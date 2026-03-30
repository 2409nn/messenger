<script setup>

  import profileDefault from "@/assets/imgs/avatars/profile_default.png"
  import { userDataStore } from "@/stores/userData.js";
  import { useRoamingData } from "@/stores/roaming.js";
  import { getAuth } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
  import { API_SERVER } from '@/db/config.js'
  import { createChatDB } from '@/db/chat.service.js'
  import { fetchChatsProfile } from "@/db/sync.service.js";


  const props = defineProps({
    avatar: {
      type: String,
      default: profileDefault,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
      default: '',
    },
    username: {
      type: String,
      required: false,
      default: '',
    },
    uid: {
      type: String,
      required: true,
    }
  })

  const emit = defineEmits(['cardClicked'])
  const userData = userDataStore().userData;
  const chatsData = useRoamingData().roaming.chatsData;

  const onCardClick = async () => {
    emit('cardClicked', {firstName: props.firstName, lastName: props.lastName, username: props.username});

    if (userData.uid === props.uid) { console.error('нельзя писать самому себе'); return }

    // await fetchChatsProfile(userData.uid).then((res) => {
    //   console.log(res);
    //   chatsData.value = res.chatsData;
    // });


    try {
      // проверка на то, авторизован ли пользователь, перед тем как писать кому-то
      const auth = await getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("Пользователь не авторизован в Firebase!");
        return;
      }

      const token = await user.getIdToken();
      await createChatDB([userData.uid, props.uid], token) // создаем чат
      await fetchChatsProfile();

    }

    catch (error) {
      console.error(error);
    }
  }

</script>

<template>
  <div class="userCard" @click="onCardClick">
    <img :src=avatar alt="avatar" class="userCard__avatar">
    <p class="userCard__firstname">{{ firstName }} {{ lastName }}</p>
    <p class="userCard__username">@{{ username }}</p>
  </div>
</template>

<style scoped lang="scss">
  .userCard {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 180px;
    height: 220px;
    background-color: var(--body-background);
    text-align: center;
    padding: 10px;
    border-radius: 10px;
    align-items: center;

    &__avatar {
      border-radius: 50%;
      width: 70px;
    }

    &__firstname {
      font-weight: 500;
      color: var(--main-text-color);
    }

    &__username {
      font-weight: 300;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--secondary-text-color);
    }

    &:hover {
      cursor: pointer;
    }
  }
</style>