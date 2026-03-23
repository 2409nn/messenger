import { defineStore } from "pinia";
import { ref } from "vue";

export const useRoamingData = defineStore("roaming", () => {

    const roaming = ref({});

    return { roaming };
}, {
    persist: true
});