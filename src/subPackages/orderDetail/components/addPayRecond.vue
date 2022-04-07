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
        title-width="140rpx"
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

    <view style="display: block; height: 280rpx;"></view>
    <view class="footer">
      <view class="tags"> 
          * 回款时必须保证回款金额等于所选回款计划的总金额，如不相等请先修改回款计划 
      </view>

      <view class="footer-submit">
        <van-button custom-style="width: 300rpx" round @click="handleCancel">取消</van-button>
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
      multiple
    />

    <DatePicker
      :show="datePickerShow"
      @close="datePickerShow = false"
      @cancel="datePickerShow = false"
      @confirm="handleDateChange"
      :value="currentDate"
      :max-date="currentDate"
    />
  </view>
</template>

<script>
import Title from "@/components/title/index.vue";
import Select from "@/components/select/index.vue";
import DatePicker from "@/components/datePicker/index.vue";
import { mapGetters } from "vuex";
import { accAdd } from "@/utils/index"
import { uploadImage } from "@/api/customer";
import { payLogCreate } from "@/api/order";

export default {
  components: {
    Title,
    Select,
    DatePicker
  },
  computed: {
    ...mapGetters(["payTypeOptions"]),
  },
  props: {
    orderId: {
      type: [String, Number],
      default: ''
    },
    payPlans: {
      type: Array,
      default: []
    },
    orderMoney: {
      type: [String, Number],
      default: '0.00'
    },
    totalMoney: {
      type: [String, Number],
      default: '0.00'
    },
    otherMoney: {
      type: [String, Number],
      default: '0.00'   
    }
  },
  data() {
    return {
      saveLoading: false,                 // 板寸按钮加载状态
      // 日期选择
      datePickerShow: false,              // 回款日期
      currentDate: new Date().getTime(),  // 默认时间
      // 回款计划
      selectShow: false,                  // 选择回款计划
      planCheckedName: '',                // 当前选择计划
      planOptions: [],                    // 回款计划选项
      // 选择支付方式
      sheetShow: false,                   // 显示活动满版
      sheetActions: [],                   // 活动满版数据
      sheetChecked: "",                   // 当前选择活动满版
      // 提交表单 
      formData: {
        pay_day: '',                      // 当前回款计划
        pay_money: '',                    // 回款金额
        pay_type: '',                     // 支付类型
        pay_plan_id: '',                  // 回款计划
        receipt_file: []                  // 回款凭证
      }
    };
  },
  watch: {
    'payPlans': function(newVal) {
        let addRecondPlan = this.resolveRecondPlan(newVal)
        this.planOptions = this.getPlanData(addRecondPlan)
    }
  },
  mounted() {
    // console.log("3", this.payPlans);
    let addRecondPlan = this.resolveRecondPlan(this.payPlans)
    this.planOptions = this.getPlanData(addRecondPlan)
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
      // console.log("handleSelectChange", detail);
      let ids = [], names = [], moneyAll = 0, money = 0

      detail.forEach(item => {
        ids.push(item.value)
        names.push(item.name)
        money = parseFloat(item.name.split('￥')[1] || 0)
        moneyAll = accAdd(moneyAll, money)
      })
      this.planCheckedName = names.join(',')
      this.formData.pay_plan_id = ids.join(',')
      this.formData.pay_money = moneyAll
      this.selectShow = false
    },
    // 回款日期
    handleDateChange(day) {
      this.datePickerShow = false;
      this.formData.pay_day = day;
    },
    // 重置状态
    reset() {
      let formData = this.formData
      
      for(let k in formData) {
        let val = formData[k]
        if (Array.isArray(val)) { 
          val = [];
        } else {
          val = 0
        }
      }

      this.formData = formData
      this.planCheckedName = ''
    },
    // 取消
    handleCancel() {
      this.$emit('close')
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
        this.createPayLog()
      }

      this.validate(validator, callback)
    },
    validate(arr, cb) {
      for (const item of arr) {
        if (!this.formData[item.key] && item.key !== 'pay_money') {
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
    // 上传凭证
    async handleAfterRead({ detail }) {
      const { file } = detail;
      const { url } = await uploadImage(file);
      this.formData.receipt_file.push({ url, isImage: true });
    },
    // 创建回款记录
    async createPayLog() {
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
        this.$emit('close')
        this.reset()
      }
    },
    // 获取配置好的计划
    getPlanData(data = []) {
      return data.map(item => ({
        name: `${item.year} ${item.name} ￥${item.money || 0}`,
        value: item.id
      }))
    },
    // 获取当前可选择的计划数据
    resolveRecondPlan(plan = []) {
      // console.log('resolveRecondPlan', plan);
      return plan.filter(item => parseFloat(item.pay_money) == 0)      
    },
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/var";
.sign-submit {
  width: 100%;
  overflow: hidden;

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    background-color: #fff;

    .tags {
      padding: 20rpx;
      margin: 20rpx 20rpx 40rpx;
      font-size: 24rpx;
      color: #ff4b4b;
    }


    &-submit {   
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 40rpx 20rpx;
      background-color: #fff;
    }

    /deep/.van-button {
      width: 300rpx;
    }
  }
}

/depp/.label {
  font-size: @font-size-md;
}

/deep/.input {
  font-size: @font-size-md;
}

.hr {
  width: 100%;;
  height: 30rpx;
  background-color: @background-color;
}
</style>