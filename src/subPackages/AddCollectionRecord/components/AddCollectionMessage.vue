<template>
<view class="sign-submit">
    <van-cell-group custom-class="group-cell">
      <van-cell
        title="回款日期"
        is-link
        required
        title-class="label"
        value-class="input"
        :value="formData.pay_day || '请选择'"
        @click="datePickerShow = true"
      />

      <van-cell
        title="回款计划"
        is-link
        required
        title-class="label"
        value-class="input"
        :value="planCheckedName || '请选择'"
        @click="selectShow = true"
      />

      <van-field
        required
        type="number"
        label="回款金额"
        label-class="label"
        input-class="input"
        :value="formData.pay_money"
        placeholder="请输入回款金额"
        @input="({ detail }) => (formData.pay_money = detail)"
        input-align="right"
      />
      <van-cell
        title="支付方式"
        required
        is-link
        title-class="label"
        value-class="input"
        title-width="200rpx"
        :value="formData.pay_type || '请选择'"
        @click="openSheet('payTypeOptions')"
      />
      <van-cell title="回款凭证" title-width="160rpx" :border="false">
        <van-uploader
          :file-list="fileList"
          @after-read="handleAfterRead"
          deletable
          @delete="({ detail }) => fileList.splice(detail.index, 1)"
        />
      </van-cell>
    </van-cell-group>


    <view class="footer">
      <view class="tags"> 
          * 回款时必须保证回款金额等于所选回款计划的总金额，如不相等请先修改回款计划 
      </view>

      <view class="footer-submit">
        <van-button round @click="handleCancel">上一步</van-button>
        <van-button round type="primary" :loading="saveLoading" @click="handleSave">保存</van-button>
      </view>    
    </view>

    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="sheetShow = false"
      @select="onSheetSelect"
    />

    <Select
      :show="selectShow"
      @close="selectShow = false"
      @confirm="handleSelectChange"
      :options="planOptions"
      option-name="name"
      option-value="value"
      multiple
    />


    <DatePicker
      :show="datePickerShow"
      @close="datePickerShow = false"
      @cancel="datePickerShow = false"
      @confirm="handleDateChange"
      :value="currentDate"
    >
    </DatePicker>


</view>
</template>

