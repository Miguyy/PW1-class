<template>
  <!-- Barra de pesquisa global com debounce (JSON Server param: ?q=) -->
  <div class="search-bar">
    <input
      type="text"
      :value="modelValue"
      @input="handleInput"
      placeholder="Search by title, author, ISBN..."
      class="search-input"
    />
    <button
      v-if="modelValue"
      @click="$emit('update:modelValue', '')"
      class="clear-btn"
      title="Clear search"
    >
      ✕
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      debounceTimer: null,
    }
  },

  methods: {
    // Debounce: espera 800ms após o utilizador parar de escrever
    handleInput(event) {
      const value = event.target.value

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }

      this.debounceTimer = setTimeout(() => {
        this.$emit('update:modelValue', value)
      }, 800)
    },
  },

  // Limpa timer para evitar memory leaks
  beforeUnmount() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
  },
}
</script>

<style scoped>
.search-bar {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.search-input {
  font-family: inherit;
  width: 100%;
  background-color: var(--bg-soft);
  color: var(--text-primary);
  padding: var(--spacing-sm) var(--spacing-xl) var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-blue);
}

.clear-btn {
  position: absolute;
  right: -8%;
  top: 50%;
  transform: translateY(-50%) translateX(8%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: var(--font-size-md);

  transition: color 0.2s ease;
}

.clear-btn:hover {
  color: var(--text-primary);
}
</style>
