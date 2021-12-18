<template>
  <view class="lgoin">
    <view class="logo">
      <image :src="appInfo.logo" />
    </view>
    <view class="bc-img">
      <image src="../../static/auth-bc.png" />
    </view>
    <button
      class="btn"
      :loading="loading"
      @click="getUserInfo"
      :disabled="!active"
      type="primary"
    >
      授权登录
    </button>
    <view class="tips"> 申请获取您的公开信息(昵称、头像等) </view>
    <view class="view">
      <van-radio-group :value="active" @change="onChecked">
        <van-radio name="1" icon-size="30rpx" shape="square"
          >我已阅读并同意</van-radio
        >
      </van-radio-group>
      <view class="link" @click="to">《用户协议和隐私政策》</view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      userInfo: null,
      radioVal: "",
      active: "",
      wxCode: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["appInfo"]),
  },
  onShow() {
    this.wxLogin();
  },
  methods: {
    to() {
      uni.navigateTo({
        url: `/pages/login/agreement`,
      });
    },
    onChecked() {
      this.active = this.active === "1" ? "" : "1";
    },
    async getUserInfo() {
      this.loading = true;
      const { iv, encryptedData } = await this.wxGetUserInfo().catch(() => {
        this.loading = false;
      });
      this.loading = false;
      if (iv) {
        uni.setStorageSync("iv", iv);
        uni.setStorageSync("encryptedData", encryptedData);
        uni.setStorageSync("wxCode", this.wxCode);
        uni.navigateTo({
          url: `/pages/login/getPhone`,
        });
      }
    },
    wxLogin() {
      uni.login({
        success: (res) => {
          this.wxCode = res.code;
        },
        fail: () => {
          uni.showToast({
            icon: "error",
            title: "登录失败",
          });
        },
      });
    },
    wxGetUserInfo() {
      return new Promise((resolve, reject) => {
        uni.getUserProfile({
          desc: "用于完善用户信息",
          success: resolve,
          fail: reject,
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.view {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  margin-top: 100rpx;
  /deep/.van-radio__label {
    color: #999999;
  }
  .link {
    color: #199fff;
  }
}
.lgoin {
  padding: 40rpx;
  .logo {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 60rpx 0 140rpx 0;
    image {
      height: 100rpx;
    }
  }
  .bc-img {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 140rpx;
    image {
      width: 550rpx;
      height: 366rpx;
    }
  }
  .tips {
    text-align: center;
    color: #999999;
    margin-top: 30rpx;
  }
  .btn {
    border-radius: 60rpx;
    background-color: #07c160;
    width: 500rpx;
  }
}
</style>
