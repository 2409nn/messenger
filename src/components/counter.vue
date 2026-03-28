<script setup>

  import { ref } from "vue";

  const props = defineProps({
    count: {
      type: Number,
      required: true
    }
  })

  const countString = ref(props.count);

  if (props.count > 99) {
    countString.value = `99+`;
  }

</script>

<template>
  <div class="counter" v-if="count > 0">
    <span class="counter__count">{{ countString }}</span>
  </div>
</template>

<style scoped lang="scss">
  .counter {
    background-color: var(--cyan-background);
    color: white;
    padding: 5px 8px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 500;
    margin-left: auto;
  }
</style>