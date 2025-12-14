<template>
  <article class="pokemon-card">
    <img :src="pokemonSprite" :alt="pokemon.name" />

    <div class="pokemon-info">
      <p>{{ formattedOrder }}</p>
      <h2>{{ pokemon.name }}</h2>
      <div class="pokemon-types" v-if="pokemon.types">
        <span v-for="type in pokemon.types" :key="type.slot" :class="'type-' + type.type.name">{{
          type.type.name
        }}</span>
      </div>
    </div>
  </article>
</template>

<script>
import { usePokemonStore } from '@/stores/pokemon'
import { mapState } from 'pinia'
import { formatPokemonOrder, getPokemonSprite } from '@/utils/pokemon'

export default {
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object,
      required: true,
      // Validação básica da estrutura do objeto
      validator: (value) => value.name && value.order && value.types && value.sprites,
    },
  },
  computed: {
    ...mapState(usePokemonStore, ['totalCount']),

    formattedOrder() {
      return formatPokemonOrder(this.pokemon.order, this.totalCount)
    },

    pokemonSprite() {
      return getPokemonSprite(this.pokemon.sprites, 'front_default')
    },
  },
}
</script>

<style scoped>
article {
  width: 300px;
  aspect-ratio: 1;
  background-color: var(--bg-soft);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  padding: var(--spacing-md);

  text-align: center;
}

article:hover {
  cursor: pointer;
}

img {
  width: 120px;
  aspect-ratio: 1;
  image-rendering: pixelated;

  margin-top: var(--spacing-md);
}

.pokemon-info {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: var(--spacing-md);
}

.pokemon-info p {
  color: var(--text-secondary);
}

.pokemon-info h2 {
  text-transform: capitalize;
  color: var(--text-blue);

  width: 100%;
  word-break: break-all;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.pokemon-types {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;

  margin-top: var(--spacing-lg);
}
</style>
