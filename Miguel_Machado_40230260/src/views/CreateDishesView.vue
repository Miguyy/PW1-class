<template>
  <div class="container container--sm">
    <div v-if="loading" class="loading-state">
      <p>Loading...</p>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="dish-form">
      <h1>{{ isEditMode ? 'Edit Dish' : 'New Dish' }}</h1>

      <!-- Name -->
      <div class="form-group">
        <label for="name">Name *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Dish Name"
          :class="{ error: errors.name }"
          @blur="validateField('name')"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label for="content">Description *</label>
        <textarea
          id="content"
          v-model="form.description"
          placeholder="Write the description..."
          rows="6"
          :class="{ error: errors.description }"
          @blur="validateField('content')"
        ></textarea>
        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
      </div>

      <div>
        <label for="price">Price *</label>
        <input
          id="price"
          v-model="form.price"
          type="number"
          min="0"
          placeholder="Dish Price"
          :class="{ error: errors.price }"
          @blur="validateField('price')"
        />
        <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
      </div>

      <!-- Category -->
      <div class="form-row">
        <!-- Category -->
        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" v-model="form.category">
            <option value="starters">Starters</option>
            <option value="mains">Mains</option>
            <option value="desserts">Desserts</option>
            <option value="drinks">Drinks</option>
          </select>
        </div>
      </div>

      <!-- Availability -->
      <div class="form-row checkbox-row">
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.available" />
            <span>Available</span>
          </label>
        </div>
      </div>

      <!-- Image -->
      <div class="form-group">
        <label for="imageUrl">Image *</label>
        <input
          id="imageUrl"
          v-model="form.imageUrl"
          type="text"
          placeholder="Dish Image"
          :class="{ error: errors.imageUrl }"
          @blur="validateField('image')"
        />
        <span v-if="errors.imageUrl" class="error-message">{{ errors.imageUrl }}</span>
      </div>

      <!-- Error -->
      <div v-if="submitError" class="error-banner">
        {{ submitError }}
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn-secondary">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="!isFormValid || submitting">
          {{ submitting ? 'Saving...' : isEditMode ? 'Save' : 'Create' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useDishesStore } from '@/stores/dishes'

export default {
  name: 'CreateDishesView',

  data() {
    return {
      form: {
        name: '',
        description: '',
        category: 'personal',
        price: '',
        imageUrl: '',
        available: false,
      },
      errors: { name: null, description: null, imageUrl: null },
      loading: false,
      submitting: false,
      submitError: null,
      originalData: null,
    }
  },

  computed: {
    ...mapStores(useDishesStore),

    store() {
      return this.dishesStore
    },

    isEditMode() {
      return !!this.$route.params.id
    },

    dishId() {
      return this.$route.params.id
    },

    dishCategory() {
      return this.$route.params.category
    },

    isFormValid() {
      const nameValid = this.form.name.trim().length >= 3
      const descriptionValid = this.form.description.trim().length >= 10
      const imageValid = this.form.imageUrl.trim().length >= 3
      return nameValid && descriptionValid && imageValid
    },
  },

  methods: {
    validateField(field) {
      switch (field) {
        case 'name':
          if (!this.form.name.trim()) {
            this.errors.name = 'The name is obrigatory'
          } else if (this.form.name.trim().length < 3) {
            this.errors.name = 'The name must have at least 3 characters' //fazer algo mais realista
          } else {
            this.errors.name = null
          }
          break

        case 'description':
          if (!this.form.description.trim()) {
            this.errors.description = 'The description is obrigatory'
          } else if (this.form.description.trim().length < 10) {
            this.errors.description = 'The description must have at least 10 characters'
          } else {
            this.errors.description = null
          }
          break

        case 'imageUrl':
          if (!this.form.imageUrl.trim()) {
            this.errors.imageUrl = 'The image is obrigatory'
          } else if (this.form.imageUrl.trim().length < 3) {
            this.errors.imageUrl = 'The image must have at least 3 characters'
          } else {
            this.errors.imageUrl = null
          }
          break
      }
    },

    validateAll() {
      this.validateField('name')
      this.validateField('description')
      this.validateField('imageUrl')
      return !this.errors.name && !this.errors.description && !this.errors.imageUrl
    },

    async loadDishForEdit() {
      if (!this.isEditMode) return

      this.loading = true
      await this.store.fetchDishById(this.dishId)

      if (this.store.currentDish) {
        this.form = {
          name: this.store.currentDish.name,
          description: this.store.currentDish.description,
          category: this.store.currentDish.category,
          price: this.store.currentDish.price,
          imageUrl: this.store.currentDish.imageUrl,
          available: this.store.currentDish.available || false,
        }
        this.originalData = { ...this.store.currentDish }
      }
      this.loading = false
    },

    async handleSubmit() {
      if (!this.validateAll()) return

      let result
      if (this.isEditMode) {
        const dishData = { ...this.originalData, ...this.form }
        result = await this.store.editDish(this.dishId, dishData)
      } else {
        result = await this.store.addDish(this.form)
      }

      if (result) {
        this.$router.push({ name: 'dish-detail', params: { id: result.id } })
      }
    },

    handleCancel() {
      if (window.history.length > 2) {
        this.$router.back()
      } else {
        this.$router.push({ name: 'listdishes' })
      }
    },
  },

  created() {
    if (this.isEditMode) {
      this.loadDishForEdit()
    }
  },

  beforeUnmount() {
    this.store.clearCurrentDish()
  },
}
</script>
