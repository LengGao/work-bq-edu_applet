<template>
  <view class="user-info">
    <van-cell-group>
      <van-cell title="客户姓名" title-class="title">
        <template v-if="!showFooter"><text class="value">{{ data.surname }}</text></template>
        <template v-else>
          <van-field
            placeholder="请输入用户名"
            :value="data.surname"
            placeholder-style="text-align:right; font-size: 28rpx;"
            custom-style="font-size: 28rpx; padding: 0;"
            input-align="right"
            @change="handeleNameChange"
          />
        </template>
      </van-cell>
      <van-cell title="手机号码" title-class="title">
        <template v-if="!showFooter"><text class="value">{{ data.mobile }}</text></template>
        <template v-else>
          <van-field
            placeholder="请输入手机号码"
            :value="data.mobile"
            placeholder-style="text-align:right; font-size: 28rpx;"
            custom-style="font-size: 28rpx; padding: 0;"
            input-align="right"
            @change="handeleChangeMobile"
          />
        </template>
      </van-cell>
      <van-cell title="身份证号" title-class="title">
        <text class="value">{{ data.id_card_number }}</text>
      </van-cell>
      <van-cell title="性别" title-class="title">
        <template v-if="!showFooter"><text class="value">{{ data.sex === 0 ? '女': '男' }}</text></template>
        <template v-else>
          <van-radio-group
            class="right"
            direction="horizontal"
            v-model="data.sex"
            @change="handleRadioChange"
          >
            <van-radio :name="1">男</van-radio>
            <van-radio :name="0">女</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-cell title="文化程度" title-class="title" @click="() =>  evetnBlurs('eduOptions')">
        <text class="value">{{data.culture}}</text>
      </van-cell>
        <van-action-sheet
          :show="eduOptionsShow"
          :actions="eduOptions"
          @close="eduOptionsShow = false"
          @select="handlePicker"
        />
      <van-cell title="客户来源" title-class="title" @click="() => evetnBlurs('fromOptions')">
        <text class="value">{{data.sources}}</text>
      </van-cell>
       <van-action-sheet
          :show="fromOptionsShow"
          :actions="fromOptions"
          @close="fromOptionsShow = false"
          @select="handlePicker"
        />
      <van-cell title="客户地区" title-class="title" @click="() => evetnBlurs('customRage')">
        <text class="value">{{customRage}}</text>
      </van-cell>
      <van-popup :show="customRageShow" position="bottom">
        <van-area
            :area-list="areaList"
            @cancel="customRageShow = false"
            @confirm="handlePicker"
          />
      </van-popup>
      <van-cell title="所属老师" title-class="title" @click.stop="() => evetnBlurs('staffOptions')">
        <text class="value">{{data.admin_name}}</text>
      </van-cell>
        <van-action-sheet
          :show="staffOptionsShow"
          :actions="staffOptions"
          @close="staffOptions = false"
          @select="handlePicker"
        />
      <van-cell title="客户性质" title-class="title">
        <text class="value">{{ data.customer_type }}</text>
      </van-cell>
      <van-cell title="机构名称" title-class="title" @click="evetnBlurs('orgOptions')">
        <text class="value">{{data.from_organization_name}}</text>
      </van-cell>
        <van-popup :show="orgOptionsShow" position="bottom">
          <van-picker 
            value-key="name" 
            :columns="orgOptions" 
            show-toolbar
            toolbar-position="top"
            confirm-button-text="确定"
            @confirm="handlePicker"
            @cancel="orgOptionsShow = false"
          />
        </van-popup>
      <van-cell title="备注信息" title-class="title" >
        <template v-if="!showFooter">
          <text class="value">{{data.tips}}</text>
        </template>
        <template v-else>
          <van-field
            placeholder="请输入备注信息"
            :value="data.tips"
            placeholder-style="text-align:right; font-size: 28rpx;"
            custom-style="font-size: 28rpx; padding: 0;"
            input-align="right"
            @change="handeleTip"
          />
        </template>
      </van-cell>
    </van-cell-group>

    <view v-if="showFooter" class="footer">
      <button class="cancel-btn" @click="handleCancel">取消</button>
      <button class="confrom-btn" @click="saveUserInfo">保存</button>
    </view>
    <button v-else class="user-info-edit" @click="handleEdit">编辑</button>
  </view>
</template>

<script>
import { postNodify } from "@/api/customer";
import { areaList } from "@vant/area-data";
import { getUserInfo } from "@/api/customer";

