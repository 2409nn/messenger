<script setup>
import { computed, watch } from 'vue';

const props = defineProps({
  seconds: {
    type: Number,
    required: true,
  }
});

const emit = defineEmits(["resendClicked"]);

// Мы просто форматируем то, что приходит в пропсах.
// Computed автоматически пересчитается, когда родитель изменит seconds.
const formattedTime = computed(() => {
  const mins = Math.floor(props.seconds / 60);
  const secs = props.seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
});

</script>

<template>
  <div class="timer">
    <span v-if="props.seconds > 0">Resend code in {{ formattedTime }}</span>
    <button v-else class="resend-btn" @click="emit('resendClicked')">
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