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
        <view class="sales-data-item-title">退款作废</view>
      </view>
      <!-- <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-4">
          {{ priceFormat(data.recruitWebsiteMoney) }}
          <text class="unit">{{ unitFormat(data.recruitWebsiteMoney) }}</text>
        </view>
        <view class="sales-data-item-title">招生官网缴费订单金额</view>
      </view> -->
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-1">
          {{ priceFormat(data.recruitWebsitePayMoney) }}
          <text class="unit">{{ unitFormat(data.recruitWebsitePayMoney) }}</text>
        </view>
        <view class="sales-data-item-title">官网回款</view>
      </view>
    </view>

    <view class="hr"></view>

    <view class="sales-data">
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-1">{{ orgData.orgStudentNum || 0 }}</view>
        <view class="sales-data-item-title">机构学生</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-2">
          {{ priceFormat(orgData.orgOrderMoney) }}
          <text class="unit">{{ unitFormat(orgData.orgOrderMoney) }}</text>
        </view>
        <view class="sales-data-item-title">机构订单</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-3">
          {{ priceFormat(orgData.orgTuitionMoney)}}
          <text class="unit">{{ unitFormat(data.orgTuitionMoney) }}</text>
        </view>
        <view class="sales-data-item-title">机构学费</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-4"
          >{{ priceFormat(orgData.orgOtherMoney) }}
          <text class="unit">{{ unitFormat(data.orgOtherMoney) }}</text>
        </view>
        <view class="sales-data-item-title">其他回款</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-1">
          {{ priceFormat(orgData.orgPayMoney)}}
          <text class="unit">{{ unitFormat(orgData.orgPayMoney) }}</text>
        </view>
        <view class="sales-data-item-title">机构回款</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-2"
          >{{ priceFormat(orgData.orgEntryMoney) }}
          <text class="unit">{{ unitFormat(orgData.orgEntryMoney) }}</text>
        </view>
        <view class="sales-data-item-title">机构入账</view>
      </view>
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-3">
          {{ priceFormat(orgData.orgRefundMoney) }}
          <text class="unit">{{ unitFormat(orgData.orgRefundMoney) }}</text>
        </view>
        <view class="sales-data-item-title">退款作废</view>
      </view>
      <!-- <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-4">
          {{ priceFormat(data.orgWebsiteMoney) }}
          <text class="unit">{{ unitFormat(data.orgWebsiteMoney) }}</text>
        </view>
        <view class="sales-data-item-title">官网缴费订单</view>
      </view> -->
      <view class="sales-data-item">
        <view class="sales-data-item-value sales-data-item-value-1">
          {{ priceFormat(orgData.orgWebsitePayMoney) }}
          <text class="unit">{{ unitFormat(orgData.orgWebsitePayMoney) }}</text>
        </view>
        <view class="sales-data-item-title">官网回款</view>
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
    orgData: {
      type: Object,
      default: () => ({}),
    }
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
  align-items: flex-start;
  flex-wrap: wrap;
  &-item {
    width: 25%;
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