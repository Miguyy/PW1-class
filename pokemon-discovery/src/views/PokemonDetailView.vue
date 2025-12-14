<template>
  <div class="detail-view">
    <!-- Loading State -->
    <template v-if="isLoading">
      <PokemonDetailSkeleton />
      <!-- Placeholder para manter espaço consistente durante o loading -->
      <nav class="nav-back nav-placeholder" aria-hidden="true"></nav>
    </template>

    <!-- Error State -->
    <div v-else-if="pokemonStore.error" class="error-message">
      <p>{{ pokemonStore.error }}</p>
      <button @click="goBack()" class="btn-retry">Voltar à Home</button>
    </div>

    <!-- Content State: Grid com 2 cards + navegação -->
    <template v-else-if="pokemonStore.currentPokemon">
      <div class="detail-grid">
        <PokemonDetailInfo :pokemon="pokemonStore.currentPokemon" />
        <PokemonDetailStats :pokemon="pokemonStore.currentPokemon" />

        <!-- Navegação dentro da grid para alinhamento correto -->
        <nav class="nav-back">
          <button @click="goBack()" class="btn-back">Voltar</button>
          <button @click="goBack(true)" class="btn-back btn-discover">Descobrir Outro</button>
        </nav>
      </div>
    </template>
  </div>
</template>

<script>
import PokemonDetailInfo from '@/components/PokemonDetailInfo.vue'
import PokemonDetailStats from '@/components/PokemonDetailStats.vue'
import PokemonDetailSkeleton from '@/components/PokemonDetailSkeleton.vue'
import { usePokemonStore } from '@/stores/pokemon'
import { mapStores, mapWritableState } from 'pinia'

export default {
  name: 'PokemonDetailView',
  components: {
    PokemonDetailInfo,
    PokemonDetailStats,
    PokemonDetailSkeleton,
  },
  computed: {
    ...mapStores(usePokemonStore),
    // mapWritableState permite escrita direta (utilizando em goBack para limpar)
    ...mapWritableState(usePokemonStore, ['currentPokemon']),

    // ID extraído do parâmetro dinâmico da rota (:id)
    pokemonId() {
      return Number(this.$route.params.id)
    },

    // Determina se já foi descoberto (afeta comportamento do skeleton)
    isAlreadyDiscovered() {
      return this.pokemonStore.discoveredIds.includes(this.pokemonId)
    },

    // Verifica se os dados em memória correspondem ao ID da rota
    hasCorrectPokemonLoaded() {
      return (
        this.pokemonStore.currentPokemon && this.pokemonStore.currentPokemon.id === this.pokemonId
      )
    },

    // Mostra skeleton se: a carregar OU dados incorretos (e sem erro)
    isLoading() {
      return (
        (this.pokemonStore.loading || !this.hasCorrectPokemonLoaded) && !this.pokemonStore.error
      )
    },
  },
  methods: {
    // Navega para Home
    // findOther=true: limpa currentPokemon para forçar nova descoberta
    goBack(findOther = false) {
      if (findOther) {
        this.currentPokemon = null
      }
      this.$router.push({ name: 'home' })
    },

    // Carrega dados apenas se necessário (evita fetch redundante)
    async loadPokemonData() {
      if (this.hasCorrectPokemonLoaded) {
        return
      }

      await this.pokemonStore.initializeAvailableIds()

      // Pokémon já descoberto: carrega rápido
      // Pokémon novo: mostra skeleton com delay
      const showSkeleton = !this.isAlreadyDiscovered
      await this.pokemonStore.fetchPokemonById(this.pokemonId, { showSkeleton })
    },
  },

  // Navigation guard: carrega dados ao entrar na rota
  // Necessário quando utilizador acede diretamente via URL
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.loadPokemonData()
    })
  },
}
</script>

<style scoped>
.detail-view {
  width: 100%;
}

.detail-grid {
  display: grid;
  grid-template-columns: var(--card-width);
  gap: var(--spacing-lg);
  justify-content: center;
}

@media (min-width: 768px) {
  .detail-grid {
    grid-template-columns: repeat(2, var(--card-width));
  }
}

.nav-back {
  grid-column: 1 / -1;
  justify-self: end;
  display: flex;
  gap: var(--spacing-md);
}

.nav-placeholder {
  visibility: hidden;
  height: calc(1.188rem + var(--spacing-lg));
}

.btn-back {
  background: transparent;
  color: var(--text-secondary);
  border: none;
  font-family: inherit;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: color 0.2s ease;
}

.btn-back:hover {
  color: var(--text-blue);
}

.btn-discover:hover {
  color: var(--text-title);
}

.error-message {
  text-align: center;
  color: var(--color-danger);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
}

.btn-retry {
  background: var(--bg-soft);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: inherit;
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-retry:hover {
  border-color: var(--text-title);
  color: var(--text-title);
}
</style>
