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

    fetch(serverURL, {
        method: 'POST',
        body: JSON.stringify(securityData)
    })

}

export async function createChatDB(uids) {
    // 1. Сортируем и создаем строку для хеша
    const sortedIds = [...uids].sort().join('|');
    const msgUint8 = new TextEncoder().encode(sortedIds);

    // 2. Генерируем SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);

    // 3. Конвертируем Buffer в HEX-строку
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const id = `chat_${hashHex.substring(0, 32)}`; // Берем часть хеша для краткости

    // 4. Названия баз
    const localDB = new PouchDB(id);
    const remoteURL = `http://admin:12345@localhost:5984/${id}`; // засекретить пароль
    const remoteDB = new PouchDB(remoteURL, { skip_setup: true });

    // 5. Синхронизация
    localDB.sync(remoteDB, {
        retry: true,
        live: true,
    }).on('error', (err) => {
        console.error("Sync error:", err);
    });

    return localDB;
}