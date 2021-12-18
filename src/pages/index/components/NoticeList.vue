<template>
  <view class="notice-list">
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
              :style="{ 'background-color': randomColor(item.id) }"
            >
              <image
                v-if="item.head_photo"
                class="avatar-img"
                :src="item.head_photo"
              ></image>
              <span v-else>
                {{
                  (item.staff_name && item.staff_name.substr(0, 1)) ||
                  item.staff_name
                }}</span
              >
            </view>
            <view class="info">
              <view class="info-user">
                <view class="user-name"
                  ><text>{{ item.staff_name }}</text> {{ item.keyword }}</view
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
        <view
          class="load-more"
          v-if="total > data.length"
          @click="$emit('more')"
          >查看更多</view
        >
        <view class="no-more" v-else>没有更多了</view>
      </block>
      <NoData v-else />
    </van-skeleton>
  </view>
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
  },
  methods: {
    randomColor(id) {
      if (id) {
        return `#${Math.random().toString(16).substr(2, 6).toUpperCase()}`;
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
  position: relative;
  height: calc(100vh - 164px - 44px - 60rpx);
  padding: 20rpx;
  .load-more {
    padding: 10rpx;
    text-align: center;
    color: #199fff;
    margin-top: -20rpx;
    &:active {
      opacity: 0.7;
    }
  }
  .no-more {
    text-align: center;
    color: @f-c-999;
    font-size: 24rpx;
    margin-top: -20rpx;
  }
  &-item {
    padding: 32rpx 0;
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
            color: @f-c-999;
            font-size: 24rpx;
            text {
              color: @primary;
              margin-right: 10rpx;
              font-size: 26rpx;
            }
          }
          .time {
            color: @f-c-999;
            margin-left: auto;
            font-size: 24rpx;
          }
        }
        &-tips {
          font-size: 26rpx;
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