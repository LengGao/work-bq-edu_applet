<template>
  <scroll-view
    class="customer-list"
    scroll-y
    refresher-enabled
    @refresherrefresh="$emit('refresherrefresh')"
    :refresher-triggered="refreshLoading"
    refresher-background="#efefef"
    enable-back-to-top
    @scrolltolower="onScrolltolower"
  >
    <van-skeleton title avatar row="2" :loading="loading">
      <block v-if="data.length">
        <view
          class="customer-list-item"
          v-for="(item, index) in data"
          :key="item.id"
          @click="$emit('item-click', index)"
        >
          <view class="customer-list-item-content">
            <view class="info">
              <text class="user-name">{{ item.name }}</text>
              <van-tag plain type="success" v-if="item.pay_state"
                >已成交</van-tag
              >
              <van-tag plain type="warning" v-else>未成交</van-tag>
            </view>
            <view class="time">上次跟进时间：{{ item.last_follow_time }}</view>
          </view>
          <view class="customer-list-item-title">{{ item.follow_title }}</view>
        </view>
        <view class="load-more" v-if="loadMoreLoading">加载中...</view>
        <view class="load-more" v-if="total === data.length">没有更多了</view>
      </block>
      <NoData v-else />
    </van-skeleton>
  </scroll-view>
</template>

<script>
import NoData from "@/components/noData/index.vue";
export default {
  name: "CustomerList",
  components: {
    NoData,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    refreshLoading: {
      type: Boolean,
      default: false,
    },
    loadMoreLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onScrolltolower() {
      if (this.total > this.data.length && !this.loadMoreLoading) {
        this.$emit("more");
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.avatar() {
  width: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  .radius();
}
.customer-list {
  box-sizing: border-box;
  position: relative;
  height: calc(100% - 80rpx);
  .load-more {
    text-align: center;
    color: @text-color-grey;
    font-size: @font-size-xs;
    padding-bottom: 20rpx;
  }

  &-item {
    padding: 32rpx 20rpx;
    .flex-c-b();
    &:active {
      opacity: 0.7;
    }
    &-content {
      .info {
        .user-name {
          margin-right: 12rpx;
          font-size: @font-size-md;
        }
      }
      .time {
        padding-top: 12rpx;
        font-size: @font-size-xs;
        color: @text-color-grey;
      }
    }
    &-title {
      align-self: flex-start;
    }
  }
}
</style>