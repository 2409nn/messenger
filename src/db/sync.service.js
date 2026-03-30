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
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        return {};
    }
    else {
        return await response.json();
    }
};


let userDBInstance = null;
let changesHandler = null;
let lastUpdateSeq = null;

/**
 * Останавливает синхронизацию и полностью очищает память.
 * Вызывай это при Logout или перед сменой пользователя.
 */
export async function stopUserSync() {
    if (changesHandler) {
        changesHandler.cancel();
        changesHandler = null;
        console.log("[Sync] Слушатель остановлен");
    }
    if (userDBInstance) {
        await userDBInstance.close();
        userDBInstance = null;
        console.log("[Sync] Инстанс базы закрыт");
    }
    lastUpdateSeq = null;
}

/**
 * Подписка на обновления базы конкретного пользователя.
 */
export async function subscribeToUserUpdates(uid, onNewMessage) {
    // 1. Если слушатель уже запущен, не плодим копии
    if (changesHandler) return;

    // 2. Если есть старый инстанс от другого юзера (забыли закрыть) — прибиваем
    if (userDBInstance) {
        console.warn("[Sync] Обнаружена старая база! Очищаю...");
        await stopUserSync();
    }

    const url = `http://admin:12345@localhost:5984/db_${uid}`.toLowerCase();

    // Создаем инстанс и сохраняем его в глобальную переменную модуля
    userDBInstance = new PouchDB(url, {
        skip_setup: true,
        auth: { username: 'admin', password: '12345' }
    });

    console.log(`--- [Sync] Слушатель запущен для: ${uid} ---`);

    changesHandler = userDBInstance.changes({
        since: 'now',
        live: true,
        include_docs: true,
        conflicts: false,
        attachments: false
    })
        .on('change', (change) => {
            // Пропускаем удаленные документы ("призраки")
            if (change.deleted || (change.doc && change.doc._deleted)) {
                return;
            }

            // Защита от дублей по seq
            if (change.seq === lastUpdateSeq) return;
            lastUpdateSeq = change.seq;

            const doc = change.doc;

            // Фильтруем только метаданные чатов
            if (doc && doc._id.startsWith('chat_')) {
                const chatId = doc.chatId || doc._id;

                const lastMessage = {
                    chatId: chatId,
                    text: doc.lastMessage?.text || doc.text,
                    time: doc.lastMessage?.time || doc.time,
                    unreadCount: doc.unreadCount || 0
                };

                // Отправляем чистые данные в коллбэк (во Vue компонент)
                onNewMessage(lastMessage);
            }
        })
        .on('error', (err) => {
            console.error("[Sync] Ошибка синхронизации:", err);
            // Если ошибка фатальна (например, 401), сбрасываем хендлер для перезапуска
            changesHandler = null;
        });
}