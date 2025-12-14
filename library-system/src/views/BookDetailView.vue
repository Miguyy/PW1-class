<template>
  <!-- Estado de loading -->
  <div v-if="loading" class="loading-state">
    <div class="spinner"></div>
    <p>Loading book details...</p>
  </div>

  <!-- Estado de erro -->
  <div v-else-if="error || !book" class="error-state">
    <h2>Book Not Found</h2>
    <p>{{ error || 'The requested book could not be found.' }}</p>
    <button @click="goBack" class="btn btn-primary">← Back to Library</button>
  </div>

  <!-- Detalhe do livro -->
  <div v-else class="book-detail">
    <nav class="breadcrumb">
      <button @click="goBack" class="breadcrumb-link">← Library</button>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ book.title }}</span>
    </nav>

    <div class="detail-content">
      <!-- Capa do livro -->
      <div class="book-cover-section">
        <img
          :src="book.imageUrl || FALLBACK_COVER_URL"
          :alt="`Cover of ${book.title}`"
          class="book-cover-large"
          @error="handleImageError"
        />

        <!-- Badge de disponibilidade (Desafio 2) -->
        <div class="availability-badge-large" :class="book.available ? 'available' : 'unavailable'">
          {{ book.available ? '✓ Available' : '✗ Unavailable' }}
        </div>
      </div>

      <!-- Informações detalhadas -->
      <div class="book-info-section">
        <div class="info-header">
          <span class="genre-badge">{{ formatGenre(book.genre) }}</span>
          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-author">by {{ book.author }}</p>

          <!-- Rating com estrelas (Desafio 1) -->
          <div class="book-rating">
            <span class="stars">{{ renderStars(book.rating) }}</span>
            <span class="rating-number">({{ book.rating }}/5)</span>
          </div>
        </div>

        <!-- Informações adicionais -->
        <div class="info-grid">
          <div class="info-item">
            <span class="label">ISBN</span>
            <span class="value">{{ book.isbn }}</span>
          </div>

          <div class="info-item">
            <span class="label">Publication Year</span>
            <span class="value">{{ book.year }}</span>
          </div>

          <div class="info-item">
            <span class="label">Genre</span>
            <span class="value">{{ formatGenre(book.genre) }}</span>
          </div>

          <div class="info-item">
            <span class="label">Status</span>
            <span class="value">
              {{ book.available ? 'Available for loan' : 'Currently unavailable' }}
            </span>
          </div>
        </div>

        <!-- Botões de ação -->
        <div class="action-buttons">
          <button @click="goToEdit" class="btn btn-edit">Edit Book</button>
          <button @click="confirmDelete" class="btn btn-delete">Delete Book</button>
          <button @click="goBack" class="btn btn-secondary">Back to Library</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de confirmação para remoção -->
  <ConfirmModal
    v-if="showDeleteModal"
    title="Delete Book"
    :message="`Are you sure you want to delete '${book.title}'? This action cannot be undone.`"
    confirmText="Delete"
    @confirm="handleDelete"
    @cancel="showDeleteModal = false"
  />
</template>

<script>
import { mapStores } from 'pinia'
import { useBooksStore } from '@/stores/books.js'
import { formatGenre, renderStars, handleImageError, FALLBACK_COVER_URL } from '@/utils/book.js'
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
  name: 'BookDetailView',

  components: {
    ConfirmModal,
  },

  data() {
    return {
      book: null,
      loading: false,
      error: null,
      showDeleteModal: false,
      FALLBACK_COVER_URL,
    }
  },

  computed: {
    ...mapStores(useBooksStore),
  },

  // Carrega livro com base no ID da rota ($route.params.id)
  async created() {
    await this.loadBook()
  },

  methods: {
    async loadBook() {
      this.loading = true
      this.error = null

      try {
        const bookId = this.$route.params.id
        const data = await this.booksStore.fetchBookById(bookId)

        if (data) {
          this.book = data
        } else {
          this.error = 'Book not found'
        }
      } catch (err) {
        this.error = `Error loading book: ${err.message}`
      } finally {
        this.loading = false
      }
    },

    // === UTILITÁRIOS (importados de utils/book.js) ===
    formatGenre,
    renderStars,
    handleImageError,

    // === NAVEGAÇÃO ===

    goBack() {
      this.$router.push({ name: 'home' })
    },

    goToEdit() {
      this.$router.push({ name: 'book-edit', params: { id: this.book.id } })
    },

    // === REMOÇÃO ===

    confirmDelete() {
      this.showDeleteModal = true
    },

    // Remove livro e redireciona para homepage com mensagem
    async handleDelete() {
      const success = await this.booksStore.deleteBook(this.book.id)

      if (success) {
        // Redireciona para a homepage e passa uma mensagem de sucesso
        // A HomeView vai mostrar esta mensagem num toast
        this.$router.push({
          name: 'home',
          params: { message: `"${this.book.title}" was successfully deleted.` },
        })
      } else {
        this.showDeleteModal = false
        this.error = 'Failed to delete book. Please try again.'
      }
    },
  },
}
</script>

<style scoped>
.loading-state,
.error-state {
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-lg);
}

.loading-state .spinner {
  margin: 0 auto var(--spacing-lg);
}

.loading-state p {
  color: var(--text-secondary);
}

.error-state h2 {
  color: var(--color-danger);
  margin-bottom: var(--spacing-md);
}

.error-state p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-sm);
}

.breadcrumb-link {
  background: none;
  border: none;
  color: var(--color-blue);
  cursor: pointer;
  padding: 0;
  font-size: var(--font-size-sm);
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--color-blue-hover);
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--text-secondary);
}

.breadcrumb-current {
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.detail-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-xl);
  background: var(--bg-soft);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
}

.book-cover-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.book-cover-large {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.availability-badge-large {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  text-align: center;
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.availability-badge-large.available {
  background: rgba(66, 184, 131, 0.15);
  border: 1px solid var(--color-success);
  color: var(--color-success);
}

.availability-badge-large.unavailable {
  background: rgba(231, 78, 61, 0.15);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
}

.book-info-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.genre-badge {
  display: inline-block;
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: var(--spacing-2xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-sm);
}

.book-title {
  font-size: var(--font-size-3xl);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.2;
}

.book-author {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  font-style: italic;
  margin: 0 0 var(--spacing-md) 0;
}

/* Rating com estrelas */
.book-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.book-rating .stars {
  color: var(--color-warning);
  font-size: var(--font-size-2xl);
  letter-spacing: 4px;
}

.rating-number {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xs);
}

.info-item .label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.info-item .value {
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.btn {
  font-family: inherit;
  background: transparent;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  border-color: var(--color-warning);
}

.btn-edit:hover {
  background: var(--color-warning);
}

.btn-delete {
  border-color: var(--color-danger);
}

.btn-delete:hover {
  background: var(--color-danger);
}

.btn-secondary {
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

.btn-primary {
  border-color: var(--color-blue);
}

.btn-primary:hover {
  background: var(--color-blue);
}

@media (max-width: 968px) {
  .detail-content {
    grid-template-columns: 1fr;
    padding: var(--spacing-lg);
  }

  .book-cover-section {
    max-width: 300px;
    margin: 0 auto;
  }

  .book-title {
    font-size: var(--font-size-2xl);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
