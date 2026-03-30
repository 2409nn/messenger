import emailjs from '@emailjs/browser';
import { db } from "../db/firebaseDB.js"

const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};


export const sendCodeToEmail = async (email) => {
    const verificationCode = generateCode(); // Создаем код

    console.log('email: ', email);

    try {
        await emailjs.send(
            'service_6uss6gs',
            'template_ndcqm6y',
            {
                to_email: email,
                passcode: verificationCode, // Передаем сгенерированный код
            },
            '1J2ttkNrIXd68QRNB'
        );

        localStorage.setItem("codeCreatedAt", Date.now());
        await db.addCode(verificationCode, email);

    } catch (error) {
        console.error("Ошибка отправки:", error);
    }
}