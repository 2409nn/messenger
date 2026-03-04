<script setup>
  const props = defineProps({
    buttons: {
      type: Array,
      required: true,
    }
  })
</script>

<template>
  <div class="dropMenu">
    <ul class="dropMenu__buttons">
      <li class="dropMenu__button" v-for="btn in props.buttons">
        <button @click="btn.onClickFn">{{ btn.title }}</button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">

</style>