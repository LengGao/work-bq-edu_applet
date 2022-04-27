<template>
  <view class="">
    <view class="sales-data">
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-1">{{ data.orgNum || 0 }}</view>
        <view class="sales-data-item-title">合作机构 </view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-2">{{ data.orgStudentNum || 0 }}</view>
        <view class="sales-data-item-title">新增学生 </view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-itm-evalue-3">
          {{ priceFormat(data.orgOrderMoney )}}
          <text class="unit">{{ unitFormat(data.orgOrderMoney) }}</text>
        </view>
        <view class="sales-data-item-title">订单金额</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-4">
          {{ priceFormat(data.orgTuitionMoney) }}
          <text class="unit">{{ unitFormat(data.orgTuitionPayMoney) }}</text>
        </view>
        <view class="sales-data-item-title">学费回款</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-1">
          {{ priceFormat(data.orgOtherMoney) }}
          <text class="unit">{{ unitFormat(data.orgOtherPayMoney) }}</text>
        </view>
        <view class="sales-data-item-title">其他回款</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-2">
          {{ priceFormat(data.orgEntryMoney) }}
          <text class="unit">{{ unitFormat(data.orgEntryMoney) }}</text>
        </view>
        <view class="sales-data-item-title">入账金额</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-3">
          {{ priceFormat(data.orgRefundMoney) }}
          <text class="unit">{{ unitFormat(data.orgRefundMoney) }}</text>
        </view>
        <view class="sales-data-item-title">退款作废</view>
      </view>
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
  methods: {
    unitFormat(val) {
      return val >= 10000 ? "万元" : "元";
    },
    priceFormat(val) {
      if (!val) {
        return `0.00`;
      }
      if (val / 10000 >= 1) {
        return (val / 10000).toFixed(3).slice(0, -1);
      }
      return (+val).toFixed(2);
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.sales-data {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  height: auto;
  &-item {
    width: 25%;
    height: auto;
    overflow: visible;
    text-align: left;
    &:nth-of-type(-n + 4) {
      margin-bottom: 20rpx;
    }
    &-title {
      color: #999;
      font-size: @font-size-sm;
      margin-bottom: 8rpx;
    }
    &-value {
      color: @primary;
      font-size: @font-size-md;
      .unit {
        font-size: @font-size-xs;
      }
    }

    &-value-1 {
      color: #199fff;
    }

    &-value-2 {
      color:  #39c327 ;
    }

    &-value-3 {
      color: #e2af00;
    }
    &-value-4 {
      color: #fd6500;
    }
  }  
}

.hr {
  display: block;
  width: 100%;
  height: 2rpx;
  margin: 24rpx 0rpx;
  background-color: #ebedf0;
}
</style>