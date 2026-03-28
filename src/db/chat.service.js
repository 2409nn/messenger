// Логика создания комнат, управления правами (security) и отправки сообщений.

import PouchDB from 'pouchdb';
import { COUCHDB_URL, ADMIN_AUTH, API_SERVER, SYNC_OPTS } from './config.js';

export async function createChatDB(uids, token) {
    const sortedIds = [...uids].sort().join('|');
    const msgUint8 = new TextEncoder().encode(sortedIds);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const id = `chat_${hashHex.substring(0, 32)}`;

    const res = await fetch(`${API_SERVER}/chat-create`, {
        method: 'POST',
        body: JSON.stringify({id: id, uids: uids}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!res.ok) throw new Error('Сервер не смог создать чат');
    return id;
}

export async function addUsersToChat(dbName, uids) {
    const serverURL = `http://${ADMIN_AUTH}@localhost:5984/${dbName}/_security`;
    const securityData = {
        admins: { names: ["admin"], roles: [] },
        members: { names: uids, roles: [] }
    };

    await fetch(serverURL, {
        method: 'POST',
        body: JSON.stringify(securityData)
    });
}

export async function sendMessage(dbName, uid, message) {
    const password = '12345';
    const remoteURL = `http://${uid}:${password}@localhost:5984/${dbName}`;
    const remoteDB = new PouchDB(remoteURL, { skip_setup: true });
    await remoteDB.put(message);
}

export async function loadUserChats(uid) {
    const password = '12345'; // засекретить пароль
    const dbName = `db_${String(uid).toLowerCase()}`;

    const remoteURL = `http://${uid}:${password}@localhost:5984/${dbName}`;

    const db = new PouchDB(remoteURL, { skip_setup: true });

    return await db.allDocs({include_docs: true, startkey: 'chat_', endkey: 'chat_\uffff'});


    // Функция для загрузки всех данных из локальной базы
    // const updateChats = async () => {
    //     const allDocs = await localDB.allDocs({include_docs: true, startkey: 'chat_', endkey: 'chat_\uffff'});
    //     allDocs.rows.forEach(row => {
    //         chats.push(row.doc); // Наполняем наш объект
    //     });
    //
    // };

    // Запускаем синхронизацию
    // localDB.sync(remoteDB, {
    //     live: true,
    //     retry: true,
    // })
    //     .on('change', async (info) => {
    //         console.log('Данные изменились, обновляем список...');
    //         await updateChats(); // Перечитываем базу при каждом изменении
    //     })
    //     .on('error', (err) => {
    //         console.error('Ошибка синхронизации:', err);
    //     });

    // Первоначальная загрузка
    // await updateChats();
}

