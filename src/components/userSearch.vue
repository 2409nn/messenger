<script setup>
  import userCard from "./userCard.vue"
  import { ref, computed } from "vue"
  import EmptyState from "@/components/emptyState.vue";
  import Arlan from "@/assets/imgs/avatars/Arlan.jpg"
  import Juliana from "@/assets/imgs/avatars/Juliana.jpg"
  import Iskanderious from "@/assets/imgs/avatars/iskanderious.jpg"
  import { getUserProfile } from "@/db/pouchDB.js";

  const isEmpty = ref(true)
  const emit = defineEmits(['update:isPopupVisible', 'userSelected']);
  const searchText = ref("");

  const closeButton = () => {
    emit("update:isPopupVisible", false);
  }
  const foundUsers = ref([]);

  function handleCardClicked (payload) {
    emit("update:isPopupVisible", false);
    emit("userSelected", payload);
  }

  // функция напрямую делает запрос на базу данных
  async function makeSearchRequest () {

    if (searchText.value.length > 0) {
      // получили профили из базы по поиску через query
      const db = await getUserProfile();
      let searchResults = await db.query('users/by_username', {startkey: searchText.value.toLowerCase(), endkey: searchText.value.toLowerCase() + '\ufff0', include_docs: true});
      searchResults = searchResults.rows;

      foundUsers.value = searchResults.map(row => row.doc);

      if (foundUsers.value.length > 0) {
        isEmpty.value = false;
      } else {
        isEmpty.value = true;
      }
    }
    else {
      isEmpty.value = true;
      foundUsers.value = [];
    }
  }


</script>

<template>
  <div class="userSearch popup">
    <div class="userSearch__heading">
      <button class="userSearch__heading-closeBtn closeBtn" @click="closeButton">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.75 20.75H13.75C18.75 20.75 20.75 18.75 20.75 13.75V7.75C20.75 2.75 18.75 0.75 13.75 0.75H7.75C2.75 0.75 0.75 2.75 0.75 7.75V13.75C0.75 18.75 2.75 20.75 7.75 20.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.01 14.28L8.48999 10.75L12.01 7.21997" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h3 class="userSearch__heading-title">Users search</h3>
    </div>
    <div class="userSearch__find">
      <input @input="makeSearchRequest" v-model="searchText" placeholder="Type username..." class="userSearch__find-input" type="text">
      <button class="userSearch__find-btn">
        <svg width="171" height="171" viewBox="0 0 171 171" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40.8065" y="17.0292" width="83.8308" height="83.8308" rx="41.9154" transform="rotate(11.5448 40.8065 17.0292)" stroke="currentColor" stroke-width="17"/>
          <path d="M132.414 155.005C135.179 158.799 140.495 159.634 144.29 156.87C148.084 154.106 148.919 148.789 146.155 144.995L139.284 150L132.414 155.005ZM104.147 101.77L97.2769 106.775L132.414 155.005L139.284 150L146.155 144.995L111.017 96.7649L104.147 101.77Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
    <empty-state v-if="isEmpty"></empty-state>

    <div class="userSearch__found">
      <ul class="userSearch__found-users">

        <li class="userSearch__found-user" v-for="user in foundUsers">
          <userCard @card-clicked="handleCardClicked" :uid="user._id" :avatar="user.avatar" :first-name=user.firstname :username=user.username></userCard>
        </li>

      </ul>

    </div>
  </div>
</template>

<style scoped lang="scss">

.userSearch {
  visibility: hidden;
  width: var(--modal-width);
  height: 550px;
  max-height: 550px;


  overflow: hidden;
  transform: translateX(-100px);

  border: 1px solid var(--divider-border-color);
  opacity: 0;
  transition: 0.3s;

  &.active {
    transform: translateX(0px);
    opacity: 1;
    visibility: visible;
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

    //&-closeBtn {
    //  background: none;
    //  border: none;
    //  stroke: var(--main-text-color);
    //
    //  path {
    //    color: var(--main-text-color);
    //  }
    //
    //  svg:hover {
    //    cursor: pointer;
    //    fill: var(--main-text-color);
    //    stroke: var(--body-background);
    //  }
    //}
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
        color: var(--main-text-color);
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