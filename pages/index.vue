<template>
  <div class="container">
    <header>
      <h1 id="qr-title" class="title">Generate QR Code</h1>
    </header>

    <main class="main">
      <section class="container-inner" aria-labelledby="qr-title">
        <div class="controls">
          <div class="colors">

            <div class="color-picker">
              <label for="dark-color" class="color-picker-label">Select dark color</label>
              <input v-model="darkColor" type="color" id="dark-color">
            </div>

            <div class="color-picker">
              <label for="light-color" class="color-picker-label">Select light color:</label>
              <input v-model="lightColor" type="color" id="light-color">
              </div>
          </div>

          <label for="qr-input" class="visually-hidden">Enter the URL or text for QR code generation</label>
          <input
              type="text"
              id="qr-input"
              v-model="qrString"
              class="qr-input"
              placeholder="Enter URL or text"
              aria-required="true"
              aria-describedby="input-help"
          />

          <button
              type="button"
              @click="generateToCanvas"
              :disabled="!qrString"
              class="qr-button"
              aria-label="Generate QR Code"
          >
            Generate
          </button>
        </div>

        <div class="qr" aria-live="polite">
          <canvas
              ref="canvasEl"
              class="canvas"
              role="img"
              aria-label="QR Code Canvas"
          />

          <button
              type="button"
              class="download-button"
              @click="saveToFile"
              aria-label="Download QR Code"
          >
            <img
                src="@/assets/img/download-icon.svg"
                alt="Download icon"
                class="icon"
            />
            <span>Download</span>
          </button>
        </div>
      </section>
    </main>
  </div>

</template>

<script setup lang="ts">
import {type QRCodeRenderersOptions, toCanvas} from 'qrcode';

const qrString = ref('https://qrwithme.vercel.app/')
const canvasEl = ref<HTMLCanvasElement>()

const darkColor = ref('#000000')
const lightColor = ref('#FFFFFF')

const generateToCanvas = () => {
  const options: QRCodeRenderersOptions = {
    margin: 1,
    color: {
      dark: darkColor.value,
      light: lightColor.value,
    },
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
    { name: 'og:description', content: 'Generate QR code fast and easy' },
  ]
})

watch(darkColor, generateToCanvas)
watch(lightColor, generateToCanvas)

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

.main {
  width: 100%;
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

.colors {
  display: flex;
  margin-bottom: 20px;
}

.color-picker {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.color-picker input {
  width: 190px;
  border: none;
  box-shadow: none;
  border-radius: 0;
}

.color-picker-label {
  font-family: Roboto;
  font-size: 20px;
  margin-bottom: 4px;
}

.qr-input {
  width: 100%;
  font-size: 20px;
  font-family: Roboto;
  outline: none;
  border: none;
  height: 52px;
  padding: 6px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.qr-input::placeholder {
  font-size: 18px;
  font-family: Roboto;
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

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}


@media screen and (max-width: 960px) {
  .container-inner {
    flex-direction: column-reverse;
    gap: 20px;
    height: auto;
  }

  .qr {
    gap: 20px;
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

  .colors {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .color-picker input {
    width: 300px;
  }
}
</style>
