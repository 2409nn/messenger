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

export async function updateLastMessageMetadata(chatDB, message) {
    const lastMessage = await chatDB.get('last_message_metadata');
    lastMessage.text = message.text;
    lastMessage.time = message.time;
    lastMessage.type = message.type;

    try {
        await chatDB.put(lastMessage);

    } catch (e) {
        console.error(e);
    }
}

export async function setupChatListeners(allChatDBs, chats, chatsData, uid) {
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
                if (chatsData[chat._id]) {
                    chatsData[chat._id].lastMessage = {
                        text: newMetadata.text,
                        time: newMetadata.time,
                        sender: newMetadata.sender,
                    };
                }
            });
        }
    });
}