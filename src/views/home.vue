<script setup>
import sideMenu from "@/components/sideMenu.vue"
import Chats from "@/components/chats.vue"
import conversation from "@/components/conversation.vue"
import accountSettings from "@/components/accountSettings.vue"
import UserSearch from "@/components/userSearch.vue"
import mobileHeader from "@/components/mobileHeader.vue"

import { ref } from "vue";
import DropMenu from "@/components/dropMenu.vue";


const isSettingsOpen = ref(false);
const isSearchOpen = ref(false);
const activePage = ref("chats");
const isBurgerOpen = ref(false);
const activeChat = ref(null);
const isChatOpen = ref(false);

const dropMenuBtns = [
  {title: "Clear messages", onClickFn: () => {
      console.log("clear messages")
  }},
  {title: "Block user", onClickFn: () => {
      console.log("block user");
    }},
  {title: "Report", onClickFn: () => {
    console.log("report user");
    }},
]

function handleUpdateSettings(payload) {
  isSettingsOpen.value = payload;
}

function handleUpdateSearch(payload) {
  isSearchOpen.value = payload;
}

function handleUpdatePage(payload) {
  activePage.value = payload;
}

function handleUpdateDropMenu(payload) {
  isBurgerOpen.value = !isBurgerOpen.value;
}

function handleUpdateChat(payload) {
  activeChat.value = payload;
  isChatOpen.value = true;
}

function handleUpdateCloseBtn(payload) {
  isChatOpen.value = false;
}


</script>

<template>

  <user-search
      :class="{'active': isSearchOpen}"
      v-model:is-popup-visible="isSearchOpen"
  />

  <account-settings
      :class="{'active': isSettingsOpen}"
      v-model:is-popup-visible="isSettingsOpen"
  />

  <drop-menu :buttons=dropMenuBtns v-if="isBurgerOpen"></drop-menu>

  <mobileHeader
      :search=true
      :close-btn="isChatOpen"
      :title="isChatOpen ? 'Iskanderious' : ''"
      :burger-menu="isChatOpen"
      :call="isChatOpen"
      @search-clicked="handleUpdateSearch"
      @burger-clicked="handleUpdateDropMenu"
      @close-clicked="handleUpdateCloseBtn"
  />

  <main>
    <side-menu
        @settings-clicked="handleUpdateSettings"
        @search-clicked="handleUpdateSearch"
        @page-clicked="handleUpdatePage"/>

    <chats :active-page="activePage" @click-chat="handleUpdateChat"/>
    <conversation @burger-clicked="handleUpdateDropMenu" :active-chat=activeChat :is-chat-open="isChatOpen" />
  </main>
</template>