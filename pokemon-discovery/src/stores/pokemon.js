import { defineStore } from 'pinia'
import { get } from '@/api/api.js'

export const usePokemonStore = defineStore('pokemon', {
  // State: dados reativos da store
  // - currentPokemon: dados do Pokémon atualmente visível
  // - availableIds: IDs ainda não descobertos (para evitar repetições)
  // - discoveredIds: IDs já descobertos (persistidos em localStorage)
  // - totalCount: total de Pokémon na Pokédex (obtido dinamicamente da API)
  // - loading/error: estados de UI
  state: () => ({
    currentPokemon: null,
    availableIds: [],
    discoveredIds: [],
    totalCount: 0,
    loading: false,
    error: null,
  }),

  getters: {
    // Número de Pokémon já descobertos
    discoveredCount: (state) => state.discoveredIds.length,

    // Verdadeiro quando todos os Pokémon foram descobertos
    hasCompletedPokedex: (state) =>
      state.availableIds.length === 0 && state.discoveredIds.length > 0,
  },

  actions: {
    // Inicializa os IDs disponíveis a partir da API
    // Obtém dinamicamente o limite máximo em vez de assumir 1-151
    // Corre apenas uma vez (skip se já houver dados do localStorage)
    async initializeAvailableIds() {
      console.log(`${this.availableIds.length} IDs já carregados.`)

      if (this.availableIds.length > 0 || this.discoveredIds.length > 0) {
        return
      }

      this.loading = true
      this.error = null

      try {
        // Obtém lista completa de Pokémon da API
        const data = await get('pokemon?limit=100000&offset=0')
        console.log(`Carregados ${data.results.length} Pokémons da API.`)

        // Extrai IDs dos URLs retornados pela API
        // Formato: "https://pokeapi.co/api/v2/pokemon/25/" -> 25
        const allIds = data.results
          .map((p) => {
            const match = p.url.match(/\/pokemon\/(\d+)\//)
            return match ? Number(match[1]) : null
          })
          .filter((id) => id !== null)

        console.log(`Extraídos ${allIds.length} IDs válidos.`)

        this.totalCount = allIds.length
        this.availableIds = allIds

        console.log(`Total de Pokémons na Pokédex: ${this.totalCount}`)
      } catch (err) {
        console.error(err)
        this.error = 'Erro ao carregar Pokédex.'
      } finally {
        this.loading = false
      }
    },

    // Seleciona um Pokémon aleatório dos ainda não descobertos
    async fetchRandomPokemon() {
      if (this.availableIds.length === 0) {
        return
      }

      // Seleciona índice aleatório do array de IDs disponíveis
      const randomIndex = Math.floor(Math.random() * this.availableIds.length)
      const randomId = this.availableIds[randomIndex]

      await this.fetchPokemonById(randomId)
    },

    // Faz fetch de um Pokémon específico pelo ID
    // showSkeleton: true = delay de 2s para UX de "descoberta"
    //               false = carregamento rápido (revisitar Pokémon)
    async fetchPokemonById(id, { showSkeleton = true } = {}) {
      this.loading = true
      this.error = null

      try {
        const dataPromise = get(`pokemon/${id}`)

        if (showSkeleton) {
          // Delay mínimo para mostrar animação de skeleton
          const minDelay = new Promise((resolve) => setTimeout(resolve, 2000))
          const [data] = await Promise.all([dataPromise, minDelay])
          this.currentPokemon = data
        } else {
          this.currentPokemon = await dataPromise
        }

        // Validação básica dos dados recebidos
        if (!this.currentPokemon || !this.currentPokemon.id) {
          throw new Error('Invalid Pokemon data received from API')
        }

        // Move ID de availableIds para discoveredIds (evita repetições)
        const index = this.availableIds.indexOf(id)
        if (index !== -1) {
          this.availableIds.splice(index, 1)
          this.discoveredIds.push(id)
        }
      } catch (err) {
        console.log(err)
        this.error = err.message
        this.currentPokemon = null
      } finally {
        this.loading = false
      }
    },

    // Limpa todos os dados e reinicia a descoberta
    resetPokedex() {
      this.$reset()
      this.initializeAvailableIds()
    },
  },

  // Plugin pinia-plugin-persistedstate para guardar progresso em localStorage
  persist: {
    pick: ['discoveredIds', 'availableIds', 'totalCount'],
    storage: localStorage,
  },
})
