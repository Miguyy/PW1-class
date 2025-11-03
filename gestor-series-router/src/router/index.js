import { createRouter, createWebHistory, RouterLink } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import SeriesCatalogView from '@/views/SeriesCatalogView.vue'
import SeriesAddFormView from '@/views/SeriesAddFormView.vue'
import SeriesDetailsView from '@/views/SeriesDetailsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/catalog',
      name: 'series-catalog',
      component: SeriesCatalogView,
      meta: { requiresAuth: true },
    },
    {
      path: '/series/:id',
      name: 'series-details',
      component: SeriesDetailsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/add-series',
      name: 'series-add-form',
      component: SeriesAddFormView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (
    to.meta.requiresAuth &&
    !localStorage.getItem('username') &&
    !localStorage.getItem('password')
  ) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
