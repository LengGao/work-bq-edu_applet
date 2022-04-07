<template>
  <view class="order-info">
    <van-cell title="审批类型" title-class="title" v-if="data.verify_type">
      <template>
        <van-tag :type="verifyTypeMap[data.verify_type || 0].type">
          {{ verifyTypeMap[data.verify_type || 0].text }}</van-tag
        >
      </template>
    </van-cell>
    <block v-if="data.verify_type === 2">
      <van-cell
        title="作废原因"
        title-class="title"
        value-class="value"
        :value="data.refund_invalid_reason"
      />
      <van-cell title="作废凭证" title-class="title" value-class="value">
        <template
          v-if="
            data.refund_invalid_voucher && data.refund_invalid_voucher.length
          "
        >
          <image
            @click="previewImage(data.refund_invalid_voucher, index)"
            style="width: 80rpx; height: 60rpx; margin-left: 10rpx"
            :src="item"
            v-for="(item, index) in data.refund_invalid_voucher"
            :key="index"
          />
        </template>
        <text v-else>--</text>
      </van-cell>
    </block>
    <block v-if="[1, 3].includes(data.verify_type)">
      <van-cell
        title="退款金额"
        title-class="title"
        value-class="value"
        :value="data.refund_invalid_refund_money | moneyFormat"
      />
      <van-cell
        title="退款方式"
        title-class="title"
        value-class="value"
        :value="data.refund_invalid_refund_type || '--'"
      />
      <van-cell
        title="退款原因"
        title-width="200rpx"
        title-class="title"
        value-class="value"
        :value="data.refund_invalid_reason || '--'"
      />
      <van-cell title="退款凭证" title-class="title" value-class="value">
        <template
          v-if="
            data.refund_invalid_voucher && data.refund_invalid_voucher.length
          "
        >
          <image
            @click="previewImage(data.refund_invalid_voucher, index)"
            style="width: 80rpx; height: 60rpx; margin-left: 10rpx"
            :src="item"
            v-for="(item, index) in data.refund_invalid_voucher"
            :key="index"
          />
        </template>
        <text v-else>--</text>
      </van-cell>
    </block>
    <van-cell
      title="订单编号"
      title-class="title"
      value-class="value"
      :value="data.order_no || '--'"
    />
    <van-cell
      title="订单时间"
      title-class="title"
      value-class="value"
      :value="data.create_time || '--'"
    />
    <van-cell
      title="客户姓名"
      title-class="title"
      value-class="value"
      :value="data.surname || '--'"
    />
    <van-cell
      title="订单来源"
      title-class="title"
      value-class="value"
      :value="data.source || '--'"
    />
    <van-cell
      title="审批类型"
      title-class="title"
      value-class="value"
      :value="data.is_new == 1 ? '新客户' : '老客户'"
    />
    <van-cell
      title="业绩归属"
      title-class="title"
      value-class="value"
      :value="data.staff_name || '--'"
    />
    <van-cell
      title="报名类型"
      title-class="title"
      value-class="value"
      :value="data.type === 1 ? '学历教育' : '职业教育'"
    />
    <van-cell
      title="报名项目"
      title-class="title"
      value-class="value"
      :value="data.project_name || '--'"
    />
    
    <van-cell
      title="届别名称"
      title-class="title"
      value-class="value"
      :value="data.jiebie_name || '--'"
    />
    <van-cell
      title="订单金额"
      title-class="title"
      value-class="value"
      :value="data.total_money | moneyFormat"
    />
    <van-cell
      title="学费金额"
      title-class="title"
      value-class="value"
      :value="data.order_money | moneyFormat"
    />
    <van-cell
      title="其他金额"
      title-class="title"
      value-class="value"
      :value="data.other_money | moneyFormat"
    />
    <van-cell
      title="已回款金额"
      title-class="title"
      value-class="value"
      :value="data.pay_money | moneyFormat"
    />
    <van-cell
      title="未回款金额"
      title-class="title"
      value-class="value"
      :value="data.overdue_money | moneyFormat"
    />
    <van-cell title="回款凭证" title-class="title" value-class="value">
      <template v-if="data.receipt_file && data.receipt_file.length">
        <image
          @click="previewImage(data.receipt_file, index)"
          style="width: 80rpx; height: 60rpx; margin-left: 10rpx"
          :src="item"
          v-for="(item, index) in data.receipt_file"
          :key="index"
        />
      </template>
      <text v-else>--</text>
    </van-cell>
    <!-- <template v-if="data.type === 1">
      <van-cell
        title="考前辅导费"
        title-class="title"
        value-class="value"
        :value="data.pre_tutor | moneyFormat"
      />
      <van-cell
        title="报考费"
        title-class="title"
        value-class="value"
        :value="data.examination | moneyFormat"
      />
      <van-cell
        title="教材费"
        title-class="title"
        value-class="value"
        :value="data.textbook | moneyFormat"
      />
      <van-cell
        title="毕设指导费"
        title-class="title"
        value-class="value"
        :value="data.graduation_guidance | moneyFormat"
      />
      <van-cell
        title="论文答辩费"
        title-class="title"
        value-class="value"
        :value="data.thesis_defense | moneyFormat"
      />
      <van-cell
        title="平台费"
        title-class="title"
        value-class="value"
        :value="data.platform_fee | moneyFormat"
      />
      <van-cell
        title="其他费用"
        title-class="title"
        value-class="value"
        :value="data.others | moneyFormat"
      />
    </template> -->
    <van-cell
      title="备注信息"
      title-class="title"
      value-class="value"
      :value="data.tips || '--'"
    />
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      verifyTypeMap: {
        0: {
          text: "新订单",
          type: "success",
        },
        1: {
          text: "申请退款",
          type: "warning",
        },
        2: {
          text: "申请作废",
          type: "danger",
        },
        3: {
          text: "申请退差价",
          type: "warning",
        },
      },
    };
  },
  methods: {
    previewImage(urls, index) {
      // console.log(...arguments);
      uni.previewImage({
        urls,
        current: urls[index],
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.order-info {
  border-top: 20rpx solid #f2f6fc;
  /deep/.title {
    flex: inherit;
    flex-shrink: 0;
    color: #969799;
  }
  /deep/.value {
    color: @text-color;
  }
}
</style>