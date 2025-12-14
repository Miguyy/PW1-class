<template>
  <header>
    <h1>Pokémon Discovery</h1>
    <Transition name="fade" v-if="!pokemonStore.error">
      <p v-if="pokemonStore.discoveredCount > 0 && !pokemonStore.hasCompletedPokedex">
        Já descobriste {{ pokemonStore.discoveredCount }} Pokémon!
      </p>
    </Transition>
  </header>

  <main>
    <!-- Skeleton enquanto carrega OU enquanto não há Pokémon -->
    <PokemonCardSkeleton v-if="isLoading" />

    <div v-else-if="pokemonStore.error" class="error-message">
      <p>{{ pokemonStore.error }}</p>
    </div>

    <div v-else-if="pokemonStore.hasCompletedPokedex" class="congrats-message">
      <p>Parabéns! Descobriste todos os {{ pokemonStore.totalCount }} Pokémon!</p>
    </div>

    <PokemonCard v-else :pokemon="pokemonStore.currentPokemon" @click="goToDetail" />

    <button class="btn-discover" :disabled="isLoading" @click="handleButtonClick">
      {{ buttonText }}
    </button>
  </main>
</template>

<script>
import PokemonCard from '@/components/PokemonCard.vue'
import PokemonCardSkeleton from '@/components/PokemonCardSkeleton.vue'
import { usePokemonStore } from '@/stores/pokemon'
import { mapStores } from 'pinia'

export default {
  name: 'HomeView',
  components: {
    PokemonCard,
    PokemonCardSkeleton,
  },
  computed: {
    // mapStores cria this.pokemonStore com acesso a state, getters e actions
    ...mapStores(usePokemonStore),

    // Unifica condições de loading: a carregar OU sem dados (e sem erro)
    isLoading() {
      return (
        this.pokemonStore.loading || (!this.pokemonStore.currentPokemon && !this.pokemonStore.error)
      )
    },

    // Texto dinâmico do botão conforme estado da aplicação
    buttonText() {
      if (this.isLoading) return 'A carregar...'
      if (this.pokemonStore.error) return 'Tentar Novamente'
      if (this.pokemonStore.hasCompletedPokedex) return 'Recomeçar Aventura'
      return 'Descobrir Novo Pokémon'
    },
  },
  methods: {
    // Handler do botão principal: descobre novo ou reinicia
    handleButtonClick() {
      if (this.pokemonStore.hasCompletedPokedex) {
        this.pokemonStore.resetPokedex()
      } else {
        this.pokemonStore.fetchRandomPokemon()
      }
    },

    // Navega para página de detalhe do Pokémon atual
    goToDetail() {
      this.$router.push({
        name: 'pokemon-detail',
        params: { id: this.pokemonStore.currentPokemon.id },
      })
    },
  },

  // created: inicializa IDs e carrega primeiro Pokémon se necessário
  async created() {
    await this.pokemonStore.initializeAvailableIds()

    if (!this.pokemonStore.currentPokemon && this.pokemonStore.availableIds.length > 0) {
      this.pokemonStore.fetchRandomPokemon()
    }
  },
}
</script>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-title);
  text-align: left;
  line-height: 1;
}

header p {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  text-align: center;
  font-style: italic;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

main {
  display: grid;
  gap: var(--spacing-lg);
  place-items: center;
}

.error-message {
  text-align: center;
  color: var(--color-danger);
}

.congrats-message {
  text-align: center;
  color: var(--color-success);
}

.btn-discover {
  background: var(--bg-soft);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: var(--spacing-md) var(--spacing-xl);
  font-family: inherit;
  font-size: var(--font-size-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-discover:disabled {
  background: var(--bg-secondary);
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-discover:hover:not(:disabled) {
  border-color: var(--text-title);
  color: var(--text-title);
}
</style>
