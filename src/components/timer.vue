<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { sendCodeToEmail } from "../workers/sendCode.js"
import { userDataStore } from "@/stores/userData.js"

const props = defineProps({
  seconds: {
    type: Number,
    default: 60
  }
});

const emit = defineEmits(["resendClicked"]);

const timeLeft = ref(props.seconds);

watch(props.seconds, (newVal) => {
  timeLeft.value = newVal;
})

const userData = userDataStore().userData;
let timer = null;

const formattedTime = computed(() => {
  const mins = Math.floor(timeLeft.value / 60);
  const secs = timeLeft.value % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
});

onMounted(() => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--;
  }, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>

<template>
  <div class="timer">
    <span v-if="timeLeft > 0">Resend code in {{ formattedTime }}</span>
    <button v-else class="resend-btn" @click="() => {emit('resendClicked')}">
      Resend code
    </button>
  </div>
</template>

<style scoped>

.timer {
  font-size: 14px;
  color: var(--secondary-text-color);
  text-align: center;
  margin-top: 15px;
}

.resend-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

</style>