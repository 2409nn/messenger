<script setup>

  import { ref, watch, computed } from 'vue'

  import user1 from '@/assets/imgs/avatars/user_1.jpg'
  import user2 from '@/assets/imgs/avatars/user_2.jpg'
  import user3 from '@/assets/imgs/avatars/user_3.jpg'
  import user4 from '@/assets/imgs/avatars/user_4.jpg'
  import EmptyState from "@/components/emptyState.vue";

  const props = defineProps({
    activePage: {
      type: String,
      default: 'chats'
    }
  })

  const activeIndex = ref(null);

  const usersData = {
    personalChats: {
      user_1: {
        firstname: "Ope",
        time: "16:47",
        message: "Gee, its been good news all day. i met someone special today. she's really pretty.",
        avatar: user1
      },
      user_2: {
        firstname: "Bambam",
        time: "16:12",
        message: "Are you coming to class tomorrow? we have test.",
        avatar: user2
      },
      user_3: {
        firstname: "Lucia",
        time: "15:27",
        message: "I miss you dear, when are you coming to see me.",
        avatar: user3
      },
      user_4: {
        firstname: "Mijan",
        time: "16:00",
        message: "Baba what sup na, you still de Lagos?",
        avatar: user4
      }
    },
    channels: {},
    live: {

    },
  }

  const showData = computed(() => {
    if (props.activePage === 'stream') return usersData.live;
    if (props.activePage === 'channels') return usersData.channels;
    if (props.activePage === 'chats') return usersData.personalChats;
    // return {}
  });

  // Длина объекта с данными которые нужно отобразить
  const showDataLength = computed(() => Object.keys(showData.value).length);

  // Слежка за изменением props.activePage
  watch(() => props.activePage, (newActivePage) => {

  });

  const emit = defineEmits(["clickChat"])

  const onClickChat = (index, avatar, firstname, lastname) => {
    activeIndex.value = index;
    emit("clickChat", {'index': index, 'avatar': avatar, 'firstname': firstname, 'lastname': lastname});
  }

</script>

<template>
  <div class="recent">
    <ul class="recent__chats">
      <li class="recent__chat" v-for="(user, index) in showData" @click="onClickChat(index, user.avatar, user.firstname, user.lastname)"
          :class="{ active: activeIndex === index }">
        <div class="recent__avatar">
          <img class="recent__avatar-img" :src="user.avatar" alt="avatar">
          <div class="recent__avatar-online online"></div>
        </div>
        <div class="recent__info">
          <div class="recent__info-top">
            <p class="recent__info-firstname">{{ user.firstname }}</p>
            <p class="recent__info-time">{{ user.time }}</p>
          </div>
          <p class="recent__info-message">{{ user.message }}</p>
        </div>
      </li>
    </ul>
    <empty-state v-if="showDataLength === 0"></empty-state>
  </div>
</template>

<style scoped lang="scss">
  .recent {
    margin-top: 10px;

    &__chats {
      width: 95%;
      margin: auto;
    }

    &__chat {
      display: flex;
      gap: 20px;
      padding: 20px 10px 5px;
      border-radius: 14px;
      margin-top: 5px;
      background-color: var(--body-background);

      &:hover {
        cursor: pointer;
      }

      &.active {
        background-color: var(--focus-background-color)
      }
    }

    &__avatar {

      &-img {
        width: 60px;
        border-radius: 16px;
      }

      &-online {
        background-color: var(--online-sign-background);
        border-radius: 10px;
        border: 3px solid var(--body-background);
        height: 20px;
        width: 20px;

        position: relative;
        bottom: 17px;
        left: 45px;
      }
    }

    &__info {

      &-top {
        display: flex;
        gap: 20px;
        align-items: center;
      }

      &-firstname {
        font-weight: 500;
      }

      &-time {
        color: var(--secondary-text-color);
        font-weight: 200;
      }

      &-message {
        color: var(--secondary-text-color);
        font-weight: 300;
      }
    }

  }
</style>