<template>
  <view class="no-data" :style="{ top }">
    <image class="img" src="../../static/no-data.png"></image>
    <view class="text"><slot>暂无数据</slot></view>
  </view>
</template>
<script>
export default {
  name: "noData",
  props: {
    top: {
      type: String,
      default: "30%",
    },
  },
};
</script>
<style lang="less" scoped>
@import "@/styles/var";
.no-data {
  position: absolute;
  top: 30%;
  left: 0;
  width: 100%;
  height: 300rpx;
  text-align: center;
  .img {
    width: 280rpx;
    height: 264rpx;
  }
  .text {
    margin-top: 40rpx;
    color: #999;
  }
}
</style>