<script setup>

  import { ref, watch, computed, reactive, onMounted } from 'vue'
  import { userDataStore } from "@/stores/userData.js";
  import {loadChats, getUserProfile} from "@/db/pouchDB.js";

  import user1 from '@/assets/imgs/avatars/user_1.jpg'
  import user2 from '@/assets/imgs/avatars/user_2.jpg'
  import user3 from '@/assets/imgs/avatars/user_3.jpg'
  import user4 from '@/assets/imgs/avatars/user_4.jpg'
  import EmptyState from "@/components/emptyState.vue";
  import profile_default from "@/assets/imgs/avatars/profile_default.png"
  import counter from "@/components/counter.vue";

  const props = defineProps({
    activePage: {
      type: String,
      default: 'chats'
    },
    isChatOpen: {
      type: Boolean,
      default: false
    }
  })

  const activeIndex = ref(null);

  const chats = reactive([]); // Реактивный объект для Vue
  const uid = userDataStore().userData.uid;
  const interlocatorsData = reactive({}); // хранит в себе профильные данные всех собеседников

  const fetchProfiles = async () => {
    // Ждем, пока загрузятся сами чаты (у тебя там await loadChats)
    // Предположим, chats — это массив после loadChats

    for (const chat of chats) {
      let interlocatorId = chat.members_id.filter(id => id !== uid)[0];

      try {
        const db = await getUserProfile();
        const result = await db.get(interlocatorId);

        // Записываем данные. Vue "увидит" добавление нового ключа в reactive объект
        interlocatorsData[interlocatorId] = {
          id: interlocatorId,
          firstname: result.firstname || 'Без имени',
          lastname: result.lastname || '',
          avatar: result.avatar || profile_default,
        };
      } catch (e) {
        console.error("Ошибка загрузки профиля:", interlocatorId, e);
      }
    }
  };

  onMounted(async () => {
    await loadChats(uid, chats);

    await fetchProfiles();
  });

  const usersData = {
    personalChats: interlocatorsData,
    channels: {},
    live: {},
  }

  const showData = computed(() => {
    if (props.activePage === 'stream') return usersData.live;
    if (props.activePage === 'channels') return usersData.channels;
    if (props.activePage === 'chats') return usersData.personalChats;
  });

  // Длина объекта с данными которые нужно отобразить
  const showDataLength = computed(() => Object.keys(showData.value).length);

  // Слежка за изменением props.activePage
  // watch(() => props.activePage, (newActivePage) => {
  //
  // });

  const emit = defineEmits(["clickChat"])

  const onClickChat = (index, avatar, firstname, lastname) => {
    let tempIndex = activeIndex.value
    activeIndex.value = index;
    if (tempIndex === index && props.isChatOpen) {
      activeIndex.value = null;
    }
    emit("clickChat", {'index': activeIndex.value, 'avatar': avatar, 'firstname': firstname, 'lastname': lastname});
  }

</script>

<template>
  <div class="recent">
    <ul class="recent__chats">
      <li class="recent__chat" v-for="(user, index) in showData" @click="onClickChat(index, user.avatar, user.firstname, user.lastname)"
          :class="{ active: activeIndex === index && props.isChatOpen }">
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
          <counter class="recent__info-newMessages" :count="1232213" />
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
      width: 100%;

      &-top {
        display: flex;
        gap: 20px;
        align-items: center;
      }

      &-firstname {
        font-weight: 500;
      }

      &-newMessages {
        float: right;
      }

      &-time {
        color: var(--secondary-text-color);
        font-weight: 200;
      }

      &-message {
        display: -webkit-box;
        color: var(--secondary-text-color);
        font-weight: 300;
        display: -webkit-box;
        -webkit-line-clamp: 4;    /* Показываем 4 строки */
        -webkit-box-orient: vertical;
        overflow: hidden;

        line-height: 1.5;         /* Высота одной строки */
        max-height: 6em;
      }
    }

  }
</style>