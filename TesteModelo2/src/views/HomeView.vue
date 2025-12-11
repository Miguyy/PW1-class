<template>
  <section class="filters-section">
    <div class="search-row">
      <!-- Input de pesquisa com debounce (300ms) -->
      <div class="search-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Pesquisar notas..."
          @keyup.enter="handleSearch"
          @input="handleSearchInput"
          :disabled="store.initialLoading"
        />
        <button v-if="searchQuery || store.searchTerm" @click="clearSearch" class="btn-clear">
          ✕
        </button>
      </div>

      <!-- Contador de notas com estados -->
      <span class="notes-count">
        {{ store.totalCount }} notas ({{ store.pinnedCount }} fixadas<span
          v-if="store.showArchived && store.archivedCount > 0"
          >, {{ store.archivedCount }} arquivadas</span
        >)
      </span>
    </div>

    <div class="category-filters">
      <!-- Botões de filtro por categoria -->
      <div class="category-buttons" role="list" aria-label="Category filters">
        <span v-for="cat in categoryOptions" :key="cat.value" role="listitem">
          <button
            class="filter-btn"
            :class="{ active: store.activeCategory === cat.value }"
            @click="handleCategoryFilter(cat.value)"
          >
            {{ cat.label }}
          </button>
        </span>
      </div>

      <!-- Toggle para mostrar/esconder notas arquivadas -->
      <label class="archive-toggle">
        <input type="checkbox" :checked="store.showArchived" @change="store.toggleShowArchived" />
        Mostrar arquivadas
      </label>
    </div>
  </section>

  <!-- Feedback de pesquisa ativa -->
  <div v-if="store.searchTerm" class="search-info">
    Resultados para "<strong>{{ store.searchTerm }}</strong
    >" ({{ store.filteredNotes.length }} encontradas)
  </div>

  <!-- Estados de UI: loading, erro e vazio -->
  <div v-if="store.initialLoading" class="loading-state">
    <p>A carregar notas...</p>
  </div>

  <div v-else-if="store.hasError" class="error-state">
    <p>{{ store.error }}</p>
    <button @click="loadNotes">Tentar novamente</button>
  </div>

  <div v-else-if="store.filteredNotes.length === 0" class="empty-state">
    <p v-if="store.searchTerm">Nenhuma nota encontrada para "{{ store.searchTerm }}"</p>
    <p v-else-if="store.activeCategory">Nenhuma nota na categoria "{{ store.activeCategory }}"</p>
    <p v-else>Ainda não tem notas. Cria a tua primeira!</p>
    <router-link to="/note/new" class="btn-primary" custom v-slot="{ navigate }">
      <button @click="navigate">Criar Nota</button>
    </router-link>
  </div>

  <!-- Grid de cards (ordenado: pinned → normais → arquivadas) -->
  <section v-else class="notes-grid">
    <NoteCard
      v-for="note in store.filteredNotes"
      :key="note.id"
      :note="note"
      :disabled="store.isUpdating"
      @click="navigateToDetail(note.id)"
      @toggle-pin="handleTogglePin"
      @toggle-archive="handleToggleArchive"
      @delete="handleDelete"
    />
  </section>
</template>

<script>
import { mapStores } from 'pinia'
import { useNotesStore } from '@/stores/notes'
import NoteCard from '@/components/NoteCard.vue'

export default {
  name: 'HomeView',

  components: {
    NoteCard,
  },

  data() {
    return {
      searchTimeout: null,
    }
  },

  computed: {
    ...mapStores(useNotesStore),

    store() {
      return this.notesStore
    },

    // Computed com getter/setter para sincronizar input com store
    searchQuery: {
      get() {
        return this.store.searchTerm
      },
      set(value) {
        this.store.searchTerm = value
        this.debouncedSearch(value)
      },
    },

    isSearchMode() {
      return this.store.searchTerm.trim().length > 0
    },

    categoryOptions() {
      return [
        { value: null, label: 'Todas' },
        { value: 'personal', label: 'Personal' },
        { value: 'work', label: 'Work' },
        { value: 'ideas', label: 'Ideas' },
        { value: 'other', label: 'Other' },
      ]
    },
  },

  methods: {
    // Debounce de 300ms para evitar requests excessivos
    debouncedSearch(query) {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        this.performSearch(query)
      }, 300)
    },

    async performSearch(query) {
      if (query.trim()) {
        this.store.setActiveCategory(null)
        await this.store.searchNotes(query)
      } else {
        await this.store.fetchAllNotes()
      }
    },

    // Filtro de categoria limpa pesquisa ativa
    async handleCategoryFilter(category) {
      this.store.clearSearch()
      this.store.setActiveCategory(category)
      await this.loadNotes()
    },

    async clearSearch() {
      this.store.clearSearch()
      await this.loadNotes()
    },

    async loadNotes() {
      if (this.store.activeCategory) {
        await this.store.fetchNotesByCategory(this.store.activeCategory)
      } else {
        await this.store.fetchAllNotes()
      }
    },

    navigateToDetail(id) {
      this.$router.push({ name: 'note-detail', params: { id } })
    },

    async handleTogglePin(id) {
      await this.store.togglePin(id)
    },

    async handleToggleArchive(id) {
      await this.store.toggleArchive(id)
    },

    async handleDelete(id) {
      await this.store.removeNote(id)
    },
  },

  async created() {
    this.store.clearSearch()
    this.store.loadShowArchivedPreference()
    await this.loadNotes()
  },

  // Limpa timeout pendente ao destruir componente
  beforeUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  },
}
</script>

<style scoped>
.filters-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.search-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.notes-count {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  white-space: nowrap;
}

.category-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
}

.category-buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: var(--accent-primary);
}

.filter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.search-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex: 1;
}

.search-group input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  max-width: 200px;
}

.search-group input:focus {
  outline: none;
  border-color: var(--accent-secondary);
}

.btn-clear {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  background-color: transparent;
  color: var(--text-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.archive-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.archive-toggle input {
  cursor: pointer;
}

.search-info {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.search-info strong {
  color: var(--accent-primary);
}

.error-state button,
.empty-state .btn-primary {
  margin-top: var(--spacing-md);
}

.notes-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 289px;
  gap: var(--spacing-md);
}

@media (min-width: 640px) {
  .notes-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }
}

@media (min-width: 900px) {
  .notes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1100px) {
  .notes-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1400px) {
  .notes-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
