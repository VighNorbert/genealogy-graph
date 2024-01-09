import {createRouter, createWebHistory} from 'vue-router'
import VisControls from "@/components/VisControls.vue";

const routes = [
    {
        path: '/',
        name: 'viz',
        component: VisControls,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const title = to.meta.title;
    if (title) {
        document.title = 'GeneoViz - ' + title;
    } else {
        document.title = 'GeneoViz';
    }
    next();
})

export default router
