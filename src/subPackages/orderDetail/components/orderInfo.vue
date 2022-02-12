<template>
  <view class="order-info">
    <van-cell
      title="订单编号"
      title-class="title"
      value-class="value"
      :value="data.order_no"
    />
    <van-cell
      title="订单时间"
      title-class="title"
      value-class="value"
      :value="data.create_time"
    />
    <van-cell
      title="客户姓名"
      title-class="title"
      value-class="value"
      :value="data.surname"
    />
    <van-cell
      title="业绩归属"
      title-class="title"
      value-class="value"
      :value="data.staff_name"
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
      :value="data.project_name"
    />
    <van-cell
      title="届别名称"
      title-class="title"
      value-class="value"
      :value="data.jiebie_name"
    />
    <van-cell
      title="订单金额"
      title-class="title"
      value-class="value"
      :value="data.order_money | moneyFormat"
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
      <text v-else>无</text>
    </van-cell>
    <template v-if="data.type === 1">
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
    </template>
    <van-cell
      title="备注信息"
      title-class="title"
      value-class="value"
      :value="data.tips || '无'"
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
  methods: {
    previewImage(urls, index) {
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