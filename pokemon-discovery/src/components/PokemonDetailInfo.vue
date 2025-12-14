<template>
  <article class="detail-card">
    <!-- Cabeçalho: Nome e Order -->
    <header>
      <h1>{{ pokemon.name }}</h1>
      <span class="pokemon-order">{{ formattedOrder }}</span>
    </header>

    <!-- Sprites: Frente e Costas -->
    <div class="sprites-container">
      <figure class="sprite-figure">
        <img :src="frontSprite" :alt="`${pokemon.name} frente`" />
        <figcaption>Frente</figcaption>
      </figure>
      <figure class="sprite-figure">
        <img :src="backSprite" :alt="`${pokemon.name} costas`" />
        <figcaption>Costas</figcaption>
      </figure>
    </div>

    <!-- Tipos -->
    <section class="types-section">
      <h2>Tipos</h2>
      <div class="pokemon-types">
        <span v-for="type in pokemon.types" :key="type.slot" :class="'type-' + type.type.name">
          {{ type.type.name }}
        </span>
      </div>
    </section>

    <!-- Altura e Peso -->
    <div class="physical-stats">
      <div class="stat-item">
        <span class="stat-label">Altura</span>
        <span class="stat-value">{{ formattedHeight }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Peso</span>
        <span class="stat-value">{{ formattedWeight }}</span>
      </div>
    </div>
  </article>
</template>

<script>
import { usePokemonStore } from '@/stores/pokemon'
import { mapState } from 'pinia'
import { formatPokemonOrder, getPokemonSprite, formatHeight, formatWeight } from '@/utils/pokemon'

export default {
  name: 'PokemonDetailInfo',
  props: {
    pokemon: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(usePokemonStore, ['totalCount']),

    formattedOrder() {
      return formatPokemonOrder(this.pokemon.order, this.totalCount)
    },

    frontSprite() {
      return getPokemonSprite(this.pokemon.sprites, 'front_default')
    },

    backSprite() {
      return getPokemonSprite(this.pokemon.sprites, 'back_default')
    },

    formattedHeight() {
      return formatHeight(this.pokemon.height)
    },

    formattedWeight() {
      return formatWeight(this.pokemon.weight)
    },
  },
}
</script>

<style scoped>
.detail-card {
  background-color: var(--bg-soft);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);

  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);

  width: var(--card-width);
  min-height: var(--card-min-height);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

header h1 {
  font-size: 1.5rem;
  color: var(--text-title);
  text-transform: capitalize;
  margin: 0;

  /* Truncar nomes longos */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pokemon-order {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.sprites-container {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
}

.sprite-figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.sprite-figure img {
  width: 96px;
  height: 96px;
  image-rendering: pixelated;
}

.sprite-figure figcaption {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.types-section h2 {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-sm);
}

.pokemon-types {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.physical-stats {
  display: flex;
  justify-content: space-around;
  gap: var(--spacing-md);
  margin-top: auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.25rem;
  color: var(--text-primary);
  font-weight: 600;
}
</style>
