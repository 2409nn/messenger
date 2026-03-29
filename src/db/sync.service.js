// Сложная логика отслеживания изменений и "бесконечный цикл" разрешения конфликтов.

import PouchDB from 'pouchdb';
import {API_SERVER, SYNC_OPTS} from './config.js';

export async function syncToChatDB(chatId, uid) {
    const password = '12345';
    const remoteURL = `http://${uid}:${password}@localhost:5984/${chatId}`;
    const localDB = new PouchDB(chatId.toLowerCase());
    const remoteDB = new PouchDB(remoteURL, { skip_setup: true });

    const syncProcessor = localDB.sync(remoteDB, SYNC_OPTS);
    return { localDB, syncProcessor };
}

export async function updateLastMessageMetadata(chatDB, message) {
    const docId = 'last_message_metadata';

    try {
        let lastMessage;

        try {
            // Пытаемся получить существующий документ
            lastMessage = await chatDB.get(docId);
        } catch (e) {
            // Если документ не найден (ошибка 404), создаем новый объект
            if (e.status === 404 || e.name === 'not_found') {
                lastMessage = { _id: docId };
            } else {
                // Если ошибка другого рода — пробрасываем её выше
                throw e;
            }
        }

        // Обновляем поля (теперь lastMessage точно существует)
        lastMessage.text = message.text;
        lastMessage.time = message.time;
        lastMessage.type = message.type;

        // Сохраняем (put работает и на создание, и на обновление, если есть _rev)
        await chatDB.put(lastMessage);

    } catch (e) {
        console.error("Ошибка при обновлении метаданных:", e);
    }
}

export const fetchChatsProfile = async (uid) => {

    const response = await fetch(`${API_SERVER}/chats-load`, {
        method: "POST",
        body: JSON.stringify({
            uid: uid,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        return {};
    }
    else {
        let res = await response.json();
        console.log(res);
        return await response.json();
    }
};


// sync.service.js
let changesHandler = null;
let lastUpdateSeq = null;



export function subscribeToUserUpdates(uid, onNewMessage) {
    if (changesHandler) return;

    const url = `http://localhost:5984/db_${uid}`.toLowerCase();
    const userDB = new PouchDB(url, {
        skip_setup: true,
        auth: { username: 'admin', password: '12345' }
    });

    userDB.changes({
        since: 'now',       // Игнорировать всё, что было до этой секунды
        live: true,
        include_docs: true,
        conflicts: false,   // Не тянуть историю конфликтов
        attachments: false  // Не тянуть вложения
    })
        .on('change', (change) => {
            // Если в объекте есть хоть намек на удаление – в топку
            if (change.deleted || (change.doc && change.doc._deleted)) {
                return;
                if (change.seq === lastUpdateSeq) return;
                lastUpdateSeq = change.seq;

                const doc = change.doc;

                // Фильтруем только метаданные чатов
                if (doc._id.startsWith('chat_')) {
                    const chatId = doc.chatId || doc._id;

                    const lastMessage = {
                        chatId: chatId,
                        text: doc.lastMessage?.text || doc.text,
                        time: doc.lastMessage?.time || doc.time,
                        unreadCount: doc.unreadCount || 0
                    };

                    // console.log(`[Sync] Выброс изменения для ${chatId}`);

                    // Отдаем наверх только то, что просили
                    onNewMessage(lastMessage);
                }
            }
        })
        .on('error', (err) => {
            console.error("Ошибка синхронизации:", err);
            changesHandler = null;
        });
}

// sync.service.js
let userDBInstance = null;
let changesHandler = null;

export async function stopUserSync() {
    if (changesHandler) {
        changesHandler.cancel();
        changesHandler = null;
    }
    if (userDBInstance) {
        // close() разрывает соединение и очищает память
        await userDBInstance.close();
        userDBInstance = null;
    }
    console.log("--- [Sync] Все соединения разорваны, память чиста ---");
}

export function subscribeToUserUpdates(uid, onUpdate) {
    // Если каким-то чудом остался старый инстанс — убиваем его
    if (userDBInstance) {
        console.warn("Обнаружена старая база! Сначала вызовите stopUserSync");
    }

    const url = `http://admin:12345@localhost:5984/db_${uid}`.toLowerCase();
    userDBInstance = new PouchDB(url, { skip_setup: true });

    // ... твой код со слушателем ...
}