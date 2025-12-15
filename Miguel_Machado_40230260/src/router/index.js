import { createRouter, createWebHistory } from 'vue-router'
import CreateDishesView from '../views/CreateDishesView.vue'
import ListDishesView from '@/views/ListDishesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'listdishes',
      component: ListDishesView,
    },
    {
      path: 'dishes/create',
      name: 'create-dishes',
      component: CreateDishesView,
    },
  ],
})

export default router
