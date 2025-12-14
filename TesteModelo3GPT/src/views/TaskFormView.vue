<template>
  <section class="task-form">
    <h1>{{ isEdit ? 'Editar Tarefa' : 'Criar Tarefa' }}</h1>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="field">
        <label>Título *</label>
        <input v-model="form.title" type="text" />
        <p v-if="touched.title && !valid.title" class="error">
          Título obrigatório (mín. 3 caracteres).
        </p>
      </div>

      <div class="field">
        <label>Descrição *</label>
        <textarea v-model="form.description" rows="6"></textarea>
        <p v-if="touched.description && !valid.description" class="error">
          Descrição obrigatória (mín. 10 caracteres).
        </p>
      </div>

      <div class="row">
        <div class="field">
          <label>Prioridade</label>
          <select v-model="form.priority">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        <div class="field">
          <label>Status</label>
          <select v-model="form.status">
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div class="field">
          <label>Data limite</label>
          <input v-model="form.dueDate" type="date" />
        </div>
      </div>

      <div class="row small">
        <label><input type="checkbox" v-model="form.favorite" /> Favorita</label>
        <label><input type="checkbox" v-model="form.archived" /> Arquivada</label>
      </div>

      <div class="actions">
        <button type="submit" :disabled="!formIsValid || submitting" class="btn primary">
          {{
            isEdit ? (submitting ? 'Guardando...' : 'Guardar') : submitting ? 'Criando...' : 'Criar'
          }}
        </button>
        <button type="button" class="btn" @click="onCancel" :disabled="submitting">Cancelar</button>
      </div>

      <p v-if="error" class="error">Erro: {{ error }}</p>
    </form>
  </section>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks.js'

export default {
  name: 'TaskFormView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useTasksStore()

    const id = route.params.id
    const isEdit = !!id

    const submitting = ref(false)
    const error = ref(null)

    const form = reactive({
      title: '',
      description: '',
      priority: 'normal',
      status: 'todo',
      dueDate: null, // YYYY-MM-DD
      favorite: false,
      archived: false,
      createdAt: null,
    })

    const touched = reactive({
      title: false,
      description: false,
    })

    const valid = {
      title: computed(() => String(form.title || '').trim().length >= 3),
      description: computed(() => String(form.description || '').trim().length >= 10),
    }

    const formIsValid = computed(() => valid.title.value && valid.description.value)

    onMounted(async () => {
      if (isEdit) {
        try {
          await store.loadTaskById(id)
          const t = store.selectedTask
          if (!t) {
            error.value = 'Tarefa não encontrada'
            return
          }
          // populate form, preserving createdAt
          form.title = t.title || ''
          form.description = t.description || ''
          form.priority = t.priority || 'normal'
          form.status = t.status || 'todo'
          // convert ISO to yyyy-mm-dd for date input if present
          form.dueDate = t.dueDate ? t.dueDate.slice(0, 10) : null
          form.favorite = !!t.favorite
          form.archived = !!t.archived
          form.createdAt = t.createdAt || t.createdAt === null ? t.createdAt : null
        } catch (err) {
          error.value = err?.message || String(err)
        }
      }
    })

    function touchAll() {
      touched.title = true
      touched.description = true
    }

    async function onSubmit() {
      touchAll()
      if (!formIsValid.value) return
      submitting.value = true
      error.value = null

      // Prepare payload: preserve createdAt when editing, set on creation if store/api doesn't set it
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        favorite: !!form.favorite,
        archived: !!form.archived,
      }

      try {
        let result
        if (isEdit) {
          // keep createdAt unchanged
          result = await store.updateTask(id, payload)
        } else {
          // assign createdAt here (store/utils may also set it)
          payload.createdAt = new Date().toISOString()
          result = await store.createTask(payload)
        }

        if (!result) {
          throw new Error('A operação não retornou um resultado válido.')
        }

        // redirect to detail page
        router.push({ name: 'task-detail', params: { id: result.id } })
      } catch (err) {
        error.value = err?.message || String(err)
      } finally {
        submitting.value = false
      }
    }

    function onCancel() {
      // go back to previous or home
      router.back()
    }

    return {
      form,
      touched,
      valid,
      formIsValid,
      onSubmit,
      onCancel,
      isEdit,
      submitting,
      error,
    }
  },
}
</script>

<style scoped>
.task-form {
  max-width: 820px;
  margin: 1rem auto;
  padding: 1rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
}
.field {
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
}
.field input[type='text'],
.field textarea,
.field select,
.field input[type='date'] {
  padding: 0.45rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.row.small {
  gap: 1.2rem;
  align-items: center;
  margin-bottom: 0.6rem;
}
.error {
  color: #c92a2a;
  margin-top: 0.35rem;
  font-size: 0 nine;
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
  background: white;
  cursor: pointer;
}
.btn.primary {
  background: #2d8cff;
  color: #fff;
  border: none;
}
.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
