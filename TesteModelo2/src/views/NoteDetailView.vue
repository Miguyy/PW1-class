<template>
  <div class="container container--sm">
    <div v-if="store.initialLoading" class="loading-state">
      <p>A carregar nota...</p>
    </div>

    <div v-else-if="store.hasError" class="error-state">
      <p>{{ store.error }}</p>
      <button @click="goBack" class="btn-secondary">Voltar</button>
    </div>

    <div v-else-if="!note" class="error-state">
      <p>Nota não encontrada.</p>
      <button @click="goBack" class="btn-secondary">Voltar</button>
    </div>

    <!-- Card da nota com cor dinâmica -->
    <article v-else class="note-detail" :class="`color-${note.color}`">
      <header class="detail-header">
        <div class="title-row">
          <h1 class="detail-title">{{ note.title }}</h1>
          <div class="badges-right">
            <span v-if="note.pinned" class="note-badge">pinned</span>
            <span v-if="note.archived" class="note-badge">archived</span>
          </div>
        </div>

        <div class="detail-meta">
          <div class="meta-left">
            <span class="note-category">{{ note.category }}</span>
          </div>
          <time class="note-date">{{ formattedDate }}</time>
        </div>
      </header>

      <section class="detail-content">
        <p>{{ note.content }}</p>
      </section>

      <footer class="detail-actions">
        <button @click="goBack" class="action-btn btn-back">
          <ArrowLeftSVG />
        </button>

        <div class="actions-right">
          <!-- Pin desativado se nota estiver arquivada -->
          <button
            @click="handleTogglePin"
            class="action-btn"
            :class="{ active: note.pinned }"
            :disabled="store.isUpdating || note.archived"
            :title="
              note.archived ? 'Desarquive primeiro para fixar' : note.pinned ? 'Desafixar' : 'Fixar'
            "
          >
            <PinSVG :is-pinned="note.pinned" />
          </button>

          <button
            @click="handleToggleArchive"
            class="action-btn"
            :class="{ active: note.archived }"
            :disabled="store.isUpdating"
            :title="note.archived ? 'Desarquivar' : 'Arquivar'"
          >
            <ArchiveSVG :is-archived="note.archived" />
          </button>

          <!-- router-link custom para aplicar estilos de botão -->
          <router-link
            :to="{ name: 'note-edit', params: { id: note.id } }"
            class="action-btn btn-edit"
            title="Editar"
            custom
            v-slot="{ navigate }"
          >
            <button @click="navigate"><PencilSVG /></button>
          </router-link>

          <button @click="handleDelete" class="action-btn btn-delete" title="Eliminar">
            <DeleteSVG />
          </button>
        </div>
      </footer>
    </article>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useNotesStore } from '@/stores/notes'
import ArchiveSVG from '@/components/svgs/ArchiveSVG.vue'
import ArrowLeftSVG from '@/components/svgs/ArrowLeftSVG.vue'
import DeleteSVG from '@/components/svgs/DeleteSVG.vue'
import PencilSVG from '@/components/svgs/PencilSVG.vue'
import PinSVG from '@/components/svgs/PinSVG.vue'

export default {
  name: 'NoteDetailView',

  components: {
    ArchiveSVG,
    ArrowLeftSVG,
    DeleteSVG,
    PencilSVG,
    PinSVG,
  },

  computed: {
    ...mapStores(useNotesStore),

    store() {
      return this.notesStore
    },

    note() {
      return this.store.currentNote
    },

    noteId() {
      return this.$route.params.id
    },

    formattedDate() {
      if (!this.note?.createdAt) return ''

      const date = new Date(this.note.createdAt)

      return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    },
  },

  methods: {
    async loadNote() {
      await this.store.fetchNoteById(this.noteId)
    },

    goBack() {
      if (window.history.length > 2) {
        this.$router.back()
      } else {
        this.$router.push({ name: 'home' })
      }
    },

    async handleTogglePin() {
      await this.store.togglePin(this.noteId)
    },

    async handleToggleArchive() {
      await this.store.toggleArchive(this.noteId)
    },

    async handleDelete() {
      if (!confirm(`Eliminar "${this.note.title}"?`)) return

      const success = await this.store.removeNote(this.noteId)

      if (success) {
        this.$router.push({ name: 'home' })
      }
    },
  },

  created() {
    this.loadNote()
  },

  // (Re)carrega dados ao entrar na rota
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.loadNote()
    })
  },

  beforeUnmount() {
    this.store.clearCurrentNote()
  },
}
</script>

<style scoped>
.note-detail {
  position: relative;
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  background-color: var(--bg-soft);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.detail-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.detail-title {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  flex: 1;
}

.badges-right {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.detail-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.meta-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.note-category,
.note-badge {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: var(--spacing-2xs) var(--spacing-xs);
  border-radius: var(--radius-sm);
  letter-spacing: 0.5px;
  font-weight: 600;
}

.note-date {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.detail-content {
  flex: 1;
}

.detail-content p {
  margin: 0;
  font-size: var(--font-size-md);
  line-height: 1.7;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.detail-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-xs);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.actions-right {
  display: flex;
  gap: var(--spacing-2xs);
}

.btn-delete:hover {
  background: var(--error-bg);
  border-color: var(--error);
}

@media (max-width: 600px) {
  .detail-title {
    font-size: var(--font-size-2xl);
  }

  .detail-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-right {
    justify-content: center;
  }
}
</style>
