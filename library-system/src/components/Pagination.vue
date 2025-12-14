<template>
  <!-- Paginação (só visível se totalPages > 1) -->
  <div class="pagination" v-if="totalPages > 1">
    <button
      @click="$emit('page-change', currentPage - 1)"
      :disabled="!hasPrevious"
      class="btn-page"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-arrow-left-icon lucide-arrow-left"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
    </button>

    <div class="page-info">
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <span class="total-items">({{ totalItems }} books)</span>
    </div>

    <button @click="$emit('page-change', currentPage + 1)" :disabled="!hasNext" class="btn-page">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-arrow-right-icon lucide-arrow-right"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'PaginationComponent',

  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    hasPrevious: {
      type: Boolean,
      default: false,
    },
    hasNext: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['page-change'],
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px;
}

.btn-page {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--bg-soft);
  color: var(--text-primary);
  border: none;
  border-radius: var(--radius-sm);

  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-page:hover:not(:disabled) {
  background: var(--color-blue);
}

.btn-page:disabled {
  background: transparent;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.page-info span {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.total-items {
  font-size: var(--font-size-xs) !important;
  color: var(--text-secondary) !important;
}
</style>
