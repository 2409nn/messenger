<script setup>
  import userCard from "./userCard.vue"
  import { ref } from "vue"
  import EmptyState from "@/components/emptyState.vue";

  const is_active = ref(false)
  const isEmpty = ref(true)
  is_active.value = true

</script>

<template>
  <div :class="{ 'is_active': is_active }" class="userSearch popup">
    <h3 class="userSearch__heading">Text user</h3>
    <div class="userSearch__find">
      <input placeholder="Type username..." class="userSearch__find-input" type="text">
      <button class="userSearch__find-btn">
        <svg width="171" height="171" viewBox="0 0 171 171" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40.8065" y="17.0292" width="83.8308" height="83.8308" rx="41.9154" transform="rotate(11.5448 40.8065 17.0292)" stroke="black" stroke-width="17"/>
          <path d="M132.414 155.005C135.179 158.799 140.495 159.634 144.29 156.87C148.084 154.106 148.919 148.789 146.155 144.995L139.284 150L132.414 155.005ZM104.147 101.77L97.2769 106.775L132.414 155.005L139.284 150L146.155 144.995L111.017 96.7649L104.147 101.77Z" fill="black"/>
        </svg>
      </button>
    </div>
    <empty-state v-if="isEmpty"></empty-state>

    <div class="userSearch__found">
      <ul class="userSearch__found-users">
        <li class="userSearch__found-user"><userCard first-name="Iskander" username="iskanderious"></userCard></li>
        <li class="userSearch__found-user"><userCard first-name="Iskander" username="iskanderious"></userCard></li>
      </ul>

    </div>
  </div>
</template>

<style scoped lang="scss">
.userSearch {
  width: 700px;
  height: 550px;
  max-height: 550px;

  position: absolute;
  left: calc(50% - 700px/2);
  top: calc(50% - 550px/2 - 100px);
  //overflow: hidden;

  border: 1px solid var(--divider-border-color);

  &__heading {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    padding-bottom: 25px;
  }

  &__find {
    display: flex;
    align-items: center;
    background-color: var(--body-background);
    padding: 5px 20px;
    border-radius: 10px;

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

    &-btn {
      background: none;
      border: none;

      svg {
        width: 25px;
        height: 25px;
      }
    }
  }

  &__found {
    margin-top: 30px;
    overflow: scroll;
    scrollbar-width: none;
    max-height: 80%;

    &-users {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;

      &::-webkit-scrollbar {
        display: none;
        -ms-overflow-style: none;
      }
    }
  }
}
</style>