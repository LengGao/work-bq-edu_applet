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
          v-for="item in data"
          :key="item.id"
          @click="$emit('item-click', item)"
        >
          <view class="notice-list-item-content">
            <view
              class="avatar"
              :style="{ 'background-color': randomColor(item.from_staff_id) }"
            >
              <image
                v-if="item.head_photo"
                class="avatar-img"
                :src="item.head_photo"
              ></image>
              <span v-else-if="item.staff_name">
                {{ item.staff_name && item.staff_name.substr(0, 1) }}</span
              >
            </view>
            <view class="info">
              <view class="info-user">
                <view class="user-name"
                  ><text class="text">{{ item.staff_name }}</text>
                  {{ item.keyword }}</view
                >
                <view class="time">{{ item.create_time }}</view>
              </view>
              <view
                class="info-tips"
                :class="{ 'info-tips--unread': !item.is_read }"
                >{{ item.tips }}</view
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
  name: "NoticeList",
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
  data() {
    return {
      colorCache: {},
    };
  },
  methods: {
    onScrolltolower() {
      if (this.total > this.data.length && !this.loadMoreLoading) {
        this.$emit("more");
      }
    },
    randomColor(id) {
      if (id) {
        return (
          this.colorCache[id] ||
          (this.colorCache[id] = `#${Math.random()
            .toString(16)
            .substr(2, 6)
            .toUpperCase()}`)
        );
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
      .flex();
      .avatar,
      .avatar-img {
        text-align: center;
        color: #fff;
        font-size: 24rpx;
        .avatar();
        flex-shrink: 0;
      }
      .info {
        margin-left: 16rpx;
        flex: 1;
        &-user {
          .flex-c-b();
          margin-bottom: 8rpx;
          .user-name {
            color: @text-color-grey;
            font-size: @font-size-sm;
            .text {
              color: @primary;
              margin-right: 10rpx;
              font-size: @font-size-md;
            }
          }
          .time {
            color: @text-color-grey;
            margin-left: auto;
            font-size: @font-size-xs;
          }
        }
        &-tips {
          font-size: @font-size-sm;
        }
        &-tips--unread {
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
}
</style>