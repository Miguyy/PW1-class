<template>
  <div>
    <table>
      <tr>
        <th>Name</th>
        <th>Grade</th>
      </tr>
      <tr v-for="student in students" :key="student.name">
        <td>{{ student.name }}</td>
        <td>{{ student.grade }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'displayStudents',
  props: {
    students: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
