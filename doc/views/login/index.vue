<template>
  <div class="login-x">
    <!-- 使用 x 表示 box -->
    <div class="login-logo">
      <img class="login-logo--img" src="doc/assets/logo.jpg" alt="">
    </div>
    <div class="input-fill-x">
      <input class="input-fill" placeholder="账号" />
      <label class="input-label">账号</label>
    </div>
    <div class="input-fill-x">
      <input @keyup.enter="submit" class="input-fill" placeholder="密码" type="password"/>
      <label class="input-label">密码</label>
    </div>

    <button class="login-btn" @click="submit">
      <span class="login-btn--span">登录</span>
    </button>
  </div>
</template>
<script>
import SmileFrame from '../../../src/requestAnimationFrame/index'
export default {
  components: {
    SmileFrame
  },
  methods: {
    submit() {
      this.$router.push('/list');
    }
  }
};
</script>