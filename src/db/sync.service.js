// Сложная логика отслеживания изменений и "бесконечный цикл" разрешения конфликтов.


import PouchDB from 'pouchdb';
import { SYNC_OPTS } from './config.js';

export async function syncToChatDB(chatId, uid) {
    const password = '12345';
    const remoteURL = `http://${uid}:${password}@localhost:5984/${chatId}`;
    const localDB = new PouchDB(chatId.toLowerCase());
    const remoteDB = new PouchDB(remoteURL, { skip_setup: true });

    const syncProcessor = localDB.sync(remoteDB, SYNC_OPTS);
    return { localDB, syncProcessor };
}

export async function updateLastMessageMetadata(db, message) {
    const metadataId = "last_message_metadata";
    let success = false;

    while (!success) {
        try {
            let metadata;
            try {
                metadata = await db.get(metadataId);
            } catch (err) {
                if (err.status === 404) {
                    metadata = { _id: metadataId, type: 'metadata' };
                } else throw err;
            }

            if (metadata.lastTime === message.time) {
                success = true; break;
            }

            metadata.lastText = message.text;
            metadata.lastSender = message.firstname || "Me";
            metadata.lastTime = message.time;
            metadata.timestamp = Date.now();

            await db.put(metadata);
            success = true;
        } catch (err) {
            if (err.status === 409) continue;
            else { console.error("Ошибка метаданных:", err); break; }
        }
    }
}

export async function setupChatListeners(allChatDBs, chats, interlocatorsData, uid) {
    chats.forEach(chat => {
        const dbName = chat._id.toLowerCase();
        if (!allChatDBs[dbName]) {
            const { localDB, syncProcessor } = syncToChatDB(dbName, uid);
            allChatDBs[dbName] = { localDB, sync: syncProcessor };

            localDB.changes({
                live: true,
                since: 'now',
                doc_ids: ['last_message_metadata'],
                include_docs: true
            }).on('change', (change) => {
                const newMetadata = change.doc;
                if (interlocatorsData[chat._id]) {
                    interlocatorsData[chat._id].lastMessage = {
                        lastText: newMetadata.lastText,
                        lastTime: newMetadata.lastTime,
                        lastSender: newMetadata.lastSender,
                    };
                }
            });
        }
    });
}