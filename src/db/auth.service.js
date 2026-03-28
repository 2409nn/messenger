// Здесь функции, отвечающие за первичную настройку связи между локальной и удаленной БД.

import PouchDB from 'pouchdb';
import { COUCHDB_URL, SYNC_OPTS } from './config.js';

export async function initLocalUserDB(uid, dbName, password) {
    const localDB = new PouchDB('local_user_db');
    const remoteURL = `http://${encodeURIComponent(uid)}:${encodeURIComponent(password)}@localhost:5984/${dbName}`;
    const remoteDB = new PouchDB(remoteURL, { skip_setup: true });

    localDB.sync(remoteDB, SYNC_OPTS)
        .on('change', (info) => console.log('Данные обновились:', info))
        .on('paused', (err) => console.log('Синхронизация приостановлена'))
        .on('error', (err) => console.error('Ошибка синхронизации:', err));

    return localDB;
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