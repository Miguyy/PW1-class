<template>
  <section class="task-detail">
    <div v-if="loading" class="loading">Carregando tarefa...</div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button class="btn" @click="goBack">Voltar</button>
    </div>

    <div v-else-if="!task" class="empty">
      <p>Tarefa não encontrada.</p>
      <button class="btn" @click="goBack">Voltar</button>
    </div>

    <div v-else class="card">
      <header class="card-header">
        <h1 class="title">{{ task.title }}</h1>

        <div class="indicators">
          <button
            class="icon"
            :title="task.favorite ? 'Desfavoritar' : 'Favoritar'"
            @click="toggleFav"
          >
            {{ task.favorite ? '★' : '☆' }}
          </button>

          <button
            class="icon"
            :title="task.status === 'done' ? 'Reabrir' : 'Marcar como concluída'"
            @click="toggleDone"
          >
            {{ task.status === 'done' ? '↺' : '✔' }}
          </button>

          <span class="badge archived" v-if="task.archived">Arquivada</span>
        </div>
      </header>

      <section class="meta">
        <div><strong>Prioridade:</strong> {{ formatPriority(task.priority) }}</div>
        <div><strong>Status:</strong> {{ task.status || 'todo' }}</div>
        <div><strong>Data de criação:</strong> {{ formatDate(task.createdAt) }}</div>
        <div><strong>Data limite:</strong> {{ formatDate(task.dueDate) }}</div>
      </section>

      <section class="description">
        <h2>Descrição</h2>
        <p v-if="task.description">{{ task.description }}</p>
        <p v-else class="muted">Sem descrição.</p>
      </section>

      <section class="actions">
        <button class="btn" @click="editTask">Editar</button>
        <button class="btn danger" @click="confirmDelete">Eliminar</button>
        <button class="btn" @click="goBack">Voltar</button>
        <button class="btn" @click="toggleArchive">
          {{ task.archived ? 'Desarquivar' : 'Arquivar' }}
        </button>
      </section>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks.js'

export default {
  name: 'TaskDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useTasksStore()

    const loading = ref(true)
    const error = ref(null)

    onMounted(async () => {
      loading.value = true
      error.value = null
      try {
        await store.loadTaskById(route.params.id)
      } catch (err) {
        error.value = err?.message || String(err)
      } finally {
        loading.value = false
      }
    })

    const task = computed(() => store.selectedTask)

    function goBack() {
      router.push({ name: 'home' })
    }

    function editTask() {
      router.push({ name: 'task-edit', params: { id: route.params.id } })
    }

    async function confirmDelete() {
      if (!task.value) return
      const ok = window.confirm(`Eliminar "${task.value.title}"? Esta ação não pode ser desfeita.`)
      if (!ok) return
      const removed = await store.removeTask(task.value.id)
      if (removed) router.push({ name: 'home' })
    }

    async function toggleFav() {
      if (!task.value) return
      await store.toggleFavorite(task.value.id)
      // refresh local selectedTask
      await store.loadTaskById(route.params.id)
    }

    async function toggleDone() {
      if (!task.value) return
      await store.toggleCompletion(task.value.id)
      await store.loadTaskById(route.params.id)
    }

    async function toggleArchive() {
      if (!task.value) return
      await store.toggleArchive(task.value.id)
      await store.loadTaskById(route.params.id)
    }

    function formatDate(val) {
      if (!val) return '—'
      try {
        const d = new Date(val)
        return d.toLocaleString()
      } catch {
        return String(val)
      }
    }

    function formatPriority(p) {
      if (!p) return 'normal'
      return p.toString().charAt(0).toUpperCase() + p.toString().slice(1)
    }

    return {
      loading,
      error,
      task,
      goBack,
      editTask,
      confirmDelete,
      toggleFav,
      toggleDone,
      toggleArchive,
      formatDate,
      formatPriority,
    }
  },
}
</script>

<style scoped>
.task-detail {
  padding: 1rem;
}

.loading,
.empty,
.error {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.card {
  max-width: 820px;
  margin: 0 auto;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.title {
  margin: 0;
  font-size: 1.25rem;
}

.indicators {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
}

.badge.archived {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
  margin: 1rem 0;
  color: #333;
}

.description {
  margin: 1rem 0;
}

.description .muted {
  color: #777;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.45rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.btn.danger {
  background: #fff5f5;
  border-color: #f5c2c7;
}
</style>
