<script setup>
import sideMenu from "../components/sideMenu.vue"
import Chats from "../components/chats.vue"
import conversation from "../components/conversation.vue"
import accountSettings from "../components/accountSettings.vue"
import { ref } from "vue";
import UserSearch from "@/components/userSearch.vue";

const isSettingsOpen = ref(false);

function handleUpdateSettings(payload) {
  isSettingsOpen.value = payload;
}
</script>

<template>

<!--  <user-search></user-search>-->

  <account-settings
      :class="{'active': isSettingsOpen}"
      v-model:is-popup-visible="isSettingsOpen"
  />

  <main>
    <side-menu @settings-clicked="handleUpdateSettings" />
    <chats />
    <conversation />
  </main>
</template>