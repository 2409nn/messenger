// Здесь функции, отвечающие за первичную настройку связи между локальной и удаленной БД.

import PouchDB from 'pouchdb';
import { COUCHDB_URL, SYNC_OPTS } from './config.js';

export async function initLocalUserDB(uid, dbName) {
    // На сервере нам не нужна локальная копия PouchDB!
    // Мы просто работаем напрямую с CouchDB
    const password = '12345'; // засекретить
    const remoteURL = `http://${uid}:${password}@localhost:5984/${dbName}`; // Используй админские права на сервере
    const remoteDB = new PouchDB(remoteURL);

    // Просто проверяем, что база существует/создается
    try {
        await remoteDB.info();
        console.log(`[Server] База ${dbName} готова к работе.`);
    } catch (err) {
        console.error(`[Server] Ошибка при обращении к ${dbName}:`, err);
    }

    return remoteDB;
}

export function getDB(dbName) {
    return new PouchDB(dbName);
}

export async function getRemoteDB(dbName, uid) {
    // Стучимся на НАШ сервер, а не на CouchDB
    const url = `http://localhost:5005/sync/${dbName}`;

    return new PouchDB(url, {
        skip_setup: true,
        fetch: (url, opts) => {
            opts.headers = new Headers(opts.headers);
            // Передаем UID (или в будущем JWT токен)
            // Пароль знает ТОЛЬКО сервер в Express
            opts.headers.set('x-user-Id', uid);
            return PouchDB.fetch(url, opts);
        }
    });
}

export async function clearUserDatabases() {
    try {
        // Получаем список всех баз данных в браузере
        const dbs = await indexedDB.databases();

        // Фильтруем те, что начинаются на _pouch_db_
        const dbsToDelete = dbs.filter(db => db.name.includes('_pouch_local_db'));

        for (const dbInfo of dbsToDelete) {
            console.log(`Удаляю базу: ${dbInfo.name}`);
            indexedDB.deleteDatabase(dbInfo.name);
        }

        localStorage.clear();

        console.log("Очистка завершена успешно");
    } catch (error) {
        console.error("Ошибка при удалении баз:", error);
    }
}

