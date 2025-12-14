import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BookDetailView from '@/views/BookDetailView.vue'
import BookFormView from '@/views/BookFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/books/new',
      name: 'book-form',
      component: BookFormView,
    },
    {
      path: '/books/:id',
      name: 'book-detail',
      component: BookDetailView,
      props: true,
    },
    {
      path: '/books/:id/edit',
      name: 'book-edit',
      component: BookFormView,
      props: true,
    },
  ],
})

export default router