<script>
import {
  createCrmOrder, uploadImage,
} from "@/api/customer";
import Select from "@/components/select/index.vue";
import DatePicker from "@/components/datePicker/index.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    Select,
    DatePicker
  },
  computed: {
    ...mapGetters(["staffOptions", "payTypeOptions"]),
  },
  data() {
    return {
      selectShow: false, // 选择
      showPlan: false,
      saveLoading: false,
      // 回款日期
      datePickerShow: false,
      currentDate: new Date().getTime(),
      // 上传
      fileList: [],
      //回款计划
      planData: [],
      planOptions: [],
      planCheckedName: "",
      planCheckedIndex: 0,
      // 选择支付方式
      sheetShow: false,
      sheetActions: [],
      sheetChecked: "",
      // 提交表单
      formData: {
        pay_day: '',      // 回款日期
        pay_money: '',    // 回款金额
        pay_type: '',     // 支付方式
        pay_plan_ids: '',
        receipt_file: []
      }
    };
  },
  onLoad(query) {
    let q = JSON.parse(decodeURIComponent(query.params))
    console.log("q", q);
    this.formData = Object.assign(this.formData, q)
    this.planData = this.formData.payList
    this.getPlanData(this.formData.payList)
  },
  methods: {
    // 获取配置好的计划
    getPlanData(data) {
      this.planData = data;
      this.planOptions = data.map((item, index) => ({
        name: `${item.year} ${item.name} ￥${item.money}`,
        value: index,
        id: item.id
      }));
    },
    toConfigPlan() {
      uni.navigateTo({
        url: "/subPackages/payPlanConfig/index",
      });
    },
    onSheetSelect({ detail }) {
      if (this.sheetChecked === "payTypeOptions") {
        this.formData.pay_type = detail.name;
        return;
      }
    },
    // 打开选择客户回款日期、支付方式
    openSheet(key) {
      if (key === "planOptions" && !this.planOptions.length) {
        uni.showToast({
          icon: "none",
          title: "请先配置",
        });
        return;
      }
      this.sheetChecked = key;
      this.sheetActions = this[key];
      this.sheetShow = true;
    },
    // 胡款计划
    handleSelectChange(detail) {
      console.log("detail", detail);
      let names = detail.map(item => item.name)
      let indexs = detail.map(item => item.value)
      let ids = detail.map(item => item.id.split('-')[1] ).join(',')
      this.planCheckedName = `${names[0]} (${names.length})` 
      this.planCheckedIndex = indexs
      this.formData.pay_plan_ids = ids
      this.selectShow = false
    },
    // 回款日期
    handleDateChange(day) {
      this.formData.pay_day = day;
      this.datePickerShow = false;
    },
    // 上传凭证
    async handleAfterRead({ detail }) {
      const { file } = detail;
      const { url } = await uploadImage(file);
      this.fileList.push({ url, isImage: true });
    },
    // 报名缴费
    async createCrmOrder() {
      console.log("from", this.formData);
      let data = {
        order_id: this.formData.order_id,
        pay_date: this.formData.pay_day,
        pay_money: this.formData.pay_money,
        pay_type: this.formData.pay_type,
        plan_id: this.formData.pay_plan_ids,
        receipt_file: this.fileList.map((item) => item.url),
      };
      
      this.saveLoading = true;
      const res = await createCrmOrder(data).catch(() => {
      this.saveLoading = false;
      });
      if (res.code === 0) {
        setTimeout(() => {
          this.saveLoading = false;          
          uni.redirectTo({
            url: '/subPackages/orderApprove/index'
          })
        }, 800);
      }
    },
    // 计划数据处理
    reslvePlanData() {

    },
    handleCancel() {
      uni.navigateBack()
    },
    // 保存
    handleSave() {
      this.validate(
        [
          {
            key: "surname",
            errmsg: "客户姓名不能为空",
          },
          {
            key: "id_card_number",
            errmsg: "请输入正确的身份证号码",
            minLength: 18,
          },
          {
            key: "mobile",
            errmsg: "请输入正确的手机号",
            reg: /^1[3-9]\d{9}$/,
          },
          {
            key: "pay_plan_ids",
            errmsg: "请配置回款计划",
            // minLength: 1,
          },
          {
            key: "order_money",
            errmsg: "请输入订单金额",
          },
          {
            key: "pay_money",
            errmsg: "请输入回款金额",
          },
          {
            key: "pay_type",
            errmsg: "请选择支付方式",
          },
          {
            key: "pay_day",
            errmsg: "请选择回款日期",
          },
        ],
        () => {
          this.createCrmOrder();
        }
      );
    },
    validate(arr, cb) {
      for (const item of arr) {
        if (!this.formData[item.key]) {
          uni.showToast({
            icon: "none",
            title: item.errmsg,
          });
          return;
        }
        if (item.reg) {
          if (!item.reg.test(this.formData[item.key])) {
            uni.showToast({
              icon: "none",
              title: item.errmsg,
            });
            return;
          }
        }
        if (item.minLength) {
          if (this.formData[item.key].length < item.minLength) {
            uni.showToast({
              icon: "none",
              title: item.errmsg,
            });
            return;
          }
        }
      }
      cb && cb();
    },
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/var";

/depp/.label {
  font-size: @font-size-md;
}
/deep/.input {
  font-size: @font-size-md;
}

.footer {
  position: static;
  margin-top: 360rpx;

  .tags {
    padding: 20rpx;
    margin: 0 40rpx;
    font-size: 24rpx;
    color: #FF4B4B; 
    border: @border;
  }

  &-submit {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 40rpx;
    padding: 0 60rpx 60rpx;
    background-color: #fff;
  }

  /deep/.van-button {
    width: 300rpx;
  }
}
</style>