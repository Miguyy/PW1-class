import { defineStore } from 'pinia'
import { get, post, put, del, buildQueryString } from '@/api/api.js'

export const useBooksStore = defineStore('books', {
  state: () => ({
    // Lista de livros (pode ser filtrada/pesquisada/paginada)
    books: [],
    // Estados de carregamento e erro para feedback ao utilizador
    loading: false,
    error: null,

    // Parâmetros de pesquisa e filtragem
    searchQuery: '',
    genreFilter: '',
    availabilityFilter: '',

    // Parâmetros de ordenação
    sortField: 'title',
    sortOrder: 'asc',

    // Parâmetros de paginação (5 livros por página conforme enunciado)
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
  }),

  getters: {
    // Lista de géneros disponíveis para filtro
    availableGenres: () => [
      { value: '', label: 'All genres' },
      { value: 'fantasy', label: 'Fantasy' },
      { value: 'fiction', label: 'Fiction' },
      { value: 'classic', label: 'Classic' },
      { value: 'dystopian', label: 'Dystopian' },
      { value: 'thriller', label: 'Thriller' },
      { value: 'scifi', label: 'Sci-Fi' },
      { value: 'romance', label: 'Romance' },
      { value: 'biography', label: 'Biography' },
    ],

    // Opções de ordenação (título, autor, ano, rating)
    sortOptions: () => [
      { value: 'title', label: 'Title' },
      { value: 'author', label: 'Author' },
      { value: 'year', label: 'Year' },
      { value: 'rating', label: 'Rating' },
    ],

    // Número total de páginas
    totalPages: (state) => Math.ceil(state.totalItems / state.itemsPerPage),

    // Navegação entre páginas
    hasPreviousPage: (state) => state.currentPage > 1,
    hasNextPage: (state) => state.currentPage < Math.ceil(state.totalItems / state.itemsPerPage),
  },

  actions: {
    // Constrói query string combinando pesquisa, filtros, ordenação e paginação
    // Utiliza parâmetros nativos do JSON Server (_sort, _order, _page, _limit, q)
    buildBooksQuery() {
      const params = {}

      // Pesquisa global (JSON Server utiliza 'q' para full-text search)
      if (this.searchQuery) {
        params.q = this.searchQuery
      }

      // Filtro por género
      if (this.genreFilter) {
        params.genre = this.genreFilter
      }

      // Filtro por disponibilidade
      if (this.availabilityFilter !== '') {
        params.available = this.availabilityFilter
      }

      // Ordenação (JSON Server utiliza _sort e _order)
      if (this.sortField) {
        params._sort = this.sortField
        params._order = this.sortOrder
      }

      // Paginação (JSON Server utiliza _page e _limit)
      params._page = this.currentPage
      params._limit = this.itemsPerPage

      return buildQueryString(params)
    },

    // Obtém livros com filtros/ordenação/paginação atuais
    // Faz dois pedidos: um para contar total (sem paginação) e outro para a página atual
    async fetchBooks() {
      this.loading = true
      this.error = null

      try {
        // Primeiro, obtemos o total de items (sem paginação)
        // para calcular o número de páginas
        const countParams = {}
        if (this.searchQuery) countParams.q = this.searchQuery
        if (this.genreFilter) countParams.genre = this.genreFilter
        if (this.availabilityFilter !== '') countParams.available = this.availabilityFilter

        const countQuery = buildQueryString(countParams)
        const allFiltered = await get(`/books${countQuery}`)
        this.totalItems = allFiltered.length

        // Depois, obtemos a página atual com todos os parâmetros
        const queryString = this.buildBooksQuery()
        const data = await get(`/books${queryString}`)
        this.books = data
      } catch (err) {
        this.error = `Error loading books: ${err.message}`
        this.books = []
      } finally {
        this.loading = false
      }
    },

    // Obtém um livro específico pelo ID (utilizado na página de detalhe)
    async fetchBookById(id) {
      this.loading = true
      this.error = null

      try {
        const data = await get(`/books/${id}`)
        return data
      } catch (err) {
        this.error = `Error loading book: ${err.message}`
        return null
      } finally {
        this.loading = false
      }
    },

    // Adiciona novo livro (JSON Server gera ID automaticamente)
    async addBook(book) {
      this.loading = true
      this.error = null

      try {
        const newBook = await post('/books', book)
        // Recarrega a lista para manter consistência com filtros/paginação
        await this.fetchBooks()
        return newBook
      } catch (err) {
        this.error = `Error adding book: ${err.message}`
        return null
      } finally {
        this.loading = false
      }
    },

    // Atualiza livro existente (PUT para substituição completa)
    async updateBook(id, book) {
      this.loading = true
      this.error = null

      try {
        const updatedBook = await put(`/books/${id}`, book)
        // Recarrega para manter consistência
        await this.fetchBooks()
        return updatedBook
      } catch (err) {
        this.error = `Error updating book: ${err.message}`
        return null
      } finally {
        this.loading = false
      }
    },

    // Remove livro (JSON Server persiste alteração no db.json)
    async deleteBook(id) {
      this.loading = true
      this.error = null

      try {
        await del(`/books/${id}`)
        // Recarrega a lista
        await this.fetchBooks()
        return true
      } catch (err) {
        this.error = `Error deleting book: ${err.message}`
        return false
      } finally {
        this.loading = false
      }
    },

    // === AÇÕES DE PESQUISA E FILTROS ===
    // Cada uma atualiza o parâmetro e recarrega (reset para página 1)

    setSearch(query) {
      this.searchQuery = query
      this.currentPage = 1
      this.fetchBooks()
    },

    setGenreFilter(genre) {
      this.genreFilter = genre
      this.currentPage = 1
      this.fetchBooks()
    },

    setAvailabilityFilter(availability) {
      this.availabilityFilter = availability
      this.currentPage = 1
      this.fetchBooks()
    },

    setSort(field, order = 'asc') {
      this.sortField = field
      this.sortOrder = order
      this.fetchBooks()
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.fetchBooks()
      }
    },

    // Limpa todos os filtros e volta aos valores default
    clearFilters() {
      this.searchQuery = ''
      this.genreFilter = ''
      this.availabilityFilter = ''
      this.sortField = 'title'
      this.sortOrder = 'asc'
      this.currentPage = 1
      this.fetchBooks()
    },

    clearError() {
      this.error = null
    },
  },
})
