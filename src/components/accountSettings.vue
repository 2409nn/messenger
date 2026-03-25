<script setup>
  import toggleList from "./toggleList.vue"
  import toggleButton from "./toggleButton.vue"
  import {ref, reactive, onMounted, onUnmounted, watch} from 'vue'
  import profile_default from '../assets/imgs/avatars/profile_default.png'
  import { getProfileById } from '@/db/pouchDB.js'

  // доступ к localStorage через Pinia
  import { useSettingsStore } from '@/stores/settings.js'
  const settings = useSettingsStore().settings;

  // доступ к пользовательским данным
  import { userDataStore } from '@/stores/userData.js'
  const userData = userDataStore().userData;

  const emit = defineEmits(['update:isPopupVisible', 'update:isDark']);


  const avatar = ref(userData.avatar); // только URL
  const userName = ref(userData.username);
  const firstName = ref(userData.firstname);
  const lastName = ref(userData.lastname);
  const bio = ref(userData.bio);
  const personalityForm = ref(null);

  const isDark = ref(settings.darkMode);

  const props = defineProps({
    isPopupVisible: {
      type: [Boolean, Object],
      required: true,
    }
  })

  const isOpen = ref({
    personality: false,
    privacy: false,
    notification: false,
    theme: false,
  });

  const supportContacts = {
    supportEmail: 'a.iskander07@gmail.com',
  }

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      alert('Email скопирован!');
    } catch (err) {
      console.error('Не удалось скопировать:', err);
    }
  };

  const autoSwitchTheme = () => {
    const now = new Date();
    if (now.getHours() >= 18 || now.getHours() <= 6) { settings.darkMode = true; }
    else { settings.darkMode = false; }
  }

  let interval

  const closeButton = () => {
    emit("update:isPopupVisible", false);
  }

  const toggleDark = (isActive) => {
    settings.darkMode = isActive;
    document.getElementById("app").setAttribute('data-theme', isActive ? 'dark' : 'light');
  }

  const onMediaLoad = (event) => {
    const file = event.target.files[0];
    if (file.type.startsWith('image/')) {
      userData.avatar = URL.createObjectURL(file);
    }
  }

  const onSaveChanges = () => {
    // Просто копируем значения из рефов в стор
    userData.firstname = firstName.value;
    userData.lastname = lastName.value;
    userData.username = userName.value;
    userData.bio = bio.value;

    console.log("Данные сохранены в Store:", userData);
  }

  // ежеминутная проверка времени для автоматической смены темы

  function startInterval() {
    if (settings.autoSwitchTheme) {
      interval = setInterval(autoSwitchTheme, 60000);
    }
    else {
      clearInterval(interval);
    }
  }

  watch(() => settings.autoSwitchTheme, () => {
    startInterval();
  })

  // onMounted(async () => {
  //   await getProfileById();
  // })

  onUnmounted(() => {
    clearInterval(interval);
  })

</script>

