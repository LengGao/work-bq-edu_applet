<template>
  <view class="order-info">
    <van-cell
      title="异动类型"
      title-class="title"
      value-class="value"
      :value="data.type_name"
    />
    <van-cell
      title="申请时间"
      title-class="title"
      value-class="value"
      :value="data.apply_time"
    />
    <van-cell
      title="申请原因"
      title-class="title"
      value-class="value"
      :value="data.apply_reason"
    />
    <van-cell
      title="办理状态"
      title-class="title"
      value-class="value"
      :value="data.status_name"
    />
    <van-cell
      title="原专业"
      title-class="title"
      value-class="value"
      :value="data.origin_major_name"
    />
    <van-cell
      title="新专业"
      title-class="title"
      value-class="value"
      :value="data.new_major_name"
    />
    <van-cell
      title="办理日期"
      title-class="title"
      value-class="value"
      :value="data.transact_time"
    />
    <van-cell
      title="审批日期"
      title-class="title"
      value-class="value"
      :value="data.approve_time"
    />
    <van-cell
      title="备注信息"
      title-class="title"
      value-class="value"
      :value="data.remark"
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