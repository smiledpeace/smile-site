<template>
  <div>
    <!-- 使用 x 表示 box -->
    <div class="input-fill-x">
      <input class="input-fill" placeholder="邮箱" />
      <label class="input-label">邮箱</label>
    </div>

    <div class="input-fill-x">
      <input class="outline-fill" placeholder="邮箱" />
      <label class="outline-label">邮箱</label>
    </div>
    <Smile-frame></Smile-frame>
  </div>
</template>
<script>
import SmileFrame from '../../../src/requestAnimationFrame/index'
export default {
  components: {
    SmileFrame
  }
};
</script>
<style lang="less" scoped>
// :placeholder-shown 选取所有 显示placeholder 的元素
.input-fill::placeholder {
  color: transparent;
}
.input-fill-x {
    position: relative;
    width: fit-content;
    &:after {
        content: ' ';
        position: absolute;
        border-bottom: 2px solid #999;
        bottom: -1px;
        left: 0;
        right: 0;
        transform: scaleX(0);
        transition: transform .3s ease;
    }
    &:focus-within:after {
        transform: scaleX(1)
    }
}
.input-fill {
    padding: 20px 16px 6px;
    background: #f4f5f6;
    border: 1px solid transparent;
    &:focus {
        outline: none;
    }
}
.input-label {
    position: absolute;
    left: 16px;
    top: 14px;
    color: #b3b4b5;
    transition: all .3s ease;
}
.input-fill:focus + .input-label {
    transform: scale(0.75) translate( -4px, -20px);
    color: #999;
}
</style>