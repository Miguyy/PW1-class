<template>
  <div id="app">
    <ButtonCounter />
    <p>
      <input type="text" v-model="title" />
      <BlogPost v-bind:title="title" />
    </p>
    <DisplayStudents :students="students" />
    <h1>Emit</h1>
    <ChildText @changeText="myFunction" />
    <AlertBox>
      <p>Este é o conteúdo do AlertBox.</p>
    </AlertBox>
  </div>
</template>

<script>
import ButtonCounter from './components/ButtonCounter.vue'
import AlertBox from './components/alertBox.vue'
import BlogPost from './components/blogPost.vue'
import ChildText from './components/childText.vue'
import DisplayStudents from './components/displayStudents.vue'

export default {
  name: 'App',
  components: {
    ButtonCounter,
    BlogPost,
    DisplayStudents,
    ChildText,
    AlertBox,
  },
  data() {
    return {
      title: ' ',
      students: [
        { name: 'Alice', grade: 90 },
        { name: 'Bob', grade: 85 },
        { name: 'Charlie', grade: 92 },
      ],
    }
  },
  methods: {
    myFunction(newText) {
      this.title = newText
      newText = alert('ola')
    },
  },
}
</script>

<style lang="scss" scoped></style>
