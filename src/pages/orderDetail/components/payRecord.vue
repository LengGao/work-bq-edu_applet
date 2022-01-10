<template>
  <view class="pay-record">
    <view class="pay-record-title">
      <Title title="回款记录"> </Title>
      <van-button
        type="primary"
        v-if="!isApprove"
        size="small"
        @click="$emit('add-click')"
        >添加回款记录</van-button
      >
    </view>
    <van-cell-group
      custom-class="cell-group"
      inset
      :border="false"
      v-for="(item, index) in data.pay_log"
      :key="index"
    >
      <van-cell :title="`${item.pay_date} 回款`" title-class="title" />
      <van-cell :border="false">
        <template #title>
          <text class="title">回款金额</text>
          <text class="value">{{ item.pay_money | moneyFormat }}</text>
        </template>
        <text class="title">支付方式</text>
        <text class="value">{{ item.pay_type }}</text>
      </van-cell>
      <van-cell :border="false">
        <template #title>
          <text class="title">关联期次</text>
          <text class="value">{{ item.pay_plan_sort || "无" }}</text>
        </template>
        <text class="title">入账状态</text>
        <text class="value">{{
          payStatusMap[item.verify_status] || "--"
        }}</text>
      </van-cell>
      <van-cell :border="false">
        <template #title>
          <text class="title">备注信息</text>
          <text class="value">{{ item.tips || "无" }}</text>
        </template>
      </van-cell>
    </van-cell-group>
    <view class="pay-record-title">
      <Title title="回款计划"> </Title>
      <van-button
        type="primary"
        v-if="!isApprove"
        @click="toConfigPlan"
        size="small"
        >配置回款计划</van-button
      >
    </view>
    <template v-if="data.pay_plan.length">
      <van-cell-group
        custom-class="cell-group"
        inset
        :border="false"
        v-for="(item, index) in data.pay_plan"
        :key="index"
      >
        <van-cell>
          <template #title>
            <text class="value">第{{ index + 1 }}期</text>
            <text class="title">计划 {{ item.day }} 回款</text>
          </template>
        </van-cell>
        <van-cell :border="false" title-class="title">
          <template #title>
            <text class="title">计划回款金额</text>
            <text class="value">{{ item.money | moneyFormat }}</text>
          </template>
          <text class="title">回款进度</text>
        </van-cell>
        <van-cell :border="false">
          <template #title>
            <text class="title">已回款金额</text>
            <text class="value">{{ item.pay_money | moneyFormat }}</text>
          </template>
          <text class="progress">{{ item.pay_progress }}</text>
        </van-cell>
      </van-cell-group>
    </template>
    <template v-else>
      <van-cell-group inset :border="false" custom-class="cell-group">
        <van-cell :border="false"></van-cell>
        <van-cell
          :border="false"
          value-class="center"
          value="暂无回款计划"
        ></van-cell>
        <van-cell :border="false"></van-cell>
      </van-cell-group>
    </template>
  </view>
</template>

<script>
import Title from "@/components/title/index.vue";

export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    isApprove: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Title,
  },
  data() {
    return {
      payStatusMap: {
        0: "待入账",
        1: "已入账",
        2: "已驳回",
        3: "确认入账中",
      },
    };
  },

  methods: {
    toConfigPlan() {
      uni.navigateTo({
        url: `/pages/payPlanConfig/index?orderId=${this.data.order_id}`,
      });
    },
  },
};
</script>


<style lang="less" scoped>
@import "@/styles/var";
.pay-record {
  padding: 20rpx 0;
  min-height: 65vh;
  &-title {
    .flex-c-b();
    padding: 0 20rpx 10rpx;
  }
  /deep/.cell-group {
    margin-bottom: 20rpx;
    border: @border;
  }
  /deep/.title {
    flex: inherit;
    flex-shrink: 0;
    color: #969799;
    margin-right: 20rpx;
  }
  /deep/.value {
    color: @font-color;
    display: inline-block;
    min-width: 100rpx;
    text-align: left;
  }
  .progress {
    color: #fd7b18;
    font-size: @font-size-md;
  }
  /deep/.center {
    text-align: center;
    color: #ccc;
  }
}
</style>