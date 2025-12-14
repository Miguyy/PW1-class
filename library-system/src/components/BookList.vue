<template>
  <div class="book-list">
    <!-- Estado de loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading books...</p>
    </div>

    <!-- Estado de erro -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="btn btn-primary">Try Again</button>
    </div>

    <!-- Estado vazio -->
    <div v-else-if="books.length === 0" class="empty-state">
      <p>No books found.</p>
      <p class="hint">Try adjusting your search or filters, or add a new book to get started.</p>
    </div>

    <!-- Grid de livros -->
    <div v-else class="books-grid">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        @view="$emit('view', book)"
        @edit="$emit('edit', book)"
        @delete="$emit('delete', book)"
      />
    </div>
  </div>
</template>

<script>
import BookCard from './BookCard.vue'

export default {
  name: 'BookList',

  components: {
    BookCard,
  },

  props: {
    books: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
  },

  emits: ['view', 'edit', 'delete', 'retry'],
}
</script>

<style scoped>
.book-list {
  width: 100%;
  min-height: 400px;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  text-align: center;
  color: var(--text-secondary);
}

.loading-state .spinner {
  margin-bottom: var(--spacing-md);
}

.error-state {
  color: var(--color-danger);
}

.error-state .btn {
  margin-top: var(--spacing-md);
}

.empty-state .hint {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--spacing-lg);
}

/* Responsivo: ajusta para ecrãs pequenos */
@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }
}

.btn {
  font-family: inherit;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid var(--color-blue);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--text-primary);
}

.btn-primary:hover {
  background: var(--color-blue);
}
</style>
