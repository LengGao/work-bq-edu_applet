<template>
  <view class="title" :class="customClass" :style="customStyle">
    <view class="title-value">{{ title }}</view>
    <view></view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    customClass: {
      type: String,
      default: "",
    },
    customStyle: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.title {
  padding: 0 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-value {
    color: #333;
    font-size: @font-size-md;
    &::before {
      display: inline-block;
      content: "";
      width: 8rpx;
      height: 30rpx;
      background-color: @primary;
      margin-right: 6rpx;
      margin-bottom: 6rpx;
      vertical-align: middle;
    }
  }
}
</style>