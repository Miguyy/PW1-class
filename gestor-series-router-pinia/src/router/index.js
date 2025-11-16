import { createRouter, createWebHistory } from 'vue-router'
import SeriesCatalogView from '../../views/SeriesCatalogView.vue'
import SeriesDetailsView from '../../views/SeriesDetailsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'seriesCatalog',
      component: SeriesCatalogView,
    },
    {
      path: 'series/:id',
      name: 'seriesDetails',
      component: SeriesDetailsView,
    },
  ],
})

export default router
