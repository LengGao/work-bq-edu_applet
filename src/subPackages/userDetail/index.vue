<template>
  <view class="user-detail">
    <view class="header">
        <image class="header-avator" :src="userInfo.user_img || defaultAvator"></image>          
        <view class="header-info">
            <text class="header-info-name">{{ userInfo.user_nicename }}</text>
            <text class="header-info-phone">{{ userInfo.telphone | phoneFormat }}</text>
        </view>
    </view>
    <video class="Split-line">
      <van-cell
        title="学生编号"
        title-class="title"
        title-width="200rpx"
        value-class="value"
        :value="userInfo.uid || '--'"
      />
      <van-cell
        title="学生姓名"
        title-class="title"
        title-width="200rpx"
        value-class="value"
        :value="userInfo.user_nicename || '--'"
      />
      <van-cell
        title="手机号"
        title-width="200rpx"
        title-class="title"
        value-class="value"
        :value="userInfo.telphone | phoneFormat"
      />
      <van-cell
        title="性别"
        title-class="title"
        title-width="200rpx"
        value-class="value"
        :value="sexMap[userInfo.sex] || '--'"
      >
      </van-cell>
      <van-cell
        title="PC"
        title-class="title"
        title-width="200rpx"
        value-class="value"
        :value="userInfo.pc_openid || '未登录'"
      />
      <van-cell
        title="小程序端"
        title-class="title"
        title-width="200rpx"
        value-class="value"
      >
      <template v-if="isLogin">
        <text class="isLogin">已登录</text>
        <van-button size="small" @click="handleOutLogin">清除登录信息</van-button>
      </template>
        <text v-else>未登录</text>
      </van-cell>

      <van-cell
        title="归属人"
        title-class="title"
        title-width="200rpx"
        value-class="value"
        :value="userInfo.staff_name || '--'"
      />
      <van-cell
        title="所属机构"
        title-class="title"
        title-width="200rpx"
        value-class="value"
        :value="userInfo.from_organization_name || '--'"
      />
    </video>
</view>
</template>

<script>
import { studentUsersClear } from "@/api/customer"

export default {
  data() {
    return {
      userInfo: {},
      isLogin: false,
      sexMap: { 1: "男", 2: "女" },
      defaultAvator: "../../static/avator.png"
    };
  },
  onLoad(query) {
      let info = JSON.parse(query.info)
      this.isLogin = info.apple_openid ? true : false
      this.userInfo = info ? info : {}
  },
  methods: {
    async handleOutLogin () {
      const data = { type: 'mini', uid: this.userInfo.uid}
      const res =  await studentUsersClear(data).catch(() => {})
      if (res.code == 0) {
        this.isLogin = false
      }
    }
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
@avator-size: 100rpx;
@lable-color: #969799;

.user-detail {
  width: 100%;
  overflow: hidden;
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 180rpx;
    padding: 0 40rpx;
    .header-avator {
      width: 100rpx;
      height: @avator-size;
      border-radius: 50%;
    }
    .header-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 10rpx;
      &-name {
        display: inline-block;
        max-width: 240rpx;
        height: 54rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: @font-size-lg;
        color: @text-color;
      }
      &-phone {
        display: inline-block;
        font-size: @font-size-sm;
        color: @text-color-grey;
      }
    }
  }
  /deep/.title {
      color: @lable-color;
  }
  /deep/.value {
      color: @text-color;
  }
  .Split-line {
    width: 100%;
    border-top: 20rpx solid #f2f6fc;
  }
  .isLogin {
    margin-right: 10rpx;
    color: @primary;
  }

}
</style>