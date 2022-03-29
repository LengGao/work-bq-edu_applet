<template>
<view class="sign-submit">
    <view class="hr"></view>
    <Title customStyle="padding: 20rpx;" title="订单小结"></Title>
    <van-cell-group custom-class="group-cell">
      <van-cell 
        title="学费金额"
        title-class=“label“
        value-class="input"
        :value="totalMoney"
      />
      <van-cell 
        title="其他金额 "
        title-class=“label“
        value-class="input"
        :value="otherMoney"
      />
      <van-cell 
        title="订单总额"
        title-class=“label“
        value-class="input"
        :value="orderMoney"
      />
    </van-cell-group>

    <view class="hr"></view>
    <Title customStyle="padding: 20rpx;" title="回款记录"></Title>
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
        readonly
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
          :file-list="formData.receipt_file"
          @after-read="handleAfterRead"
          deletable
          @delete="({ detail }) => formData.receipt_file.splice(detail.index, 1)"
        />
      </van-cell>
    </van-cell-group>


    <view class="footer">
      <view class="tags"> 
          * 回款时必须保证回款金额等于所选回款计划的总金额，如不相等请先修改回款计划 
      </view>

      <view class="footer-submit">
        <van-button custom-style="width: 300rpx" round @click="handleCancel">上一步</van-button>
        <van-button custom-style="width: 300rpx" round type="primary" @click="handleSave">保存</van-button>
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
      :min-date="currentDate"
    />


</view>
</template>

<script>
import Select from "@/components/select/index.vue";
import DatePicker from "@/components/datePicker/index.vue";
import { mapGetters } from "vuex";
import { uploadImage } from "@/api/customer";
import { payLogCreate } from '@/api/order'

export default {
  components: {
    Select,
    DatePicker
  },
  computed: {
    ...mapGetters(["staffOptions", "payTypeOptions"]),
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    payList: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      saveLoading: false, // 板寸按钮加载状态
      // 日期选择
      datePickerShow: false, // 回款日期
      currentDate: new Date().getTime(),
      // 回款计划
      selectShow: false, // 选择回款计划
      planData: [], // 回款计划数据
      planOptions: [], // 回款计划选项
      planCheckedName: "", // 当前选择的会跨计划
      planCheckedIndex: [], // 当前选择的会跨计划索引
      // 选择支付方式
      sheetShow: false, 
      sheetActions: [],
      sheetChecked: "",

      totalMoney: '0.00',
      otherMoney: '0.00',
      orderMoney: '0.00',
      // 提交表单
      formData: {
        pay_day: '',      // 回款日期
        pay_money: '',    // 回款金额
        pay_type: '',     // 支付方式
        pay_plan_id: '', // 选择回款计划id
        receipt_file: []
      },
    };
  },
  mounted() {
    this.getPlanData(this.payList)
  },
  methods: {
    // 支付方式
    onSheetSelect({ detail }) {
      this.formData.pay_type = detail.name;
    },
    // 打开选择客户回款日期、支付方式
    openSheet(key) {
      this.sheetChecked = key;
      this.sheetActions = this[key];
      this.sheetShow = true;
    },
    // 胡款计划
    handleSelectChange(detail) {
      this.selectShow = false
      let names = detail.map(item => item.name)
      let indexs = detail.map(item => item.value)
      let ids = detail.map(item => item.id).join(',')
      this.planCheckedName = names[0] ? `${names[0]} (${names.length})` : '请选择'
      this.planCheckedIndex = indexs
      this.formData.pay_plan_id = ids
    },
    // 回款日期
    handleDateChange(day) {
      this.datePickerShow = false;
      this.formData.pay_day = day;
    },
    handleCancel() {
      this.$emit('cancel')
    },
    // 保存
    handleSave() {
      let validator = [
          { key: "pay_plan_id", errmsg: "请配置回款计划" },
          { key: "pay_money", errmsg: "请输入回款金额" },
          { key: "pay_type", errmsg: "请选择支付方式" },
          { key: "pay_day", errmsg: "请选择回款日期" },
      ]

      const callback = () => {
        this.payLogCreate()
      }

      this.validate(validator, callback)
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
      
      if (cb) cb();
    },
    // 获取配置好的计划
    getPlanData(data) {
      this.planData = data;
      this.planOptions = data.map((item, index) => ({
        name: `${item.year} ${item.name} ￥${item.money}`,
        value: index,
        id: item.id
      }))
    },
    // 上传凭证
    async handleAfterRead({ detail }) {
      const { file } = detail;
      const { url } = await uploadImage(file);
      this.formData.receipt_file.push({ url, isImage: true });
    },
    // 创建回款记录
    async payLogCreate() {
      let formData = this.formData
      let data = { 
            order_id: this.orderId,
            pay_date: formData.pay_day,
            plan_id: formData.pay_plan_id,
            pay_money: formData.pay_money,
            pay_type: formData.pay_type,
            receipt_file: formData.receipt_file.map(item => item.url)
          }
      let res = await payLogCreate(data).catch(() => {})
      if (res.code == 0) {
        uni.showToast({ icon: 'none', title: '创建成功' })
        this.$emit("confirm")
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/var";
.sign-submit {
  width: 100%;
  overflow: hidden;

  /depp/.label {
    font-size: @font-size-md;
  }

  /deep/.input {
    font-size: @font-size-md;
  }

  .footer {
    position: absolute;
    bottom: 20rpx;
    left: 0;

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
      padding: 0 40rpx;
      background-color: #fff;
    }
  }
}
</style>