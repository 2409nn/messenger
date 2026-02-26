<script setup>

  const props = defineProps({
    title: {
      type: String,
      default: 'nothing found',
    }
  })
</script>

<template>
  <div class="emptyState">
    <svg class="userSearch__emptyState-pic" width="195" height="195" viewBox="0 0 195 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_178_227)">
        <path d="M180.177 113.543C189.398 68.6308 160.277 24.7852 115.133 15.6111C69.9897 6.43706 25.9181 35.4086 16.6968 80.3208C7.47539 125.233 36.5962 169.079 81.74 178.253C126.884 187.427 170.955 158.455 180.177 113.543Z" stroke="black" stroke-width="17"/>
        <path d="M89.4588 66.5C89.4588 61.2533 85.1835 57 79.9098 57C74.636 57 70.3608 61.2533 70.3608 66.5V73.5C70.3608 78.7467 74.636 83 79.9098 83C85.1835 83 89.4588 78.7467 89.4588 73.5V66.5Z" fill="black"/>
        <path d="M132.68 89.5C132.68 84.2533 128.405 80 123.131 80C117.858 80 113.582 84.2533 113.582 89.5V96.5C113.582 101.747 117.858 106 123.131 106C128.405 106 132.68 101.747 132.68 96.5V89.5Z" fill="black"/>
        <path d="M51.2337 110.971L122.6 131.971" stroke="black" stroke-width="14" stroke-linecap="round"/>
      </g>
      <defs>
        <clipPath id="clip0_178_227">
          <rect width="195" height="195" fill="white"/>
        </clipPath>
      </defs>
    </svg>

    <p class="userSearch__emptyState-title">{{ props.title }}</p>
  </div>
</template>

<style scoped lang="scss">
  .emptyState {
    display: block;
    //position: relative;
    text-align: center;
    opacity: 30%;
    margin-top: 100px;

    &-title {
      font-weight: 400;
      user-select: none;
    }
  }
</style>