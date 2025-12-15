import { defineStore } from 'pinia'
import {
  dishesList as apiGetAll,
  dishesDetails as apiGetByCategory,
  createDish as apiCreate,
  updateDish as apiUpdate,
  deleteDish as apiDelete,
} from '@/api/api.js'

export const useDishesStore = defineStore('dishes', {
  state: () => ({
    dishes: [],
    selectedDish: null,
    activeDishFilter: null,
    loading: false,
    error: null,
  }),

  actions: {
    setError(err) {
      this.error = err ? String(err.message || err) : null
    },

    async loadDish() {
      this.loading = true
      this.setError(null)
      try {
        const data = await apiGetAll()
        this.dishes = Array.isArray(data) ? data : []
      } catch (err) {
        this.setError(err)
        this.dishes = []
      } finally {
        this.loading = false
      }
    },

    async loadDishByCategory(category) {
      this.loading = true
      this.setError(null)
      try {
        const data = await apiGetByCategory(category)
        this.selectedDish = data || null
        return this.selectedDish
      } catch (err) {
        this.setError(err)
        this.selectedDish = null
        return null
      } finally {
        this.loading = false
      }
    },

    async addDish(dishData) {
      this.loading = true
      this.setError(null)
      try {
        const created = await apiCreate(dishData)
        this.dishes.unshift(created)
        return created
      } catch (err) {
        this.setError(err)
        return null
      } finally {
        this.loading = false
      }
    },

    async updateDish(id, dishData) {
      this.loading = true
      this.setError(null)
      try {
        const updated = await apiUpdate(id, dishData)
        if (updated) {
          const idx = this.dishes.findIndex((d) => String(d.id) === String(id))
          if (idx !== -1) this.dishes.splice(idx, 1, updated)
          if (this.selectedDish && String(this.selectedDish.id) === String(id)) {
            this.selectedDish = updated
          }
        }
        return updated
      } catch (err) {
        this.setError(err)
        return null
      } finally {
        this.loading = false
      }
    },

    async removeDish(id) {
      this.loading = true
      this.setError(null)
      try {
        const ok = await apiDelete(id)
        if (ok) {
          this.dishes = this.dishes.filter((d) => String(d.id) !== String(id))
          if (this.selectedSession && String(this.selectedSession.id) === String(id)) {
            this.selectedSession = null
          }
        }
        return ok
      } catch (err) {
        this.setError(err)
        return false
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    dishesByActiveCategory: (state) => (category) =>
      state.dishes.filter((d) => d.category === category),
  },
})
