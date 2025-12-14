import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TaskDetailView from '@/views/TaskDetailView.vue'
import TaskFormView from '@/views/TaskFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tasks/new',
      name: 'task-form',
      component: TaskFormView,
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: TaskDetailView,
    },
    {
      path: '/tasks/:id/edit',
      name: 'task-edit',
      component: TaskFormView,
    },
  ],
})

export default router
