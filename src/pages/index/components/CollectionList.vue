<template>
  <scroll-view
    class="collection-list"
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
          class="collection-list-item"
          v-for="item in data"
          :key="item.plan_id"
          @click="$emit('item-click', item)"
        >
          <view class="collection-list-item-content">
            <view class="info">
              <view class="info-user">
                <view class="user-name"
                  >{{ item.nickname }}--{{ item.project_name }}</view
                >
                <view class="time">{{ item.day }}</view>
              </view>
              <view class="info-tips">
                <text class="plan-money">计划金额￥{{ item.money || 0 }}</text>
                <text>实收金额￥{{ item.pay_money || 0 }}</text></view
              >
            </view>
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
  name: "CollectionList",
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

.collection-list {
  box-sizing: border-box;
  position: relative;
  height: calc(100% - 80rpx);
  .load-more {
    text-align: center;
    color: @text-color-grey;
    font-size: @font-size-sm;
    padding-bottom: 20rpx;
  }
  &-item {
    padding: 30rpx 20rpx;
    &:active {
      opacity: 0.7;
    }
    &-content {
      .info {
        flex: 1;
        &-user {
          .flex-c-b();
          margin-bottom: 8rpx;
          .user-name {
            font-size: @font-size-md;
          }
          .time {
            margin-left: auto;
            font-size: @font-size-sm;
            color: #fe7d00;
          }
        }
        &-tips {
          font-size: @font-size-sm;
          color: #888;
          .plan-money {
            margin-right: 40rpx;
          }
        }
      }
    }
  }
}
</style>