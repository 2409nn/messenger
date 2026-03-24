// Этот файл поднимает сервер (пока что локальный) чтобы выполнить этот порядок действий:
//

const express = require('express');
const cors = require('cors');
const { verifyUserAndRole, handleUserSync, initChatDB } = require('./db/firebaseBinder.cjs');

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
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).send("Токен отсутствует");
        }

        // Вызываем твою магическую цепочку
        // ВАЖНО: Передаем idToken в handleUserSync
        const result = await handleUserSync(idToken);

        // Отправляем фронтенду данные для подключения к PouchDB
        res.json({
            status: "success",
            dbName: result.dbName,
            password: result.password // Тот самый фиксированный пароль
        });

    } catch (error) {
        console.error("Ошибка на сервере:", error);
        res.status(401).send("Ошибка авторизации или создания базы");
    }
});

app.post('/chat-create', async (req, res) => {
    try {
        console.log("--- Запрос на создание чата получен ---");

        // 1. Достаем чистый токен
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
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

const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});