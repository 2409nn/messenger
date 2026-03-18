// src/workers/crypto.worker.js

let sharedKey = null; // Глобальная переменная внутри воркера
const encode = (txt) => new TextEncoder().encode(txt);
const decode = (buffer) => new TextDecoder().decode(buffer);

self.onmessage = async (e) => {
    // ВАЖНО: Проверь, какие имена полей ты используешь в Vue (payload или data?)
    const { command, key, data } = e.data;

    try {
        switch (command) {
            case 'INIT_KEY':
                // Сохраняем ключ в переменную выше
                sharedKey = key;
                console.log("Worker: Ключ инициализирован", sharedKey);
                self.postMessage({ command: 'READY' });
                break;

            case 'ENCRYPT':
                // Вот тут и вылетает ошибка, если sharedKey == null
                if (!sharedKey) {
                    throw new Error("Ключ не инициализирован! Сначала вызовите INIT_KEY.");
                }
                const encrypted = await encryptMessage(data, sharedKey);
                self.postMessage({ command: 'ENCRYPTED', key: encrypted });
                break;

            // ... остальные кейсы ...
        }
    } catch (err) {
        self.postMessage({ command: 'ERROR', key: err.message });
    }
};

// --- Функции шифрования (те же, что были у тебя) ---
async function encryptMessage(text, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encode(text)
    );
    return { ciphertext, iv };
}

async function decryptMessage(ciphertext, iv, key) {
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
    );
    return decode(decrypted);
};
