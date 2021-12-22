<template>
  <view class="sales-data">
    <view class="sales-data-item">
      <view class="sales-data-item-title">招生客户</view>
      <view class="sales-data-item-value">{{ data.customerNum || 0 }}</view>
    </view>
    <view class="sales-data-item">
      <view class="sales-data-item-title">招生订单</view>
      <view class="sales-data-item-value">{{ data.orderNum || 0 }}</view>
    </view>
    <view class="sales-data-item">
      <view class="sales-data-item-title">渠道学生</view>
      <view class="sales-data-item-value">{{
        data.channelCustomers || 0
      }}</view>
    </view>
    <view class="sales-data-item">
      <view class="sales-data-item-title">机构回款</view>
      <view class="sales-data-item-value">{{ data.channelOrder || 0 }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "SalesData",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.sales-data {
  .flex-c-b();
  &-item {
    &-title {
      color: #999;
      margin-bottom: 8rpx;
    }
    &-value {
      text-align: center;
      color: @primary;
      font-size: 36rpx;
    }
  }
}
</style>