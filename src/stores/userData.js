import { defineStore } from "pinia";
import { ref } from "vue";

export const userDataStore = defineStore("userData", () => {
    const userData = ref({
        uid: '',
        email: '',
        username: '',
        firstname: '',
        lastname: '',
    });

    function clearUserData() {
        // Очищаем весь объект сразу
        userData.value = {
            uid: '',
            email: '',
            username: '',
            firstname: '',
            lastname: '',
        };
    }

    return { userData, clearUserData };
}, {
    persist: true
});