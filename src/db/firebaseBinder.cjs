// Задачи файла: инициализировать админа и создать функцию для проверки токена, который пришлет фронтенд.
const nano = require('nano')("http://admin:12345@127.0.0.1:5984");

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

async function handleUserSync(uid) {
    // const uid = await verifyUserAndRole(idToken).uid;
    const password = "fuckingPassword123456";

    // регистрация на couchDB
    await registerInCouch(uid, password);

    // 3. Создаем личную базу
    const dbName = `db_${uid.toLowerCase()}`;
    try {
        await nano.db.create(dbName);

        // 4. Настраиваем СЕКЬЮРИТИ (Самое важное!)
        const db = nano.use(dbName);
        await db.setSecurity({
            admins: { names: ['admin'], roles: [] },
            members: { names: [uid], roles: [] } // Только этот юзер может войти
        });
    } catch (e) {
        // База уже есть - ок
    }

    return { dbName, password };
}

async function testConnection() {
    try {
        const info = await nano.info();
        console.log("Ура! Связь с CouchDB установлена. Версия:", info.version);
    } catch (err) {
        console.error("Ошибка! Проверь пароль или запущен ли CouchDB:", err.message);
    }
}

handleUserSync('RKC56Gh6WxO1MpSSpRxmj3aZLy52');

module.exports = { verifyUserAndRole, handleUserSync, admin };