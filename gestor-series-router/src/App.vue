<script>
export default {
  name: 'App',
  data() {
    return {
      series: [
        {
          id: 1,
          title: 'Breaking Bad',
          link: 'https://pt.wikipedia.org/wiki/Breaking_Bad',
          seasons: 5,
          years: 2008 - 2013,
          cover:
            'https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        },
        {
          id: 2,
          title: 'Stranger Things',
          link: 'https://pt.wikipedia.org/wiki/Stranger_Things',
          seasons: 4,
          years: 2016 - 2022,
          cover: 'https://cdn.europosters.eu/image/750/63329.jpg',
        },
        {
          id: 3,
          title: 'Game of Thrones',
          link: 'https://pt.wikipedia.org/wiki/Game_of_Thrones',
          seasons: 8,
          years: 2011 - 2019,
          cover:
            'https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        },
      ],
    }
  },
  created() {
    if (!localStorage.getItem('series')) {
      localStorage.setItem('series', JSON.stringify(this.series))
    }
  },
}
</script>

<template>
  <h1>View Series</h1>
  <RouterView />
</template>

<style scoped></style>
