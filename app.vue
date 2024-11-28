<template>
  <div>
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
    <analytics />
  </div>
</template>
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
</script>
<style>
body {
  background: #121212;
  color: #E0E0E0;
  padding: 0;
  margin: 0;
}
* {
  font-family: Roboto;
  box-sizing: border-box;
}

button {
  box-shadow: none;
  border: none;
  border-radius: 8px;
  color: #E0E0E0;
  cursor: pointer;
  font-size: 20px;
  transition: all ease 0.3s;
}
</style>
