
const express = require('express');
const cors = require('cors');
const { verifyUserAndRole, handleUserSync, initChatDB } = require('./db/firebaseBinder.cjs');
const { initLocalUserDB } = require('./db/auth.service.js');
const { putUserProfile } = require('./db/profile.service.js');
const { COUCHDB_URL, ADMIN_AUTH, API_SERVER } = require('./db/config.js');
const { getProfileById, getUserProfile, updateUserProfile } = require('./db/profile.service.js');

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Адрес твоего Vue (уточни порт!)
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // чтобы сервер мог понимать json в теле запроса

// Главный эндпоинт для синхронизации

app.post('/auth-sync', async (req, res) => {
    try {
        const { idToken, user, userData } = req.body;

        if (!idToken) {
            return res.status(400).send("Токен отсутствует");
        }

        const result = await handleUserSync(idToken);
        const password = '12345' // засекретить пароль

        await initLocalUserDB(user.uid, `db_${user.uid.toLowerCase()}`, password);
        await putUserProfile(
            {_id: user.uid, username: userData.username, firstname: userData.firstname, lastname: userData.lastname},
        );

        // Отправляем фронтенду данные для подключения к PouchDB
        res.json({
            status: "success",
            dbName: result.dbName,
            password: result.password
        });

    } catch (error) {
        console.error("Ошибка на сервере:", error);
        res.status(401).send("Ошибка авторизации или создания базы");
    }
});

app.post('/login', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).send("Токен отсутствует");
    }

    const result = await handleUserSync(idToken);

    res.json({
        status: "success",
        dbName: result.dbName,
        password: result.password
    });

})

app.post('/chat-create', async (req, res) => {
    try {
        console.log("--- Запрос на создание чата получен ---");

        // 1. Достаем чистый токен
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.log("Нет токена")
            return res.status(401).json({ error: "No token provided" });
        }

        const { id, uids } = req.body;
        console.log(`Создаю чат ID: ${id} для пользователей: ${uids}`);

        // 2. Ждем выполнения функции создания БД
        await initChatDB(token, id, uids);

        // 3. ОБЯЗАТЕЛЬНО отправляем ответ клиенту
        res.status(200).json({
            status: "success",
            message: "Database created",
        });


    } catch (error) {
        console.error("Ошибка при initChatDB:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.put('/update-profile', async (req, res) => {

    const userData = req.body;

    // обновление в pouchDB
    try {
        const userProfile = await getProfileById(userData.uid);
        userProfile.firstname = userData.firstname;
        userProfile.lastname = userData.lastname;
        userProfile.username = userData.username;
        userProfile.bio = userData.bio;
        // userProfile.avatar = userData.avatar; // доделать сохранение аватара

        await updateUserProfile(userProfile);

        res.status(200).json({
            status: "success",
            message: "Database created",
        });

    } catch (error) {
        console.error(error);
    }
})

// 1. Меняем на работу с Query параметрами (например: /find-user?text=admin)
app.get('/find-user', async (req, res) => {
    try {

        const searchText = req.query.text; // Данные берем из req.query, так как это GET запрос

        if (!searchText) {
            return res.status(400).json({ error: "Search text is required" });
        }

        const db = await getUserProfile();

        // Поиск в базе
        const searchResults = await db.query('users/by_username', {
            startkey: searchText.toLowerCase(),
            endkey: searchText.toLowerCase() + '\ufff0',
            include_docs: true
        });

        const docs = searchResults.rows.map(row => row.doc);

        console.log('docs: ', docs);

        // Отправляем ОДИН ответ, объединяя данные, если нужно
        return res.status(200).json({
            status: "success",
            users: docs,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});