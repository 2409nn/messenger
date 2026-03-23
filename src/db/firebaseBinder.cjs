// Задачи файла: инициализировать админа и создать функцию для проверки токена, который пришлет фронтенд.
const nano = require('nano')("http://admin:12345@localhost:5984"); // засекретить пароль

var admin = require("firebase-admin");
var serviceAccount = require("../API/nuclear-abf45-firebase-adminsdk-fbsvc-7dd90feb51.json");

// инициализация админа
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

/**
 * Проверяет токен и возвращает данные пользователя, включая его роль.
 * @param {string} idToken
 */

async function verifyUserAndRole(idToken) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Проверяем, есть ли у пользователя флаг админа
        if (decodedToken.admin === true) {
            console.log("Это администратор приложения!");
        }

        return {
            uid: decodedToken.uid,
            isAdmin: !!decodedToken.admin // вернет true или false
        };
    } catch (error) {
        throw new Error("Ошибка авторизации");
    }
}

async function registerInCouch(uid, password) {
    const login = await nano.auth('admin', '12345');
    const usersDb = nano.use('_users'); // Системная база пользователей
    const userDocId = `org.couchdb.user:${uid}`; // ID должен быть именно в таком формате

    try {
        await usersDb.insert({
            _id: userDocId,
            name: uid,
            password: password, // CouchDB сама его захеширует
            roles: [],
            type: 'user'
        });
        console.log(`Пользователь ${uid} успешно зарегистрирован в CouchDB`);
    } catch (error) {
        if (error.statusCode === 409) {
            console.log("Пользователь уже существует");
        } else {
            throw error;
        }
    }
}

async function handleUserSync(idToken) {
    const userData = await verifyUserAndRole(idToken);
    const uid = userData.uid;
    const password = "12345"; // засекретить пароль

    // регистрация на couchDB
    await registerInCouch(uid, password);

    // Создаем личную базу
    const dbName = `db_${uid.toLowerCase()}`;
    try {
        await nano.db.create(dbName);

        const db = nano.use(dbName);

        const securityDoc = {
            admins: { names: ['admin'], roles: [] },
            members: { names: [uid], roles: [] }
        };

        // Отправляем PUT запрос прямо на /db_name/_security
        // nano.request — это универсальный способ достучаться до любого API CouchDB
        await nano.request({
            db: dbName,
            path: '_security',
            method: 'PUT',
            body: securityDoc
        });
    } catch (e) {
        if (e.reason === 'The database could not be created, the file already exists.') {
            console.log(`ℹ️ База ${dbName} уже существует, идем дальше.`);
        } else {
            // ЕСЛИ ТУТ ВЫЛЕТИТ "You are not a server admin", значит логин/пароль в шапке файла неверные
            console.error(`❌ Ошибка создания базы ${dbName}:`, e.reason || e.message);
            throw e;
        }
    }

    return { dbName, password };
}

async function createChatDB(idToken, dbName, uids) {
    const userData = await verifyUserAndRole(idToken);
    const uid = userData.uid;
    const password = "12345"; // засекретить пароль

    // регистрация на couchDB
    await registerInCouch(uid, password);
    try {
        await nano.db.create(dbName);

        const db = nano.use(dbName);

        const securityDoc = {
            admins: { names: ['admin'], roles: [] },
            members: { names: uids, roles: [] }
        };

        // Отправляем PUT запрос прямо на /db_name/_security
        // nano.request — это универсальный способ достучаться до любого API CouchDB
        await nano.request({
            db: dbName,
            path: '_security',
            method: 'PUT',
            body: securityDoc
        });
    } catch (e) {
        if (e.reason === 'The database could not be created, the file already exists.') {
            console.log(`ℹ️ База ${dbName} уже существует, идем дальше.`);
        } else {
            // ЕСЛИ ТУТ ВЫЛЕТИТ "You are not a server admin", значит логин/пароль в шапке файла неверные
            console.error(`❌ Ошибка создания базы ${dbName}:`, e.reason || e.message);
            throw e;
        }
    }
}

module.exports = { verifyUserAndRole, handleUserSync, createChatDB, admin };