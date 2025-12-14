import { defineStore } from 'pinia'
import {
  getRandomCocktail,
  getCocktailById,
  searchCocktails,
  getCocktailsByCategory,
  getCategories,
} from '@/api/api'

// Chave para localStorage dos favoritos
const FAVORITES_STORAGE_KEY = 'cocktail-favorites'

export const useCocktailsStore = defineStore('cocktails', {
  // STATE - Dados reativos (equivalente ao data() de um componente)
  state: () => ({
    // Lista de cocktails para a homepage
    cocktails: [],

    // Cocktail atualmente selecionado (página de detalhes)
    currentCocktail: null,

    // Lista de categorias (para dropdown)
    categories: [],

    // Categoria selecionada
    selectedCategory: 'Cocktail',

    // IDs dos favoritos (persistidos em localStorage)
    favorites: [],

    // Estados de UI
    loading: false,
    error: null,
  }),

  // GETTERS - Propriedades computadas (equivalente a computed)
  getters: {
    // Processa ingredientes do cocktail atual
    // A API retorna strIngredient1..15 e strMeasure1..15 (muitos são null)
    // Este getter combina cada ingrediente com a medida correspondente
    ingredients(state) {
      if (!state.currentCocktail) {
        return []
      }

      const cocktail = state.currentCocktail
      const result = []

      const ingredientsCount = Object.keys(cocktail).filter(
        (key) => key.startsWith('strIngredient') && cocktail[key],
      ).length

      for (let i = 1; i <= ingredientsCount; i++) {
        const ingredient = cocktail[`strIngredient${i}`]
        const measure = cocktail[`strMeasure${i}`]

        if (ingredient && ingredient.trim() !== '') {
          result.push({
            ingredient: ingredient.trim(),
            measure: measure ? measure.trim() : '',
          })
        }
      }

      return result
    },

    hasCocktails(state) {
      return state.cocktails.length > 0
    },

    hasError(state) {
      return state.error !== null
    },

    // Retorna função para verificar se cocktail está nos favoritos
    // No template: store.isFavorite(cocktailId)
    isFavorite(state) {
      return (cocktailId) => state.favorites.includes(String(cocktailId))
    },

    favoritesCount(state) {
      return state.favorites.length
    },
  },

  // ACTIONS - Métodos (equivalente a methods, podem ser assíncronos)
  actions: {
    // Carrega lista de categorias da API
    async fetchCategories() {
      // Evita recarregar se já temos dados
      if (this.categories.length > 0) {
        return
      }

      this.loading = true
      this.error = null

      try {
        this.categories = await getCategories()
      } catch (err) {
        console.error('Erro ao carregar categorias:', err)
        this.error = 'Não foi possível carregar as categorias.'
      } finally {
        this.loading = false
      }
    },

    // Carrega cocktails de uma categoria específica
    async fetchCocktailsByCategory(category) {
      this.loading = true
      this.error = null
      this.selectedCategory = category

      try {
        this.cocktails = await getCocktailsByCategory(category)
      } catch (err) {
        console.error('Erro ao carregar cocktails por categoria:', err)
        this.error = 'Não foi possível carregar os cocktails.'
        this.cocktails = []
      } finally {
        this.loading = false
      }
    },

    // Pesquisa cocktails por nome
    async searchCocktails(query) {
      this.loading = true
      this.error = null

      try {
        this.cocktails = await searchCocktails(query)
      } catch (err) {
        console.error('Erro ao pesquisar cocktails:', err)
        this.error = 'Não foi possível realizar a pesquisa.'
        this.cocktails = []
      } finally {
        this.loading = false
      }
    },

    // Carrega detalhes de um cocktail específico por ID
    async fetchCocktailById(id) {
      this.loading = true
      this.error = null

      try {
        this.currentCocktail = await getCocktailById(id)

        if (!this.currentCocktail) {
          this.error = 'Cocktail não encontrado.'
        }
      } catch (err) {
        console.error('Erro ao carregar cocktail:', err)
        this.error = 'Não foi possível carregar os detalhes do cocktail.'
        this.currentCocktail = null
      } finally {
        this.loading = false
      }
    },

    // Carrega um cocktail aleatório
    async fetchRandomCocktail() {
      this.loading = true
      this.error = null

      try {
        this.currentCocktail = await getRandomCocktail()
      } catch (err) {
        console.error('Erro ao carregar cocktail aleatório:', err)
        this.error = 'Não foi possível carregar um cocktail aleatório.'
        this.currentCocktail = null
      } finally {
        this.loading = false
      }
    },

    // Limpa o cocktail atual (ao sair da página de detalhes)
    clearCurrentCocktail() {
      this.currentCocktail = null
      this.error = null
    },

    // Toggle favorito - adiciona se não existe, remove se existe
    toggleFavorite(cocktailId) {
      const id = String(cocktailId)
      const index = this.favorites.indexOf(id)

      if (index === -1) {
        this.favorites.push(id)
      } else {
        this.favorites.splice(index, 1)
      }

      this.saveFavoritesToStorage()
    },

    // Persiste favoritos no localStorage
    saveFavoritesToStorage() {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(this.favorites))
      } catch (error) {
        console.error('Erro ao guardar favoritos:', error)
      }
    },

    // Carrega favoritos do localStorage
    loadFavoritesFromStorage() {
      try {
        const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)

        if (stored) {
          const parsed = JSON.parse(stored)

          // Valida se é array antes de atribuir
          if (Array.isArray(parsed)) {
            this.favorites = parsed
          }
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error)
        this.favorites = []
      }
    },
  },
})
