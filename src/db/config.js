// базовые URL и общие параметры, чтобы не дублировать их в каждом файле.

// Проверяем, где мы находимся: в Node.js или в браузере (Vite)
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

// Достаем пароль в зависимости от среды
const adminPassword = isNode
    ? process.env.VITE_ADMIN_PASSWORD  // Для бэкенда (Node)
    : import.meta.env.VITE_ADMIN_PASSWORD; // Для фронтенда (Vite)

export const API_SERVER = isNode
    ? process.env.SERVER
    : import.meta.env.VITE_SERVER

export const COUCHDB_URL = 'http://localhost:5984';
export const ADMIN_AUTH = `admin:${adminPassword}`;

export const POUCH_OPTS = {
    skip_setup: true
};

export const SYNC_OPTS = {
    live: true,
    retry: true
};