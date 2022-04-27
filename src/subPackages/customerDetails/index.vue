<template>
  <view class="customer-details">
    <view class="header">
      <view class="header-info">
        <view class="header-info-avator">
          <image
            v-if="userInfo.user_img"
            class="info-avator-img"
            :src="userInfo.user_img"
          ></image>
          <image v-else class="info-avator-img" :src="defaultAvator"></image>
        </view>
        <view class="header-info-text">
          <text class="infor-text__name">{{ userInfo.surname }}</text>
          <text class="info-text__phone">{{
            userInfo.mobile | phoneFormat
          }}</text>
        </view>
      </view>
      <view class="header-btn">
        <button @click="handleSignUp">报名</button>
      </view>
    </view>
    <view class="main">
      <van-tabs
        type="line"
        color="#199fff"
        title-active-color="#199fff"
        animated
        tab-class="custom-tab"
        :active="active"
        @click="handleTabClick"
      >
        <van-tab title="基本信息" >
          <UserInfo
            :user-info="userInfo"
            @open-select="handleOpenSelect"
            @open-sheet="handleOpenSheet"
            @update="getUserInfo"
            @input-blur="modifyUserInfo"
            @open-popup="popupShow = true"
          ></UserInfo>
        </van-tab>
        <van-tab title="证件资料">
          <CertificateInformation 
            :uid="uid"
             @openEdit="openEdit">
          </CertificateInformation>
        </van-tab>
        <van-tab title="订单记录">
          <UserOrderRecond :uid="uid" :staff="staff"></UserOrderRecond>
        </van-tab>
        <van-tab title="项目班级">
          <StudentClass :uid="uid"></StudentClass>
        </van-tab>
        <van-tab title="学习进度">
          <StudyProgress :uid="uid"></StudyProgress>
        </van-tab>
      </van-tabs>
    </view>

    <van-popup :show="popupShow" position="bottom" @close="popupShow = false">
      <van-area
        :area-list="areaList"
        @cancel="popupShow = false"
        @confirm="handleAreaConfirm"
      />
    </van-popup>
    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="sheetShow = false"
      @select="onSheetSelect"
    />
    <Select
      :show="selectStaffShow"
      @close="selectStaffShow = false"
      @confirm="handleSelectChange"
      :options="staffOptions"
      option-name="staff_name"
      option-value="staff_id"
    />
    <Select
      :show="selectOrgShow"
      @close="selectOrgShow = false"
      @confirm="handleSelectOrgChange"
      :options="institutionOptions"
    />

  </view>
</template>
<script>
import { UserInfo } from "./components/userInfo.vue";
import { CertificateInformation } from "./components/certificateInformation.vue";
import { UserOrderRecond } from "./components/userOrderRecond.vue";
import { StudentClass } from "./components/studentClass.vue";
import { StudyProgress } from "./components/studyProgress.vue";
import { areaList } from "@vant/area-data";
import { mapGetters } from "vuex";
import Select from "@/components/select/index.vue";

