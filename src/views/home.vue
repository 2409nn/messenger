<script setup>
import sideMenu from "@/components/sideMenu.vue"
import Chats from "@/components/chats.vue"
import conversation from "@/components/conversation.vue"
import accountSettings from "@/components/accountSettings.vue"
import UserSearch from "@/components/userSearch.vue"
import mobileHeader from "@/components/mobileHeader.vue"
import contextMenu from "@/components/contextMenu.vue"
import callWindow from "@/components/callWindow.vue"
import confirm from "@/components/confirm.vue"
import alert from "@/components/alert.vue"
import createWindow from "@/components/createWindow.vue"
import preloader from "@/components/preloader.vue"

import { ref } from "vue"
import DropMenu from "@/components/dropMenu.vue"
import { onClickOutside } from "@vueuse/core"

// Референсы для всплывающих окон
const isSettingsOpen = ref(false);
const isSearchOpen = ref(false);
const isChatOpen = ref(false);
const isBurgerOpen = ref(false);
const isCreateOpen = ref(false);
const isCallActive = ref(false);
const isVideoCall = ref(false);

// Прочее
const activeChat = ref(null);
const activePage = ref("chats");
const alertText = ref('You have unsaved changes that will be lost if you leave this page. Are you sure you want to proceed?');
const alertIsActive = ref(false);

const confirmText = ref("");
const confirmIsActive = ref(false);
const onConfirmYes = ref(() => {});
const onConfirmNo = ref(() => {});

// DOM объекты элементов
const burgerDOM = ref(null);
const mainDOM = ref(null)
const contextDOM = ref(null);


const handleCallAlert = (payload) => {
  alertText.value = payload;
  alertIsActive.value = true;
}


const chatMenuBtns = [
  {title: "Clear messages", danger: true, onClickFn: () => {
    confirmText.value = "Messages of this chat will be irreversibly removed for both users. Are you sure?";
    confirmIsActive.value = true;
    onConfirmYes.value = () => {console.log("Messages are removed");}
      onConfirmNo.value = () => {}
  }},
  {title: "Block user", danger: true, onClickFn: () => {
      console.log("block user");
      alertText.value = "User is blocked";
      alertIsActive.value = true;
    }},
  {title: "Report", danger: true, onClickFn: () => {
    console.log("report user");
      alertText.value = "Report was sent to Nuclear support";
      alertIsActive.value = true;
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
];
const contextChatBtns = [
  {title: "Clear chat", danger:true, onClickFn: () => {
      console.log("Clear chat");
    }},
  {title: "Delete", danger:true, onClickFn: () => {
      console.log("Deleted message");
    }},
  {title: "Block user", danger:true, onClickFn: () => {
      console.log("Block user");
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

  if (mainDOM.value) {
    let mainWidth = mainDOM.value.clientWidth;
    pos.value.x = payload.clientX - (mainWidth - payload.clientX + 100);
    pos.value.y = payload.clientY + 25;
  }
}

function handleCreateClick (payload) {
  isCreateOpen.value = true;
}

function handleUpdateChat(payload) {
  activeChat.value = payload;
  isChatOpen.value = payload.index !== null ? true : false;
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
const contextMenuBtns = ref(null);

function handleContextMenu (event) {
  event.preventDefault();
  pos.value.x = event.clientX;
  pos.value.y = event.clientY;
  let elementClass = event.target.className;

  // если клик по сообщению:
  if (elementClass.startsWith("conv__message")) {
    contextElement.value = 'message';
    contextMenuBtns.value = contextMessageBtns;
  }
  // если клик по чату:
  else if (elementClass.startsWith("recent__")) {
    contextElement.value = 'chat';
    contextMenuBtns.value = contextChatBtns;
  }

  else {
    contextElement.value = '';
  }
}

function handleCreatedData (payload) {
  console.log(payload);
}

function handleUserSelected (payload) {
  // todo сделать так, чтобы в user появился новый документ с метаданными нового чата

}


</script>

<template>

  <confirm :text="confirmText" v-model:is-active="confirmIsActive" :yes-case="onConfirmYes" :no-case="onConfirmNo" />

  <alert :is-active="alertIsActive" v-model:is-active="alertIsActive" :text="alertText" :on-ok="() => {console.log('bombardiro crocodilo')}"></alert>

<!--  <preloader />-->

  <user-search
      @user-selected="handleUserSelected"
      :class="{'active': isSearchOpen}"
      v-model:is-popup-visible="isSearchOpen"
  />

  <createWindow
      :class="{'active': isCreateOpen}"
      @call-alert="handleCallAlert"
      @created-data="handleCreatedData"
      v-model:is-popup-visible="isCreateOpen"/>

  <account-settings
      :class="{'active': isSettingsOpen}"
      v-model:is-popup-visible="isSettingsOpen"
  />

  <contextMenu :buttons='contextMenuBtns'
               :position=pos v-if="contextElement" :element=contextElement ref="contextDOM" />
  <drop-menu :buttons='isChatOpen ? chatMenuBtns : mainMenuBtns' v-if="isBurgerOpen" :position=pos ref="burgerDOM" />

  <mobileHeader
      :search="!isChatOpen"
      :close-btn="isChatOpen"
      :title="isChatOpen ? activeChat.firstname : ''"
      :burger-menu="isChatOpen"
      :call="isChatOpen"
      :create-btn="!isChatOpen"
      @create-clicked="handleCreateClick"
      @search-clicked="handleUpdateSearch"
      @burger-clicked="handleUpdateDropMenu"
      @close-clicked="handleUpdateCloseBtn"
      @call-clicked="handleCallClick"
  />

  <callWindow :active="isCallActive" :is-video="isVideoCall" @call-ended="handleCallEnded" />

  <main @contextmenu="handleContextMenu" ref="mainDOM">
    <side-menu
        @settings-clicked="handleUpdateSettings"
        @search-clicked="handleUpdateSearch"
        @create-clicked="handleCreateClick"
        @page-clicked="handleUpdatePage"/>

    <chats :active-page="activePage" :is-chat-open="isChatOpen" @click-chat="handleUpdateChat"/>
    <conversation
        @audio-call-clicked="() => { handleCallClick(); isVideoCall = false }"
        @video-call-clicked="() => { handleCallClick(); isVideoCall = true }"
        @call-alert="handleCallAlert"
        @burger-clicked="handleUpdateDropMenu" :active-chat=activeChat :is-chat-open="isChatOpen" />
  </main>
</template>