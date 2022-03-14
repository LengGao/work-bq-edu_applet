<template>
  <view class="user-detail">
    <view class="header">
        <image class="header-avator" :src="userInfo.user_img ? userInfo.user_img : defaultAvator"></image>          
        <view class="header-info">
            <text class="header-info-name">{{ userInfo.user_nicename }}</text>
            <text class="header-info-phone">{{ userInfo.telphone }}</text>
        </view>
    </view>

    <van-cell-group>
      <van-field
        title-class="title"
        value-class="value"
        :value="userInfo.uid"
        input-align="right"
        label="学生编号"
      />
      <van-cell
        title-class="title"
        title="学生姓名"
        title-width="200rpx"
        :value="userInfo.user_nicename || '--'"
      />
      <van-cell
        title-class="title"
        title="手机号"
        title-width="200rpx"
        :value="userInfo.telphone || '--'"
      />
      <van-cell
        title="性别"
        title-class="title"
        :value="sexMap[userInfo.sex] || '--'"
      >
      </van-cell>
      <van-cell
        title-class="title"
        title="PC"
        title-width="200rpx"
        :value="userInfo.pc_openid || '--'"
      />
      <van-cell
        title="小程序端"
        title-class="title"
        :value="userInfo.apple_openid || '--'"
      />
      <van-cell
        title-class="title"
        title="归属人"
        :value="userInfo.staff_name || '--'"
      />
      <van-cell
        title-class="title"
        title="所属机构"
        :value="userInfo.from_organization_name || '--'"
      />
    </van-cell-group>
  </view>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {
        aid: 22617,
        apple_openid: "",
        class_count: 0,
        course_count: 0,
        from_organization_id: 0,
        from_organization_name: "-",
        order_count: 1,
        pc_openid: "",
        sex: 1,
        staff_name: "刘诗胜",
        state: 2,
        telphone: "13525212215",
        uid: 120463,
        user_img: "",
        user_nicename: "张有",
        user_realname: "张有"
      },
      defaultAvator: "../../static/avator.png",
      sexMap: { 1: "男", 2: "女" },
    };
  },
  onLoad(query) {
      console.log(query);
    //   this.userInfo = JSON.parse(query.info)
  },
  methods: {
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
@avator-size: 100rpx;

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
    --cell-value-color: @text-color;
    // --field-label-color: @lable-color;
    /deep/.title {
        // color: @lable-color;
    }
    /deep/.value {
        color: @text-color;
    }
}
</style>