<template >
  <view class="order-recond">
    <view v-for="data in datas.list" :key="data.order_id">
      <Title :title="'订单记录 ' + data.order_id"> </Title>
      <van-cell :border="false">
          <template #title>
              <text class="title">项目名称</text>
              <text class="value strong">{{ data.project_name }}</text>
          </template>
      </van-cell>

      <van-cell :border="false" :title-width="titleWidth" center>
          <template #title>
              <text class="title">客户姓名</text>
              <text class="value">{{ data.surname }}</text>
          </template>
          <template>
              <text class="title left">订单金额</text>
              <text class="value price">{{ data.order_money }}</text>
          </template>
      </van-cell>

      <van-cell :border="false" :title-width="titleWidth" center>
          <template #title>
              <text class="title">业绩归属</text>
              <text class="value">{{ data.jiebie_name }}</text>
          </template>
          <template>
              <text class="title left">订单时间</text>
              <text class="value">{{ data.create_time }}</text>
          </template>
      </van-cell>

      <van-cell :border="false" :title-width="titleWidth" center>
          <template #title>
              <text class="title">已回款金额</text>
              <text class="value">{{ data.pay_money }}</text>
          </template>
          <template>
              <text class="title left">未回款金额</text>
              <text class="value">{{ data.reduction }}</text>
          </template>
      </van-cell>

      <van-cell :border="false">
          <template #title>
              <text class="title left">备注信息</text>
              <text class="value">{{ data.tips }}</text>
          </template>
      </van-cell>

      <van-cell :border="false">
        <template #title>
          <text class="title">回款凭证</text>
          <template v-if="item.receipt_file && item.receipt_file.length">
            <image
              v-for="(src, index) in item.receipt_file"
              :key="index"
              style="width: 80rpx; height: 60rpx; margin-left: 10rpx; vertical-align: top;"
              :src="src"
              alt=""
              @click="() => previewImage(item.receipt_file, index)"
            />
          </template>
          <text v-else>无</text>
        </template>
      </van-cell>
    </view>
  </view>
</template>

<script>
import Title from "@/components/title/index.vue";
import { getOrderRecond } from "@/api/customer";

export default {
  components: {
    Title,
  },
  props: {
    uid: { type: Number }
  },
  data() {
    return {
        datas: {},
        total: 0,
        page: 1,
        titleWidth: '300rpx'
    };
  },
  methods: {
    previewImage(urls, index) {
      uni.previewImage({urls, current: urls[index]});
    },
  },
  mounted() {
    const params = { uid: this.uid }
    getOrderRecond(params).then(res => {
      this.datas = res.data
    })
  }
};
</script>


<style lang="less" scoped>
@import "@/styles/var";
.order-recond {
  padding: 20rpx 0;
  &-title {
    display: flex;
    align-items: center;
    padding: 0 20rpx 10rpx;
  }
  .title {
    color: #969799;
    font-size: @font-size-sm;
    text-align: left;
    margin-right: 20rpx;
  }
  .value {
    display: inline-block;
    text-align: left;
    font-size: @font-size-sm;
    color: @text-color;
  }
  .price {
    color: #FD6500;
  }
  .left {
      float: left;
  }
  .strong {
    font-weight: 700;
    color: #323333;
  }
}
</style>