<script setup>

import EmptyState from "@/components/emptyState.vue";
import { ref } from "vue";

const isEmpty = ref(true);

</script>

<template>
  <div class="recent-group">

    <empty-state v-if="isEmpty"></empty-state>


<!--    <ul class="recent-group__chats">-->
<!--      <li class="recent-group__chat" v-for="(user, index) in usersData" @click="activeIndex=index" :class="{ active: activeIndex === index }">-->
<!--        <div class="recent-group__avatar">-->
<!--          <img class="recent-group__avatar-img" :src="user.avatar" alt="avatar">-->
<!--          <div class="recent-group__avatar-online online"></div>-->
<!--        </div>-->
<!--        <div class="recent-group__info">-->
<!--          <div class="recent-group__info-top">-->
<!--            <p class="recent-group__info-firstname">{{ user.firstname }}</p>-->
<!--            <p class="recent-group__info-time">{{ user.time }}</p>-->
<!--          </div>-->
<!--          <p class="recent-group__info-message">{{ user.message }}</p>-->
<!--        </div>-->
<!--      </li>-->
<!--    </ul>-->
  </div>
</template>

<style scoped lang="scss">

.recent-group {
  display: block;
}

</style>