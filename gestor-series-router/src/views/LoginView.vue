<template>
  <div>
    <h1>Login</h1>
    <form action="" @submit.prevent="login">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" v-model="username" />
      <br />
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" v-model="password" />
      <br />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    login() {
      if (this.username === 'admin' && this.password === 'admin') {
        localStorage.setItem('username', this.username)
        localStorage.setItem('password', this.password)
        this.$router.push({ name: 'series-catalog' })
      } else {
        alert('Invalid credentials')
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
