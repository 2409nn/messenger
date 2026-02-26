<script setup>
import { ref, defineEmits } from "vue"

const emit = defineEmits(["switch"])

const props = defineProps({
  firstName: String,
  secondName: String,
})

const activeTab = ref( props.firstName );

const setTab = (name) => {
  activeTab.value = name;
  emit("switch", name);
}

</script>

<template>
  <div class="switcher">
    <button class="switcher__first-btn" @click="setTab(firstName)" :class="{active: activeTab === firstName}">{{ firstName }}</button>
    <button class="switcher__second-btn" @click="setTab(secondName)" :class="{active: activeTab === secondName}">{{ secondName }}</button>
  </div>
</template>

<style scoped>
  .switcher {
    background-color: var(--main-background-color);
    border-radius: 14px;
    padding: 5px;
    height: 50px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 5px;

    width: 95%;
    margin: auto;
  }

  .switcher button {
    background: none;
    border: none;
    border-radius: 10px;
    color: var(--secondary-text-color);
  }

  .switcher button:hover {
    cursor: pointer;
    background-color: var(--hover-background-color);
  }

  .switcher button.active {
    background-color: var(--hover-background-color);
    color: var(--main-text-color);
  }

</style>