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
      <van-cell :title="`${item.pay_date || '--'} 回款`" title-class="bold-title" />
      <van-cell :border="false">
        <template #title>
          <text class="title">入账状态</text>
          <text class="value">{{ payStatusMap[item.verify_status] || "--"}}</text>
        </template>
      </van-cell>
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
          <text class="title">回款计划</text>
        </template>
        <text class="value">{{ item.relation_plan || "无" }}</text>
      </van-cell>
      <van-cell :border="false">
        <template #title>
          <text class="title">回款凭证</text>
          <template v-if="item.receipt_file && item.receipt_file.length">
            <image
              :src="src"
              @click="() => previewImage(item.receipt_file, index)"
              style="
                width: 80rpx;
                height: 60rpx;
                margin-left: 10rpx;
                vertical-align: top;
              "
              v-for="(src, index) in item.receipt_file"
              :key="index"
              alt=""
            />
          </template>
          <text v-else>无</text>
        </template>
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
        @click="$emit('setting')"
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
            <!-- <text class="bold-title">第{{ index + 1 }}期</text> -->
            <text class="bold-title">{{ expenseType[item.type] }} ( {{ item.year }} )</text>
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
    passParams: {
      type: Boolean,
      default: {}
    }
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
.pay-record {
  padding: 20rpx 0;
  border-top: 20rpx solid #f2f6fc;
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
    font-size: @font-size-sm;
    color: @text-color-grey;
    margin-right: 20rpx;
  }
  /deep/.value {
    color: @text-color;
    display: inline-block;
    min-width: 100rpx;
    text-align: left;
    font-size: @font-size-sm;
  }
  .progress {
    color: #fd7b18;
    font-size: @font-size-sm;
  }
  /deep/.center {
    text-align: center;
    color: #ccc;
  }
  /deep/.bold-title {
    flex: inherit;
    flex-shrink: 0;
    font-size: @font-size-sm;
    color: @text-color;
    font-weight: 700;
    margin-right: 20rpx;
  }
}
</style>