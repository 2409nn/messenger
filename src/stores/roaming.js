import { defineStore } from "pinia";
import { ref } from "vue";

export const useRoamingData = defineStore("roaming", () => {

    const roaming = ref({
        chatsData: {}
    });

    function clearRoamingData() {
        // Очищаем весь объект сразу
        roaming.value = {
            chatsData: {}
        }
    }

    return { roaming, clearRoamingData };
}, {
    persist: true
});