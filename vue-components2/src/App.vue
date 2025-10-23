<template>
  <div id="app">
    <StudentCard
      v-for="student in students"
      :key="student.studentNumber"
      :name="student.name"
      :studentNumber="student.studentNumber"
      :course="student.course"
      :year="student.year"
    />
  </div>
</template>

<script>
import StudentCard from './components/StudentCard.vue'

export default {
  name: 'App',
  components: {
    StudentCard,
  },
  data() {
    return {
      students: [
        {
          name: 'Alice Johnson',
          studentNumber: 12345,
          course: 'Computer Science',
          year: 2,
        },
        {
          name: 'Bob Smith',
          studentNumber: 67890,
          course: 'Information Technology',
          year: 3,
        },
        {
          name: 'John Smith',
          studentNumber: 10212,
          course: 'UI/UX',
          year: 1,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
