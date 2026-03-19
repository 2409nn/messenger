<script setup>
  import { useSettingsStore } from "@/stores/settings.js";
  import CryptoWorker from "@/workers/crypto.worker?worker";
  import { ref } from "vue";

  const loadAccountSettings = async () => {
    const settings = useSettingsStore().settings;
    document.getElementById("app").setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  }

  loadAccountSettings()


  // ------- шифр -------// Путь к твоему воркеру

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
      // 1. Генерируем реальный ключ (для теста генерируем симметричный AES)
      // В твоем чате здесь будет результат deriveKey (ECDH)
      const realKey = await window.crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"]
      );

      // 2. Создаем воркер
      const myWorker = new CryptoWorker();

      // 3. Настраиваем прием ответов
      myWorker.onmessage = (e) => {
        const { command, data } = e.data;

        if (command === 'READY') {
          // console.log("Воркер готов, отправляем текст на шифрование...");
          myWorker.postMessage({
            command: 'ENCRYPT',
            data: inputMessage.value
          });
        }

        if (command === 'ENCRYPTED') {
          encryptedResult.value = bufferToBase64(data.ciphertext);
          // console.log("Успешно зашифровано в воркере:", data);
          // console.log(encryptedResult.value);

          // Сразу проверим дешифровку для теста
          myWorker.postMessage({
            command: 'DECRYPT',
            data: data // передаем {ciphertext, iv}
          });
        }

        if (command === 'DECRYPTED') {
          decryptedResult.value = data;
          // console.log("Успешно расшифровано в воркере:", data);
          myWorker.terminate(); // Закрываем поток
        }

        if (command === 'ERROR') {
          console.error("Ошибка в воркере:", data);
          myWorker.terminate();
        }
      };

      // 4. Инициализируем воркер ключом
      myWorker.postMessage({
        command: 'INIT_KEY',
        key: realKey // ПЕРЕДАЕМ НАСТОЯЩИЙ ОБЪЕКТ КЛЮЧА
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