<template>
  <!-- Card clicável com classes dinâmicas por cor e estado -->
  <article
    class="note-card"
    :class="[`color-${note.color}`, { 'is-pinned': note.pinned, 'is-archived': note.archived }]"
    @click="$emit('click')"
  >
    <div class="card-content">
      <h3 class="card-title">{{ note.title }}</h3>
      <p class="card-excerpt">{{ truncatedContent }}</p>

      <div class="card-meta">
        <span class="card-category">{{ note.category }}</span>

        <!-- Indicador de pinned -->
        <span v-if="note.pinned" class="pin-indicator" title="Nota fixada">pinned</span>

        <!-- Indicador de archived -->
        <span v-if="note.archived" class="archived-indicator" title="Nota arquivada">archived</span>
      </div>
    </div>

    <!-- Ações rápidas -->
    <div class="card-actions" @click.stop>
      <!-- Toggle Pin -->
      <button
        class="action-btn"
        :class="{ active: note.pinned }"
        :disabled="disabled || note.archived"
        @click="$emit('toggle-pin', note.id)"
        :title="
          note.archived ? 'Desarquive primeiro para fixar' : note.pinned ? 'Desafixar' : 'Fixar'
        "
      >
        <PinSVG :is-pinned="note.pinned" />
      </button>

      <!-- Toggle Archive -->
      <button
        class="action-btn"
        :class="{ active: note.archived }"
        @click="$emit('toggle-archive', note.id)"
        :title="note.archived ? 'Desarquivar' : 'Arquivar'"
      >
        <ArchiveSVG :is-archived="note.archived" />
      </button>

      <!-- Delete -->
      <button class="action-btn delete-btn" @click="handleDelete" title="Eliminar">
        <DeleteSVG />
      </button>
    </div>
  </article>
</template>

<script>
import ArchiveSVG from './svgs/ArchiveSVG.vue'
import DeleteSVG from './svgs/DeleteSVG.vue'
import PinSVG from './svgs/PinSVG.vue'

export default {
  name: 'NoteCard',
  components: { ArchiveSVG, PinSVG, DeleteSVG },

  props: {
    note: {
      type: Object,
      required: true,
      // Validação básica da estrutura do objeto
      validator: (value) => value.id && value.title && value.color,
    },
    // Desativa ações quando pai está a processar
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['click', 'toggle-pin', 'toggle-archive', 'delete'],

  computed: {
    truncatedContent() {
      if (!this.note.content || this.note.content.length <= 100) {
        return this.note.content || ''
      }
      return this.note.content.substring(0, 100) + '...'
    },
  },

  methods: {
    handleDelete() {
      if (confirm(`Tem a certeza que deseja eliminar a nota "${this.note.title}"?`)) {
        this.$emit('delete', this.note.id)
      }
    },
  },
}
</script>

<style scoped>
.note-card {
  position: relative;
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  cursor: pointer;
  background-color: var(--bg-soft);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.is-pinned {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.is-archived {
  opacity: 0.7;
}

.pin-indicator,
.archived-indicator {
  font-size: var(--font-size-xs);
  line-height: 1;
  color: var(--text-secondary);
  padding: var(--spacing-2xs) var(--spacing-xs);
  border-radius: var(--radius-sm);
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.card-excerpt {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.4;
  flex: 1;
  overflow-wrap: break-word;
  word-break: break-word;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xs);
}

.card-category {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: var(--spacing-2xs) var(--spacing-xs);
  border-radius: var(--radius-sm);
  letter-spacing: 0.5px;
}

.card-actions {
  display: flex;
  gap: var(--spacing-2xs);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-color);
}

.note-card .action-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.delete-btn:hover {
  border: 1px solid var(--error);
}
</style>
