<template>
  <div class="app">
    <NuxtLayout name="default">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [
    { rel: "stylesheet", href:"https://unpkg.com/zuck.js/dist/zuck.css" }, 
    { rel: "stylesheet", href:"https://unpkg.com/zuck.js/dist/skins/snapgram.css" }
  ],
  script: [
    { src: 'https://unpkg.com/zuck.js/dist/zuck.js' },
  ]
});
</script>