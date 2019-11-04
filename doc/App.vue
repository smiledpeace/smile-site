<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
import router from './js/router';
console.log(router);

export default {
  name: "App",
  router
};

</script>