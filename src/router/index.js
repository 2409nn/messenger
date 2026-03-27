import { createRouter, createWebHistory } from "vue-router"
import home from "../views/home.vue"
import reg from "../views/reg.vue"

const routes = [
    {
      path: "/",
      name: "home",
      component: home,
    },
    {
        path: "/reg",
        name: "reg",
        component: reg,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;