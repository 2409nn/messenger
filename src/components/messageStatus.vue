<script setup>
  const props = defineProps({
    status: {
      default: 'pending',
      type: String,
    }
  })

</script>

<template>
  <span class="messageStatus" :class="{'pending': props.status.toLowerCase() === 'pending',
   'error': props.status.toLowerCase() === 'error',
   'delivered': props.status.toLowerCase() === 'delivered',
   'read': props.status.toLowerCase() === 'read',
   }"></span>
</template>

<style scoped lang="scss">
  .messageStatus {
    border-radius: 50%;
    width: 8px;
    height: 8px;

    &.pending {
      border: 2px solid var(--yellow-border);
      background-color: var(--yellow-background);
      border-radius: 50%;
      transition: all 0.2s;
    }

    &.delivered {
      border: 2px solid var(--green-border);
      transition: all 0.2s;
    }

    &.read {
      border: 2px solid var(--green-border);
      background-color: var(--online-sign-background);
      transition: all 0.2s;
    }

    &.error {
      border: 2px solid var(--red-border);
      background-color: var(--danger-color);
      border-radius: 0;
    }
  }
</style>