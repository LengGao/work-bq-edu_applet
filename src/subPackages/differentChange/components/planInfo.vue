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
    <van-cell-group custom-class="group-cell" v-for="(item, index) in data" :key="item.id">
      <van-cell
        title="回款日期"
        is-link
        required
        title-class="label"
        value-class="input"
        :value="item.pay_date || '请选择'"
        @click="handleDataSelect(item, index)"
      />

      <van-cell
        title="回款计划"
        is-link
        required
        title-class="label"
        value-class="input"
        :value="item.planCheckedName || '请选择'"
        @click="handlePlanSelect(item, index)"
      />

      <van-field
        required
        type="number"
        label="回款金额"
        label-class="label"
        input-class="input"
        :value="item.pay_money"
        placeholder="请输入回款金额"
        input-align="right"
        @blur="({ detail }) => 
          detail.value !== item.pay_money && 
          $emit('dynamic-input', 'planRecond', {pay_money: detail.value}, index)
        "
      />
      <van-cell
        title="支付方式"
        required
        is-link
        title-class="label"
        value-class="input"
        title-width="200rpx"
        :value="item.pay_type || '请选择'"
        @click="handlePayTypeSelect(item, index)"
      />
      <van-cell title="回款凭证" title-width="160rpx" :border="false">
        <van-uploader
          :file-list="item.receipt_file"
          deletable
          @after-read="({ detail }) => handleAfterRead(detail, index)"
          @delete="({ detail }) => handleDeleteFile(detail, index)"
        />
      </van-cell>
      <view class="hr"></view>
    </van-cell-group>

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
      :value="currentItem.planCheckedIndex"
      other="plan"
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
      :max-date="currentDate"
    />
  </view>
</template>