import {
  getUserInfo,
  modifyUserInfo,
  updateUserFromOrgId,
  changeStaffId,
} from "@/api/customer";
export default {
  components: {
    Select,
    UserInfo,
    CertificateInformation,
    UserOrderRecond,
    StudentClass,
    StudyProgress
  },
  data() {
    return {
      userInfo: {},
      orderRecond: {},
      studentClass: [],
      userProject: [],
      studyProgress: {},
      active: 0,
      defaultAvator: "../../static/avator.png",
      uid: "",
      cid: "",
      staff: "",
      // 选择客户来源、学历
      sheetShow: false,
      sheetActions: [],
      sheetChecked: "",

      // 省市区弹窗
      popupShow: false,
      areaList,

      //所属老师
      selectStaffShow: false,
      // 机构
      selectOrgShow: false,
      //   性别
      sexOptions: [
        {
          name: "男",
          value: 1,
        },
        {
          name: "女",
          value: 2,
        },
      ],
      // 修改需要的参数
      formData: {
        id: "",
        surname: "",
        mobile: "",
        id_card_number: "",
        sex: "",
        culture: "",
        province: "", // 籍贯
        city: "",
        sources: "",
        from_organization_id: "",
        tips: "",
        is_graduate: "",
        online_course: "",
      }
    };
  },
  computed: {
    ...mapGetters(["fromOptions", "eduOptions", "staffOptions", "orgOptions"]),
    institutionOptions() {
      return this.orgOptions.map((item) => ({
        name: item.institution_name,
        value: item.institution_id,
      }));
    },
  },
  onLoad({ uid, cid }) {
    this.uid = uid;
    this.cid = cid;
    this.getUserInfo();
  },
  methods: {
    // 初始化修改的参数
    initFormData() {
      for (const k in this.formData) {
        this.formData[k] = this.userInfo[k] || "";
      }
    },
    // 打开老师，机构选择器
    handleOpenSelect(key) {
      switch (key) {
        case "staff":
          this.selectStaffShow = true;
          break;
        case "org":
          this.selectOrgShow = true;
          break;
      }
    },
    // 修改用户信息
    async modifyUserInfo(newData) {
      const data = {
        ...this.formData,
        ...newData,
      };
      await modifyUserInfo(data);
      this.getUserInfo();
    },
    // 选择所属机构
    handleSelectOrgChange(checked) {
      this.selectOrgShow = false;
      this.updateUserFromOrgId(checked.value);
    },
    // 修改机构
    async updateUserFromOrgId(institution_id) {
      const data = {
        institution_id,
        uid_arr: [this.uid],
      };
      await updateUserFromOrgId(data);
      this.getUserInfo();
    },
    // 选择所属老师
    handleSelectChange(checked) {
      this.selectStaffShow = false;
      this.changeStaffId(checked.staff_id);
    },
    // 修改所属老师
    async changeStaffId(staff_id) {
      const data = {
        id: this.userInfo.id,
        staff_id,
      };
      await changeStaffId(data);
      this.getUserInfo();
    },
    // 选择省市区
    handleAreaConfirm({ detail }) {
      const { values } = detail;
      this.modifyUserInfo({ province: values[0].code, city: values[1].code });
      this.popupShow = false;
    },
    // 选择客户来源、学历,性别
    handleOpenSheet(key) {
      this.sheetChecked = key;
      this.sheetActions = this[key];
      this.sheetShow = true;
    },
    onSheetSelect({ detail }) {
      switch (this.sheetChecked) {
        case "sexOptions":
          this.modifyUserInfo({ sex: detail.value });
          break;
        case "fromOptions":
          this.modifyUserInfo({ sources: detail.name });
          break;
        case "eduOptions":
          this.modifyUserInfo({ culture: detail.name });
          break;
      }
    },
    handleTabClick(event) {
      // console.log("event", event);
    },
    handleSignUp() {
      const { uid, surname, mobile, id_card_number } = this.userInfo;
      const url = `/subPackages/customeSignUp/index?userId=${uid}&userName=${surname}&userMobile=${mobile}&userIdCard=${id_card_number}`;
      uni.navigateTo({ url });
    },
    async getUserInfo() {
      const param = { uid: this.uid, cid: this.cid };
      const res = await getUserInfo(param);
      const data = res.data
      this.userInfo = data  
      this.staff = data.admin_name ? data.admin_name + ',' + data.union_staff_name : data.union_staff_name
      this.initFormData();
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
@import "@/styles/logan";

@avator-width: 100rpx;
@avator-height: 100rpx;
.customer-details {
  height: 100%;
  .header {
    height: 180rpx;
    padding: 0 40rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .header-info {
      display: flex;
      flex-direction: row;
      .header-info-avator {
        width: @avator-width;
        height: @avator-height;
        .info-avator-img {
          width: @avator-width;
          height: @avator-height;
          border-radius: 50%;
        }
      }
      .header-info-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 10rpx;
        height: @avator-height;
        .infor-text__name {
          display: inline-block;
          max-width: 240rpx;
          height: 54rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: @font-size-lg;
          color: @text-color;
        }
        .infor-text__phone {
          display: inline-block;
          font-size: @font-size-sm;
          color: @text-color-grey;
        }
      }
    }
    .header-btn {
      width: 212rpx;
      height: 68rpx;
      button {
        font-size: @font-size-sm;
        color: #ffffff;
        border-radius: 30rpx;
        background-color: @primary;
      }
    }
  }
  .main {
    height: calc(100vh - 180rpx);
    overflow-y: auto;
  }
}

/deep/.custom-tab {
  font-size: 28rpx;
}
</style>