<template>
  <div class="accountSettings popup" :class="{'active' : props.isPopupVisible}">
    <div class="accountSettings__heading">

      <button class="accountSettings__heading-closeBtn closeBtn" @click="closeButton">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.75 20.75H13.75C18.75 20.75 20.75 18.75 20.75 13.75V7.75C20.75 2.75 18.75 0.75 13.75 0.75H7.75C2.75 0.75 0.75 2.75 0.75 7.75V13.75C0.75 18.75 2.75 20.75 7.75 20.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.01 14.28L8.48999 10.75L12.01 7.21997" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <h3>Account settings</h3>
    </div>
    <div class="accountSettings__preferences">
      <h4>Settings & preferences</h4>
      <div class="accountSettings__preferences-lists">

        <div class="accountSettings__preferences-personality">
          <toggle-list @click="isOpen.personality = !isOpen.personality" >

            <img :src="userData.avatar ? userData.avatar : profile_default" alt="profile" style="width: 40px; height: 40px; border-radius: 50%;">

            <div class="accountSettings__preferences-personality__name" style="display: grid; grid-template-rows: repeat(2, 1fr); grid-template-columns: 1fr">
              <p style="grid-row: 1; text-align: left; font-weight: 500; font-size: 16px" v-if="userData.firstname" class="accountSettings__preferences-personality__fullname">{{ userData.firstname }} {{userData.lastname }}</p>
              <p style="grid-row: 2; text-align: left; font-weight: 400;" v-if="userData.username" class="accountSettings__preferences-personality__username">@{{ userData.username }}</p>
            </div>

          </toggle-list>

          <form ref="personalityForm" @submit.prevent="" action="" class="accountSettings__preferences-personality__form" v-if="isOpen.personality">
            <div class="form-row-top">
              <div class="avatar-upload">
                <label for="accountSettings__input-avatar" style="height: 100%; width: 100%; padding: 10px; align-content: center">Click to Upload image</label>
                <input id="accountSettings__input-avatar" type="file" @change="onMediaLoad" hidden>
              </div>

              <div class="names-column">
                <div class="form-group">
                  <label for="first-name">First name:</label>
                  <input type="text" v-model="firstName" id="first-name" placeholder="Type your firstname...">
                </div>
                <div class="form-group">
                  <label for="last-name">Last name:</label>
                  <input type="text" v-model="lastName" id="last-name" placeholder="Type your lastname...">
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="username">Username:</label>
              <input class="accountSettings__input-username" v-model="userName" type="text" id="username" placeholder="Type username to find you...">
            </div>

            <div class="form-group">
              <label for="bio">Bio:</label>
              <textarea id="bio" v-model="bio" placeholder="Type something, for example: my name is Iskander, I’m from Almaty city..."></textarea>
            </div>

            <button type="submit" class="submit-btn" @click="onSaveChanges">Save changes</button>
          </form>
        </div>

        <div class="accountSettings__preferences-privacy">
          <toggle-list title="Privacy" @click="isOpen.privacy = !isOpen.privacy">
            <svg width="20" height="20" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.581 7.74396C14.581 11.5836 11.7936 15.1798 7.98539 16.2319C7.72628 16.3026 7.44361 16.3026 7.18449 16.2319C3.3763 15.1798 0.588867 11.5836 0.588867 7.74396V4.29695C0.588867 3.65309 1.07569 2.92286 1.68029 2.67945L6.05381 0.889204C7.03531 0.488755 8.14243 0.488755 9.12392 0.889204L13.4974 2.67945C14.0942 2.92286 14.5889 3.65309 14.5889 4.29695L14.581 7.74396Z" stroke="currentColor" stroke-width="1.17779" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.58497 8.82755C8.00147 8.82755 8.4009 8.6621 8.69541 8.36759C8.98991 8.07309 9.15536 7.67365 9.15536 7.25716C9.15536 6.84066 8.98991 6.44123 8.69541 6.14672C8.4009 5.85222 8.00147 5.68677 7.58497 5.68677C7.16848 5.68677 6.76905 5.85222 6.47454 6.14672C6.18004 6.44123 6.01459 6.84066 6.01459 7.25716C6.01459 7.67365 6.18004 8.07309 6.47454 8.36759C6.76905 8.6621 7.16848 8.82755 7.58497 8.82755ZM7.58497 8.82755V11.1831" stroke="currentColor" stroke-width="1.17779" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </toggle-list>
          <ul class="accountSettings__preferences__list" v-if="isOpen.privacy">

            <li class="accountSettings__preferences__list-item">
              <toggle-button class="accountSettings__preferences__list-btn"
                             @update:model-value="(isActive) => { settings.showLastOnline = isActive }"
                             :model-value='settings.showLastOnline' label="Show last seen & online"></toggle-button>
            </li>
            <li class="accountSettings__preferences__list-item">
              <toggle-button class="accountSettings__preferences__list-btn" label="Let other users see your profile photos"
                             @update:model-value="(isActive) => { settings.showProfilePhotos = isActive }"
                             :model-value='settings.showProfilePhotos'></toggle-button>
            </li>
            <li class="accountSettings__preferences__list-item">
              <toggle-button class="accountSettings__preferences__list-btn" label="Show bio other users"
                             @update:model-value="(isActive) => { settings.showBio = isActive }"
                             :model-value='settings.showBio'></toggle-button>
            </li>

          </ul>
        </div>

        <div class="account__settings__preferences-notification">

          <toggle-list title="Notification" @click="isOpen.notification = !isOpen.notification">
            <svg width="25" height="25" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5839 5.69272C11.1866 5.02795 11.1293 4.00671 10.4559 3.41172C9.78258 2.81673 8.74815 2.8733 8.14548 3.53808C5.5254 6.42813 3.70229 10.042 3.02281 14.0404C2.87329 14.9203 3.47456 15.7532 4.36578 15.9008C5.257 16.0484 6.10068 15.4548 6.2502 14.575C6.82422 11.1971 8.36442 8.14093 10.5839 5.69272Z" fill="currentColor"/>
              <path d="M39.8545 3.53808C39.2518 2.8733 38.2174 2.81673 37.5441 3.41172C36.8707 4.00671 36.8134 5.02795 37.4161 5.69272C39.6356 8.14093 41.1758 11.1971 41.7498 14.575C41.8993 15.4548 42.743 16.0484 43.6342 15.9008C44.5254 15.7532 45.1267 14.9203 44.9772 14.0404C44.2977 10.042 42.4746 6.42813 39.8545 3.53808Z" fill="currentColor"/>
              <path fill-rule="evenodd" stroke-width="3px" clip-rule="evenodd" d="M24.0004 3C15.8675 3 9.27441 9.50886 9.27417 17.538L9.27374 19.1538C9.27374 23.7267 7.52619 27.8929 4.65178 31.0428C4.28853 31.4409 4.14884 31.9909 4.27885 32.511C4.40887 33.0312 4.79167 33.4539 5.30079 33.6395C8.66955 34.8672 12.1961 35.7728 15.8418 36.3184C15.8268 36.5182 15.8192 36.7198 15.8192 36.9231C15.8192 41.3838 19.482 45 24.0004 45C28.5188 45 32.1816 41.3838 32.1816 36.9231C32.1816 36.7198 32.174 36.5181 32.159 36.3183C35.8044 35.7726 39.3307 34.8671 42.6992 33.6395C43.2083 33.4539 43.5911 33.0312 43.7211 32.511C43.8511 31.9909 43.7114 31.4409 43.3482 31.0428C40.4738 27.8929 38.7262 23.7267 38.7262 19.1538V17.6444L38.7266 17.5385C38.7266 9.50909 32.1335 3 24.0004 3ZM19.0917 36.9231C19.0917 36.8503 19.0933 36.778 19.0965 36.7061C20.7119 36.8497 22.3475 36.9231 24 36.9231C25.6528 36.9231 27.2886 36.8497 28.9043 36.706C28.9075 36.7779 28.9091 36.8503 28.9091 36.9231C28.9091 39.5995 26.7114 41.7692 24.0004 41.7692C21.2894 41.7692 19.0917 39.5995 19.0917 36.9231Z" stroke="currentColor"/>
            </svg>
          </toggle-list>

          <ul class="accountSettings__preferences__list" v-if="isOpen.notification">

            <li class="accountSettings__preferences__list-item">
              <toggle-button class="accountSettings__preferences__list-btn"
                             :model-value=settings.notifications
                             @update:model-value="(isActive) => {settings.notifications = isActive}"
                             label="Sound new messages"></toggle-button>
            </li>

          </ul>
        </div>

        <div class="account__settings__preferences-theme">
          <toggle-list title="Theme" @click="isOpen.theme = !isOpen.theme">
            <svg stroke="currentColor" color="currentColor" width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.561745 8.07704C0.821947 11.7994 3.98051 14.8279 7.76067 14.9941C10.4277 15.1097 12.8129 13.8666 14.244 11.9078C14.8367 11.1055 14.5187 10.5707 13.5285 10.7513C13.0442 10.8381 12.5455 10.8742 12.0251 10.8525C8.49068 10.708 5.59955 7.75179 5.58509 4.26073C5.57786 3.32111 5.77301 2.43209 6.12718 1.62257C6.51748 0.726312 6.04767 0.299868 5.14419 0.682945C2.28197 1.89 0.323227 4.77391 0.561745 8.07704Z" stroke="currentColor" stroke-width="1.08418" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </toggle-list>

          <ul class="accountSettings__preferences__list" v-if="isOpen.theme">

            <li class="accountSettings__preferences__list-item">
              <toggle-button class="accountSettings__preferences__list-btn" @update:model-value="toggleDark" label="Dark mode" :model-value="settings.darkMode"></toggle-button>
              <toggle-button class="accountSettings__preferences__list-btn" @update:model-value="(isActive) => {settings.autoSwitchTheme = isActive; startInterval()}" label="Automatically switch theme"></toggle-button>
            </li>

          </ul>
        </div>
      </div>

    </div>
    <div class="accountSettings__support">

      <h4>Support</h4>
      <p>If you have any questions, suggestions, or issues, please email the developer:
        <u
          style="font-weight: 500; cursor: pointer"
          @click="copyEmail(supportContacts.supportEmail);">
          {{ supportContacts.supportEmail }}
        </u></p>
    </div>
    <router-link to="/reg" class="accountSettings__logOut-btn logOut-btn">Log out</router-link>
  </div>
