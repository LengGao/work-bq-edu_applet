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
        title="其他金额"
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
        title-width="140rpx"
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
        input-align="right"
        placeholder="请输入回款金额"
        :value="formData.pay_money"
        @input="({ detail }) => (formData.pay_money = detail)"
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
          @delete="
            ({ detail }) => formData.receipt_file.splice(detail.index, 1)
          "
        />
      </van-cell>
    </van-cell-group>

    <view style="display: block; height: 320rpx;"></view>
    <view class="footer">
      <view class="tags">
        *回款时必须保证回款金额等于所选回款计划的总金额，如不相等请先修改回款计划
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
      :max-date="currentDate"
    />
  </view>
</template>

<script>
import Title from "@/components/title/index.vue";
import Select from "@/components/select/index.vue";
import DatePicker from "@/components/datePicker/index.vue";
import { mapGetters } from "vuex";
import { accAdd } from "@/utils/index";
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
      planCheckedIndex: [], // 当前选择的回款计划索引
      // 选择支付方式
      sheetShow: false, 
      sheetActions: [],
      sheetChecked: "",

      orderMoney: '0.00', // 订单金额
      totalMoney: '0.00', // 总报名项目金额
      otherMoney: '0.00', // 其他费用 也就是回款计划中已选择的总额
      
      // 提交表单
      formData: {
        pay_day: '',      // 回款日期
        pay_money: '',    // 回款金额
        pay_type: '',     // 支付方式
        pay_plan_ids: '', // 选择回款计划id
        receipt_file: []
      },
    };
  },
  onLoad(query) {
    let q = JSON.parse(decodeURIComponent(query.params))    
    this.formData = Object.assign(this.formData, q)
    // console.log("customeSignPayRecond:", q);
    let payList = q.payList, money = this.computeMoney(payList)
    this.totalMoney = q.order_money                                 // 总学费
    this.otherMoney = money.otherMoney                              // 防护学
    this.orderMoney = accAdd(money.otherMoney, q.order_money)       // 订单总额

    this.getPlanData(payList)
  },
  onUnload() {
    if (uni.getStorageSync('plan')) [
      uni.removeStorageSync("plan")
    ]
  },
  methods: {
    // 订单小姐金额计算
    computeMoney(arr) {
      let totalMoney = 0, otherMoney = 0, orderMoney = 0
      for(let i = arr.length - 1; i >= 0; i--) {
        let item = arr[i]
        // console.log(item, item.type == 1);
        if (item.type == 1) {
          totalMoney = accAdd(totalMoney, item.money)
        } else {
          otherMoney = accAdd(otherMoney, item.money)
        }
      }
      orderMoney = accAdd(totalMoney, otherMoney)
      return { totalMoney, otherMoney, orderMoney }
    },
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
      this.formData.pay_plan_ids = ids
      let money = names.map(name => name.split(' ')[2].replace('￥', ''))
      let val = 0;
      for(let i = money.length - 1; i >=0; i--) {
        let _val = money[i] 
        val = accAdd(val, _val)
      }
      this.formData.pay_money = val 
    },
    // 回款日期
    handleDateChange(day) {
      this.datePickerShow = false;
      this.formData.pay_day = day;
    },
    handleCancel() {
      uni.navigateBack()
      if (uni.getStorageSync('plan')) [
        uni.removeStorageSync("plan")
      ]
    },
    // 保存
    handleSave() {
      let validator = [
          { key: "surname",errmsg: "客户姓名不能为空" },
          { key: "id_card_number", errmsg: "请输入正确的身份证号码", minLength: 18 },
          { key: "mobile", errmsg: "请输入正确的手机号", reg: /^1[3-9]\d{9}$/ },
          { key: "pay_plan_ids", errmsg: "请配置回款计划" },
          { key: "order_money", errmsg: "请输入订单金额" },
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
        if (!this.formData[item.key] && item.key !== 'pay_money' && item.key !== 'order_money') {
          uni.showToast({
            icon: "none",
            title: item.errmsg,
          });
          return;
        }
        // if (item.key === 'pay_money') {
        //   let pay_money = this.formData[item.key]
        //   if (parseFloat(pay_money) <= 0) {
        //     uni.showToast({
        //       icon: 'none',
        //       title: '回款金额不能小于等于0'
        //     })
        //     return;
        //   }
        // }
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
        id: item.id,
      }))
    },
    // 上传凭证
    async handleAfterRead({ detail }) {
      const { file } = detail;
      const { url } = await uploadImage(file);
      this.formData.receipt_file.push({ url, isImage: true });
    },
    // 报名缴费
    async createCrmOrder() {
      let formData = this.formData,
          receipt_file = formData.receipt_file.map(item => item.url)
          
      // 来源数据的'-'需要特殊处理
      let source = formData.source.trim()
      if (source === '') { source = '-' }

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
        source: source,
        receipt_file: receipt_file,
        pay_day: formData.pay_day,
        pay_money: formData.pay_money,
        pay_type: formData.pay_type,
        pay_plan_ids: formData.pay_plan_ids,
        pay_plan: []
      };

      data.pay_plan = formData.payList.map((item, index) => {
        if (this.planCheckedIndex.indexOf(index) !== -1) {
          if (data.type == 0) {
            return { temp_id: item.id, year: item.year, type: item.type, day: item.day,money: item.money, project_ids: item.project_ids || '' }
          } else {
            return { temp_id: item.id, year: item.year, type: item.type, day: item.day,money: item.money, project_ids: item.project_ids || '' }
          }
        } else {
          return ''
        }
      }).filter(i => (!!i))
      
      this.saveLoading = true;
      const res = await createCrmOrder(data).catch(() => { this.saveLoading = false; })
      
      if (res.code === 0) {
        setTimeout(() => {
          this.saveLoading = false;          
          uni.reLaunch({ url: '/subPackages/customerList/index' })
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
  }

  /deep/.van-button {
    width: 300rpx;
  }
}
.hr {
  width: 100%;;
  height: 20rpx;
  background-color: @background-color;
}
</style>