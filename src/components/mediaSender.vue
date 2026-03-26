<script setup>

import { ref } from "vue"
import {getDB, sendMessage} from "@/db/pouchDB.js";
import { userDataStore } from "@/stores/userData.js"

const props = defineProps({
  media: {
    required: true
  },
  isVideo: {
    default: false,
  }
})

const text = ref('');
const userData = userDataStore().userData;
const emit = defineEmits(['update:isPopupVisible', 'onMediaSend']);

const closeButton = () => {
  emit("update:isPopupVisible", false);
  text.value = '';
}

const onSubmitClick = () => {

  emit("onMediaSend", {text: text.value, media: props.media});
  text.value = '';

  closeButton();
}

</script>

<template>
  <div class="mediaSender popup">
    <div class="mediaSender__heading">
      <button class="mediaSender__heading-closeBtn closeBtn" @click="closeButton">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.75 20.75H13.75C18.75 20.75 20.75 18.75 20.75 13.75V7.75C20.75 2.75 18.75 0.75 13.75 0.75H7.75C2.75 0.75 0.75 2.75 0.75 7.75V13.75C0.75 18.75 2.75 20.75 7.75 20.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.01 14.28L8.48999 10.75L12.01 7.21997" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h3 class="mediaSender__heading-title">Send media</h3>
    </div>

    <div class="mediaSender__media">
      <img :src="props.media" alt="media" class="mediaSender__media-preview" v-if="!isVideo">
      <video controls :src="props.media" preload="metadata" alt="media" class="mediaSender__media-preview" v-if="isVideo"></video>
    </div>

    <form class="mediaSender__form" @submit.prevent="" >
        <input v-model="text" type="text" class="mediaSender__form-text" placeholder="Type something...">
        <button class="mediaSender__form-submit" @click.prevent="onSubmitClick">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_151_161)">
              <path d="M15.9883 1.15569L13.9891 14.1262C13.9666 14.2771 13.9097 14.4209 13.823 14.5465C13.7362 14.6721 13.6218 14.7761 13.4886 14.8505C13.3554 14.925 13.2069 14.968 13.0545 14.9761C12.9021 14.9843 12.7499 14.9574 12.6095 14.8975L8.78639 13.2996L7.19701 15.6826C7.14301 15.7793 7.06411 15.8597 6.96852 15.9155C6.87292 15.9713 6.76411 16.0005 6.65341 16C6.48107 16 6.31578 15.9315 6.19392 15.8096C6.07205 15.6878 6.00359 15.5225 6.00359 15.3501V12.3462C6.00284 12.124 6.07614 11.908 6.21192 11.7322L12.9999 3.00329L3.82508 11.2616L0.620102 9.9287C0.442529 9.85471 0.289977 9.73121 0.180632 9.57292C0.0712864 9.41463 0.0097602 9.22823 0.00338772 9.03595C-0.0123181 8.84889 0.0268162 8.66131 0.116006 8.49615C0.205195 8.33098 0.340574 8.19538 0.505589 8.10594L14.5051 0.131851C14.6683 0.0384918 14.8545 -0.00691445 15.0424 0.000853036C15.2302 0.00862052 15.4121 0.0692464 15.567 0.17576C15.7219 0.282275 15.8436 0.430352 15.9182 0.602969C15.9927 0.775586 16.017 0.965734 15.9883 1.15155V1.15569Z" fill="currentColor"/>
            </g>
            <defs>
              <clipPath id="clip0_151_162">
                <rect width="24" height="24" fill="currentColor"/>
              </clipPath>
            </defs>
          </svg>

        </button>
    </form>
  </div>
</template>

<style scoped lang="scss">

.mediaSender {
  visibility: hidden;
  width: var(--modal-width);
  height: fit-content !important;
  max-height: 680px;
  overflow-y: scroll;
  transform: translateY(-100px);
  border: 1px solid var(--divider-border-color);
  opacity: 0;
  transition: 0.3s;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &__media {
    //border-radius: 10px;
    //background-color: var(--body-background);
    min-height: 200px;
    max-height: 500px;
    overflow: hidden;

    &-preview {
      width: 100%;
      border-radius: 10px;
    }
  }

  &__form {
    margin-top: 30px;
    display: flex;

    &-submit {
      background: var(--submit-background-color);
      border: none;
      margin-left: 10px;
      border-radius: 50%;
      color: var(--main-text-color);
      padding: 0 10px;
    }
  }

  &__label {
    color: var(--main-text-color);
    padding-top: 20px;
    padding-bottom: 15px;
    display: block;
  }

  &.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  form input,
  form textarea {
    width: 100%;
    padding: 12px 15px;
    border: none;
    border-radius: 4px;
    background-color: var(--body-background);
    font-size: 14px;
  }

  textarea {
    height: 100px;
    resize: none;
  }

  &__heading {
    display: flex;
    justify-content: left;
    padding-bottom: 20px;
    color: var(--main-text-color);

    h3 {
      margin: auto;
      font-weight: 500;
    }

  }

  &-input {
    background: none;
    border: none;
    width: 100%;
    padding: 10px;
    outline: none;

    &::placeholder {
      color: var(--secondary-text-color);
    }
  }

}

</style>