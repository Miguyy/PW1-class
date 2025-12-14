<template>
  <article class="pokemon-card" aria-busy="true" aria-label="A carregar Pokémon">
    <div class="image-skeleton skeleton-element"></div>

    <div class="pokemon-info">
      <p class="skeleton-element"></p>
      <h2 class="skeleton-element"></h2>
      <div class="pokemon-types">
        <span class="skeleton-element"></span>
        <span class="skeleton-element"></span>
        <span class="skeleton-element"></span>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'PokemonCardSkeleton',
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
  justify-content: center;
  gap: var(--spacing-md);

  padding: var(--spacing-md);

  text-align: center;
}

.image-skeleton {
  width: 50%;
  height: 50%;
  border-radius: 50%;
}

.pokemon-info {
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  width: 100%;

  flex: 1;
}

.pokemon-types {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;

  width: 100%;
}

.pokemon-types span.skeleton-element {
  border: none;
}

h2,
p,
span {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-xl);
  height: 1rem;
}

p {
  width: 30%;
}

h2 {
  width: 50%;
}

span {
  width: 100%;
}
</style>
