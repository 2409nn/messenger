// Все, что касается профилей, аватаров и данных участников.

import PouchDB from 'pouchdb';
import { COUCHDB_URL, ADMIN_AUTH, POUCH_OPTS } from './config.js';
import dotenv from 'dotenv';
import { getRemoteDB } from "./auth.service.js";

dotenv.config();

const USER_PASSWORD = process.env.USER_PASSWORD;

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
    const remoteURL = `http://${uid}:${USER_PASSWORD}@localhost:5984/user_profiles`;
    return await new PouchDB(remoteURL, POUCH_OPTS).get(uid);
}

export async function updateUserProfile(uid, updatedDoc) {
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