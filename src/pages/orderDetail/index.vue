<template>
  <view class="order-detail">
    <view class="order-detail-header">
      <view class="order-detail-header-title"
        >{{ detailData.surname || "" }}-{{
          detailData.project_name || ""
        }}</view
      >
      <view class="order-detail-header-other"
        >{{ detailData.create_time || "" }} |
        <text style="color: #fd6500; margin-left: 10rpx">{{
          detailData.order_money | moneyFormat
        }}</text></view
      >
    </view>
    <van-steps :steps="steps" active-color="#199fff" :active="active" />
    <van-tabs color="#199fff" animated swipeable>
      <van-tab title="订单信息">
        <OrderInfo :data="detailData" />
      </van-tab>
      <van-tab title="回款记录">
        <PayRecord :data="detailData" />
      </van-tab>
      <van-tab title="审批记录">
        <ApproveRecord :data="detailData" />
      </van-tab>
    </van-tabs>
  </view>
</template>

<script>
import OrderInfo from "./components/orderInfo.vue";
import PayRecord from "./components/payRecord.vue";
import ApproveRecord from "./components/approveRecord.vue";
import { getCrmOrderDetail } from "@/api/order";
export default {
  components: {
    OrderInfo,
    PayRecord,
    ApproveRecord,
  },
  data() {
    return {
      detailData: {
        pay_plan: [],
        pay_log: [],
        project: "[]",
        verify_step: [],
        verify_status: 0,
      },
      active: 1,
      steps: [
        {
          text: "步骤一",
          desc: "描述信息",
        },
        {
          text: "步骤二",
          desc: "描述信息",
        },
        {
          text: "步骤三",
          desc: "描述信息",
        },
        {
          text: "步骤四",
          desc: "描述信息",
        },
      ],
    };
  },
  onLoad() {
    this.getCrmOrderDetail();
  },
  methods: {
    async getCrmOrderDetail() {
      const data = {
        order_id: "20450", //20445
      };
      const res = await getCrmOrderDetail(data);
      this.detailData = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.order-detail {
  padding: 20rpx 0;
  &-header {
    padding: 0 20rpx;
    &-title {
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    &-other {
      color: @f-c-999;
    }
  }
}
</style>