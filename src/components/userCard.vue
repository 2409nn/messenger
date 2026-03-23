<script setup>

  import profileDefault from "@/assets/imgs/avatars/profile_default.png"

  import { addUsersToChat, createChatDB } from "@/db/pouchDB.js"
  import { userDataStore } from "@/stores/userData.js";


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

  const onCardClick = async () => {
    emit('cardClicked', {firstName: props.firstName, lastName: props.lastName, username: props.username});
    const userData = userDataStore().userData;

    console.log(props.uid)

    if (userData.uid !== props.uid) {
      const chatDB = await createChatDB([userData.uid, props.uid]) // создаем чат
      await addUsersToChat(chatDB, [userData.uid, props.uid]);

    } else {
      console.log("Нельзя написать самому себе (одинаковые uid)")
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