<script>
import Title from "@/components/title/index.vue";
import Select from "@/components/select/index3.vue";
import DatePicker from "@/components/datePicker/index.vue";
import { mapGetters } from "vuex";
import { accAdd } from "@/utils/index"
import { createCrmOrder, uploadImage } from "@/api/customer";

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
    info: {
      type: Array,
      default: []
    },
    paylist: {
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
      saveLoading: false, // 板寸按钮加载状态
      // 日期选择
      datePickerShow: false, // 回款日期
      currentDate: new Date().getTime(),
      // 回款计划
      selectShow: false, // 选择回款计划
      planOptions: [], // 回款计划选项
      planCheckedName: "", // 当前选择的会跨计划
      planCheckedIndex: [], // 当前选择的会跨计划索引
      // 选择支付方式
      sheetShow: false, 
      sheetActions: [],
      sheetChecked: "",
      // 提交表单
      data: [],
      planLog: [],
      currentItem: {name: '', value: ''},
      currentIndex: 0,
    };
  },
  watch: {
    'paylist': function(newVal) {
      this.getPlanData(newVal)
    },
    'otherMoney': function(newVal) {
      console.log('otherMoney',newVal);
      this.otherMoney = newVal
    },
    'totalMoney': function(newVal) {
      console.log('totalMoney', newVal);
      this.totalMoney = newVal
    }
  },
  mounted() {
    this.data = this.info
    this.getPlanData(this.paylist)
  },
  methods: {
    // 日期玄额
    handleDataSelect(item, index) {
      this.datePickerShow = true
      this.currentItem = item
      this.currentIndex = index
    },
    // 回款计划选择
    handlePlanSelect(item, index) {
      this.currentItem = item
      this.currentIndex = index
      this.selectShow = true
    },
    handlePayTypeSelect(item, index) {
      this.openSheet('payTypeOptions')
      this.currentItem = item
      this.currentIndex = index
    },
    // 支付方式
    onSheetSelect({ detail }) {
      let item = this.currentItem, index = this.currentIndex
      item.pay_type = detail.name
      this.data[index] = item
      this.$emit('dynamic-input', 'planRecond', { pay_type: detail.name }, index)
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
      let item = this.currentItem, index = this.currentIndex
      item.planCheckedName = names[0] ? `${names[0]} (${names.length})` : '请选择'       
      item.planCheckedIndex = indexs
      item.pay_plan_id = ids

      let money = names.map(name => name.split(' ')[2].replace('￥', ''))
      let val = 0;
      for(let i = money.length - 1; i >=0; i--) {
        let _val = money[i] 
        val = accAdd(val, _val)
      }
      item.pay_money = val 

      this.data[index] = item
      this.$emit('dynamic-input', 'planRecond', { pay_money: val, pay_plan_id: ids }, index)
    },
    // 回款日期
    handleDateChange(day) {
      this.datePickerShow = false;
      let item = this.currentItem, index = this.currentIndex
      item.pay_date = day
      this.data[index] = item
      this.$emit('dynamic-input', 'planRecond', { pay_date: day }, index)
    },
    handleCancel() {
      uni.navigateBack()
    },
    // 保存
    handleSave() {
      let validator = [
          { key: "surname",errmsg: "客户姓名不能为空" },
          { key: "id_card_number", errmsg: "请输入正确的身份证号码", minLength: 18 },
          { key: "mobile", errmsg: "请输入正确的手机号", reg: /^1[3-9]\d{9}$/ },
          { key: "pay_plan_ids", errmsg: "请配置回款计划" },
          { key: "order_money", errmsg: "请输入学费金额" },
          { key: "pay_money", errmsg: "请输入回款金额" },
          { key: "pay_type", errmsg: "请选择支付方式" },
          { key: "pay_day", errmsg: "请选择回款日期" },
      ]

      const callback = () => {
        this.createCrmOrder()
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
      console.log("getPlanData", data );
      this.planOptions = data.map((item, index) => ({
        name: `${item.year} ${item.name} ￥${item.money || 0}`,
        value: index,
        id: item.id
      }))
    },
    // 删除上传
    handleDeleteFile(detail, index) {
      let _data = this.data[index].receipt_file
      _data.splice(detail.index, 1)
      this.data[index].receipt_file = _data
      this.$emit('dynamic-input', 'planRecond', { receipt_file: _data }, index)
    },
    // 上传凭证
    async handleAfterRead(detail, index) {
      const { file } = detail;
      const { url } = await uploadImage(file);
      let _data = this.data[index].receipt_file
      _data.push({ url, isImage: true });
      this.data[index].receipt_file = _data
      this.$emit('dynamic-input', 'planRecond', {receipt_file: _data}, index)
    },
    // 报名缴费
    async createCrmOrder() {
      let formData = this.formData,
          receipt_file = formData.receipt_file.map((item) => item.url)
      
      let data = {
        order_token: Date.now(),
        id: formData.id,
        order_money: formData.order_money,
        surname: formData.surname,
        mobile: formData.mobile,
        id_card_number: formData.id_card_number,
        tips: formData.tips,
        union_staff_id: formData.union_staff_id,
        type: formData.type,
        project: formData.project,
        project_pay_money: formData.project_pay_money,
        jiebie_id: formData.jiebie_id,
        source: formData.source,
        receipt_file: receipt_file,
        pay_day: formData.pay_day,
        pay_money: formData.pay_money,
        pay_type: formData.pay_type,
        pay_plan_ids: formData.pay_plan_ids,
        pay_plan: []
      };

      data.pay_plan = formData.payList.map((item, index) => {
        if (this.planCheckedIndex.indexOf(index) !== -1) {
          return { temp_id: item.id, year: item.year, type: item.type, day: item.day,money: item.money }
        }
      })
      
      this.saveLoading = true;
      const res = await createCrmOrder(data).catch(() => { this.saveLoading = false; })
      
      if (res.code === 0) {
        setTimeout(() => {
          this.saveLoading = false;          
          uni.reLaunch({ url: '/subPackages/orderApprove/index' })
        }, 800);
      }
    },
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/var";

.sign-submit {
  width: 100%;
  overflow: hidden;
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