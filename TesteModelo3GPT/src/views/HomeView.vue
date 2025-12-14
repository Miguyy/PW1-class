<template>
  <section class="home">
    <!-- Toolbar -->
    <header class="toolbar">
      <div class="toolbar-left">
        <button class="btn btn-primary" @click="goToNew">Nova Tarefa</button>

        <div class="indicator">
          {{ totalText }}
        </div>

        <label class="show-archived">
          <input type="checkbox" v-model="showArchivedLocal" />
          Mostrar tarefas arquivadas
        </label>
      </div>

      <div class="toolbar-right">
        <div class="filters">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="['tab', { active: activeTab === tab.value }]"
            @click="setTab(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="search">
          <input
            type="text"
            placeholder="Pesquisar tarefas..."
            v-model="searchText"
            @keydown.enter="applySearchImmediate"
          />
          <button v-if="searchText" class="btn-clear" @click="clearSearch">✕</button>
        </div>
      </div>
    </header>

    <!-- List area -->
    <main class="list-area">
      <div v-if="loading" class="loading">Carregando tarefas...</div>

      <div v-else-if="!loading && tasksToShow.length === 0" class="empty">
        <p>Nenhuma tarefa encontrada.</p>
        <p class="hint">Crie uma nova tarefa com "Nova Tarefa".</p>
      </div>

      <div v-else class="grid">
        <article
          v-for="task in tasksToShow"
          :key="task.id"
          class="task-card"
          :class="{ favorite: task.favorite, archived: task.archived }"
        >
          <header class="card-top">
            <h3 class="title">{{ task.title }}</h3>
            <div class="badges">
              <span class="badge priority">{{ formatPriority(task.priority) }}</span>
              <span class="badge status">{{ task.status }}</span>
            </div>
          </header>

          <p class="excerpt">{{ excerpt(task.description) }}</p>

          <footer class="card-footer">
            <div class="meta">
              <small class="due">Prazo: {{ formatDue(task.dueDate) }}</small>
              <small class="icons">
                <button title="Favoritar" @click="toggleFav(task)" class="icon-btn">
                  {{ task.favorite ? '★' : '☆' }}
                </button>
                <button title="Concluir / Reabrir" @click="toggleDone(task)" class="icon-btn">
                  {{ task.status === 'done' ? '↺' : '✔' }}
                </button>
                <button title="Arquivar" @click="toggleArchive(task)" class="icon-btn">
                  {{ task.archived ? '📦' : '🗄' }}
                </button>
              </small>
            </div>

            <div class="actions">
              <button class="btn small" @click="viewTask(task)">Ver</button>
              <button class="btn small" @click="editTask(task)">Editar</button>
              <button class="btn small danger" @click="confirmDelete(task)">Eliminar</button>
            </div>
          </footer>
        </article>
      </div>
    </main>
  </section>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks.js'

