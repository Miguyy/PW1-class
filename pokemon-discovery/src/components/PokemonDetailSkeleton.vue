<template>
  <div
    class="detail-skeleton-container"
    aria-busy="true"
    aria-label="A carregar detalhes do Pokémon"
  >
    <!-- Skeleton Card Info (esquerda) -->
    <article class="detail-card skeleton-card">
      <!-- Header -->
      <div class="skeleton-header">
        <div class="skeleton-element skeleton-title"></div>
        <div class="skeleton-element skeleton-order"></div>
      </div>

      <!-- Sprites -->
      <div class="skeleton-sprites">
        <div class="skeleton-sprite-group">
          <div class="skeleton-element skeleton-sprite"></div>
          <div class="skeleton-element skeleton-caption"></div>
        </div>
        <div class="skeleton-sprite-group">
          <div class="skeleton-element skeleton-sprite"></div>
          <div class="skeleton-element skeleton-caption"></div>
        </div>
      </div>

      <!-- Tipos -->
      <div class="skeleton-types-section">
        <div class="skeleton-element skeleton-section-title"></div>
        <div class="skeleton-types">
          <div class="skeleton-element skeleton-type"></div>
          <div class="skeleton-element skeleton-type"></div>
        </div>
      </div>

      <!-- Altura e Peso -->
      <div class="skeleton-physical">
        <div class="skeleton-stat-item">
          <div class="skeleton-element skeleton-label"></div>
          <div class="skeleton-element skeleton-value"></div>
        </div>
        <div class="skeleton-stat-item">
          <div class="skeleton-element skeleton-label"></div>
          <div class="skeleton-element skeleton-value"></div>
        </div>
      </div>
    </article>

    <!-- Skeleton Card Stats (direita) -->
    <article class="detail-card skeleton-card">
      <!-- Stats Section -->
      <div class="skeleton-stats-section">
        <div class="skeleton-element skeleton-section-title"></div>
        <div class="skeleton-stats-list">
          <div v-for="n in 6" :key="n" class="skeleton-stat-row">
            <div class="skeleton-element skeleton-stat-name"></div>
            <div class="skeleton-element skeleton-stat-bar"></div>
            <div class="skeleton-element skeleton-stat-value"></div>
          </div>
        </div>
      </div>

      <!-- Abilities Section -->
      <div class="skeleton-abilities-section">
        <div class="skeleton-element skeleton-section-title"></div>
        <div class="skeleton-abilities-list">
          <div class="skeleton-element skeleton-ability"></div>
          <div class="skeleton-element skeleton-ability"></div>
          <div class="skeleton-element skeleton-ability"></div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'PokemonDetailSkeleton',
}
</script>

<style scoped>
.detail-skeleton-container {
  display: grid;
  grid-template-columns: var(--card-width);
  gap: var(--spacing-lg);
  justify-content: center;
}

@media (min-width: 768px) {
  .detail-skeleton-container {
    grid-template-columns: repeat(2, var(--card-width));
  }
}

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

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.skeleton-title {
  height: 1.5rem;
  width: 60%;
  border-radius: var(--radius-md);
}

.skeleton-order {
  height: 1rem;
  width: 15%;
}

.skeleton-sprites {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
}

.skeleton-sprite-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.skeleton-sprite {
  width: 96px;
  height: 96px;
  border-radius: 50%;
}

.skeleton-caption {
  width: 50px;
  height: 0.75rem;
}

.skeleton-types-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton-section-title {
  width: 40%;
  height: 0.75rem;
}

.skeleton-types {
  display: flex;
  gap: var(--spacing-sm);
}

.skeleton-type {
  width: 70px;
  height: 1.5rem;
  border-radius: var(--radius-xl);
}

.skeleton-physical {
  display: flex;
  justify-content: space-around;
  gap: var(--spacing-md);
  margin-top: auto;
}

.skeleton-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.skeleton-label {
  width: 50px;
  height: 0.75rem;
}

.skeleton-value {
  width: 40px;
  height: 1rem;
}

.skeleton-stats-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.skeleton-stats-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton-stat-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.skeleton-stat-name {
  width: 80px;
  height: 0.75rem;
  flex-shrink: 0;
}

.skeleton-stat-bar {
  flex: 1;
  height: 8px;
  border-radius: var(--radius-sm);
}

.skeleton-stat-value {
  width: 35px;
  height: 0.75rem;
  flex-shrink: 0;
}

.skeleton-abilities-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.skeleton-abilities-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton-ability {
  height: 2rem;
  border-radius: var(--radius-sm);
}
</style>
