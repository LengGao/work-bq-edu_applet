<template>
  <scroll-view
    class="notice-list"
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
          class="notice-list-item"
          v-for="(item, index) in data"
          :key="item.id"
          @click="$emit('item-click', index)"
        >
          <view class="notice-list-item-content">
            <view
              class="notice-content"
              :class="{ 'notice-content--unread': item.read === 1 }"
              >{{ item.title }}</view
            >
            <view class="notice-time">{{ item.create_time }}</view>
          </view>
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
  name: "SystemNoticeList",
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
.notice-list {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  .load-more {
    text-align: center;
    color: @text-color-grey;
    font-size: @font-size-xs;
    padding-bottom: 20rpx;
  }
  &-item {
    padding: 32rpx 20rpx;
    &:active {
      opacity: 0.7;
    }
    &-content {
      .flex-c-b();
      .notice-time {
        color: @text-color-grey;
        font-size: @font-size-xs;
        flex-shrink: 0;
      }
      .notice-content {
        font-size: @font-size-md;
      }
      .notice-content--unread {
        position: relative;
        &::after {
          position: absolute;
          left: -14rpx;
          top: 14rpx;
          content: "";
          width: 10rpx;
          height: 10rpx;
          .radius();
          background-color: #fd6500;
        }
      }
    }
  }
}
</style>