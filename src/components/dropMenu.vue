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
      <li v-for="(btn, index) in props.buttons" :key="index" class="dropMenu__item">
        <button class="dropMenu__button" @click="btn.onClickFn">
          {{ btn.title }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.dropMenu {
  position: absolute;
  background: var(--main-background-color);
  width: fit-content;
  border-radius: 10px;
  border: 1px solid var(--divider-border-color);
  text-align: center;
  overflow: hidden;
  right: 0;
  top: 6%;
  z-index: 100;

  &__buttons {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__button {
    display: block;
    width: 100%;
    padding: 10px 20px; // Немного увеличил для удобства
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 1px solid var(--divider-border-color);
    color: var(--main-text-color);

    &:hover {
      background-color: var(--hover-background-color);
    }

  }

  &__item:last-child {
    .dropMenu__button {
      border-bottom: none;
    }
  }
}
</style>