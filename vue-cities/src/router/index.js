import { createRouter, createWebHistory } from 'vue-router'
import CityView from '@/Views/CityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cities/:cityId',
      name: 'city',
      component: CityView,
    },
  ],
})

export default router
