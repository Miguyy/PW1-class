<template>
  <section class="session-form">
    <h1>{{ isEdit ? 'Editar Sessão' : 'Nova Sessão' }}</h1>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="field">
        <label>Título *</label>
        <input v-model="form.title" @blur="touched.title = true" type="text" />
        <p v-if="touched.title && !valid.title" class="error">
          Título obrigatório (mín. 3 caracteres).
        </p>
      </div>

      <div class="field">
        <label>Disciplina *</label>
        <select v-model="form.subject">
          <option value="">-- selecione --</option>
          <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
        </select>
        <p v-if="touched.subject && !valid.subject" class="error">Selecione uma disciplina.</p>
      </div>

      <div class="field">
        <label>Duração (min) *</label>
        <input
          v-model.number="form.duration"
          type="number"
          min="1"
          @blur="touched.duration = true"
        />
        <p v-if="touched.duration && !valid.duration" class="error">
          Duração mínima de 10 minutos.
        </p>
      </div>

      <div class="field">
        <label><input type="checkbox" v-model="form.favorite" /> Favorita</label>
      </div>

      <div class="actions">
        <button type="submit" :disabled="!formIsValid || submitting" class="btn primary">
          {{
            isEdit ? (submitting ? 'Guardando...' : 'Guardar') : submitting ? 'Criando...' : 'Criar'
          }}
        </button>
        <button type="button" class="btn" @click="cancel" :disabled="submitting">Cancelar</button>
      </div>

      <p v-if="error" class="error">Erro: {{ error }}</p>
    </form>
  </section>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionsStore } from '@/stores/sessions.js'

export default {
  name: 'SessionFormView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useSessionsStore()

    const id = route.params.id
    const isEdit = !!id

    const submitting = ref(false)
    const error = ref(null)

    const form = reactive({
      title: '',
      subject: '',
      duration: 30,
      favorite: false,
      createdAt: null,
    })

    const touched = reactive({ title: false, subject: false, duration: false })

    const valid = {
      title: computed(() => String(form.title || '').trim().length >= 3),
      subject: computed(() => Boolean(form.subject && String(form.subject).trim())),
      duration: computed(() => Number(form.duration) >= 10),
    }

    const formIsValid = computed(
      () => valid.title.value && valid.subject.value && valid.duration.value,
    )

    const subjects = computed(() => {
      const set = new Set(store.sessions.map((s) => s.subject).filter(Boolean))
      // fallback options
      if (!set.size) {
        return ['frontend', 'backend', 'design', 'outros']
      }
      return Array.from(set)
    })

    onMounted(async () => {
      if (isEdit) {
        try {
          await store.loadSessionById(id)
          const s = store.selectedSession
          if (!s) {
            error.value = 'Sessão não encontrada'
            return
          }
          form.title = s.title || ''
          form.subject = s.subject || ''
          form.duration = s.duration || 30
          form.favorite = !!s.favorite
          form.createdAt = s.createdAt || null
        } catch (err) {
          error.value = err?.message || String(err)
        }
      }
    })

    function touchAll() {
      touched.title = true
      touched.subject = true
      touched.duration = true
    }

    async function onSubmit() {
      touchAll()
      if (!formIsValid.value) return
      submitting.value = true
      error.value = null

      const payload = {
        title: String(form.title).trim(),
        subject: String(form.subject).trim(),
        duration: Number(form.duration),
        favorite: !!form.favorite,
      }

      try {
        let result
        if (isEdit) {
          result = await store.updateSession(id, payload)
        } else {
          payload.createdAt = new Date().toISOString()
          result = await store.addSession(payload)
        }

        if (!result) throw new Error('Operação falhou.')

        router.push({ name: 'session-detail', params: { id: result.id } })
      } catch (err) {
        error.value = err?.message || String(err)
      } finally {
        submitting.value = false
      }
    }

    function cancel() {
      router.back()
    }

    return {
      form,
      touched,
      valid,
      formIsValid,
      onSubmit,
      cancel,
      isEdit,
      submitting,
      error,
      subjects,
    }
  },
}
</script>

<style scoped>
.session-form {
  max-width: 720px;
  margin: 1rem auto;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}
.field {
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
}
.field input[type='text'],
.field input[type='number'],
.field select {
  padding: 0.45rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
}
.btn {
  padding: 0.45rem 0.75rem;
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
.error {
  color: #c92a2a;
  margin-top: 0.35rem;
  font-size: 0 nine;
}
</style>
