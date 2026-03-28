<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  endTime: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(["resendClicked"]);

// 1. Создаем реактивную точку "сейчас"
const now = ref(Date.now());
let interval;

// 2. Запускаем обновление "сейчас" каждую секунду
onMounted(() => {
  interval = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

// Не забываем чистить за собой!
onUnmounted(() => clearInterval(interval));

// 3. Теперь duration будет пересчитываться каждую секунду,
// так как зависимость now.value меняется
const duration = computed(() => {
  return Math.max(props.endTime - now.value, 0);
});

const seconds = computed(() => {
  return Math.floor(duration.value / 1000);
});
</script>

<template>
  <div class="timer">
    <span v-if="duration > 0">Resend code in {{ seconds }}</span>
    <button v-else class="resend-btn" @click="emit('resendClicked')"> Resend code </button>
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