import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SessionDetailView from '@/views/SessionDetailView.vue'
import SessionFormView from '@/views/SessionFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sessions/new',
      name: 'session-form',
      component: SessionFormView,
    },
    {
      path: '/sessions/:id',
      name: 'session-detail',
      component: SessionDetailView,
    },
    {
      path: '/sessions/:id/edit',
      name: 'session-edit',
      component: SessionFormView,
    },
  ],
})

export default router
