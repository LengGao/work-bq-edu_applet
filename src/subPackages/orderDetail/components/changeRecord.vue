<template>
  <view class="change-record">
    <van-cell-group custom-class="cell-group" :border="false">
      <van-cell
        title="异动后订单金额"
        title-class="title"
        value-class="value right"
        :value="data.order_money | moneyFormat"
      />
      <van-cell
        title="优惠金额"
        title-class="title"
        value-class="value right"
        :value="data.reduction | moneyFormat"
      />
      <van-cell
        title="已回款金额"
        title-class="title"
        value-class="value right"
        :value="data.pay_money | moneyFormat"
      />
      <van-cell
        title="未回款金额"
        title-class="title"
        value-class="value right"
        :value="data.overdue_money | moneyFormat"
      />
      <van-cell
        title="共享业绩"
        title-class="title"
        value-class="value right"
        :value="data.union_staff_name || '--'"
      />
      <van-cell
        title="届别名称"
        title-class="title"
        value-class="value right"
        :value="data.jiebie_name || '--'"
        :border="false"
      />
    </van-cell-group>
    <view class="change-record-title">
      <Title title="回款记录"> </Title>
    </view>
    <van-cell-group
      custom-class="cell-group"
      inset
      :border="false"
      v-for="(item, index) in data.pay_log"
      :key="index"
    >
      <van-cell :title="`${item.pay_date} 回款`" title-class="bold-title" />
      <van-cell :border="false" custom-class="cell-item">
        <template #title>
          <text class="title">入账状态</text>
          <text class="value">{{ payStatusMap[item.verify_status] || "--"}}</text>
        </template>
      </van-cell>
      <van-cell :border="false" custom-class="cell-item">
        <template #title>
          <text class="title">回款金额</text>
          <text class="value">{{ item.pay_money | moneyFormat }}</text>
        </template>
        <text class="title">支付方式</text>
        <text class="value">{{ item.pay_type }}</text>
      </van-cell>
      <van-cell :border="false" title-width="130rpx" custom-class="cell-item">
        <template #title>
          <text class="title">回款计划</text>
        </template> 
        <text class="value" decode>{{ item.relation_plan.replaceAll(',', ',  ') || "无" }}</text>
      </van-cell>
      <van-cell :border="false" >
        <template #title>
          <text class="title">备注信息</text>
        </template>
        <text class="value">{{ item.tips || "无" }}</text>
      </van-cell>
    </van-cell-group>
    <view class="change-record-title">
      <Title title="项目信息"> </Title>
    </view>
    <template v-if="data.project && data.project.length">
      <van-cell-group
        custom-class="cell-group"
        inset
        :border="false"
        v-for="(item, index) in data.project"
        :key="index"
      >
        <van-cell
          title-width="180rpx"
          title-class="title"
          value-class="value"
          title="项目名称"
          :value="item.project_name"
        >
        </van-cell>
        <van-cell
          :border="false"
          title-width="180rpx"
          title-class="title"
          value-class="value"
          title="项目价格"
          :value="(item.project_price || item.price) | moneyFormat"
        >
        </van-cell>
      </van-cell-group>
    </template>
    <template v-else>
      <van-cell-group inset :border="false" custom-class="cell-group">
        <van-cell :border="false"></van-cell>
        <van-cell
          :border="false"
          value-class="center"
          value="暂无数据"
        ></van-cell>
        <van-cell :border="false"></van-cell>
      </van-cell-group>
    </template>
    <view class="change-record-title">
      <Title title="回款计划"> </Title>
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
            <text class="bold-title">{{ expenseType[item.type] }} ( {{ item.year }} )</text>
            <text class="title">计划 {{ item.day }} 回款</text>
          </template>
        </van-cell>
        <van-cell :border="false" title-class="title" custom-class="cell-item">
          <template #title>
            <text class="title">计划回款金额</text>
            <text class="value">{{ item.money | moneyFormat }}</text>
          </template>
          <text class="title">回款进度</text>
        </van-cell>
        <van-cell :border="false" custom-class="cell-item">
          <template #title>
            <text class="title">实际回款金额</text>
            <text class="value">{{ item.pay_money | moneyFormat }}</text>
          </template>
          <text class="progress">{{ item.pay_progress }}</text>
        </van-cell>
        <van-cell :border="false" title-width="130rpx" custom-class="cell-item">
          <template #title>
            <text class="title">所属项目</text>
          </template> 
            <text class="value" style="width: 100%;" decode>{{ (item.project_name || '').replaceAll(',', ',  ') || "无" }}</text>
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
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters(['expenseType'])
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
        url: `/subPackages/payPlanConfig/index?orderId=${this.data.order_id}`,
      });
    },
  },
};
</script>


<style lang="less" scoped>
@import "@/styles/var";
.change-record {
  border-top: 20rpx solid #f2f6fc;
  min-height: 65vh;
  &-title {
    padding: 0 20rpx 10rpx;
  }
  /deep/.cell-group {
    margin-bottom: 20rpx;
    border: @border;
  }
  /deep/.title {
    flex: inherit;
    flex-shrink: 0;
    font-size: @font-size-sm;
    color: @text-color-grey;
    margin-right: 20rpx;
  }
  /deep/.value {
    min-width: 100rpx;
    display: inline-block;
    color: @text-color;
    font-size: @font-size-sm;
    text-align: left;
    &.right {
      text-align: right;
    }
  }
  .progress {
    color: #fd7b18;
    font-size: @font-size-md;
  }
  /deep/.center {
    text-align: center;
    color: #ccc;
  }
  /deep/.bold-title {
    font-size: @font-size-sm;
    color: @text-color;
    font-weight: 700;
    margin-left: -20rpx;
    margin-right: 20rpx;
  }
  /deep/.cell-item {
    padding: 8rpx 16rpx;
  }
}
</style>