<template>
  <div>
    <li>
      <ul>
        <li v-for="article in articles" :key="article.id">
          <router-link :to="`/articles/${article.id}`">
            <h2>{{ article.title }}</h2>
            <p>by {{ article.author }}</p>
            <p>{{ article.excerpt }}</p>
          </router-link>
        </li>
      </ul>
    </li>
  </div>
</template>

<script>
export default {
  name: 'ArticleListView',
  data() {
    return {
      articles: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Getting Started with Vue 3 Composition API',
          author: 'Maria Santos',
          excerpt:
            'Learn the fundamentals of Vue 3s Composition API and how it can improve your code organization and reusability.',
          content:
            'The Composition API is one of the most exciting features introduced in Vue 3. It provides a new way to organize component logic, making it more flexible and easier to reuse across components. In this article, we will explore the basics of the Composition API and see how it compares to the Options API.The main advantage of the Composition API is that it allows you to group related logic together, rather than splitting it across different options like data, methods, and computed. This makes your code more maintainable, especially in larger components.',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          title: 'Getting Started with Vue 3 Composition API',
          author: 'João Pedro',
          excerpt:
            'Learn the fundamentals of Vue 3s Composition API and how it can improve your code organization and reusability.',
          content:
            'The Composition API is one of the most exciting features introduced in Vue 3. It provides a new way to organize component logic, making it more flexible and easier to reuse across components. In this article, we will explore the basics of the Composition API and see how it compares to the Options API.The main advantage of the Composition API is that it allows you to group related logic together, rather than splitting it across different options like data, methods, and computed. This makes your code more maintainable, especially in larger components.',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          title: 'Getting Started with Vue 3 Composition API',
          author: 'Ana Costa',
          excerpt:
            'Learn the fundamentals of Vue 3s Composition API and how it can improve your code organization and reusability.',
          content:
            'The Composition API is one of the most exciting features introduced in Vue 3. It provides a new way to organize component logic, making it more flexible and easier to reuse across components. In this article, we will explore the basics of the Composition API and see how it compares to the Options API.The main advantage of the Composition API is that it allows you to group related logic together, rather than splitting it across different options like data, methods, and computed. This makes your code more maintainable, especially in larger components.',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          title: 'Getting Started with Vue 3 Composition API',
          author: 'Ricardo Silva',
          excerpt:
            'Learn the fundamentals of Vue 3s Composition API and how it can improve your code organization and reusability.',
          content:
            'The Composition API is one of the most exciting features introduced in Vue 3. It provides a new way to organize component logic, making it more flexible and easier to reuse across components. In this article, we will explore the basics of the Composition API and see how it compares to the Options API.The main advantage of the Composition API is that it allows you to group related logic together, rather than splitting it across different options like data, methods, and computed. This makes your code more maintainable, especially in larger components.',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
