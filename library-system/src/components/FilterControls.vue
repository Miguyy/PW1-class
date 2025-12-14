<template>
  <!-- Controlos de filtro e ordenação para a lista de livros -->
  <div class="filter-controls">
    <!-- Filtro por género -->
    <div class="filter-group">
      <label for="genre-filter">Genre</label>
      <select
        id="genre-filter"
        :value="genreFilter"
        @change="$emit('update:genreFilter', $event.target.value)"
      >
        <option v-for="genre in genres" :key="genre.value" :value="genre.value">
          {{ genre.label }}
        </option>
      </select>
    </div>

    <!-- Filtro por disponibilidade -->
    <div class="filter-group">
      <label for="availability-filter">Availability</label>
      <select
        id="availability-filter"
        :value="availabilityFilter"
        @change="$emit('update:availabilityFilter', $event.target.value)"
      >
        <option value="">All</option>
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </select>
    </div>

    <!-- Ordenação -->
    <div class="filter-group">
      <label for="sort-field">Sort by</label>
      <select
        id="sort-field"
        :value="sortField"
        @change="$emit('update:sortField', $event.target.value)"
      >
        <option v-for="option in sortOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Direção (asc/desc) -->
    <div class="filter-group">
      <label for="sort-order">Order</label>
      <select
        id="sort-order"
        :value="sortOrder"
        @change="$emit('update:sortOrder', $event.target.value)"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <button @click="$emit('clear')" class="btn-clear">Clear Filters</button>
  </div>
</template>

<script>
export default {
  name: 'FilterControls',

  props: {
    genres: {
      type: Array,
      required: true,
    },
    sortOptions: {
      type: Array,
      required: true,
    },
    genreFilter: {
      type: String,
      default: '',
    },
    availabilityFilter: {
      type: String,
      default: '',
    },
    sortField: {
      type: String,
      default: 'title',
    },
    sortOrder: {
      type: String,
      default: 'asc',
    },
  },

  emits: [
    'update:genreFilter',
    'update:availabilityFilter',
    'update:sortField',
    'update:sortOrder',
    'clear',
  ],
}
</script>

<style scoped>
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: flex-end;
  padding: var(--spacing-md);
  background: var(--bg-soft);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xs);
}

.filter-group label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: 500;
}

.filter-group select {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  min-width: 140px;
  transition: border-color 0.2s ease;
}

.filter-group select:focus {
  outline: none;
  border-color: var(--color-blue);
}

.btn-clear {
  background: none;
  border: none;
  color: var(--color-blue);
  text-decoration: underline;
  cursor: pointer;
  font-size: var(--font-size-sm);
  margin-left: var(--spacing-sm);
  transition: color 0.2s ease;
}

.btn-clear:hover {
  color: var(--color-blue-hover);
}
</style>
