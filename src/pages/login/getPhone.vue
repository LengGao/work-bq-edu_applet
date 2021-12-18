<template>
  <view class="lgoin">
    <view class="logo">
      <image :src="appInfo.logo" />
    </view>
    <view class="bc-img">
      <image src="../../static/iphone-bc.png" />
    </view>
    <button
      class="btn"
      open-type="getPhoneNumber"
      type="primary"
      @getphonenumber="getPhoneNumber"
    >
      授权手机号码
    </button>
    <view class="tips"> 申请获取您的微信绑定手机号 </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getSign } from "@/api/user";
export default {
  data() {
    return {
      userInfo: null,
      phoneInfo: null,
    };
  },
  computed: {
    ...mapGetters(["organization_id", "appInfo"]),
  },

  methods: {
    ...mapActions(["setUserInfo", "getAppInfo"]),
    async getSign() {
      const data = {
        code: uni.getStorageSync("wxCode"),
        organization_id: this.organization_id,
        mobile: {
          iv: this.phoneInfo.iv,
          encryptedData: this.phoneInfo.encryptedData,
        },
        user: {
          iv: uni.getStorageSync("iv"),
          encryptedData: uni.getStorageSync("encryptedData"),
        },
      };
      const res = await getSign(data);
      if (res.error_code === 0) {
        this.setUserInfo(res.data);
        this.getAppInfo({ debug: 0 });
        uni.removeStorageSync("wxCode");
        uni.removeStorageSync("encryptedData");
        uni.removeStorageSync("iv");
        const indexPage = getCurrentPages()[0] || {};
        if (indexPage.route === "pages/login/index") {
          uni.switchTab({
            url: "/pages/index/index",
          });
        } else {
          uni.navigateBack({
            delta: 2,
          });
        }
      }
    },
    async getUserInfo(e) {
      const res = await this.wxGetUserInfo();
      if (res) {
        this.userInfo = res;
        uni.showToast({
          icon: "none",
          title: "请继续授权手机号码",
        });
      }
    },
    getPhoneNumber(e) {
      const data = e.detail;
      if (data.iv) {
        this.phoneInfo = data;
        this.getSign();
      } else {
        uni.showToast({
          icon: "error",
          title: "获取失败",
        });
      }
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
