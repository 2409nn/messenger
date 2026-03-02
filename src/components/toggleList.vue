<script setup>

  import { ref } from "vue";

  const isActive = ref(false);

  defineProps({

    title: {
      type: String,
      required: true
    },
    buttonType: {
      type: String,
      required: false,
      default: 'arrow',
    },

  })

  const setToggleStatus = () => {
    isActive.value = !isActive.value;
  }



</script>

<template>
  <div class="toggleList">
    <button class="toggleList__toggle" @click="setToggleStatus">

      <div class="toggleList__toggle-slot">
        <slot></slot>
      </div>

      <p class="toggleList__toggle-title">{{ title }}</p>

      <svg class="toggleList__toggle-btn" v-if="buttonType === 'arrow'" :class="{'active': isActive}" width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.27841 1.27836L7.27841 7.29537L1.27841 13.3124" stroke="currentColor" stroke-width="2.55681" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>

    </button>
  </div>
</template>

<style scoped lang="scss">
  .toggleList {

    &__toggle {
      background-color: var(--body-background);
      border: none;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.17);
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      padding: 20px;
      border-radius: 10px;
      margin-top: 12px;

      &-slot {
        display: flex;
        flex-direction: row;
        gap: 20px;
        align-items: center;
        color: var(--main-text-color);
        stroke: white !important;
      }


      &-title {
        margin-left: 15px;
        color: var(--main-text-color);
      }

      &-btn {
        margin-left: auto;
        color: var(--main-text-color);

        &.active {
          transform: rotate(90deg);
        }
      }
    }

  }
</style>