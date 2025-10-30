import { createRouter, createWebHistory } from 'vue-router'
import articles from '../views/ArticleListView.vue'
import ArticleView from '../views/ArticleView.vue'
import ArticleListView from '../views/ArticleListView.vue'
import HomeView from '../views/HomeView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticleView,
    },
    {
      path: '/articles/list',
      name: 'articlelist',
      component: ArticleListView,
    },
    {
      path: '/articles/:id',
      component: articles,
    },
  ],
})

export default router
