import { defineStore } from "pinia";
import { ref } from "vue";

export const userDataStore = defineStore("userData", () => {
    // 1. Данные, которые МОЖНО сохранять (строки, цифры)
    const userData = ref({
        uid: '',
        email: '',
        username: '',
        firstname: '',
        lastname: '',
    });

    return { userData };
}, {
    persist: true // Плагин сам сохранит всё, что есть в return
});