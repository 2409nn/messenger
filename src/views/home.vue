<script setup>
import sideMenu from "@/components/sideMenu.vue"
import Chats from "@/components/chats.vue"
import conversation from "@/components/conversation.vue"
import accountSettings from "@/components/accountSettings.vue"
import UserSearch from "@/components/userSearch.vue"
import mobileHeader from "@/components/mobileHeader.vue"
import contextMenu from "@/components/contextMenu.vue"
import callWindow from "@/components/callWindow.vue"

import { ref } from "vue"
import DropMenu from "@/components/dropMenu.vue"
import { onClickOutside } from "@vueuse/core"

const isSettingsOpen = ref(false);
const isSearchOpen = ref(false);
const activePage = ref("chats");
const isBurgerOpen = ref(false);
const burgerDOM = ref(null);
const contextDOM = ref(null);
const activeChat = ref(null);
const isChatOpen = ref(false);
const isCallActive = ref(false);

const dropMenuBtns = [
  {title: "Clear messages", danger: true, onClickFn: () => {
      console.log("clear messages")
  }},
  {title: "Block user", danger: true, onClickFn: () => {
      console.log("block user");
    }},
  {title: "Report", danger: true, onClickFn: () => {
    console.log("report user");
    }},
]

const contextMessageBtns = [
  {title: "Reply", onClickFn: () => {
      console.log("replied message");
    }},
  {title: "Edit", onClickFn: () => {
      console.log("replied message");
    }},
  {title: "Copy", onClickFn: () => {
      console.log("Copied message");
    }},
  {title: "Forward", onClickFn: () => {
      console.log("Forwarded message");
    }},
  {title: "Select", onClickFn: () => {
      console.log("Selected");
    }},
  {title: "Report", onClickFn: () => {
      console.log("reported");
    }},
  {title: "Delete", danger:true, onClickFn: () => {
      console.log("Deleted message");
    }},
]

onClickOutside(burgerDOM, () => {
  isBurgerOpen.value = false;
})

onClickOutside(contextDOM, () => {
  contextElement.value = '';
})

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

function handleCallClick(payload) {
  isCallActive.value = true;
}

function handleCallEnded(payload) {
  isCallActive.value = false;
}

const pos = ref({x: 0, y: 0});
const contextElement = ref('');

function handleContextMenu(event) {
  event.preventDefault();
  pos.value.x = event.clientX;
  pos.value.y = event.clientY;
  let elementClass = event.target.className;

  // если клик по сообщению:
  if (elementClass.startsWith("conv__message")) {
    contextElement.value = 'message';
  }
  else {
    contextElement.value = '';
  }
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

  <contextMenu :buttons=contextMessageBtns :position=pos v-if="contextElement" :element=contextElement ref="contextDOM" />
  <drop-menu :buttons=dropMenuBtns v-if="isBurgerOpen" ref="burgerDOM" />

  <mobileHeader
      :search=true
      :close-btn="isChatOpen"
      :title="isChatOpen ? activeChat.firstname : ''"
      :burger-menu="isChatOpen"
      :call="isChatOpen"
      @search-clicked="handleUpdateSearch"
      @burger-clicked="handleUpdateDropMenu"
      @close-clicked="handleUpdateCloseBtn"
  />

  <callWindow :active="isCallActive" @call-ended="handleCallEnded" />

  <main @contextmenu="handleContextMenu" >
    <side-menu
        @settings-clicked="handleUpdateSettings"
        @search-clicked="handleUpdateSearch"
        @page-clicked="handleUpdatePage"/>

    <chats :active-page="activePage" @click-chat="handleUpdateChat"/>
    <conversation
        @audio-call-clicked="handleCallClick"
        @burger-clicked="handleUpdateDropMenu" :active-chat=activeChat :is-chat-open="isChatOpen" />
  </main>
</template>