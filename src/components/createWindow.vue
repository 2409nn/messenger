<script setup>
  import switcher from "@/components/switcher.vue"
  import toggleList from "@/components/toggleList.vue"
  import toggleButton from "@/components/toggleButton.vue"
  import { ref } from "vue"
  import user_1 from "@/assets/imgs/avatars/user_1.jpg"
  import user_2 from "@/assets/imgs/avatars/user_2.jpg"
  import user_3 from "@/assets/imgs/avatars/user_3.jpg"
  import user_4 from "@/assets/imgs/avatars/user_4.jpg"

  const activeTab = ref('Group');
  const contactsOpen = ref(false);
  const formDOM = ref(null);
  const emit = defineEmits(['update:isPopupVisible', 'callAlert', 'createdData']);

  const spaceName = ref('');
  const spaceDescription = ref('');
  const selectedMembers = ref([]);
  const togglesActive = ref(false);

  const handleSwitch = (payload) => {
    activeTab.value = payload
  }

  const closeButton = () => {
    emit("update:isPopupVisible", false);
  }
  const onCreateClick = () => {
    if (formDOM.value) {
      // небольшая валидация на пустые поля
      let isEmpty = spaceName.value.length === 0 && spaceDescription.value.length === 0;

      if (isEmpty) {
        emit("callAlert", "Fields cannot be empty, please fill the fields");
      }

      else {
        const data = {
          title: formDOM.value.querySelector("#createWindow__space-name").value,
          description: formDOM.value.querySelector("#createWindow__space-description").value,
          members: selectedMembers.value,
        }

        emit('createdData', data);
        // очистка полей
        spaceName.value = "";
        spaceDescription.value = "";

        emit("update:isPopupVisible", false);
      }
    }
  }

  const contacts = [
    {"firstname": "Ope", avatar: user_1},
    {"firstname": "Bambam", avatar: user_2},
    {"firstname": "Lucia", avatar: user_3},
    {"firstname": "Mijan", avatar: user_4},
  ]

</script>

<template>
  <div class="createWindow popup">
    <div class="createWindow__heading">
      <button class="createWindow__heading-closeBtn closeBtn" @click="closeButton">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.75 20.75H13.75C18.75 20.75 20.75 18.75 20.75 13.75V7.75C20.75 2.75 18.75 0.75 13.75 0.75H7.75C2.75 0.75 0.75 2.75 0.75 7.75V13.75C0.75 18.75 2.75 20.75 7.75 20.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.01 14.28L8.48999 10.75L12.01 7.21997" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h3 class="createWindow__heading-title">Create space</h3>
    </div>
    <switcher @switch="handleSwitch" class="createWindow__switcher" first-name="Group" second-name="Channel" third-name="Stream" />

    <form class="createWindow__form" ref="formDOM" @submit.prevent="">

      <label class="createWindow__label" for="createWindow__space-name">Name</label>
      <input maxlength="100" placeholder="Type name here..." type="text" id="createWindow__space-name" v-model="spaceName">

      <label class="createWindow__label" for="createWindow__space-description">Description</label>
      <textarea maxlength="1000" id="createWindow__space-description" placeholder="Type description here..." v-model="spaceDescription"></textarea>

      <toggleList title="Members" @click="contactsOpen = !contactsOpen">
      </toggleList>

      <ul class="createWindow__contacts" v-if="contactsOpen">
        <li class="createWindow__contact" v-for="contact in contacts">
          <img :src="contact.avatar" alt="avatar" class="createWindow__contact-avatar">
          <toggle-button :label="contact.firstname" :model-value="togglesActive" @update:modelValue="selectedMembers.push(contact)" class="createWindow__contact-button"/>
        </li>
      </ul>

      <button type="button" class="createWindow__create-button" @click="onCreateClick">Create</button>
    </form>
  </div>
</template>

<style scoped lang="scss">

.createWindow {
  visibility: hidden;
  width: var(--modal-width);
  height: fit-content !important;
  max-height: 620px;
  overflow-y: scroll;
  transform: translateX(-100px);
  border: 1px solid var(--divider-border-color);
  opacity: 0;
  transition: 0.3s;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &__label {
    color: var(--main-text-color);
    padding-top: 20px;
    padding-bottom: 15px;
    display: block;
  }

  &.active {
    transform: translateX(0px);
    opacity: 1;
    visibility: visible;
  }

  &__create-button {
    background-color: var(--online-sign-background);
    width: 100%;
    border: none;
    padding: 18px 7px;
    margin-top: 80px;
    color: white;
    border-radius: 10px;
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

  &__contacts {
    width: 100%;
    margin-top: 10px;
    max-height: 400px;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__contact {
    display: grid;
    grid-template-columns: auto 1fr;
    padding: 5px;

    &-avatar {
      //display: inline;
      width: 40px;
      border-radius: 50%;
    }

    &-button {
      //display: inline;
    }
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
  }

</style>