<template>
  <view :class="['seal', `seal--${type}`]">
    <view class="seal-body"> <slot></slot> </view>
  </view>
</template>

<script>
export default {
  props: {
    type: String,
    default: "warning",
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.seal {
  width: 160rpx;
  height: 160rpx;
  padding: 4rpx;
  position: absolute;
  right: 40rpx;
  top: 40rpx;
  border: 4rpx solid #000;
  border-radius: 50%;
  z-index: 200;
  &-body {
    width: 100%;
    height: 100%;
    .flex-c-c();
    border: 3rpx dashed #000;
    border-radius: 50%;
    transform: rotate(-30deg);
    font-size: @font-size-md;
  }
  &--success {
    color: @success;
    border-color: @success;
    .seal-body {
      border-color: @success;
    }
  }
  &--warning {
    color: @warning;
    border-color: @warning;
    .seal-body {
      border-color: @warning;
    }
  }
}
</style>