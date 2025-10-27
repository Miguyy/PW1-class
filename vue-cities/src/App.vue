<script>
export default {
  name: 'CitiesApp',
  data() {
    return {
      cities: [
        {
          id: 1,
          name: 'Porto',
          nPopulation: 214349,
          image: 'https://www.klm.pt/travel-guide/destinations/europe/portugal/porto',
        },
        {
          id: 2,
          name: 'Vila Nova de Gaia',
          nPopulation: 302295,
          image:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.gaiaresidence.com%2Flocal-area&psig=AOvVaw3P_ff3peWIl_fexIJVnIcg&ust=1761653258560000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJC66_irxJADFQAAAAAdAAAAABAE',
        },
        {
          id: 3,
          name: 'Braga',
          nPopulation: 181494,
          image:
            'https://portugaltravelguide.com/wp-content/uploads/2020/01/Braga-e1745684985938.webp',
        },
      ],
    }
  },
}
</script>

<template>
  <h1>Cities</h1>
  <table>
    <tr v-for="city in cities" :key="city.id">
      <td>{{ city.name }}</td>
      <td>{{ city.nPopulation }}</td>
      <td>
        <RouterLink to="{name: 'city', params:{cityId: city.id}}"> link </RouterLink>
      </td>
    </tr>
  </table>
  <RouterView />
</template>

<style scoped></style>
