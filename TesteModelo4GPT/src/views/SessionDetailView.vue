<template>
  <section class="session-detail">
    <div v-if="loading" class="state">Carregando sessão...</div>

    <div v-else-if="error" class="state error">
      <p>{{ error }}</p>
      <button class="btn" @click="goBack">Voltar</button>
    </div>

    <div v-else-if="!session" class="state empty">
      <p>Sessão não encontrada.</p>
      <button class="btn" @click="goBack">Voltar</button>
    </div>

    <div v-else class="card">
      <header class="card-header">
        <h1>{{ session.title }}</h1>
        <div class="indicators">
          <button
            class="icon"
            @click="toggleFavorite"
            :title="session.favorite ? 'Desfavoritar' : 'Favoritar'"
          >
            {{ session.favorite ? '★' : '☆' }}
          </button>
          <button
            class="icon"
            @click="toggleCompleted"
            :title="session.completed ? 'Reabrir' : 'Marcar como concluída'"
          >
            {{ session.completed ? '↺' : '✔' }}
          </button>
        </div>
      </header>

      <dl class="meta">
        <div><strong>Disciplina:</strong> {{ session.subject || '—' }}</div>
        <div><strong>Duração:</strong> {{ session.duration }} minutos</div>
        <div><strong>Estado:</strong> {{ session.completed ? 'Concluída' : 'Pendente' }}</div>
        <div><strong>Favorita:</strong> {{ session.favorite ? 'Sim' : 'Não' }}</div>
        <div><strong>Criada em:</strong> {{ formatDate(session.createdAt) }}</div>
      </dl>

      <div class="actions">
        <button class="btn" @click="edit">Editar</button>
        <button class="btn danger" @click="confirmDelete">Eliminar</button>
        <button class="btn" @click="goBack">Voltar</button>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionsStore } from '@/stores/sessions.js'

export default {
  name: 'SessionDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useSessionsStore()

    const loading = ref(true)
    const error = ref(null)

    const sessionId = route.params.id

    onMounted(async () => {
      loading.value = true
      error.value = null
      try {
        await store.loadSessionById(sessionId)
      } catch (err) {
        error.value = err?.message || String(err)
      } finally {
        loading.value = false
      }
    })

    const session = computed(() => store.selectedSession)

    function formatDate(val) {
      if (!val) return '—'
      try {
        return new Date(val).toLocaleString()
      } catch {
        return val
      }
    }

    async function toggleFavorite() {
      if (!session.value) return
      await store.toggleFavorite(session.value.id)
      await store.loadSessionById(session.value.id)
    }

    async function toggleCompleted() {
      if (!session.value) return
      await store.toggleCompleted(session.value.id)
      await store.loadSessionById(session.value.id)
    }

    function edit() {
      router.push({ name: 'session-edit', params: { id: sessionId } })
    }

    async function confirmDelete() {
      if (!session.value) return
      if (!confirm(`Eliminar "${session.value.title}"?`)) return
      const ok = await store.removeSession(session.value.id)
      if (ok) router.push({ name: 'home' })
    }

    function goBack() {
      router.push({ name: 'home' })
    }

    return {
      loading,
      error,
      session,
      formatDate,
      toggleFavorite,
      toggleCompleted,
      edit,
      confirmDelete,
      goBack,
    }
  },
}
</script>

<style scoped>
.session-detail {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}
.state {
  padding: 1.5rem;
  text-align: center;
  color: #666;
}
.card {
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
.indicators .icon {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  margin-left: 0.5rem;
}
.meta {
  display: grid;
  gap: 0.5rem;
  margin: 1rem 0;
  color: #333;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.btn {
  padding: 0.45rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #fff;
}
.btn.danger {
  background: #fff5f5;
  border-color: #f5c2c7;
}
</style>
