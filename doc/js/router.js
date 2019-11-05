import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const List = () => import(/* webpackChunkName: "list" */ '../views/list/index.vue');
const Detail = () => import(/* webpackChunkName: "detail" */ '../views/detail/index.vue');
const Login = () => import(/* webpackChunkName: "login" */ '../views/login/index.vue');
// console.log(List);

const routes = [
    {
        path: "/list",
        component: List
    },
    {
        path: "/detail",
        component: Detail
    },
    {
        path: "/",
        component: Login
    },
    
];

const router = new VueRouter({
    routes
});

export default router;

