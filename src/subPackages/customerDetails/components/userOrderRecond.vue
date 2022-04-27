<template>
  <view class="order-recond">
    <template v-if="orderList.length">
      <view
        v-for="(data, index) in orderList"
        :key="data.order_id"
        class="order-recond-card"
      >
        <Title :title="'订单记录 ' + (index + 1)"> </Title>
        <view class="order-recond-item">
          <van-cell custom-class="project-name">
            <template #title>
              <text class="title">项目名称</text>
              <text class="value">{{ data.project_name || '--' }}</text>
            </template>
          </van-cell>

          <van-cell
            :border="false"
            :title-width="titleWidth"
            custom-class="custom-class"
          >
            <template #title>
              <text class="title">客户姓名</text>
              <text class="value">{{ data.surname || '--' }}</text>
            </template>
            <view class="cell-item-value">
              <text class="title">订单金额</text>
              <text class="value price">￥{{ data.order_money || 0.0 }}</text>
            </view>
          </van-cell>

          <van-cell
            :border="false"
            :title-width="titleWidth"
            custom-class="custom-class"
          >
            <template #title>
              <text class="title">业绩归属</text>
              <text class="value">{{ staff || '--' }}</text>
            </template>
            <view class="cell-item-value" style="overflow: hidden">
              <text class="title">订单时间</text>
              <text class="value-time">{{ data.create_time || '--' }}</text>
            </view>
          </van-cell>

          <van-cell
            :border="false"
            :title-width="titleWidth"
            custom-class="custom-class"
          >
            <template #title>
              <text class="title">已回款金额</text>
              <text class="value">￥{{ data.pay_money || 0.0 }}</text>
            </template>
            <view class="cell-item-value">
              <text class="title">未回款金额</text>
              <text class="value">￥{{ data.reduction || 0.0 }}</text>
            </view>
          </van-cell>

          <van-cell :border="false" custom-class="custom-class">
            <template #title>
              <text class="title">备注信息</text>
              <text class="value">{{ data.tips || '--' }}</text>
            </template>
          </van-cell>

          <van-cell :border="false" custom-class="custom-class">
            <template #title>
              <text class="title">回款凭证</text>

              <template v-if="data.receipt_file">
                <image
                  v-for="(src, index) in getImgs(data.receipt_file)"
                  :key="index"
                  style="
                    width: 80rpx;
                    height: 60rpx;
                    margin-left: 10rpx;
                    vertical-align: top;
                  "
                  :src="src"
                  @click="() => previewImage(getImgs(data.receipt_file), index)"
                />
              </template>
              <text v-else>无</text>
            </template>
          </van-cell>
        </view>
      </view>
    </template>
    <NoData v-else />
  </view>
</template>

<script>
import Title from "@/components/title/index.vue";
import NoData from "@/components/noData/index.vue";
import { getOrderRecond } from "@/api/customer";

export default {
  components: {
    Title,
    NoData,
  },
  props: {
    uid: { type: Number },
    staff: { type: String, default: ''}
  },
  data() {
    return {
      orderList: [],
      titleWidth: "300rpx",
    };
  },
  watch: {
    uid: function (val) {
      if (val !== 0) {
        this.uid = val
        this.getOrderRecond();
      }
    }
  },
  mounted() {
    if (this.uid !== 0) {
      this.getOrderRecond();
    }
  },
  methods: {
    getImgs(str) {
      return str.split(",");
    },
    async getOrderRecond() {
      const data = { uid: this.uid, person: 1, page: 1 , limit: 99};
      const res = await getOrderRecond(data);
      this.orderList = res.data.list;
    },
    previewImage(urls, index) {
      uni.previewImage({ urls, current: urls[index] });
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.order-recond {
  border-top: 20rpx solid #f2f6fc;
  min-height: 60vh;
  position: relative;
  .order-recond-card {
    padding: 20rpx 10rpx;
  }
  .order-recond-item {
    margin: 0 10rpx;
    padding-bottom: 20rpx;
    border: @border;
    border-radius: 8rpx;
    background-color: #ffffff;
  }
  /deep/.project-name {
    padding: 14rpx 20rpx;
    .value {
      font-weight: bold;
    }
  }
  &-title {
    display: flex;
    align-items: center;
  }
  /deep/.title {
    overflow: hidden;
    margin-right: 8rpx;
    color: #969799;
    font-size: @font-size-sm;
    white-space: nowrap;
  }
  /deep/.value {
    display: inline-block;
    font-size: @font-size-sm;
    color: @text-color;
    text-align: left;
  }
  .cell-item-value {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: left;
    margin-left: 6rpx;
  }
  .value-time {
    display: inline-block;
    width: 260rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: @font-size-sm;
    color: @text-color;
  }
  .price {
    color: #fd6500;
  }
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .text-left {
    text-align: left;
  }
  .strong {
    font-weight: 700;
    color: #323333;
  }
}

/deep/.custom-class {
  padding: 7rpx 20rpx;
}
</style>