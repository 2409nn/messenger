<script setup>
  import userAvatar from "@/assets/imgs/avatars/user_1.jpg"
  import { ref, watch, defineEmits } from "vue"

  const props = defineProps({
    // userData: {
    //   type: Object,
    //   required: true
    //
    // }
    active: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(["callEnded"])

  const isActive = ref(props.active)

  watch(() => props.active, (newVal) => {
    isActive.value = newVal;
  })

  const onCloseClick = () => {
    isActive.value = false;
    emit("callEnded", isActive.value);
  }

</script>

<template>
<div class="callWindow" :class="{'active': isActive}">

  <img class="callWindow__avatar" :src="userAvatar" alt="avatar">
  <p class="callWindow__title">Ope</p>
  <div style="font-size: 56px; font-weight: 300; margin: 45px 0" class="callWindow__stopwatch">4:21</div>
  <div class="callWindow__buttons">
    <button class="callWindow__button callWindow__button-microphone">
      <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 4.66667C7 3.19391 8.34315 2 10 2C11.6569 2 13 3.19391 13 4.66667V10C13 11.4728 11.6569 12.6667 10 12.6667C8.34315 12.6667 7 11.4728 7 10V4.66667Z" fill="currentColor"/>
        <path d="M5.5 9.68251C5.5 9.31432 5.16421 9.01584 4.75 9.01584C4.33579 9.01584 4 9.31432 4 9.68251V9.99997C4 12.7197 6.29027 14.964 9.25 15.292V16.6667H7.75C7.33579 16.6667 7 16.9651 7 17.3333C7 17.7015 7.33579 18 7.75 18H12.25C12.6642 18 13 17.7015 13 17.3333C13 16.9651 12.6642 16.6667 12.25 16.6667H10.75V15.292C13.7097 14.964 16 12.7197 16 9.99997V9.68251C16 9.31432 15.6642 9.01584 15.25 9.01584C14.8358 9.01584 14.5 9.31432 14.5 9.68251V9.99997C14.5 12.2091 12.4853 14 10 14C7.51472 14 5.5 12.2091 5.5 9.99997V9.68251Z" fill="currentColor"/>
        <rect class="callWindow__svg-cross" x="4.62529" y="4.66476" width="1.69274" height="16.4752" rx="0.59637" transform="rotate(-39.2597 4.62529 4.66476)" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
      </svg>
    </button>
    <button class="callWindow__button callWindow__button-camera">
      <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.57143 4C2.15127 4 1 5.16406 1 6.6V14.4C1 15.8359 2.15127 17 3.57143 17H10.6429C12.063 17 13.2143 15.8359 13.2143 14.4V6.6C13.2143 5.16406 12.063 4 10.6429 4H3.57143Z" fill="currentColor"/>
        <path d="M16.8052 16.35L14.5 14.0192V6.98073L16.8052 4.64997C17.6151 3.83101 19 4.41104 19 5.56921V15.4307C19 16.5889 17.6151 17.1689 16.8052 16.35Z" fill="currentColor"/>
        <rect class="callWindow__svg-cross" x="0.351781" y="3.10659" width="1.69274" height="20.5"  rx="0.59637" transform="rotate(-39.2597 0.351781 3.10659)" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
      </svg>
    </button>

    <button class="callWindow__button callWindow__button-end" @click="onCloseClick">
      <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" rx="10" fill="#E04E4E"/>
        <rect x="13.0753" y="5.80646" width="1.58149" height="10.2797" rx="0.790743" transform="rotate(45 13.0753 5.80646)" fill="white"/>
        <rect x="14.1935" y="13.0753" width="1.58149" height="10.2797" rx="0.790743" transform="rotate(135 14.1935 13.0753)" fill="white"/>
      </svg>

    </button>
  </div>
</div>
</template>

<style scoped lang="scss">
  .callWindow {
    position: absolute;
    width: var(--call-width);
    height: var(--call-height);
    background: linear-gradient(45grad, #9453ff, #ff65d2);
    border-radius: 10px;
    border: 1px solid var(--divider-border-color);
    text-align: center;
    color: white;
    z-index: 120;
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s cubic-bezier(0,0,.15,.98);
    left: calc(50% - var(--call-width) / 2);
    top: calc(50% - var(--call-height) / 2 - 100px);

    &.active {
      opacity: 1;
      transform: scale(1);
      transition: all 0.5s cubic-bezier(0,0,.53,1.31);
    }

    &__avatar {
      border-radius: 50%;
      width: 100px;
      margin-top: 30px;
    }

    &__title {
      font-size: 20px;
      margin-top: 10px;
      font-weight: 500;
    }

    &__buttons {
      display: flex;
      gap: 10px;
      background: var(--body-background);
      width: fit-content;
      margin: auto;
      padding: 10px 30px;
      border-radius: 10px;
      border: 1px solid var(--divider-border-color);
    }

    &__svg-cross {
      stroke: var(--body-background);
      fill: var(--main-text-color);
    }

    &__button {
      background-color: var(--main-background-color);
      padding: 5px;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      border: none;

      &-end {
        background: var(--danger-color);
      }

      svg {
        height: 30px;
        width: 30px;
        color: var(--main-text-color);
      }
    }
  }
</style>