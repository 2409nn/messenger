import emailjs from '@emailjs/browser';
import { db } from "../db/firebaseDB.js"

const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};


export const sendCodeToEmail = async (email, uid) => {
    const verificationCode = generateCode(); // Создаем код

    try {
        await emailjs.send(
            'service_8rbl13n',
            'template_f24wjhe',
            {
                to_email: email,
                verification_code: verificationCode, // Передаем сгенерированный код
            },
            'QjoW_-j0AvIA09Gbp'
        );

        console.log("Код отправлен на почту!");
        console.log(verificationCode);

        await db.addCode(verificationCode, uid);

    } catch (error) {
        console.error("Ошибка отправки:", error);
    }
}