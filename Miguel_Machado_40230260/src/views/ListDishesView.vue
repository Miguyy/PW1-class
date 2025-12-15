<template>
  <section class="filters-section">
    <div class="category-filters">
      <div class="category-buttons" role="list" aria-label="Category filters">
        <span v-for="cat in categoryOptions" :key="cat.value" role="listitem">
          <button
            class="filter-btn"
            :class="{ active: store.activeDishFilter === cat.value }"
            @click="handleCategoryFilter(cat.value)"
          >
            {{ cat.label }}
          </button>
        </span>
      </div>
    </div>
  </section>

  <div v-if="store.loading" class="loading-state">
    <p>Loading...</p>
  </div>

  <div v-else-if="store.error" class="error-state">
    <p>{{ store.error }}</p>
    <button @click="loadDishes">Try Again</button>
  </div>

  <div v-else-if="store.filteredDishes.length === 0" class="empty-state">
    <p v-if="store.activeCategory">This category has no dishes "{{ store.activeCategory }}"</p>
    <p v-else>Create your first!</p>
    <router-link to="/dishes/create" class="btn-primary" custom v-slot="{ navigate }">
      <button @click="navigate">Create Dish</button>
    </router-link>
  </div>

  <section v-else class="dishes-grid">
    <DishesCard
      v-for="dish in store.filteredDishes"
      :key="dish.id"
      :dish="dish"
      :disabled="store.isUpdating"
      @click="navigateToDetail(dish.id)"
      @delete="handleDelete"
    />
  </section>
</template>

<script>
import { mapStores } from 'pinia'
import { useDishesStore } from '@/stores/dishes'

export default {
  name: 'ListDishesView',

  data() {
    return {}
  },

  computed: {
    ...mapStores(useDishesStore),

    store() {
      return this.dishesStore
    },

    categoryOptions() {
      return [
        { value: null, label: 'starters' },
        { value: 'mains', label: 'mains' },
        { value: 'desserts', label: 'desserts' },
        { value: 'drinks', label: 'drinks' },
      ]
    },
  },

  methods: {
    async handleCategoryFilter(category) {
      this.store.setActiveCategory(category)
      await this.loadDishes()
    },

    async loadDishes() {
      if (this.store.activeCategory) {
        await this.store.fetchDishesByCategory(this.store.activeCategory)
      } else {
        await this.store.fetchAllDishes()
      }
    },

    navigateToDetail(id) {
      this.$router.push({ name: 'dish-detail', params: { id } })
    },

    async handleDelete(id) {
      await this.store.removeDish(id)
    },
  },

  async created() {
    await this.loadDishes()
  },
}
</script>