export default {
  props: {
    datas: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      areaList,
      showFooter: false,
      enableEdit: false,
      eduOptionsShow: false,
      customRageShow: false,
      fromOptionsShow: false,
      staffOptionsShow: false,      
      orgOptionsShow: false,
      currentPicker: '',
      eduOptions: [],
      customRages: [],
      fromOptions: [],
      staffOptions: [],
      orgOptions: [],
      customRage: '',
      data: {}
    };
  },
  methods: {
    evetnBlurs(eventName) {
      console.log("出发");
      if (!this.showFooter) return;
      switch (eventName) {
        case "eduOptions": 
        this.eduOptionsShow = true
        break;
        case "customRage": 
        this.customRageShow = true
        break;
        case "fromOptions": 
        this.fromOptionsShow = true
        break;
        case "staffOptions": 
        this.staffOptionsShow = true
        break;
        case "orgOptions": 
        this.orgOptionsShow = true
        break;
      }
      this.enableEdit = true
      this.currentPicker = eventName
    },
    handleCancelPopup() {
      this.enableEdit = false
    },
    handeleTip(event) {
      this.data.tips = event.detail
    },
    handlePickerConfirm() {
      console.log("handlePickerConfirm");
    },
    handlePicker(event) {
      console.log("handlePicker", event, this.currentPicker);
      const deteil = event.detail
      switch(this.currentPicker) {
        case "eduOptions": 
        this.data.culture = deteil.name
        this.eduOptionsShow = false
        break;
        case "customRage":
        const { values } = deteil
        const province = values[0].code, city = values[1].code, district = values[2].code
        this.customRage = `${values[0].name}-${values[1].name}-${values[2].name}`
        this.data.province = province
        this.data.city = city
        this.district = district
        this.customRageShow = false
        break;
        case "orgOptions": 
        this.data.from_organization_name = deteil.value.name
        this.orgOptionsShow = false
        break;
        case "fromOptions": 
        this.data.sources = deteil.name
        this.fromOptionsShow = false
        break;
        case "staffOptions": 
        this.data.admin_name = deteil.name
        this.staffOptionsShow = false
        break;
      }
      return event.stopPropagation();
    },
    handeleNameChange(event) {
      this.data.surname = event.detail
    },
    handeleChangeMobile(event) {
      this.data.mobile = event.detail
    },
    handleRadioChange(event) {
      this.data.sex = (+event.detail)
    },
    handleEdit() {
      this.showFooter = true;
    },
    handleCancel() {
      this.showFooter = false;
    },
    saveUserInfo() {
      let data = this.data;
      postNodify(data).then(res => {
        this.showFooter = false
      })
    },
  },
  async created() {
    await this.$store.dispatch('getFromOptions')
    await this.$store.dispatch('getStaffOptions')
    await this.$store.dispatch('getOrganizationOptions')
    const res = await getUserInfo({uid: this.datas.uid}).catch(() => {})
    this.data = res.data
    const { eduOptions, orgOptions, fromOptions, staffOptions } = this.$store.getters
    this.eduOptions = eduOptions
    this.fromOptions = fromOptions
    this.staffOptions = staffOptions.map(item => ({id: item.staff_id, name: item.staff_name}))
    this.orgOptions = orgOptions.map(item => ({id: item.institution_id, name: item.institution_name}))
    this.customRage = `${this.data.province || ''} ${this.data.city || ''} ${this.data.district || ''}`
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.user-info {
  border-top: 20rpx solid #f2f6fc;
  padding-bottom: 200rpx;
  /deep/.title {
    flex: inherit;
    flex-shrink: 0;
    color: #969799;
    font-size: @font-size-sm;
  }
  /deep/.value {
    color: @text-color;
    font-size: @font-size-sm;
  }
}

.user-info-edit {
  float: right;
  width: 122rpx;
  margin: 20rpx 40rpx 0 0;
  font-size: @font-size-sm;
  color: @text-color;
  background-color: rgba(242, 246, 252, 1);
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 120rpx;
  button {
    width: 320rpx;
    height: 88rpx;
    border-radius: 5rpx;
    font-size: @font-size-lg;
  }
  .cancel-btn {
    color: @text-color-grey;
    background-color: rgba(242, 246, 252, 1);
  }
  .confrom-btn {
    color: #ffffff;
    background-color: @primary;
  }
}
.right {
  float: right;
}

.label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  color: #969799;
  font-size: @font-size-sm;
}
</style>