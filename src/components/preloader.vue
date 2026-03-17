<script setup>
  const props = defineProps({
    title: { type: String, default: 'Loading data' },
  })
</script>

<template>
  <div class="preloader">
    <div class="preloader__heading">
      <h3 class="prealoder__heading-title">{{ title }}...</h3>
    </div>
    <div class="preloader__progressbar">
      <div class="preloader__progressbar-front"></div>
      <div class="preloader__progressbar-back"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .preloader {
    position: absolute;
    background-color: var(--main-background-color);
    width: var(--preloader-width);
    height: 80px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid var(--divider-border-color);
    z-index: 100;
    left: calc(50% - var(--preloader-width) / 2);
    top: 20%;

    &__heading {
      font-size: 14px;
      text-align: center;
    }

    &__progressbar {
      width: 100%;
      height: 5px;
      margin-top: 20px;

      &-back {
        background-color: var(--body-background);
        width: 100%;
        height: 100%;
        border-radius: 100px;
      }
      &-front {
        position: relative;
        top: 100%;
        background-color: var(--cyan-background);
        width: 69%;
        height: 100%;
        border-radius: 100px;
      }
    }
  }
</style>