<template>
  <!-- Card de livro com capa, info, rating com estrelas e badge de disponibilidade -->
  <div class="book-card" :class="{ unavailable: !book.available }">
    <!-- Capa com fallback -->
    <div class="book-cover">
      <img
        :src="book.imageUrl || FALLBACK_COVER_URL"
        :alt="`Cover of ${book.title}`"
        class="cover-image"
        @error="handleImageError"
      />
    </div>

    <div class="book-info">
      <div class="book-header">
        <span class="book-genre">{{ formatGenre(book.genre) }}</span>
        <span class="availability-badge" :class="book.available ? 'available' : 'unavailable'">
          {{ book.available ? 'Available' : 'Unavailable' }}
        </span>
      </div>

      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">by {{ book.author }}</p>

      <div class="book-meta">
        <span class="book-year">{{ book.year }}</span>
        <span class="book-rating" :title="`${book.rating} out of 5 stars`">
          {{ renderStars(book.rating) }}
        </span>
      </div>

      <div class="book-actions">
        <button @click="$emit('view', book)" class="btn btn-view">View</button>
        <button @click="$emit('edit', book)" class="btn btn-edit">Edit</button>
        <button @click="$emit('delete', book)" class="btn btn-delete">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatGenre, renderStars, handleImageError, FALLBACK_COVER_URL } from '@/utils/book.js'

export default {
  name: 'BookCard',

  props: {
    book: {
      type: Object,
      required: true,
    },
  },

  emits: ['view', 'edit', 'delete'],

  // Constante exposta ao template
  data() {
    return {
      FALLBACK_COVER_URL,
    }
  },

  methods: {
    formatGenre,
    renderStars,
    handleImageError,
  },
}
</script>

<style scoped>
.book-card {
  background: var(--bg-soft);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.book-card.unavailable {
  opacity: 0.7;
}

.book-cover {
  width: 100%;
  height: 220px;
  padding-block: var(--spacing-xs);
  overflow: hidden;
  background: var(--bg-soft);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.book-info {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.book-genre {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: var(--spacing-2xs) var(--spacing-xs);
  border-radius: var(--radius-sm);
  letter-spacing: 0.5px;
}

.availability-badge {
  font-size: 11px;
  padding: var(--spacing-2xs) var(--spacing-xs);
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.availability-badge.available {
  background: rgba(66, 184, 131, 0.15);
  border: 1px solid var(--color-success);
  color: var(--color-success);
}

.availability-badge.unavailable {
  background: rgba(231, 78, 61, 0.15);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
}

.book-title {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  margin: 0 0 6px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-md) 0;
  font-style: italic;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  margin-top: auto;
}

.book-year {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.book-rating {
  color: var(--color-warning);
  font-size: var(--font-size-sm);
  letter-spacing: 2px;
}

.book-actions {
  display: flex;
  gap: 6px;
}

.btn {
  font-family: inherit;
  flex: 1;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: transparent;
  border: 1px solid;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view {
  border-color: var(--color-blue);
  color: var(--color-blue);
}

.btn-view:hover {
  border-color: var(--color-blue-hover);
  color: var(--text-primary);
  background: var(--color-blue-hover);
}

.btn-edit {
  border-color: var(--color-warning);
  color: var(--text-primary);
}

.btn-edit:hover {
  background: var(--color-warning);
}

.btn-delete {
  border-color: var(--color-danger);
  color: var(--text-primary);
}

.btn-delete:hover {
  background: var(--color-danger);
}
</style>
