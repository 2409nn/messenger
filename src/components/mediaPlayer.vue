<script setup>

const props = defineProps({
  media: {
    required: true
  },
  mediaText: {
    required: true
  },
  isVideo: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:isPopupVisible']);

// console.log(props.mediaMessage);

const closeButton = () => {
  emit("update:isPopupVisible", false);
}

</script>

<template>
  <div class="mediaPlayer popup">
    <div class="mediaPlayer__heading">
      <button class="mediaSender__heading-closeBtn closeBtn" @click="closeButton">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.75 20.75H13.75C18.75 20.75 20.75 18.75 20.75 13.75V7.75C20.75 2.75 18.75 0.75 13.75 0.75H7.75C2.75 0.75 0.75 2.75 0.75 7.75V13.75C0.75 18.75 2.75 20.75 7.75 20.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.01 14.28L8.48999 10.75L12.01 7.21997" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h3 class="mediaSender__heading-title">{{ mediaText }}</h3>
    </div>

    <div class="mediaPlayer__media">
      <img v-if="!isVideo" :src="props.media" alt="media" class="mediaPlayer__media-preview">
      <video v-if="isVideo" :src="props.media" alt="media" class="mediaPlayer__media-preview" controls></video>
    </div>
  </div>
</template>

<style scoped lang="scss">

.mediaPlayer {
  visibility: hidden;
  width: 80vw !important;
  height: fit-content !important;
  max-height: 80vh !important;
  overflow-y: scroll;
  transform: translateY(-100px);
  border: 1px solid var(--divider-border-color);
  opacity: 0;
  transition: 0.3s;
  left: 10vw !important;
  padding: 5px !important;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &__heading {
    padding: 0 !important;
  }

  &__media {
    //border-radius: 10px;
    //background-color: var(--body-background);
    min-height: 200px;
    overflow: hidden;
    text-align: center;
    width: 100%;

    &-preview {
      border-radius: 10px;
      width: 100%;
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