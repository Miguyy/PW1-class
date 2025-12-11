<template>
  <div class="container container--sm">
    <!-- Loading ao carregar dados para edição -->
    <div v-if="loading" class="loading-state">
      <p>A carregar...</p>
    </div>

    <!-- Formulário -->
    <form v-else @submit.prevent="handleSubmit" class="note-form">
      <h1>{{ isEditMode ? 'Editar Nota' : 'Nova Nota' }}</h1>

      <!-- Título -->
      <div class="form-group">
        <label for="title">Título *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Título da nota..."
          :class="{ error: errors.title }"
          @blur="validateField('title')"
        />
        <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
      </div>

      <!-- Conteúdo -->
      <div class="form-group">
        <label for="content">Conteúdo *</label>
        <textarea
          id="content"
          v-model="form.content"
          placeholder="Escreva o conteúdo da nota..."
          rows="6"
          :class="{ error: errors.content }"
          @blur="validateField('content')"
        ></textarea>
        <span v-if="errors.content" class="error-message">{{ errors.content }}</span>
      </div>

      <!-- Categoria e Cor (inline) -->
      <div class="form-row">
        <!-- Categoria -->
        <div class="form-group">
          <label for="category">Categoria</label>
          <select id="category" v-model="form.category">
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="ideas">Ideas</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- Cor -->
        <div class="form-group form-group-color">
          <label>Cor</label>
          <div class="color-options">
            <button
              v-for="color in colors"
              :key="color"
              type="button"
              class="color-btn"
              :class="[`color-${color}`, { selected: form.color === color }]"
              @click="form.color = color"
            >
              <span v-if="form.color === color">✓</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pinned e Archived (inline) -->
      <div class="form-row checkbox-row">
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.pinned" />
            <span>Fixar esta nota</span>
          </label>
        </div>

        <div v-if="isEditMode" class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.archived" />
            <span>Arquivar esta nota</span>
          </label>
        </div>
      </div>

      <!-- Erro geral -->
      <div v-if="submitError" class="error-banner">
        {{ submitError }}
      </div>

      <!-- Ações -->
      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn-secondary">Cancelar</button>
        <button type="submit" class="btn-primary" :disabled="!isFormValid || submitting">
          {{ submitting ? 'A guardar...' : isEditMode ? 'Guardar' : 'Criar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useNotesStore } from '@/stores/notes'

export default {
  name: 'NoteFormView',

  // Formulário dual: criação (sem ID) ou edição (com ID na rota)
  data() {
    return {
      form: {
        title: '',
        content: '',
        category: 'personal',
        color: 'yellow',
        pinned: false,
        archived: false,
      },
      errors: { title: null, content: null },
      loading: false,
      submitting: false,
      submitError: null,
      // Guarda dados originais para merge na edição
      originalData: null,
    }
  },

  computed: {
    ...mapStores(useNotesStore),

    store() {
      return this.notesStore
    },

    isEditMode() {
      return !!this.$route.params.id
    },

    noteId() {
      return this.$route.params.id
    },

    colors() {
      return ['yellow', 'green', 'blue', 'pink']
    },

    // Validação em tempo real para o de botão submit
    isFormValid() {
      const titleValid = this.form.title.trim().length >= 3
      const contentValid = this.form.content.trim().length >= 10
      return titleValid && contentValid
    },
  },

  methods: {
    // Validação on blur - mostra erro quando user sai do campo
    validateField(field) {
      switch (field) {
        case 'title':
          if (!this.form.title.trim()) {
            this.errors.title = 'O título é obrigatório.'
          } else if (this.form.title.trim().length < 3) {
            this.errors.title = 'O título deve ter pelo menos 3 caracteres.'
          } else {
            this.errors.title = null
          }
          break

        case 'content':
          if (!this.form.content.trim()) {
            this.errors.content = 'O conteúdo é obrigatório.'
          } else if (this.form.content.trim().length < 10) {
            this.errors.content = 'O conteúdo deve ter pelo menos 10 caracteres.'
          } else {
            this.errors.content = null
          }
          break
      }
    },

    validateAll() {
      this.validateField('title')
      this.validateField('content')
      return !this.errors.title && !this.errors.content
    },

    // Modo edição: preenche form com dados existentes
    async loadNoteForEdit() {
      if (!this.isEditMode) return

      this.loading = true
      await this.store.fetchNoteById(this.noteId)

      if (this.store.currentNote) {
        this.form = {
          title: this.store.currentNote.title,
          content: this.store.currentNote.content,
          category: this.store.currentNote.category,
          color: this.store.currentNote.color,
          pinned: this.store.currentNote.pinned,
          archived: this.store.currentNote.archived || false,
        }
        // Guarda original para preservar campos como id, createdAt
        this.originalData = { ...this.store.currentNote }
      }
      this.loading = false
    },

    async handleSubmit() {
      if (!this.validateAll()) return

      let result
      if (this.isEditMode) {
        // Merge: preserva campos originais (id, createdAt) + form atualizado
        const noteData = { ...this.originalData, ...this.form }
        result = await this.store.editNote(this.noteId, noteData)
      } else {
        result = await this.store.addNote(this.form)
      }

      if (result) {
        this.$router.push({ name: 'note-detail', params: { id: result.id } })
      }
    },

    // Fallback para home se não houver histórico
    handleCancel() {
      if (window.history.length > 2) {
        this.$router.back()
      } else {
        this.$router.push({ name: 'home' })
      }
    },
  },

  created() {
    if (this.isEditMode) {
      this.loadNoteForEdit()
    }
  },

  beforeUnmount() {
    this.store.clearCurrentNote()
  },
}
</script>

<style scoped>
.note-form {
  width: 100%;
  background: var(--bg-soft);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
}

@media (max-width: 480px) {
  .note-form {
    padding: var(--spacing-md);
  }
}

h1 {
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.form-group-color {
  margin-bottom: 0;
}

.checkbox-row {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input[type='text'],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-family: inherit;
  transition: border-color 0.2s ease;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent-secondary);
}

.form-group input.error,
.form-group textarea.error {
  border-color: var(--error);
}

.error-message {
  display: block;
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--error);
}

.color-options {
  display: flex;
  gap: var(--spacing-sm);
}

button.color-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  transition: transform 0.2s ease;
}

button.color-btn:hover {
  transform: scale(1.07);
}

button.color-btn.selected {
  border-color: var(--text-primary);
}

button.color-btn span {
  color: var(--text-secondary);
  font-weight: bold;
}

.checkbox-group {
  margin-bottom: 0;
}

.checkbox-group label {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-weight: normal;
  color: var(--text-primary);
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

button.color-yellow {
  background-color: var(--color-yellow-bg);
  border: 1px solid var(--color-yellow-border);
}

button.color-green {
  background-color: var(--color-green-bg);
  border: 1px solid var(--color-green-border);
}

button.color-blue {
  background-color: var(--color-blue-bg);
  border: 1px solid var(--color-blue-border);
}

button.color-pink {
  background-color: var(--color-pink-bg);
  border: 1px solid var(--color-pink-border);
}

.error-banner {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--error-bg);
  border: 1px solid var(--error);
  border-radius: var(--radius-md);
  color: var(--error);
  margin-bottom: var(--spacing-lg);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}
</style>
