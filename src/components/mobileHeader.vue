<script setup>

  import { defineEmits } from "vue";

  const props = defineProps({
    title: {
      type: String,
      required: false,
      default: '',
    },
    search: {
      type: Boolean,
      default: false,
    },
    closeBtn: {
      type: Boolean,
      default: false
    },
    call: {
      type: Boolean,
      default: false
    },
    burgerMenu: {
      type: Boolean,
      default: false
    },
    createBtn: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(["searchClicked", "burgerClicked", "closeClicked", "callClicked", "createClicked"]);

  const onSearchUser = () => {
    emit('searchClicked', true);
  }

  const onBurgerClicked = (event) => {
    emit('burgerClicked', event);
  }

  const onCloseClicked = (payload) => {
    emit('closeClicked', true);
  }

  const onCallClicked = (payload) => {
    emit('callClicked', true);
  }

  const onCreateClicked = (payload) => {
    emit('createClicked', true);
  }

</script>

<template>
  <header class="header">
    <nav class="header__nav">
      <ul class="header__groups">

        <li class="header__group">
          <button class="header__item-closeBtn closeBtn" v-if="props.closeBtn" @click="onCloseClicked">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.75 20.75H13.75C18.75 20.75 20.75 18.75 20.75 13.75V7.75C20.75 2.75 18.75 0.75 13.75 0.75H7.75C2.75 0.75 0.75 2.75 0.75 7.75V13.75C0.75 18.75 2.75 20.75 7.75 20.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.01 14.28L8.48999 10.75L12.01 7.21997" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </li>
        <li class="header__group">
          <h4 class="header__group-title" v-if="props.title">{{ props.title }}</h4>
        </li>
        <li class="header__group">

          <ul class="header__group-items">
            <li class="header__group-item" id="header__call">

              <button class="header__group-button" v-if="props.call" @click="onCallClicked">
                <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_302_158)">
                    <path d="M19 15.697C19 16.021 18.9279 16.354 18.7747 16.678C18.6214 17.002 18.4231 17.308 18.1617 17.596C17.7201 18.082 17.2334 18.433 16.6835 18.658C16.1427 18.883 15.5568 19 14.9259 19C14.0065 19 13.024 18.784 11.9875 18.343C10.9509 17.902 9.91437 17.308 8.88683 16.561C7.83956 15.7961 6.8513 14.9537 5.9304 14.041C5.01892 13.1248 4.17826 12.141 3.41562 11.098C2.67651 10.072 2.08162 9.046 1.64897 8.029C1.21632 7.003 1 6.022 1 5.086C1 4.474 1.10816 3.889 1.32449 3.349C1.54081 2.8 1.88333 2.296 2.36104 1.846C2.93791 1.279 3.56885 1 4.23585 1C4.48823 1 4.74061 1.054 4.96595 1.162C5.2003 1.27 5.40761 1.432 5.56986 1.666L7.66099 4.609C7.82324 4.834 7.94041 5.041 8.02153 5.239C8.10265 5.428 8.14772 5.617 8.14772 5.788C8.14772 6.004 8.08463 6.22 7.95844 6.427C7.84126 6.634 7.67001 6.85 7.45368 7.066L6.76865 7.777C6.6695 7.876 6.62444 7.993 6.62444 8.137C6.62444 8.209 6.63345 8.272 6.65148 8.344C6.67852 8.416 6.70556 8.47 6.72359 8.524C6.88583 8.821 7.16525 9.208 7.56184 9.676C7.96745 10.144 8.4001 10.621 8.8688 11.098C9.35553 11.575 9.82424 12.016 10.302 12.421C10.7707 12.817 11.1582 13.087 11.4647 13.249C11.5098 13.267 11.5638 13.294 11.6269 13.321C11.699 13.348 11.7712 13.357 11.8523 13.357C12.0055 13.357 12.1227 13.303 12.2218 13.204L12.9069 12.529C13.1322 12.304 13.3485 12.133 13.5558 12.025C13.7631 11.899 13.9705 11.836 14.1958 11.836C14.3671 11.836 14.5473 11.872 14.7456 11.953C14.9439 12.034 15.1512 12.151 15.3766 12.304L18.36 14.419C18.5944 14.581 18.7566 14.77 18.8558 14.995C18.9459 15.22 19 15.445 19 15.697Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/>
                    <path d="M13.1682 4.60001H17.675M15.4216 6.85001V2.35001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_302_158">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>

            </li>
            <li class="header__group-item" id="header__search">
              <button class="header__group-button" v-if="props.search" @click="onSearchUser">
                <svg width="30" height="30" viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="40.8065" y="17.0292" width="83.8308" height="83.8308" rx="41.9154" transform="rotate(11.5448 40.8065 17.0292)" stroke="currentColor" stroke-width="17"/>
                  <path d="M132.414 155.005C135.179 158.799 140.495 159.634 144.29 156.87C148.084 154.106 148.919 148.789 146.155 144.995L139.284 150L132.414 155.005ZM104.147 101.77L97.2769 106.775L132.414 155.005L139.284 150L146.155 144.995L111.017 96.7649L104.147 101.77Z" fill="currentColor"/>
                </svg>
              </button>
            </li>
            <li class="header__group-item" id="header__create">
              <button class="header__group-button" v-if="props.createBtn" @click="onCreateClicked">
                <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="8" width="83" height="83" rx="41.5" stroke="currentColor" stroke-width="4" stroke-dasharray="12 12"/>
                  <rect x="48" y="29" width="5" height="42" rx="1" fill="currentColor"/>
                  <rect x="71" y="48" width="5" height="42" rx="1" transform="rotate(90 71 48)" fill="currentColor"/>
                </svg>
              </button>
            </li>
            <li class="header__group-item" id="header__burger">
              <button class="header__group-button" v-if="props.burgerMenu" @click="onBurgerClicked">
                <svg width="30" height="30" viewBox="0 0 28 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 6.1C10.5 5.21634 11.3954 4.5 12.5 4.5C13.6046 4.5 14.5 5.21634 14.5 6.1C14.5 6.98366 13.6046 7.7 12.5 7.7C11.3954 7.7 10.5 6.98366 10.5 6.1ZM10.5 12.5C10.5 11.6163 11.3954 10.9 12.5 10.9C13.6046 10.9 14.5 11.6163 14.5 12.5C14.5 13.3837 13.6046 14.1 12.5 14.1C11.3954 14.1 10.5 13.3837 10.5 12.5ZM10.5 18.9C10.5 18.0163 11.3954 17.3 12.5 17.3C13.6046 17.3 14.5 18.0163 14.5 18.9C14.5 19.7837 13.6046 20.5 12.5 20.5C11.3954 20.5 10.5 19.7837 10.5 18.9Z" fill="currentColor"/>
                </svg>
              </button>

            </li>
          </ul>

        </li>

      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">

  .header {
    display: none;
    background-color: var(--sidebar__item_svg-background);

    @media (max-width: 740px) {
      display: block;
    }

    svg {
      color: var(--main-text-color);
    }

    button {
      background: none;
      border: none;
    }

    &__nav {
      padding: 10px 20px;
    }

    &__groups {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }

    &__group {
      align-content: center;

      &-items {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      &-item button {
        padding-left: 15px;
      }

      &-title {
        text-align: center;
        color: var(--main-text-color);
        overflow: hidden;
        text-wrap: nowrap;
        max-width: 30vw;
        text-overflow: ellipsis;
      }
    }
  }


</style>