<template>
  <view class="">
    <view class="sales-data">
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-1">{{ data.recruitStudentNum || 0 }}</view>
        <view class="sales-data-item-title">招生客户</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-2">
          {{ priceFormat(data.recruitOrderMoney )}}
          <text class="unit">{{ unitFormat(data.recruitOrderMoney )}}</text>
        </view>
        <view class="sales-data-item-title">招生订单</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-3">
          {{ priceFormat(data.recruitTuitionMoney )}}
          <text class="unit">{{ unitFormat(data.recruitTuitionMoney) }}</text>
        </view>
        <view class="sales-data-item-title">招生学费</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-4">
          {{ priceFormat(data.recruitOtherMoney) }}
          <text class="unit">{{ unitFormat(data.recruitOtherMoney) }}</text>
        </view>
        <view class="sales-data-item-title">其他回款</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-1">
          {{ priceFormat(data.recruitPayMoney) }}
          <text class="unit">{{ unitFormat(data.recruitPayMoney)}}</text>
        </view>
        <view class="sales-data-item-title">招生回款</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-2">
          {{ priceFormat(data.recruitEntryMoney) }}
          <text class="unit">{{ unitFormat(data.recruitEntryMoney) }}</text>
        </view>
        <view class="sales-data-item-title">招生入账</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-3">
          {{ priceFormat(data.recruitRefundMoney) }}
          <text class="unit">{{ unitFormat(data.recruitRefundMoney) }}</text>
        </view>
        <view class="sales-data-item-title">招生退款作废</view>
      </view>
    </view>

    <view class="hr"></view>

    <view class="sales-data">
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-1">{{ data.orgStudentNum || 0 }}</view>
        <view class="sales-data-item-title">机构学生</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-2">
          {{ priceFormat(data.orgOrderMoney) }}
          <text class="unit">{{ unitFormat(data.orgOrderMoney) }}</text>
        </view>
        <view class="sales-data-item-title">机构订单</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-3">
          {{ priceFormat(data.orgTuitionMoney)}}
          <text class="unit">{{ unitFormat(data.orgTuitionMoney) }}</text>
        </view>
        <view class="sales-data-item-title">机构学费</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-4"
          >{{ priceFormat(data.orgOtherMoney) }}
          <text class="unit">{{ unitFormat(data.orgOtherMoney) }}</text>
        </view>
        <view class="sales-data-item-title">其他回款</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-1">
          {{ priceFormat(data.orgPayMoney)}}
          <text class="unit">{{ unitFormat(data.orgPayMoney) }}</text>
        </view>
        <view class="sales-data-item-title">机构回款</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-2"
          >{{ priceFormat(data.orgEntryMoney) }}
          <text class="unit">{{ unitFormat(data.orgEntryMoney) }}</text>
        </view>
        <view class="sales-data-item-title">机构入账</view>
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
  &-item {
    width: 25%;
    text-align: center;
    &:nth-of-type(-n + 4) {
      margin-bottom: 20rpx;
    }
    &-title {
      color: #999;
      font-size: @font-size-sm;
      margin-bottom: 8rpx;
    }
    &-value {
      text-align: center;
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