const encode = (txt) => new TextEncoder().encode(txt);
const decode = (buffer) => new TextDecoder().decode(buffer);

let sharedKey = null;

self.onmessage = async (e) => {
    const { command, data, key } = e.data;

    try {
        switch (command) {
            case 'INIT_KEY':
                sharedKey = key;
                self.postMessage({ command: 'READY' });
                break;

            case 'ENCRYPT':
                if (!sharedKey) throw new Error("Ключ не инициализирован (sharedKey is null)");
                const encrypted = await encryptMessage(data, sharedKey);
                self.postMessage({ command: 'ENCRYPTED', data: encrypted });
                break;

            case 'DECRYPT':
                if (!sharedKey) throw new Error("Ключ не инициализирован");
                const decryptedText = await decryptMessage(data.ciphertext, data.iv, sharedKey);
                self.postMessage({ command: 'DECRYPTED', data: decryptedText });
                break;
        }
    } catch (err) {
        self.postMessage({ command: 'ERROR', data: err.message });
    }
};

async function encryptMessage(text, cryptoKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        encode(text)
    );
    return { ciphertext, iv };
}

async function decryptMessage(ciphertext, iv, cryptoKey) {
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        ciphertext
    );
    return decode(decrypted);
}