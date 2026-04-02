<script setup>

import {ref, computed, onMounted, onUnmounted} from 'vue'
  import { API_SERVER } from "@/db/config.js";
  import { userDataStore } from "@/stores/userData.js";
  import EmptyState from "@/components/emptyState.vue";
  import profile_default from "@/assets/imgs/avatars/profile_default.png"
  import counter from "@/components/counter.vue";
  import { getRemoteDB } from "@/db/auth.service.js"
  import { fetchChatsProfile } from "@/db/sync.service.js";
  import { useRoamingData } from "@/stores/roaming.js";

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

  const uid = userDataStore().userData.uid;
  const roamingData = useRoamingData().roaming;
  const chatsData = roamingData.chatsData;

  onMounted(async () => {
    await fetchChatsProfile(uid).then((res) => {
      chatsData.value = res.chatsData;
    });
  });

  const showData = computed(() => {
    if (props.activePage === 'stream') return {};
    if (props.activePage === 'channels') return {};
    if (props.activePage === 'chats') return chatsData.value;

    return {};
  });

  const showDataLength = computed(() => {
    return showData.value ? Object.keys(showData.value).length : 0;
      }
  )

  const emit = defineEmits(["clickChat"])

  const onClickChat = (index, avatar, firstname, lastname) => {
    // index – id чата
    let tempIndex = activeIndex.value
    activeIndex.value = index;
    if (tempIndex === index && props.isChatOpen) {
      activeIndex.value = null;
    }
    emit("clickChat", {'index': activeIndex.value, 'avatar': avatar, 'firstname': firstname, 'lastname': lastname});
  }

  const unreadCount = 0;

</script>

<template>
  <div class="recent">
    <ul class="recent__chats">
      <li
          class="recent__chat"
          v-for="(chat, id) in showData"
          :key="id"
          @click="onClickChat(id, chat.chatInfo.avatar, chat.chatInfo.firstname, chat.chatInfo.lastname)"
          :class="{ active: activeIndex === id && props.isChatOpen }"
      >
        <div class="recent__avatar">
          <img class="recent__avatar-img" :src="chat.chatInfo?.avatar || profile_default" alt="avatar">
          <div class="recent__avatar-online online"></div>
        </div>
        <div class="recent__info">
          <div class="recent__info-top">
            <p class="recent__info-firstname">{{ chat.chatInfo?.firstname }}</p>
            <p class="recent__info-time">{{ chat.lastMessage?.time }}</p>
          </div>
          <p class="recent__info-message">{{ chat.lastMessage?.text }}</p>
          <counter class="recent__info-newMessages" :count="unreadCount" />
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
        white-space: normal; /* Добавь это */
        word-break: break-word;

        line-height: 1.5;         /* Высота одной строки */
        max-height: 6em;
      }
    }

  }
</style>