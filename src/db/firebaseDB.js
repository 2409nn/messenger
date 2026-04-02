import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    query,
    where,
    getDoc,
    Timestamp,
    getDocs as getQueryDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {
    getAuth,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { firebaseConfig } from "../workers/firebase.js";

// На основе уникального fbConfig запускается приложение.
// С помощью функции getFirestore, мы получаем базу данных приложения.

export class DataBase {
    constructor(fbConfig) {
        this.fbConfig = fbConfig;
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app);
    }

    // возвращает id пользователя по email
    async getUserByEmail(email) {
        try {
            const usersRef = collection(this.db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getQueryDocs(q);

            if (querySnapshot.empty) {return null;} // Нет такого пользователя

            // Если пользователь найден, возвращаем первый документ
            const userDoc = querySnapshot.docs[0];
            return {
                id: userDoc.id,
                ...userDoc.data()
            };
        } catch (e) {
            console.error("Ошибка при поиске пользователя по email:", e);
            return null;
        }
    }

    // получает данные о пользователе из базы данных, обращаясь к документу через userId
    async getUserInfo(userId){
        try {
            const userRef = doc(this.db, "users", userId);
            const userInfo = await getDoc(userRef);
            return userInfo.data();

        }catch(e) {
            console.error(e);
        }
    }

    // сохранение пользователя в базу данных
    async addUser(username, email, firstname, lastname, userId) {
        try {
            const userRef = doc(this.db, "users", userId);
            await setDoc(userRef, {
                username,
                email,
                firstname,
                lastname,
                couch_db_name: `user_db_${userId}`,

                createdAt: new Date()
            });
            // console.log(`Пользователь добавлен с ID: ${userId}`);
            localStorage.setItem("uid", userId);
            return userId;

        } catch (e) {
            console.error("Ошибка при добавлении пользователя:", e);
            return null;
        }
    }

    // сохранение временного кода в базу данных
    async addCode(code, email) {
        try {
            const codeRef = doc(this.db, "codes", email);
            await setDoc(codeRef, {
                code,
                email
            })
        } catch (error) {
            console.error("Ошибка при сохранения кода:", error);
        }
    }

    async getCode(email) {
        try {
            const codeRef = doc(this.db, "codes", email);
            const codeSnapshot = await getDoc(codeRef);

            if (!codeSnapshot.exists()) {return null;} // Нет такого пользователя

            // Если пользователь найден, возвращаем первый документ
            return codeSnapshot.data();

        } catch (e) {
            console.error("Ошибка при поиске пользователя по email:", e);
            return null;
        }
    }

    // получение всех пользователей в базе данных
    async getUsers() {
        return getDocs(collection(this.db, "users"));
    }

    // Получение ID текущего пользователя
    getCurrentUserId() {
        const user = this.auth.currentUser;
        if (user) {
            return user.uid; // UID из Firebase Authentication
        } else {
            console.warn("Пользователь не авторизован");
            return null;
        }
    }

    // Изменение данных о пользователе
    async updateUser(userId, newData) {
        try {
            const userRef = doc(this.db, "users", userId);
            await updateDoc(userRef, newData);
        } catch (e) {
            alert("Ошибка при обновлении пользователя");
            console.error("Ошибка при обновлении пользователя:", e);
        }
    }

}

export const db = new DataBase(firebaseConfig);