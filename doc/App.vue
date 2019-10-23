<template>
  <div>
    1111111
    <smile-swipe class="demo" :autoplay="3000">
        <smile-swipe-item>1</smile-swipe-item>
        <smile-swipe-item>2</smile-swipe-item>
        <smile-swipe-item>3</smile-swipe-item>
    </smile-swipe>
    <smile-frame :time="15 * 1000" ></smile-frame>
  </div>
</template>
<script>
import Index from "./components/index";
import Tag from "../src/tag";
import Swipe from '../src/swipe';
import SwipeItem from '../src/swipe-item';
import Frame from '../src/requestAnimationFrame';

console.log(Tag);
console.log(Swipe);
export default {
  components: {
    [Tag.name]: Tag,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Frame.name]: Frame,
    Index
  }
};
</script>
<style lang="less" scoped>
.demo {
  
    height: 150px;
}
</style>