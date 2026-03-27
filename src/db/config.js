// базовые URL и общие параметры, чтобы не дублировать их в каждом файле.

export const COUCHDB_URL = 'http://localhost:5984';
export const ADMIN_AUTH = 'admin:12345';
export const API_SERVER = 'http://localhost:5005';

export const POUCH_OPTS = {
    skip_setup: true
};

export const SYNC_OPTS = {
    live: true,
    retry: true
};