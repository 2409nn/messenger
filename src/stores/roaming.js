import { defineStore } from "pinia";
import { ref } from "vue";

export const useRoamingData = defineStore("roaming", () => {

    const roaming = ref({
        chatsData: {}
    });

    return { roaming };
}, {
    persist: true
});