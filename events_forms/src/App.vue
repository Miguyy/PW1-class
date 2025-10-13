<template>
  <!-- <div><input type="checkbox" value="ESMAD" v-model="checkedSchools" />ESMAD</div>
  <div><input type="checkbox" value="ISEP" v-model="checkedSchools" />ISEP</div>
  <div><input type="checkbox" value="ISLAGAYA" v-model="checkedSchools" />ISLAGAYA</div>
  <p>Selected schools: {{ checkedSchools }}</p>
 -->
  <!-- <select v-model="selected" multiple> -->
  <!-- <option disabled value="">Please select one</option> -->
  <!-- <option>A</option>
    <option>B</option>
    <option>C</option> -->
  <!-- <option v-for="option in options" v-bind:key="option.value" :value="option.value">
      {{ option.text }}
    </option>
  </select>
  <span>Selected: {{ selected }}</span> <br />
  <br />
 -->
  <form @submit.prevent="onSubmit" @reset.prevent="onReset">
    <label>Name:</label>
    <input type="text" required v-model="formInfo.name" />
    <br />
    <label>Age:</label>
    <input type="number" min="15" max="100" required v-model.number="formInfo.age" />
    <br />
    <label>Gender:</label>
    <input type="radio" name="gender" value="male" v-model="formInfo.gender" /> Male
    <input type="radio" name="gender" value="female" v-model="formInfo.gender" /> Female
    <br />
    <label>Hobbies:</label>
    <select v-model="formInfo.hobbies" multiple>
      <option
        v-for="hobbieOption in hobbieOptions"
        :key="hobbieOption.value"
        :value="hobbieOption.value"
      >
        {{ hobbieOption.text }}
      </option>
    </select>
    <br />
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
    <p>Form Info: {{ formInfo }}</p>
    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
  </form>
</template>

<script>
export default {
  data() {
    return {
      /* checkedSchools: [],
      selected: '',
      options: [
        { text: '1', value: 'A' },
        { text: '2', value: 'B' },
        { text: '3', value: 'C' },
      ], */
      hobbieOptions: [
        { text: 'Reading', value: 'reading' },
        { text: 'Traveling', value: 'traveling' },
        { text: 'Cooking', value: 'cooking' },
        { text: 'Sports', value: 'sports' },
        { text: 'Music', value: 'music' },
      ],
      formInfo: {
        name: '',
        age: '',
        gender: '',
        hobbies: [],
      },
      errorMsg: '',
    }
  },
  methods: {
    onSubmit() {
      if (this.formInfo.age < 15 || this.formInfo.age > 100) {
        this.errorMsg = 'Age must be between 15 and 100.'
        return
      }
      this.errorMsg = ''
      alert('Form submitted!\n' + JSON.stringify(this.formInfo))
    },
    onReset() {
      this.formInfo = {
        name: '',
        age: '',
        gender: '',
        hobbies: [],
      }
      this.errorMsg = ''
    },
  },
}
</script>

<style lang="scss" scoped></style>
