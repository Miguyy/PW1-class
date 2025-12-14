import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CocktailDetailView from '../views/CocktailDetailView.vue'
import RandomCocktailView from '../views/RandomCocktailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Cocktail App' },
    },
    {
      path: '/cocktail/:id',
      name: 'cocktail-detail',
      component: CocktailDetailView,
      props: true,
      meta: { title: 'Cocktail Details' },
    },
    {
      path: '/random',
      name: 'random-cocktail',
      component: RandomCocktailView,
      meta: { title: 'Random Cocktail' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Cocktail App'
  next()
})

export default router
