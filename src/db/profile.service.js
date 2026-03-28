// Все, что касается профилей, аватаров и данных участников.

import PouchDB from 'pouchdb';
import { COUCHDB_URL, ADMIN_AUTH, POUCH_OPTS } from './config.js';
import { getRemoteDB } from "./auth.service.js";

export async function putUserProfile(profile) {
    const remoteURL = `http://${ADMIN_AUTH}@localhost:5984/user_profiles`;
    const remoteDB = new PouchDB(remoteURL, POUCH_OPTS);

    try {
        await remoteDB.put(profile);
    } catch(err) {
        console.error('Ошибка сохранения профиля:', err);
    }
}

export async function getUserProfile() {
    const remoteURL = `${COUCHDB_URL}/user_profiles`;
    return new PouchDB(remoteURL, POUCH_OPTS);
}

export async function getProfileById(uid) {
    const password = '12345'; // В идеале передавать как аргумент
    const remoteURL = `http://${uid}:${password}@localhost:5984/user_profiles`;
    return await new PouchDB(remoteURL, POUCH_OPTS).get(uid);
}

export async function updateUserProfile(uid, updatedDoc) {
    const password = '12345';
    const remoteURL = `http://@localhost:5984/user_profiles`;
    const remoteDB = getRemoteDB(remoteURL);
    const db = PouchDB(remoteURL, POUCH_OPTS)
    const { avatar, ...docToSave } = updatedDoc;

    const response = await db.put(docToSave);

    if (avatar) {
        await db.putAttachment(
            updatedDoc._id,
            'avatar.jpg',
            response._rev,
            avatar,
            'image/jpeg'
        );
    }

    await db.put(updatedDoc);
}