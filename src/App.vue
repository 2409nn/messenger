<script setup>
  import { useSettingsStore } from "@/stores/settings.js";
  import CryptoWorker from "@/workers/crypto.worker?worker";
  import { ref } from "vue";

  const loadAccountSettings = async () => {
    const settings = useSettingsStore().settings;
    document.getElementById("app").setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  }

  loadAccountSettings()


  // ------- шифр -------

  const bufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const inputMessage = ref('Hello World');
  const encryptedResult = ref(null);
  const decryptedResult = ref('');

  // Основная функция
  const processCrypto = async () => {
    try {
      const realKey = await window.crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"]
      );

      const myWorker = new CryptoWorker();

      myWorker.onmessage = (e) => {
        const { command, data } = e.data;

        if (command === 'READY') {
          myWorker.postMessage({
            command: 'ENCRYPT',
            data: inputMessage.value
          });
        }

        if (command === 'ENCRYPTED') {
          encryptedResult.value = bufferToBase64(data.ciphertext);

          myWorker.postMessage({
            command: 'DECRYPT',
            data: data
          });
        }

        if (command === 'DECRYPTED') {
          decryptedResult.value = data;
          myWorker.terminate();
        }

        if (command === 'ERROR') {
          console.error("Ошибка в воркере:", data);
          myWorker.terminate();
        }
      };

      myWorker.postMessage({
        command: 'INIT_KEY',
        key: realKey
      });

    } catch (err) {
      console.error("Ошибка в главном потоке:", err);
    }
  };

  processCrypto();


</script>

<template>
  <div id="app">
    <router-view>

    </router-view>
  </div>
</template>

<style lang="scss" scoped>

</style>