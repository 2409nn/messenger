import PouchDB from 'pouchdb-browser';

export function initLocalUserDB(uid, dbName, password) {
    const localDB = new PouchDB('local_user_db');
    const remoteURL = `http://${uid}:${password}/${uid}@localhost:5005/${dbName}`;
    const remoteDB = new PouchDB(remoteURL); // подключение к удаленной базе данных

    localDB.sync(remoteDB, {
        live: true, // мгновенная синхронизация
        retry: true, // повторять попытку если связь оборвется

    }).on('change', (info) => console.log('Данные обновились:', info))
        .on('paused', (err) => console.log('Синхронизация приостановлена'))
        .on('error', (err) => console.error('Ошибка синхронизации:', err));

    return localDB;
}