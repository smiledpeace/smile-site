import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const List = () => import(/* webpackChunkName: "list" */ '../views/list/index.vue');
const Detail = () => import(/* webpackChunkName: "detail" */ '../views/detail/index.vue');
const Login = () => import(/* webpackChunkName: "login" */ '../views/login/index.vue');
const Chat = () => import(/* webpackChunkName: "login" */ '../views/chat/App.vue');
const ChatLogin = () => import(/* webpackChunkName: "login" */ '../views/chat/views/Login.vue');
const ChatDashboard = () => import(/* webpackChunkName: "login" */ '../views/chat/views/ChatDashboard.vue');
const Element = () => import(/* webpackChunkName: "login" */ '../views/element/index.vue');
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
    {
        path: "/chat",
        component: Chat,
        children: [
            {
                path: '/',
                name: 'login',
                component: ChatLogin
              },
              {
                path: 'chat',
                name: 'chat',
                component: ChatDashboard,
              }
        ]
    },
    {
        path: "/element",
        component: Element,
    },
    
];

const router = new VueRouter({
    routes
});

export default router;

