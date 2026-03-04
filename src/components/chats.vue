<script setup>
  import switcher from "./switcher.vue"
  import recentMessages from "./recentMessages.vue"
  import recentGroupMessages from "./recentGroupMessages.vue"

  import { ref } from "vue"


  defineProps(["activePage"])
  const currentTab = ref("Chat");

  const handleEmit = (playload) => {
    currentTab.value = playload;
  }

</script>

<!-- todo: сделать заглушку если чат не выбран -->

<template>

  <section class="chats">
    <div class="chats__heading heading">
      <h2 class="chats__heading-title">Recent {{ activePage }}</h2>
    </div>
    <switcher @switch="handleEmit" firstName="Chat" secondName="Group" v-if="activePage === 'chats'"></switcher>
    <recent-messages v-if="currentTab === 'Chat'" :active-page=activePage></recent-messages>
    <recentGroupMessages v-if="currentTab === 'Group'"></recentGroupMessages>
  </section>
</template>

<style scoped lang="scss">
  .chats {
    grid-column: 2/6;
    background-color: var(--body-background);

    &__heading {
      padding: 20px;
    }
  }
</style>