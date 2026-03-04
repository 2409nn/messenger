<script setup>
import sideMenu from "@/components/sideMenu.vue"
import Chats from "@/components/chats.vue"
import conversation from "@/components/conversation.vue"
import accountSettings from "@/components/accountSettings.vue"
import UserSearch from "@/components/userSearch.vue"
import mobileHeader from "@/components/mobileHeader.vue"

import { ref } from "vue";


const isSettingsOpen = ref(false);
const isSearchOpen = ref(false);
const activePage = ref("chats");

function handleUpdateSettings(payload) {
  isSettingsOpen.value = payload;
}

function handleUpdateSearch(payload) {
  isSearchOpen.value = payload;
  console.log(payload);
}

function handleUpdatePage(payload) {
  activePage.value = payload;
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

  <mobileHeader
      :search=true
      :burger-menu=true
      @search-clicked="handleUpdateSearch" />

  <main>
    <side-menu
        @settings-clicked="handleUpdateSettings"
        @search-clicked="handleUpdateSearch"
        @page-clicked="handleUpdatePage"/>

    <chats :active-page="activePage" />
    <conversation />
  </main>
</template>