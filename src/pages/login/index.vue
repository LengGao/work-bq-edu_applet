<template>
  <view class="login">
    <image class="login-img" src="../../static/Presetation.png" />

    <van-cell-group title="欢迎登录" custom-class="group-title" :border="false">
      <van-field
        type="number"
        :value="mobile"
        left-icon="manager-o"
        placeholder="请输入账号"
        @input="({ detail }) => (mobile = detail)"
      />
      <van-field
        password
        type="password"
        left-icon="question-o"
        placeholder="请输入密码"
        @input="({ detail }) => (password = detail)"
        @confirm="appletBindPhone"
      />
    </van-cell-group>
    <view class="login-btn">
      <van-button
        type="primary"
        :loading="loading"
        round
        @click="appletBindPhone"
        >登 录</van-button
      >
    </view>
  </view>
</template>

<script>
import { appletBindPhone } from "@/api/user";
import http from "@/utils/request";
export default {
  data() {
    return {
      loading: false,
      mobile: "",
      password: "",
      openid: "",
    };
  },
  onLoad({ openid }) {
    this.openid = openid;
  },
  methods: {
    // 通过账号登录
    async appletBindPhone() {
      if (!this.mobile) {
        uni.showToast({
          title: "账号不能为空",
          icon: "error",
        });
        return;
      }
      if (!this.password) {
        uni.showToast({
          title: "密码不能为空",
          icon: "error",
        });
        return;
      }
      const data = {
        mobile: this.mobile,
        password: this.password,
        openid: this.openid,
      };
      this.loading = true;
      const res = await appletBindPhone(data).catch(() => {});
      this.loading = false;
      if (res.code === 0) {
        this.$store.dispatch("setUserInfo", {
          ...res.data.info,
          token: res.data.token,
        });
        uni.navigateBack();
        // 执行请求队列里的请求
        http._onAccessTokenFetched();
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.login {
  padding: 40rpx;
  &-img {
    padding: 100rpx 0 30rpx;
    width: 100%;
    height: 400rpx;
  }
  /deep/.van-cell-group__title {
    padding: 20rpx 0;
    color: #333;
    font-size: @font-size-md;
  }
  &-btn {
    padding: 60rpx 0;
    /deep/.van-button {
      width: 100%;
    }
  }
}
</style>
