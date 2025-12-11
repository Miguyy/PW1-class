// Configuração do Vue Router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Note Keeper' },
  },
  {
    path: '/note/new',
    name: 'note-create',
    component: () => import('@/views/NoteFormView.vue'),
    meta: { title: 'New Note' },
  },
  {
    path: '/note/:id',
    name: 'note-detail',
    component: () => import('@/views/NoteDetailView.vue'),
    meta: { title: 'Detailed Note' },
  },
  {
    path: '/note/:id/edit',
    name: 'note-edit',
    component: () => import('@/views/NoteFormView.vue'),
    meta: { title: 'Editing Note' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Atualiza título da página baseado na meta da rota
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Note Keeper'
  next()
})

export default router
