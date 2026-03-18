<script setup>
  import { useSettingsStore } from "@/stores/settings.js";
  // import CryptoWorker from "@/workers/crypto.worker?worker";
  import { ref } from "vue";

  const loadAccountSettings = async () => {
    const settings = useSettingsStore().settings;
    document.getElementById("app").setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  }

  loadAccountSettings()

  // const message = ref('');
  // const encryptedData = ref(null);
  // const decryptedText = ref('');
  // let worker = null;
  //
  // worker = new CryptoWorker();
  //
  // // Слушаем ответы от воркера
  // worker.onmessage = (e) => {
  //   const { type, payload } = e.data;
  //
  //   if (type === 'ENCRYPTED') {
  //     encryptedData.value = payload;
  //     console.log("Данные зашифрованы в воркере!");
  //   }
  //
  //   if (type === 'DECRYPTED') {
  //     decryptedText.value = payload;
  //   }
  //
  //   if (type === 'ERROR') {
  //     console.error("Ошибка в воркере:", payload);
  //   }
  // };
  //
  // // 2. Генерация ключей (делаем один раз при инициализации)
  // // В реальном приложении ты бы достал их из IndexedDB
  // const aliceKeys = await window.crypto.subtle.generateKey(
  //     { name: "ECDH", namedCurve: "P-256" },
  //     false,
  //     ["deriveKey"]
  // );
  //
  // // Для примера создадим sharedKey сразу (как будто обменялись с Бобом)
  // // В жизни тут был бы deriveKey с публичным ключом собеседника
  // const sharedKey = await window.crypto.subtle.deriveKey(
  //     { name: "ECDH", public: aliceKeys.publicKey }, // просто для теста самого себя
  //     aliceKeys.privateKey,
  //     { name: "AES-GCM", length: 256 },
  //     false,
  //     ["encrypt", "decrypt"]
  // );
  //
  // // 3. Отправляем ключ в воркер "на хранение"
  // worker.postMessage({ type: 'INIT_KEY', payload: sharedKey });
  //
  // const handleEncrypt = () => {
  //   worker.postMessage({ type: 'ENCRYPT', payload: message.value });
  // };
  //
  // const handleDecrypt = () => {
  //   if (encryptedData.value) {
  //     worker.postMessage({type: 'DECRYPT', payload: encryptedData.value});
  //     console.log(encryptedData.value);
  //   }
  // }
  //
  // handleDecrypt();


</script>

<template>
  <div id="app">
    <router-view>

    </router-view>
  </div>
</template>

<style lang="scss" scoped>

</style>