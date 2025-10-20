<template>
  <div>
    <input type="text" @input="$emit('changeText', $event.target.value)" />
  </div>
</template>

<script>
export default {
  name: 'ChildText',
}
</script>

<style lang="scss" scoped></style>
