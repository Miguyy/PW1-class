<template>
  <header class="page-header">
    <h1>Library System</h1>
    <p>Manage your book collection with ease</p>
  </header>

  <main class="page-content">
    <!-- Toolbar com pesquisa e botão de adicionar -->
    <div class="toolbar">
      <SearchBar v-model="booksStore.searchQuery" @update:modelValue="handleSearch" />
      <button @click="goToCreate" class="btn btn-primary">Add Book</button>
    </div>

    <!-- Contador de resultados (Desafio 3) -->
    <div v-if="booksStore.searchQuery || hasActiveFilters" class="results-info">
      <p>
        Found {{ booksStore.totalItems }} result{{ booksStore.totalItems !== 1 ? 's' : '' }}
        <button @click="booksStore.clearFilters()" class="link-button">Clear all filters</button>
      </p>
    </div>

    <!-- Controlos de filtro e ordenação -->
    <FilterControls
      :genres="booksStore.availableGenres"
      :sort-options="booksStore.sortOptions"
      :genre-filter="booksStore.genreFilter"
      :availability-filter="booksStore.availabilityFilter"
      :sort-field="booksStore.sortField"
      :sort-order="booksStore.sortOrder"
      @update:genreFilter="handleGenreFilter"
      @update:availabilityFilter="handleAvailabilityFilter"
      @update:sortField="handleSortField"
      @update:sortOrder="handleSortOrder"
      @clear="booksStore.clearFilters()"
    />

    <!-- Mensagem de sucesso (feedback após operações) -->
    <div v-if="successMessage" class="success-toast">
      {{ successMessage }}
    </div>

    <!-- Lista de livros com estados de loading/erro/vazio -->
    <BookList
      :books="booksStore.books"
      :loading="booksStore.loading"
      :error="booksStore.error"
      @view="goToDetail"
      @edit="goToEdit"
      @delete="confirmDelete"
      @retry="booksStore.fetchBooks()"
    />

    <!-- Paginação (só visível se houver mais de uma página) -->
    <Pagination
      :current-page="booksStore.currentPage"
      :total-pages="booksStore.totalPages"
      :total-items="booksStore.totalItems"
      :has-previous="booksStore.hasPreviousPage"
      :has-next="booksStore.hasNextPage"
      @page-change="booksStore.goToPage"
    />
  </main>

  <!-- Modal de confirmação para remoção -->
  <ConfirmModal
    v-if="showDeleteModal && bookToDelete"
    title="Delete Book"
    :message="`Are you sure you want to delete '${bookToDelete.title}'? This action cannot be undone.`"
    confirmText="Delete"
    @confirm="handleDelete"
    @cancel="closeDeleteModal"
  />
</template>

<script>
import { mapStores } from 'pinia'
import { useBooksStore } from '@/stores/books.js'
import SearchBar from '@/components/SearchBar.vue'
import FilterControls from '@/components/FilterControls.vue'
import BookList from '@/components/BookList.vue'
import Pagination from '@/components/Pagination.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
  name: 'HomeView',

  components: {
    SearchBar,
    FilterControls,
    BookList,
    Pagination,
    ConfirmModal,
  },

  data() {
    return {
      // Modal de confirmação de remoção
      showDeleteModal: false,
      bookToDelete: null,
      // Mensagem de feedback
      successMessage: null,
    }
  },

  computed: {
    ...mapStores(useBooksStore),

    // Verifica se há filtros ativos para mostrar contador
    hasActiveFilters() {
      return this.booksStore.genreFilter || this.booksStore.availabilityFilter !== ''
    },
  },

  // Carrega livros quando o componente é criado
  created() {
    this.booksStore.fetchBooks()

    // Mostra mensagem de sucesso se vier de outra página
    if (this.$route.params.message) {
      this.showSuccess(this.$route.params.message)
    }
  },

  methods: {
    // === NAVEGAÇÃO ===

    goToCreate() {
      this.$router.push({ name: 'book-create' })
    },

    goToDetail(book) {
      this.$router.push({ name: 'book-detail', params: { id: book.id } })
    },

    goToEdit(book) {
      this.$router.push({ name: 'book-edit', params: { id: book.id } })
    },

    // === FEEDBACK ===

    // Mostra mensagem temporária (3 segundos)
    showSuccess(message) {
      this.successMessage = message
      setTimeout(() => {
        this.successMessage = null
      }, 3000)
    },

    // === PESQUISA E FILTROS ===

    handleSearch(query) {
      this.booksStore.setSearch(query)
    },

    handleGenreFilter(genre) {
      this.booksStore.setGenreFilter(genre)
    },

    handleAvailabilityFilter(availability) {
      this.booksStore.setAvailabilityFilter(availability)
    },

    handleSortField(field) {
      this.booksStore.setSort(field, this.booksStore.sortOrder)
    },

    handleSortOrder(order) {
      this.booksStore.setSort(this.booksStore.sortField, order)
    },

    // === REMOÇÃO ===

    confirmDelete(book) {
      this.bookToDelete = book
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
      this.bookToDelete = null
    },

    async handleDelete() {
      if (!this.bookToDelete) return

      const success = await this.booksStore.deleteBook(this.bookToDelete.id)

      if (success) {
        this.showSuccess(`"${this.bookToDelete.title}" was successfully deleted.`)
      }

      this.closeDeleteModal()
    },
  },
}
</script>

<style scoped>
.page-header {
  color: var(--text-primary);
  text-align: left;
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: var(--font-size-3xl);
  margin: 0 0 var(--spacing-xs) 0;
}

.page-header p {
  margin: 0;
  font-weight: 500;
  color: var(--text-secondary);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.results-info {
  background: transparent;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.results-info p {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.link-button {
  background: none;
  border: none;
  color: var(--color-blue);
  text-decoration: underline;
  cursor: pointer;
  font-size: var(--font-size-sm);
  margin-left: var(--spacing-sm);
  transition: color 0.2s ease;
}

.link-button:hover {
  color: var(--color-blue-hover);
}

.btn {
  font-family: inherit;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary {
  background: var(--bg-soft);
  color: var(--text-primary);
}

.btn-primary:hover {
  background: var(--bg-secondary);
  border-color: var(--border-color-hover);
}

.success-toast {
  background: var(--color-success);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  text-align: center;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header h1 {
    font-size: var(--font-size-2xl);
  }
}
</style>
