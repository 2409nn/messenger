// Этот файл поднимает сервер (пока что локальный) чтобы выполнить этот порядок действий:
//

const express = require('express');
const cors = require('cors');
const { verifyUserAndRole, handleUserSync } = require('./db/firebaseBinder.cjs');

const app = express();
app.use(cors());
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


const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});