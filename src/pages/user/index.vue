<template>
  <view class="user">
    <image class="b-img" src="../../static/chapter-background.png"></image>
    <view class="user-header">
      <image class="avatar" :src="userInfo.cover"></image>
      <view class="user-info">
        <view>
          <text class="name">{{ userInfo.nickname }}</text>
          {{
            (userInfo.mobile + "").replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
          }}
          <van-button
            @click="toLogin"
            v-if="appInfo.debug == 1"
            size="mini"
            type="warning"
            class="btn-login"
            >登 录</van-button
          >
        </view>
        <view class="tips">不怕千万人阻挡，只怕自己投降。</view>
      </view>
    </view>
    <view class="user-mune">
      <button class="menu-item" open-type="share">
        <view class="menu-item-info">
          <text class="iconfont">&#xf36c;</text>
          <text class="title">推荐给好友</text>
        </view>
        <text class="iconfont">&#xe66b;</text>
      </button>
      <!-- <view class="menu-item">
        <view class="menu-item-info">
          <text class="iconfont">&#xe646;</text>
          <text class="title">学习报告</text>
        </view>
        <text class="iconfont">&#xe66b;</text>
      </view> -->
      <view class="menu-item" @click="toAuthor">
        <view class="menu-item-info">
          <text class="iconfont">&#xe603;</text>
          <text class="title">关于我们</text>
        </view>
        <text class="iconfont">&#xe66b;</text>
      </view>
      <button class="menu-item" open-type="feedback">
        <view class="menu-item-info">
          <text class="iconfont">&#xe610;</text>
          <text class="title">意见反馈</text>
        </view>
        <text class="iconfont">&#xe66b;</text>
      </button>
      <button class="menu-item" open-type="contact">
        <view class="menu-item-info">
          <text class="iconfont">&#xe60e;</text>
          <text class="title">联系客服</text>
        </view>
        <text class="iconfont">&#xe66b;</text>
      </button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      title: "我的",
    };
  },
  computed: {
    ...mapGetters(["userInfo", "appInfo"]),
  },
  methods: {
    toLogin() {
      uni.navigateTo({
        url: "/pages/login/index",
      });
    },
    toAuthor() {
      uni.navigateTo({
        url: "/pages/author/index",
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.user {
  padding: 0 30rpx;
  .btn-login {
    margin-left: 20rpx;
  }
  .b-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 228rpx;
    z-index: -1;
  }
  &-header {
    height: 228rpx;
    box-sizing: border-box;
    .flex-c();
    .avatar {
      height: 120rpx;
      width: 120rpx;
      background-color: #fff;
      .radius();
      margin-right: 32rpx;
    }
    .user-info {
      font-size: @font-size-sm;
      color: #fff;
      .name {
        font-size: 40rpx;
        margin-right: 16rpx;
      }
      .tips {
        margin-top: 22rpx;
      }
    }
  }
  &-mune {
    padding: 20rpx 0 0 7rpx;
    .menu-item {
      height: 100rpx;
      box-sizing: border-box;
      color: #666;
      border-bottom: 1px solid #eee;
      font-size: @font-size-md;
      .flex-c();
      justify-content: space-between;
      background-color: #fff;
      padding: 0;
      border-radius: 0;
      &::after {
        border: 0;
      }
      &:active {
        opacity: 0.7;
      }
      &-info {
        .flex-c();
        .title {
          margin-left: 13rpx;
        }
        .iconfont {
          font-size: @font-size-lg;
        }
      }
    }
  }
}
</style>
