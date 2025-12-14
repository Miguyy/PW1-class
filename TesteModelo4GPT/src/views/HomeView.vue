<template>
  <section class="home">
    <header class="toolbar">
      <div class="left">
        <button class="btn primary" @click="goNew">Nova Sessão</button>
        <div class="indicator">{{ totalText }}</div>
      </div>

      <div class="controls">
        <label class="select-wrap">
          <select v-model="selectedSubject">
            <option value="">Todas as disciplinas</option>
            <option v-for="sub in subjects" :key="sub" :value="sub">{{ sub }}</option>
          </select>
        </label>

        <button class="btn" @click="refresh">Atualizar</button>
      </div>
    </header>

    <main class="content">
      <div v-if="loading" class="state">Carregando sessões...</div>

      <div v-else-if="!loading && sessionsToShow.length === 0" class="state empty">
        <p>Nenhuma sessão encontrada.</p>
      </div>

      <div v-else class="grid">
        <article
          v-for="s in sessionsToShow"
          :key="s.id"
          class="card"
          :class="{ completed: s.completed, favorite: s.favorite }"
        >
          <header class="card-head">
            <h3 class="title">{{ s.title }}</h3>
            <div class="badges">
              <span class="badge subject">{{ s.subject }}</span>
              <span class="badge duration">{{ s.duration }}m</span>
            </div>
          </header>

          <div class="meta">
            <span class="flag" v-if="s.completed">Concluída</span>
            <span class="flag" v-if="s.favorite">Favorita</span>
            <small class="created">Criada: {{ formatDate(s.createdAt) }}</small>
          </div>

          <footer class="card-actions">
            <button class="btn small" @click="toggleComplete(s)">
              {{ s.completed ? 'Reabrir' : 'Concluir' }}
            </button>
            <button class="btn small" @click="toggleFav(s)">
              {{ s.favorite ? 'Desfavoritar' : 'Favoritar' }}
            </button>
            <button class="btn small danger" @click="confirmDelete(s)">Eliminar</button>
          </footer>
        </article>
      </div>
    </main>
  </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionsStore } from '@/stores/sessions.js'

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const store = useSessionsStore()

    const selectedSubject = ref('')
    const loading = computed(() => store.loading)

    const subjects = computed(() => {
      const set = new Set(store.sessions.map((s) => s.subject).filter(Boolean))
      return Array.from(set)
    })

    const sessionsToShow = computed(() => {
      let list = store.sessions || []
      if (selectedSubject.value) {
        list = list.filter((s) => s.subject === selectedSubject.value)
      }
      return list
    })

    const totalText = computed(() => {
      const total = store.sessions.length
      const completed = store.completedCount || 0
      const fav = store.favoriteCount || 0
      return `${total} sessões (${completed} concluídas, ${fav} favoritas)`
    })

    async function refresh() {
      await store.loadSessions()
    }

    function goNew() {
      router.push({ name: 'session-form' })
    }

    async function toggleComplete(session) {
      await store.toggleCompleted(session.id)
    }

    async function toggleFav(session) {
      await store.toggleFavorite(session.id)
    }

    async function confirmDelete(session) {
      if (confirm(`Eliminar "${session.title}"? Esta ação não pode ser desfeita.`)) {
        await store.removeSession(session.id)
      }
    }

    function formatDate(val) {
      if (!val) return '—'
      try {
        return new Date(val).toLocaleString()
      } catch {
        return val
      }
    }

    onMounted(async () => {
      await store.loadSessions()
    })

    return {
      selectedSubject,
      subjects,
      sessionsToShow,
      loading,
      totalText,
      goNew,
      refresh,
      toggleComplete,
      toggleFav,
      confirmDelete,
      formatDate,
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
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.indicator {
  color: #444;
  font-size: 0.95rem;
}
.controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.select-wrap select {
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.btn {
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}
.btn.primary {
  background: #2d8cff;
  color: #fff;
  border: none;
}
.btn.small {
  padding: 0.3rem 0.5rem;
  font-size: 0.85rem;
}
.btn.danger {
  background: #fff5f5;
  border-color: #f5c2c7;
}

.content .state {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
.card {
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 0.75rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.card.completed {
  opacity: 0.75;
}
.card.favorite {
  box-shadow: 0 0 0 2px rgba(255, 223, 93, 0.12);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}
.title {
  margin: 0;
  font-size: 1rem;
}
.badges {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}
.badge {
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  background: #f7f7f7;
  border: 1px solid #eee;
}
.meta {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  color: #555;
  font-size: 0.85rem;
}
.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}
</style>
