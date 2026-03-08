<script setup>

const props = defineProps({
  buttons: {
    type: Array,
    required: true,
  },
  position: {
    type: {x: 0, y: 0},
    required: true,
  },
  element: {
    type: String,
    required: true,
  }
})

</script>


<template>
  <div class="contextMenu" :style="{'top': position.y + 'px', left: position.x + 'px'}">
    <ul class="contextMenu__buttons">
      <li v-for="(btn, index) in props.buttons" :key="index" class="contextMenu__item">
        <button class="contextMenu__button" :class="{'dangerBtn': btn.danger}" @click="btn.onClickFn">
          {{ btn.title }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.contextMenu {
  position: absolute;
  background: var(--main-background-color);
  width: fit-content;
  min-width: 140px;
  border-radius: 10px;
  border: 1px solid var(--divider-border-color);
  text-align: center;
  overflow: hidden;
  z-index: 110;

  &__buttons {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__button {
    display: block;
    width: 100%;
    padding: 5px;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 1px solid var(--divider-border-color);
    color: var(--main-text-color);

    &.dangerBtn {
      color: var(--danger-color);
    }

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