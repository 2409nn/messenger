
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const cors = require('cors');
const { verifyUserAndRole, handleUserSync, initChatDB } = require('./db/firebaseBinder.cjs');
const { initLocalUserDB, getDB } = require('./db/auth.service.js');
const { COUCHDB_URL, ADMIN_AUTH, API_SERVER } = require('./db/config.js');
const { putUserProfile, getProfileById, getUserProfile, updateUserProfile } = require('./db/profile.service.js');
const {loadUserChats} = require("./db/chat.service.js");
const {sendMessage} = require("./db/chat.service.js");
const {fetchChatsProfile} = require("./db/sync.service.js");

const authHeaderAdmin = 'Basic ' + Buffer.from('admin:12345').toString('base64');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // адрес vue страницы
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(['/sync/:dbName', '/sync'], createProxyMiddleware({
    target: 'http://127.0.0.1:5984',
    changeOrigin: true,
    pathRewrite: { '^/sync': '' },
    onProxyReq: (proxyReq, req) => {
        // Достаем UID (проверь, чтобы во Vue было такое же имя!)
        const uid = req.headers['x-user-id'] || req.headers['x-auth-id'];

        if (!uid && req.params.dbName) {
            console.error("[PROXY] КРИТИЧЕСКАЯ ОШИБКА: UID не пришел в заголовках!");
        }

        const userPassword = '12345';
        // Обязательно .toLowerCase(), CouchDB не любит заглавные в именах юзеров
        const auth = 'Basic ' + Buffer.from(`${uid}:${userPassword}`).toString('base64');

        proxyReq.removeHeader('Authorization');
        proxyReq.removeHeader('cookie');

        proxyReq.setHeader('Authorization', auth);

        // console.log(`[PROXY] ${req.method} | User: ${uid} | Base: ${req.params.dbName || 'ROOT'}`);
    }
}));

app.use(express.json()); // чтобы сервер мог понимать json в теле запроса

// ---- Эндпоинты ----

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
        console.log("--- вызван запрос на /chat-create ---");

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
        userProfile.avatar = userData.avatar;

        await updateUserProfile(userProfile);

        res.status(200).json({
            status: "success",
            message: "Профиль обновлен",
        });

    } catch (error) {
        console.error(error);
    }
})

app.get('/find-user', async (req, res) => {
    try {

        const searchText = req.query.text;

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

app.post('/chats-load', async (req, res) => {

    const uid = req.body.uid;
    let chats = await loadUserChats(uid);

    console.log("user chats: ", chats);

    chats = chats.rows;

    const chatsData = {};

    for (let chatRow of chats) { // используем другое имя, чтобы не путаться

        const chat = chatRow.doc;

        for (let userId of chat.members_id) {

            console.log('userId: ', userId);

            const chatDB = await getDB(`http://admin:12345@localhost:5984/${chat._id}`);
            const userDB = await getDB(`http://admin:12345@localhost:5984/db_${userId}`);

            const interlocatorId = chat.members_id.find(id => id.toLowerCase() !== uid.toLowerCase());

            try {
                const db = await getUserProfile();
                const interlocatorProfile = await db.get(interlocatorId);

                try {
                    // 1. Берем актуальный "слепок" из базы конкретного чата
                    var chatMeta = await chatDB.get('last_message_metadata');

                    // 3. Пытаемся найти существующий документ в базе пользователя, чтобы узнать его _rev
                    try {
                        const existing = await userDB.get(`${chat._id}`.toLowerCase());

                        const userMetaDoc = {
                            ...existing,
                            lastMessage: {text: chatMeta.text, time: chatMeta.time, type: chatMeta.type},
                            unreadCount: chatMeta.unreadCount,
                            time: chatMeta.lastMessage?.time,
                            // Если нужно обновить профиль собеседника в этом же доке:
                            interlocatorInfo: interlocatorProfile
                        };

                        await userDB.put(userMetaDoc);

                    } catch (err) {
                        // Если документа нет (404) — это нормально, создадим новый без _rev
                    }

                    // 4. Сохраняем в базу пользователя

                    // В этот момент сработает твой ЕДИНЫЙ слушатель userDB.changes(),
                    // который обновит Proxy-объект chatStatusMap, и UI перерисуется!

                } catch (e) {
                    if (e.status === 404) {
                        console.log(`В чате ${chat._id} еще нет сообщений (метаданные отсутствуют)`);
                    } else {
                        console.error(e);
                        // console.error("Ошибка синхронизации метаданных:", e);
                    }
                }

                chatsData[chat._id] = {
                    chatInfo: interlocatorProfile,
                    lastMessage: chatMeta,
                    interlocatorId: interlocatorId
                };
            } catch (e) {
                console.error("Ошибка загрузки профиля:", interlocatorId, e);
            }
        }
    }

    return res.status(200).json({
        status: "success",
        chatsData: chatsData,
    })

})

app.get('/profile', async (req, res) => {

    if (!req.query.uid) {
        console.error("Не указан uid для запроса на /profile");
        return;
    }
    try {
        const uid = req.query.uid;
        const profile = await getProfileById(uid);

        return res.status(200).json({
            status: "success",
            profile: profile,
        })
    }
    catch (error) {
        console.error("Не удалось получить профиль пользователя: ", error);
    }
});

app.post('/send-message', async (req, res) => {
    const { dbName, uid, newMessage } = req.body;
    try {
        await sendMessage(dbName, uid, newMessage);

        return res.sendStatus(200);
    }
    catch (e) {
        console.error('Не удалось записать сообщение в базу: ', e)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});