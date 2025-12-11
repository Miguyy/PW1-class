<template>
  <!-- Navegação principal -->
  <header class="app-header">
    <nav class="container main-nav">
      <router-link to="/" class="nav-brand">Note Keeper</router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">My Notes</router-link>
        <router-link to="/note/new" class="nav-link">+ New Note</router-link>
      </div>
    </nav>
  </header>

  <!-- Conteúdo das rotas -->
  <main class="container app-main">
    <router-view />
  </main>

  <!-- Footer -->
  <footer class="app-footer">
    <p>Note Keeper © {{ currentYear }}</p>
  </footer>
</template>

<script>
export default {
  name: 'App',

  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style>
.app-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.main-nav {
  max-width: var(--container-lg);
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--accent-primary);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: var(--spacing-xl);
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: var(--font-size-sm);
  line-height: 54px;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--accent-secondary);
}

.nav-link.router-link-active {
  color: var(--accent-primary);
  font-weight: 600;
  position: relative;
  border-bottom: 1px solid var(--accent-primary);
  bottom: -1px;
}

.app-main {
  flex: 1;
  padding-block: var(--spacing-xl);
}

.app-footer {
  flex-shrink: 0;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-lg) var(--spacing-xl);
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>
