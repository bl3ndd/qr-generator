<template>
  <div class="container">
    <h1 class="title">Generate QR code</h1>
    <div class="container-inner">
      <div class="controls">
        <div tabindex="0" class="input-control">
          <input type="text" v-model="qrString" class="qr-input" placeholder="Enter URL" />
        </div>
        <button @click="generateToCanvas" :disabled="!qrString" class="qr-button">Generate</button>
      </div>
      <div class="qr">
        <canvas ref="canvasEl" class="canvas" />
        <button class="download-button" @click="saveToFile">
          <img src="@/assets/img/download-icon.svg" alt="download icon" class="icon">
          <span>Download</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toCanvas } from 'qrcode';

const qrString = ref(location.origin)
const canvasEl = ref<HTMLCanvasElement>()

const generateToCanvas = () => {
  const options = {
    margin: 1,
    width: 400
  }

  toCanvas(canvasEl.value, qrString.value, options)
}

const saveToFile = () => {
  if (!canvasEl.value) {
    return
  }

  const link = document.createElement('a');
  link.download = 'qr.jpeg';
  link.href = canvasEl.value.toDataURL('image/jpeg')
  link.click();
}

useHead({
  title: "QR code generator",
  meta: [
    { name: "og:locale", content: 'en_US' },
    { name: "og:site_name", content: "QR generator" },
    { name: 'og:description', content: 'Generate QR code in one second' },
  ]
})

onMounted(() => {
  generateToCanvas()
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}

.title {
  margin-top: 100px;
  font-size: 60px;

}

.container-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 600px;
  width: 100%;
}

.controls {
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.input-control {
  padding: 6px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.qr-input {
  width: 100%;
  padding: 0;
  margin: 0;
  font-size: 18px;
  outline: none;
  border: none;
  height: 32px;
}

.qr-input::placeholder {
  font-size: 18px;
}

.canvas {
  width: 100%;
  height: 100%;
  border-radius: 12px
}

.qr {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 40px;
  max-width: 400px;
  width: 100%;
}

.qr-button {
  border-radius: 8px;
  height: 52px;
  background: #00796B;
  color: #E0E0E0;
  font-size: 20px;
}

.qr-button:hover {
  background: #029d8c;
}

.qr-button:disabled {
  background: #004f45;
}

.icon {
  width: 40px;
  height: 40px;
  color: #E0E0E0;
}

.download-button {
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

@media screen and (max-width: 960px) {
  .container-inner {
    flex-direction: column-reverse;
    gap: 40px;
    height: auto;
  }

  .title {
    font-size: 36px;
    margin-top: 18px;
  }

  .canvas {
    max-width: 300px;
    max-height: 300px;
  }

  .controls {
    max-width: 300px;
  }
}
</style>
