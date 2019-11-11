<template>
  <div id="chat-app">
    <router-view />
  </div>
</template>


<script>
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import VueChatScroll from "vue-chat-scroll";

import App from "./App.vue";
import store from "./store/index";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/css/loading.css";
import "./assets/css/loading-btn.css";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueChatScroll);
export default {
  store
};
</script>