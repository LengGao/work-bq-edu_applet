<template>
  <view class="sales-data">
    <view class="sales-data-item">
      <view class="sales-data-item-title">招生客户</view>
      <view class="sales-data-item-value">{{ data.zhaoShengRenShu || 0 }}</view>
    </view>
    <view class="sales-data-item">
      <view class="sales-data-item-title">渠道学生</view>
      <view class="sales-data-item-value">{{ data.quDaoRenShu || 0 }}</view>
    </view>
    <view class="sales-data-item">
      <view class="sales-data-item-title">招生订单</view>
      <view class="sales-data-item-value"
        >{{ priceFormat(data.zhaoShengDingdan)
        }}<text class="unit">{{
          unitFormat(data.zhaoShengDingdan)
        }}</text></view
      >
    </view>
    <view class="sales-data-item">
      <view class="sales-data-item-title">招生回款</view>
      <view class="sales-data-item-value"
        >{{ priceFormat(data.zhaoShengHuiKuan)
        }}<text class="unit">{{
          unitFormat(data.zhaoShengHuiKuan)
        }}</text></view
      >
    </view>
    <view class="sales-data-item">
      <view class="sales-data-item-title">招生入账</view>
      <view class="sales-data-item-value"
        >{{ priceFormat(data.zhaoShengRuZhang)
        }}<text class="unit">{{
          unitFormat(data.zhaoShengRuZhang)
        }}</text></view
      >
    </view>
    <view class="sales-data-item">
      <view class="sales-data-item-title">机构订单</view>
      <view class="sales-data-item-value"
        >{{ priceFormat(data.jiGouDingdan)
        }}<text class="unit">{{ unitFormat(data.jiGouDingdan) }}</text></view
      >
    </view>
    <view class="sales-data-item">
      <view class="sales-data-item-title">机构回款</view>
      <view class="sales-data-item-value"
        >{{ priceFormat(data.jiGouHuiKuan)
        }}<text class="unit">{{ unitFormat(data.jiGouHuiKuan) }}</text></view
      >
    </view>
    <view class="sales-data-item">
      <view class="sales-data-item-title">机构入账</view>
      <view class="sales-data-item-value"
        >{{ priceFormat(data.jiGouRuZhang)
        }}<text class="unit">{{ unitFormat(data.jiGouRuZhang) }}</text>
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
  .flex-c-b();
  flex-wrap: wrap;
  &-item {
    width: 25%;
    text-align: center;
    &:nth-of-type(-n + 4) {
      margin-bottom: 20rpx;
    }
    &-title {
      color: #999;
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
  }
}
</style>