<script setup>

  import { ref } from "vue"

  const props = defineProps({
    isPopupVisible: {
      type: Boolean,
      default: true
    }
  })

  const emit = defineEmits(['onGifClick', 'update:isPopupVisible'])

  // Настройки API
  const API_KEY = 'XLxdFo0WWcWG0NyAPTF2fDkOhIWNApjy';
  const SEARCH_QUERY = ref('');
  const LIMIT = 25; // Сколько гифок загрузить
  const gifs = ref([]);

  const closeButton = () => {
    emit('update:isPopupVisible', false);
  }

  async function getGifs() {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${SEARCH_QUERY.value}&limit=${LIMIT}&rating=g&lang=en-US`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.status}`);
      }

      const { data } = await response.json();
      gifs.value = data;
    } catch (error) {
      console.error("Не удалось загрузить GIF:", error);
    }
  }

  function onGifClick(event) {
    let gifSrc = event.target.src
    emit("onGifClick", gifSrc);
  }

  // function renderGifs(gifs) {
  //   const container = document.querySelector('.gifSender__gifs');
  //   container.innerHTML = ''; // Очищаем контейнер перед загрузкой
  //
  //   gifs.forEach(gif => {
  //     const img = document.createElement('img');
  //
  //     // Используем fixed_height_small для максимально быстрой загрузки превью
  //     img.src = gif.images.fixed_height_small.url;
  //     img.alt = gif.title;
  //     img.style.margin = '5px';
  //
  //     container.appendChild(img);
  //   });
  // }

</script>

<template>
  <div class="gifSender popup" :class="{'active' : props.isPopupVisible}">
    <div class="gifSender__heading">

      <button class="gifSender__heading-closeBtn closeBtn" @click="closeButton">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.75 20.75H13.75C18.75 20.75 20.75 18.75 20.75 13.75V7.75C20.75 2.75 18.75 0.75 13.75 0.75H7.75C2.75 0.75 0.75 2.75 0.75 7.75V13.75C0.75 18.75 2.75 20.75 7.75 20.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.01 14.28L8.48999 10.75L12.01 7.21997" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <h3 class="gifSender__title">GIF</h3>
    </div>
    <div class="gifSender__search">
      <input type="text" v-model="SEARCH_QUERY" class="gifSender__search-input" placeholder="Type search query...">
      <button class="gifSender__search-find" @click="getGifs">
        <svg width="20" height="20" viewBox="0 0 171 171" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40.8065" y="17.0292" width="83.8308" height="83.8308" rx="41.9154" transform="rotate(11.5448 40.8065 17.0292)" stroke="currentColor" stroke-width="17"/>
          <path d="M132.414 155.005C135.179 158.799 140.495 159.634 144.29 156.87C148.084 154.106 148.919 148.789 146.155 144.995L139.284 150L132.414 155.005ZM104.147 101.77L97.2769 106.775L132.414 155.005L139.284 150L146.155 144.995L111.017 96.7649L104.147 101.77Z" fill="currentColor"/>
        </svg>
      </button>
    </div>

    <div class="gifSender__gifs">
      <button class="gifSender__gif" @click="onGifClick" v-for="gif in gifs" style="margin: 5px">
        <img :src="gif.images.fixed_height_small.url" :alt="gif.title">
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gifSender {
  height: fit-content;
  max-height: 660px;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  transform: translateX(-100px);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;

  &__gif {
    background: none;
    border: none;

    &:hover {
      filter: brightness(90%);
    }

    img {
      width: 100px;
      height: 100px;
    }
  }


  &.active {
    transform: translateX(0px);
    opacity: 1;
    visibility: visible;
  }

  &::-webkit-scrollbar {
    display: none;
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

  &__search {
    display: flex;
    justify-content: center;

    &-input {
      width: 80%;
      background-color: var(--body-background);
      border: none;
      border-radius: 5px;
      padding: 0px 20px;
    }

    &-find {
      background-color: var(--submit-background-color);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      margin-left: 10px;

      svg {
        color: var(--main-text-color);
      }

    }
  }

  &__gifs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    margin-top: 30px;
    gap: 2px;
  }
}
</style>