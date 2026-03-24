import PouchDB from 'pouchdb-browser';

export async function initLocalUserDB(uid, dbName, password) {
    const localDB = new PouchDB('local_user_db');
    const remoteURL = `http://${encodeURIComponent(uid)}:${encodeURIComponent(password)}@localhost:5984/${dbName}`;
    const remoteDB = new PouchDB(remoteURL, { skip_setup: true }); // подключение к удаленной базе данных

    localDB.sync(remoteDB, {
        live: true, // мгновенная синхронизация
        retry: true, // повторять попытку если связь оборвется

    }).on('change', (info) => console.log('Данные обновились:', info))
        .on('paused', (err) => console.log('Синхронизация приостановлена'))
        .on('error', (err) => console.error('Ошибка синхронизации:', err));

    return localDB;
}

export async function putUserProfile(profile) {
    const adminPassword = '12345'; // засекретить пароль
    const remoteURL = `http://admin:${encodeURIComponent(adminPassword)}@localhost:5984/user_profiles`;
    const remoteDB = new PouchDB(remoteURL, { skip_setup: true }); // подключение к удаленной базе данных

    try {
        await remoteDB.put(profile);

    }catch(err) {
        console.error(err);
    }
}

export async function getDB(dbName) {
    return new PouchDB(dbName);
}

export async function getUserProfile() {
    const remoteURL = `http://localhost:5984/user_profiles`;
    const remoteDB = new PouchDB(remoteURL, { skip_setup: true }); // подключение к удаленной базе данных
    try {
        return remoteDB;
    }catch(err) {
        console.error(err);
    }
}

export async function saveDataPouchDB(data, db, id) {
    try {
        await db.put({_id: id, ...data});

    } catch (err) {
        console.error(err);
    }
}

export async function putDesign(design, db) {
    await db.put(design);
}

// todo создавать новую базу данных, где members – участники чата

export async function addUsersToChat(dbName, uids) {
    const serverURL = `http://admin:12345@localhost:5984/${dbName}/_security`; // засекретить пароль

    const securityData = {
        admins: { names: ["admin"], roles: [] },
        members: {
            names: uids, // Сюда залетают UID всех участников чата
            roles: []
        }
    };

    await fetch(serverURL, {
        method: 'POST',
        body: JSON.stringify(securityData)
    })

}

export async function createChatDB(uids, token) {

    // делаем из uids единый хэш-id
    const sortedIds = [...uids].sort().join('|');
    const msgUint8 = new TextEncoder().encode(sortedIds);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const id = `chat_${hashHex.substring(0, 32)}`; // Берем часть хеша для краткости

    // запрос на сервер, где передаем параметры для функции
    const res = await fetch('http://localhost:5005/chat-create', {
        method: 'POST',
        body: JSON.stringify({id: id, uids: uids}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })

    if (!res.ok) { console.error('Сервер не смог выполнить запрос'); return }
    console.log(res);

}

export async function sendMessage(chatId, uid, message) {
    const password = '12345'; // засекретить пароль
    const remoteURL = `http://${uid}:${password}@localhost:5984/${chatId}`;
    const remoteDB = new PouchDB(remoteURL, { skip_setup: true });

    try {
        await remoteDB.put(message);
    }
    catch(err) {
        console.error(err);
    }
}

export async function loadChats(uid, chats) {
    const password = '12345'; // засекретить пароль
    const dbName = `db_${uid.toLowerCase()}`;
    console.log(dbName);

    const remoteURL = `http://${uid}:${password}@localhost:5984/${dbName}`;

    const localDB = new PouchDB(dbName);
    const remoteDB = new PouchDB(remoteURL, { skip_setup: true });

    // Функция для загрузки всех данных из локальной базы
    const updateChats = async () => {
        const allDocs = await localDB.allDocs({include_docs: true, startkey: 'chat_', endkey: 'chat_\uffff'});
        allDocs.rows.forEach(row => {
            chats.push(row.doc); // Наполняем наш объект
        });

    };

    // Запускаем синхронизацию
    localDB.sync(remoteDB, {
        live: true,
        retry: true,
    })
        .on('change', async (info) => {
            console.log('Данные изменились, обновляем список...');
            await updateChats(); // Перечитываем базу при каждом изменении
        })
        .on('error', (err) => {
            console.error('Ошибка синхронизации:', err);
        });

    // Первоначальная загрузка
    await updateChats();
}
