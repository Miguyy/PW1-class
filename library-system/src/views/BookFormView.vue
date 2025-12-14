<template>
  <div class="form-container">
    <!-- Breadcrumb para navegação -->
    <nav class="breadcrumb">
      <button @click="goBack" class="breadcrumb-link">
        ← {{ isEditing ? 'Book Details' : 'Library' }}
      </button>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ isEditing ? 'Edit Book' : 'Add New Book' }}</span>
    </nav>

    <div class="form-card">
      <h1>{{ isEditing ? 'Edit Book' : 'Add New Book' }}</h1>
      <p class="form-description">
        {{
          isEditing
            ? 'Update the book information below.'
            : 'Fill in the details to add a new book to your library.'
        }}
      </p>

      <!-- Formulário -->
      <form @submit.prevent="handleSubmit">
        <!-- Título (obrigatório, min 2 caracteres) -->
        <div class="form-row">
          <div class="form-group full-width">
            <label for="title">Title *</label>
            <input
              type="text"
              id="title"
              v-model="form.title"
              placeholder="e.g., The Lord of the Rings"
              required
              minlength="2"
            />
            <span v-if="errors.title" class="field-error">{{ errors.title }}</span>
          </div>
        </div>

        <!-- Autor (min 3 caracteres) e ISBN -->
        <div class="form-row">
          <div class="form-group">
            <label for="author">Author *</label>
            <input
              type="text"
              id="author"
              v-model="form.author"
              placeholder="e.g., J.R.R. Tolkien"
              required
              minlength="3"
            />
            <span v-if="errors.author" class="field-error">{{ errors.author }}</span>
          </div>

          <div class="form-group">
            <label for="isbn">ISBN</label>
            <input
              type="text"
              id="isbn"
              v-model="form.isbn"
              placeholder="e.g., 978-0-618-64015-7"
            />
            <span v-if="errors.isbn" class="field-error">{{ errors.isbn }}</span>
          </div>
        </div>

        <!-- Ano (1000-atual) e Género -->
        <div class="form-row">
          <div class="form-group">
            <label for="year">Publication Year *</label>
            <input
              type="number"
              id="year"
              v-model.number="form.year"
              :min="1000"
              :max="currentYear"
              required
            />
            <span v-if="errors.year" class="field-error">{{ errors.year }}</span>
          </div>

          <div class="form-group">
            <label for="genre">Genre *</label>
            <select id="genre" v-model="form.genre" required>
              <option value="">Select a genre...</option>
              <option value="fantasy">Fantasy</option>
              <option value="fiction">Fiction</option>
              <option value="classic">Classic</option>
              <option value="dystopian">Dystopian</option>
              <option value="thriller">Thriller</option>
              <option value="scifi">Sci-Fi</option>
              <option value="romance">Romance</option>
              <option value="biography">Biography</option>
              <option value="horror">Horror</option>
            </select>
            <span v-if="errors.genre" class="field-error">{{ errors.genre }}</span>
          </div>
        </div>

        <!-- Rating (0-5) e Disponibilidade -->
        <div class="form-row">
          <div class="form-group">
            <label for="rating">Rating (0-5) *</label>
            <input
              type="number"
              id="rating"
              v-model.number="form.rating"
              min="0"
              max="5"
              step="1"
              required
            />
            <span class="rating-preview">{{ renderStars(form.rating || 0) }}</span>
            <span v-if="errors.rating" class="field-error">{{ errors.rating }}</span>
          </div>

          <div class="form-group">
            <label>Availability</label>
            <div class="checkbox-wrapper">
              <input type="checkbox" id="available" v-model="form.available" />
              <label for="available" class="checkbox-label">
                {{ form.available ? 'Available' : 'Unavailable' }}
              </label>
            </div>
          </div>
        </div>

        <!-- URL da Capa -->
        <div class="form-row">
          <div class="form-group full-width">
            <label for="imageUrl">Cover Image URL</label>
            <input
              type="url"
              id="imageUrl"
              v-model="form.imageUrl"
              placeholder="https://example.com/cover.jpg"
            />
            <span class="field-hint">Optional: Add a URL to the book's cover image</span>

            <!-- Preview da imagem se URL válido -->
            <div v-if="form.imageUrl" class="image-preview">
              <img
                :src="form.imageUrl"
                alt="Cover preview"
                @error="imageLoadError = true"
                v-show="!imageLoadError"
              />
              <p v-if="imageLoadError" class="image-error">Unable to load image from this URL</p>
            </div>
          </div>
        </div>

        <!-- Mensagem de erro geral -->
        <p v-if="error" class="error-message">{{ error }}</p>

        <!-- Botões de ação -->
        <div class="form-actions">
          <button
            type="button"
            @click="goBack"
            class="btn btn-secondary"
            :disabled="booksStore.loading"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="booksStore.loading">
            {{ booksStore.loading ? 'Saving...' : isEditing ? 'Update Book' : 'Add Book' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useBooksStore } from '@/stores/books.js'
import { renderStars } from '@/utils/book.js'

export default {
  name: 'BookFormView',

  data() {
    return {
      // Dados do formulário
      form: {
        title: '',
        author: '',
        isbn: '',
        year: new Date().getFullYear(),
        genre: '',
        available: true,
        rating: 0,
        imageUrl: '',
      },
      errors: {},
      error: null,
      imageLoadError: false,
    }
  },

  computed: {
    ...mapStores(useBooksStore),

    // Modo edição se existir ID na rota
    isEditing() {
      return !!this.$route.params.id
    },

    currentYear() {
      return new Date().getFullYear()
    },
  },

  // Em modo edição, carrega dados do livro para o formulário
  async created() {
    if (this.isEditing) {
      await this.loadBook()
    }
  },

  // Reseta erro de imagem quando URL muda
  watch: {
    'form.imageUrl'() {
      this.imageLoadError = false
    },
  },

  methods: {
    // Carrega livro existente para edição
    async loadBook() {
      const bookId = this.$route.params.id
      const book = await this.booksStore.fetchBookById(bookId)

      if (book) {
        // Preenche o formulário com os dados do livro
        this.form = {
          title: book.title || '',
          author: book.author || '',
          isbn: book.isbn || '',
          year: book.year || new Date().getFullYear(),
          genre: book.genre || '',
          available: book.available !== undefined ? book.available : true,
          rating: book.rating || 0,
          imageUrl: book.imageUrl || '',
        }
      } else {
        // Livro não encontrado, redireciona para a homepage
        this.$router.push({ name: 'home' })
      }
    },

    // Importado de utils/book.js
    renderStars,

    // Valida formulário conforme regras do enunciado
    validate() {
      this.errors = {}

      // Título: obrigatório, mínimo 2 caracteres
      if (!this.form.title || this.form.title.trim().length < 2) {
        this.errors.title = 'Title must be at least 2 characters long'
      }

      // Autor: obrigatório, mínimo 3 caracteres
      if (!this.form.author || this.form.author.trim().length < 3) {
        this.errors.author = 'Author name must be at least 3 characters long'
      }

      // ISBN: formato simplificado (opcional mas se preenchido deve ter formato válido)
      if (this.form.isbn && this.form.isbn.trim()) {
        const isbnPattern = /^(?:\d{10}|\d{13}|[\d-]{13,17})$/
        if (!isbnPattern.test(this.form.isbn.replace(/[-\s]/g, ''))) {
          this.errors.isbn = 'Invalid ISBN format'
        }
      }

      // Ano: entre 1000 e ano atual
      if (!this.form.year || this.form.year < 1000 || this.form.year > this.currentYear) {
        this.errors.year = `Year must be between 1000 and ${this.currentYear}`
      }

      // Género: obrigatório
      if (!this.form.genre) {
        this.errors.genre = 'Please select a genre'
      }

      // Rating: entre 0 e 5
      if (this.form.rating < 0 || this.form.rating > 5) {
        this.errors.rating = 'Rating must be between 0 and 5'
      }

      return Object.keys(this.errors).length === 0
    },

    // Submete formulário (cria ou atualiza) e redireciona para detalhe
    async handleSubmit() {
      this.error = null

      // Valida o formulário
      if (!this.validate()) {
        this.error = 'Please correct the errors above'
        return
      }

      // Prepara os dados para enviar
      const bookData = {
        title: this.form.title.trim(),
        author: this.form.author.trim(),
        isbn: this.form.isbn.trim(),
        year: this.form.year,
        genre: this.form.genre,
        available: this.form.available,
        rating: this.form.rating,
        imageUrl: this.form.imageUrl.trim(),
      }

      let result = null

      if (this.isEditing) {
        // Atualizar livro existente
        const bookId = this.$route.params.id
        bookData.id = bookId
        result = await this.booksStore.updateBook(bookId, bookData)

        if (result) {
          // Redireciona para a página de detalhe com mensagem de sucesso
          this.$router.push({
            name: 'book-detail',
            params: {
              id: bookId,
              message: `"${bookData.title}" was successfully updated.`,
            },
          })
        }
      } else {
        // Criar novo livro
        result = await this.booksStore.addBook(bookData)

        if (result) {
          // Redireciona para a página de detalhe do novo livro
          this.$router.push({
            name: 'book-detail',
            params: {
              id: result.id,
              message: `"${bookData.title}" was successfully added.`,
            },
          })
        }
      }

      // Se chegou aqui e result é null, houve erro
      if (!result) {
        this.error = this.booksStore.error || 'An error occurred. Please try again.'
      }
    },

    // Volta para página anterior (detalhe se edição, homepage se criação)
    goBack() {
      if (this.isEditing) {
        this.$router.push({
          name: 'book-detail',
          params: { id: this.$route.params.id },
        })
      } else {
        this.$router.push({ name: 'home' })
      }
    },
  },
}
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
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
}