</template>

<style scoped lang="scss">
  .accountSettings {
    height: fit-content;
    max-height: 660px;
    overflow: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    transform: translateX(-100px);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;

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

    &__support {
      margin-top: 40px;
      color: var(--main-text-color);

      p {
        margin-top: 20px;
      }
    }

    &__preferences {
      color: var(--main-text-color);

      &__list {
        padding-bottom: 15px;
        display: block;
      }
    }

    &__logOut-btn {
      display: block;
      text-align: center;
      text-decoration: none;
      width: 100%;
      margin-top: 30px;
      padding: 15px 0;
      border-radius: 10px;

      &:hover {
        cursor: pointer;
        filter: brightness(1.1);
      }
    }
  }



  .accountSettings__preferences-personality__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 10px 0;
    background-color: var(--body-background);
    padding: 20px;
    border: 1px solid var(--divider-border-color);
    border-radius: 10px;
  }

  .form-row-top {
    display: flex;
    gap: 20px;
  }

  .avatar-upload {
    width: 150px;
    height: 150px;
    border: 1.5px solid var(--main-text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 14px;
    flex-shrink: 0;

    label {
      cursor: pointer;
    }
  }

  .names-column {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-size: 16px;
    font-weight: 500;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 12px 15px;
    border: none;
    border-radius: 4px;
    background-color: var(--main-background-color);
    font-size: 14px;
  }

  .form-group textarea {
    height: 100px;
    resize: none;
  }

  .submit-btn {
    background-color: var(--online-sign-background);
    color: white;
    border: none;
    border-radius: 7px;
    padding: 15px;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
      filter: brightness(1.05);
    }
  }
</style>