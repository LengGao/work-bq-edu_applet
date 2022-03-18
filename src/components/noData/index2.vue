<template>
  <view class="no-data">
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
    display: flex;
    flex-direction: column;
    align-items: center;
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