.form-card {
  background: var(--bg-soft);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
}

.form-card h1 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
  font-size: var(--font-size-3xl);
}

.form-description {
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-xl) 0;
  font-size: var(--font-size-sm);
}

.form-row {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xs);
}

.form-group.full-width {
  flex: 100%;
}

.form-group label {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-weight: 600;
}

.form-group input,
.form-group select {
  font-family: inherit;
  padding: var(--spacing-sm);
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  transition: border-color 0.2s ease;
}

.form-group input::placeholder {
  color: var(--text-secondary);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-blue);
}

.form-group select option {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
}

.checkbox-wrapper input[type='checkbox'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--color-success);
}

.checkbox-label {
  font-weight: normal !important;
  cursor: pointer;
  margin: 0;
  color: var(--text-primary);
}

.rating-preview {
  color: var(--color-warning);
  font-size: var(--font-size-lg);
  letter-spacing: 2px;
  margin-top: var(--spacing-2xs);
}

.field-hint {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-style: italic;
}

.field-error {
  color: var(--color-danger);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-lg) 0;
  padding: var(--spacing-sm);
  background: rgba(231, 78, 61, 0.1);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-danger);
}

.image-preview {
  margin-top: var(--spacing-sm);
  max-width: 200px;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.image-error {
  color: var(--color-danger);
  font-size: var(--font-size-xs);
  margin: 0;
}

.form-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.btn {
  font-family: inherit;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border-color: var(--border-color);
  color: var(--text-primary);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-secondary);
  border-color: var(--border-color-hover);
}

.btn-primary {
  background: transparent;
  border-color: var(--color-success);
  color: var(--text-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-success);
}

@media (max-width: 768px) {
  .form-card {
    padding: var(--spacing-lg);
  }

  .form-row {
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
