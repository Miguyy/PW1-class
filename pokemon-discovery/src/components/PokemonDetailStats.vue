<template>
  <article class="detail-card">
    <!-- Estatísticas Base -->
    <section class="stats-section">
      <h2>Estatísticas Base</h2>
      <div class="stats-list">
        <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat-row">
          <span class="stat-name">{{ formatStatName(stat.stat.name) }}</span>
          <div class="stat-bar-container">
            <div
              class="stat-bar"
              :style="{ width: calculateStatPercentage(stat.base_stat) + '%' }"
            ></div>
          </div>
          <span class="stat-value">{{ stat.base_stat }}</span>
        </div>
      </div>
    </section>

    <!-- Abilities -->
    <section class="abilities-section">
      <h2>Habilidades</h2>
      <div class="abilities-list">
        <p v-for="ability in pokemon.abilities" :key="ability.slot" class="ability-item">
          {{ formatAbilityName(ability.ability.name) }}
          <span v-if="ability.is_hidden" class="hidden-badge">Oculta</span>
        </p>
      </div>
    </section>
  </article>
</template>

<script>
import { formatStatName, calculateStatPercentage, formatAbilityName } from '@/utils/pokemon'

export default {
  name: 'PokemonDetailStats',
  props: {
    pokemon: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatStatName,
    calculateStatPercentage,
    formatAbilityName,
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

.stats-section h2,
.abilities-section h2 {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-md);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.stat-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.stat-name {
  width: 80px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.stat-bar-container {
  flex: 1;
  height: 8px;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.stat-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-success), var(--text-blue));
  border-radius: var(--radius-sm);
  transition: width 0.5s ease;
}

.stat-value {
  width: 35px;
  text-align: right;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-weight: 600;
  flex-shrink: 0;
}

.abilities-section {
  margin-top: auto;
}

.abilities-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.ability-item {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-sm);

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hidden-badge {
  font-size: var(--font-size-xs);
  color: var(--color-warning);
  background-color: rgba(243, 156, 18, 0.1);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-warning);
}
</style>
