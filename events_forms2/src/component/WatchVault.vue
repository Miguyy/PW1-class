<template>
  <div>
    <p>Total: {{ items.length }} items, {{ seriesCount }} series, {{ moviesCount }} movies</p>
    <form @reset.prevent="onReset">
      <label>Type:</label>
      <input type="radio" name="type" value="serie" v-model="newItem.type" required /> Serie
      <input type="radio" name="type" value="movie" v-model="newItem.type" required /> Movie
      <br />

      <label>Name:</label>
      <input type="text" v-model="newItem.name" placeholder="Name" minlength="3" required />
      <br />

      <label>Category:</label>
      <input type="radio" name="category" value="Drama" v-model="newItem.category" required /> Drama
      <input type="radio" name="category" value="Comedy" v-model="newItem.category" required />
      Comedy
      <input type="radio" name="category" value="Action" v-model="newItem.category" required />
      Action
      <input type="radio" name="category" value="Sci-Fi" v-model="newItem.category" required />
      Sci-Fi
      <br />

      <label>Rating:</label>
      <select v-model="newItem.rating" required>
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
      <br />

      <button type="button" @click="addToWatchlist">Add to Watchlist</button>
      <button type="reset">Clear Form</button>
      <select v-model="sortBy">
        <option value="Alphabetical">Alphabetical</option>
        <option value="Rating">Rating</option>
      </select>
      <button @click="setOrder('asc')">Asc</button>
      <button @click="setOrder('desc')">Desc</button>
    </form>
  </div>
  <div>
    <table v-if="items.length > 0" border="1">
      <tr>
        <th>Type</th>
        <th>Name</th>
        <th>Category</th>
        <th>Rating</th>
        <th>Remove</th>
      </tr>
      <tr v-for="(item, idx) in items" :key="item.id">
        <td>{{ item.type }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.category }}</td>
        <td>{{ item.rating }}</td>
        <td><button @click="removeItem(idx, item)">Remove</button></td>
      </tr>
    </table>
    <div v-else>No items added yet. Add your first one!</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      newItem: {
        type: '',
        name: '',
        category: '',
        rating: '',
      },
      sortBy: '',
      sortOrder: 'asc',
    }
  },
  computed: {
    seriesCount() {
      return this.items.filter((item) => item.type === 'serie').length
    },
    moviesCount() {
      return this.items.filter((item) => item.type === 'movie').length
    },
  },
  watch: {
    sortBy() {
      this.sortItems()
    },
  },
  mounted() {
    if (localStorage.getItem('watchlist')) {
      this.items = JSON.parse(localStorage.getItem('watchlist'))
    }
  },
  updated() {
    localStorage.setItem('watchlist', JSON.stringify(this.items))
  },
  methods: {
    addToWatchlist() {
      if (
        !this.newItem.type ||
        !this.newItem.name ||
        this.newItem.name.length < 3 ||
        !this.newItem.category ||
        !this.newItem.rating
      ) {
        alert('Fill all fields correctly!')
        return
      }
      const item = { ...this.newItem, id: Date.now() }
      this.items.push(item)
      this.onReset()
    },
    removeItem(idx, item) {
      if (item.type === 'serie') {
        if (window.confirm('Are you sure you want to remove "' + item.name + '"?')) {
          this.items.splice(idx, 1)
        }
      } else {
        this.items.splice(idx, 1)
      }
    },
    onReset() {
      this.newItem = {
        type: '',
        name: '',
        category: '',
        rating: '',
      }
    },
    sortItems() {
      if (this.sortBy === 'Alphabetical') {
        this.items.sort((a, b) => {
          if (this.sortOrder === 'asc') {
            return a.name.localeCompare(b.name)
          } else {
            return b.name.localeCompare(a.name)
          }
        })
      } else if (this.sortBy === 'Rating') {
        this.items.sort((a, b) => {
          if (this.sortOrder === 'asc') {
            return a.rating - b.rating
          } else {
            return b.rating - a.rating
          }
        })
      }
    },
    setOrder(order) {
      this.sortOrder = order
      this.sortItems()
    },
  },
}
</script>
