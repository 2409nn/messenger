<script setup>

  import { ref, watch } from "vue"

  const props = defineProps({
    title: {
      type: String,
      default: 'Warning'
    },
    text: {
      type: String,
      default: 'You have unsaved changes that will be lost if you leave this page. Are you sure you want to proceed?'
    },
    yesCase: {
      type: Function,
      required: true
    },
    noCase: {
      type: Function,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(["update:isActive"])

  const active = ref(props.isActive);

  watch(() => props.isActive, (newVal) => {
    active.value = newVal;
  })


</script>

<template>
  <div class="confirm" :class="{'active': active}">
    <h3 class="confirm__title">{{ title }}</h3>
    <p class="confirm__text">{{ text }}</p>

    <div class="confirm__buttons">
      <button class="confirm__button confirm__button-no" @click="() => {props.noCase(); active = false; emit('update:isActive', active)}">No</button>
      <button class="confirm__button confirm__button-yes" @click="() => {props.yesCase(); active = false; emit('update:isActive', active)}">Yes</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .confirm {
    position: absolute;
    left: calc(50% - 268px / 2);
    top: 30%;
    z-index: 140;
    background-color: var(--main-background-color);
    width: 268px;
    min-height: 160px;
    padding: 14px;
    border-radius: 10px;
    border: 1px solid var(--divider-border-color);
    text-align: center;
    opacity: 0;
    transform: scale(0);
    transition: all 0.2s;

    &.active {
      opacity: 1;
      transform: scale(100%);
      transition: all 0.3s cubic-bezier(0,0,.53,1.31);
    }

    &__title {
      font-size: 18px;
      padding-bottom: 20px;
    }

    &__text {
      font-size: 12px;
    }

    &__buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__button {
      border: none;
      border-radius: 5px;
      padding: 5px 40px;
      width: auto;
      margin-top: 20px;

      &:hover {
        cursor: pointer;
        filter: brightness(95%);
      }

      &-yes {
        background-color: var(--danger-color);
        color: white;
      }
      &-no {
        background-color: var(--body-background);
        color: var(--main-text-color);
      }
    }
  }
</style>