<template>
  <view class="login">
    <image class="login-img" src="../../static/Presetation.png" />

    <van-cell-group title="欢迎登录" custom-class="group-title" :border="false">
      <van-field
        :value="mobile"
        left-icon="manager-o"
        placeholder="请输入账号"
        @input="({ detail }) => (mobile = detail)"
      />
      <van-field
        password
        :value="password"
        left-icon="question-o"
        placeholder="请输入密码"
        @input="({ detail }) => (password = detail)"
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
import { appletLogin, appletBindPhone } from "@/api/user";
export default {
  data() {
    return {
      loading: false,
      mobile: "",
      password: "",
      openid: "",
    };
  },
  onShow() {
    this.wxLogin();
  },
  methods: {
    // 通过账号登录
    async appletBindPhone() {
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
        this.reloadPrevPage();
      }
    },
    // 通过code登录
    async appletLogin(code) {
      const data = {
        code,
      };
      const res = await appletLogin(data).catch(() => {
        uni.hideLoading();
      });
      if (res.code === 5) {
        this.openid = res.data.applet_openid;
      }
      if (res.code === 0) {
        this.$store.dispatch("setUserInfo", {
          ...res.data.info,
          token: res.data.token,
        });
        this.reloadPrevPage();
      }
    },
    // 登录成功后重新加载上一页
    reloadPrevPage() {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.onLoad(prevPage.options);
      uni.navigateBack();
    },
    wxLogin() {
      uni.login({
        success: (res) => {
          this.appletLogin(res.code);
        },
        fail: () => {
          uni.showToast({
            icon: "error",
            title: "登录失败",
          });
        },
      });
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