const ARCHIVE_PREF_KEY = 'showArchivedPref_v1'

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const store = useTasksStore()

    const loading = computed(() => store.loading)
    const tabs = [
      { value: null, label: 'Todas' },
      { value: 'todo', label: 'To Do' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'done', label: 'Done' },
    ]

    // local models
    const activeTab = ref(store.activeStatusFilter || null)
    const searchText = ref(store.searchQuery || '')
    const showArchivedLocal = ref(JSON.parse(localStorage.getItem(ARCHIVE_PREF_KEY) || 'false'))

    // Sync preference to store and persist
    watch(
      showArchivedLocal,
      (val) => {
        store.showArchived = val
        localStorage.setItem(ARCHIVE_PREF_KEY, JSON.stringify(val))
      },
      { immediate: true },
    )

    // Debounce search
    let searchTimer = null
    watch(searchText, (val) => {
      clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        applySearch(val)
      }, 300)
    })

    // load initial data
    onMounted(async () => {
      // initialize showArchived into store
      store.showArchived = showArchivedLocal.value
      await store.loadAllTasks()
    })

    // computed lists
    const tasksToShow = computed(() => {
      let list = store.sortedTasks || []
      // apply active tab locally (store may already have filtered)
      if (activeTab.value) {
        list = list.filter((t) => (t.status || 'todo') === activeTab.value)
      }
      return list
    })

    const totalText = computed(() => {
      const total = store.tasks.length
      const fav = store.favoriteCount || 0
      const done = store.completedCount || 0
      return `${total} tarefas (${fav} favoritas, ${done} concluídas)`
    })

    // methods
    function setTab(value) {
      activeTab.value = value
      store.activeStatusFilter = value
      // prefer store action filter which may call API
      store.filterByStatus(value)
    }

    async function applySearch(term) {
      if (!term) {
        // clear search and reload
        store.searchQuery = ''
        await store.loadAllTasks()
        return
      }
      store.searchQuery = term
      await store.search(term)
    }

    async function applySearchImmediate() {
      clearTimeout(searchTimer)
      await applySearch(searchText.value)
    }

    function clearSearch() {
      searchText.value = ''
    }

    function goToNew() {
      router.push({ name: 'task-form' })
    }

    function viewTask(task) {
      router.push({ name: 'task-detail', params: { id: task.id } })
    }

    function editTask(task) {
      router.push({ name: 'task-edit', params: { id: task.id } })
    }

    async function toggleFav(task) {
      await store.toggleFavorite(task.id)
    }

    async function toggleDone(task) {
      await store.toggleCompletion(task.id)
    }

    async function toggleArchive(task) {
      await store.toggleArchive(task.id)
    }

    function confirmDelete(task) {
      if (window.confirm(`Eliminar "${task.title}"? Esta ação não pode ser desfeita.`)) {
        store.removeTask(task.id)
      }
    }

    function excerpt(text, len = 120) {
      if (!text) return ''
      return text.length > len ? text.slice(0, len) + '…' : text
    }

    function formatDue(due) {
      if (!due) return '—'
      try {
        const dt = new Date(due)
        return dt.toLocaleDateString()
      } catch {
        return due
      }
    }

    function formatPriority(p) {
      if (!p) return 'normal'
      return p.toString().charAt(0).toUpperCase() + p.toString().slice(1)
    }

    return {
      loading,
      tabs,
      activeTab,
      searchText,
      showArchivedLocal,
      tasksToShow,
      totalText,
      setTab,
      applySearchImmediate,
      clearSearch,
      goToNew,
      viewTask,
      editTask,
      toggleFav,
      toggleDone,
      toggleArchive,
      confirmDelete,
      excerpt,
      formatDue,
      formatPriority,
    }
  },
}
</script>

<style scoped>
.home {
  padding: 1rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.btn-primary {
  background: #2d8cff;
  color: white;
  border: none;
}

.indicator {
  font-size: 0.95rem;
  color: #333;
}

.show-archived {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  font-size: 0.9rem;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filters .tab {
  background: transparent;
  border: 1px solid transparent;
  padding: 0.35rem 0.6rem;
  margin-right: 0.25rem;
  cursor: pointer;
  border-radius: 6px;
}

.filters .tab.active {
  background: #eef6ff;
  border-color: #cbe4ff;
}

.search {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.search input {
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.btn-clear {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
}

/* grid list */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.task-card {
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.task-card.favorite {
  box-shadow: 0 0 0 2px rgba(255, 223, 93, 0.12);
}

.task-card.archived {
  opacity: 0.6;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 1rem;
}

.badge {
  margin-left: 0.4rem;
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
  font-size: 0.75rem;
  border: 1px solid #eee;
}

.priority {
  background: #fff7ed;
  border-color: #ffd8a8;
}
.status {
  background: #f1f8ff;
  border-color: #cfe8ff;
}

.excerpt {
  margin: 0.6rem 0;
  color: #444;
  font-size: 0.9rem;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.6rem;
}

.meta {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.05rem;
  margin-left: 0.25rem;
}

.actions .btn.small {
  padding: 0.3rem 0.5rem;
  font-size: 0.85rem;
}

.actions .btn.danger {
  background: #fff5f5;
  border: 1px solid #f5c2c7;
}

.loading,
.empty {
  padding: 3rem;
  text-align: center;
  color: #666;
}
</style>
