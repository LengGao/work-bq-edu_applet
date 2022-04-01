<template>
  <view class="order-detail">
    <template v-if="detailData.reshuffle_list && detailData.reshuffle_list.length">
      <van-notice-bar
        wrapable
        v-if="detailData.reshuffle_list[unusualIndex].status === 3"
        left-icon="volume-o"
        :text="`驳回原因：${detailData.reshuffle_list[unusualIndex].tips || '无'}`"
      />
      <van-notice-bar v-else wrapable left-icon="volume-o"
        :text="`异动原因：${detailData.reshuffle_list[unusualIndex].reason};${detailData.reshuffle_list[unusualIndex].desc}`"
      />
    </template>

    <van-notice-bar
      v-if="detailData.verify_status === 9 && !isChange"
      wrapable
      left-icon="volume-o"
      :text="`驳回原因：${detailData.verify_step[0].tips || '无'}`"
    />

    <view class="order-detail-header">
      <view class="order-detail-header-title"
        >{{ detailData.surname || "" }}-{{detailData.project_name || ""}}
          <van-tag :type="verifyTypeMaps[detailData.verify_type].type" plain>
              {{ verifyTypeMaps[detailData.verify_type].text }}
          </van-tag>
      </view>
      <view class="order-detail-header-other"
        >{{ detailData.create_time || "" }} |
        <text style="color: #fd6500; margin-left: 10rpx">{{detailData.total_money | moneyFormat}}</text>
      </view>
    </view>

    <view class="order-detail-steps" v-if="!isChange">
      <van-steps :steps="steps" :active="stepActive" :active-color="stepActiveColor" />
    </view>

    <van-tabs animated swipeable color="#199fff" :ellipsis="false" @change="handleTabsChange">
      <van-tab title="订单信息">
        <OrderInfo :data="detailData" />
      </van-tab>
      <van-tab title="项目信息">
        <ProjectInfo :data="detailData" />
      </van-tab>
      <van-tab title="回款记录">
        <PayRecord
          v-if="detailData"
          :isApprove="isApprove"
          :isChannel="isChannel"
          :passParams="passParams"
          :data="detailData"
          @add-click="onAdd"
          @setting="onSetting"
        />
      </van-tab>
      <van-tab
        :title="`学籍异动${index + 1}`"
        v-for="(item, index) in orderTransactionData"
        :key="item.id"
      >
        <StudentStatusChangeRecord :data="item" />
      </van-tab>
      <van-tab
        :title="`异动记录${index + 1}`"
        v-for="(item, index) in detailData.reshuffle_list"
        :key="index"
      >
        <ChangeRecord :data="item.new_detail" />
      </van-tab>
    </van-tabs>

    <!-- 是审批且异动的相关操作 -->
    <template v-if="!isChannel">

    <template v-if="isApprove">
      <van-tabbar
        :active="1"
        active-color="#43d100"
        inactive-color="#fd6500"
        @change="handleTabbarChange"
      >
        <template v-if="
          ( isChange && 
            detailData.reshuffle_list.length && 
            detailData.reshuffle_list[0].my_reshuffle_review ) || 
            detailData.is_my_review"
        > 
          <van-tabbar-item icon="clear" name="2">驳回</van-tabbar-item>
          <van-tabbar-item icon="checked" name="1">
            <text style="color: #59D234;"> 通过 </text>
          </van-tabbar-item>
        </template> 
      </van-tabbar>
    </template>

    <!-- 订单相关操作 -->
    <template v-else>
      <van-tabbar @change="handleTabbarChange">
        <van-tabbar-item v-if="detailData.verify_status <= 1 && !detailData.reshuffle" name="3" icon="revoke">
          撤回
        </van-tabbar-item>
        <van-tabbar-item v-if="(
          detailData.verify_status == 8 ) && 
          !detailData.is_deleted
          " 
          name="4" icon="delete-o">
          删除
        </van-tabbar-item>  
        <van-tabbar-item v-if="detailData.refund_button && !detailData.reshuffle" name="5" icon="failure">
          退款作废
        </van-tabbar-item>
        <van-tabbar-item v-if="(
          detailData.verify_status < 4 || 
          detailData.verify_status >= 8 ) && 
          !detailData.reshuffle
          " 
          name="6" icon="orders-o"
        >
          申请异动
        </van-tabbar-item>
        <van-tabbar-item v-if="detailData.verify_status < 3" name="7" icon="smile-o">
          催办
        </van-tabbar-item>
      </van-tabbar>
    </template>

    </template>
    <template v-if="isChange && detailData.reshuffle_list && detailData.reshuffle_list.length">
      <Seal type="warning" v-if="detailData.reshuffle_list[0].status === 3">已驳回</Seal>
      <Seal type="success" v-if="detailData.reshuffle_list[0].status === 2">已通过</Seal>
      <Seal type="warning" v-if="detailData.reshuffle_list[0].status === 8">已撤回</Seal>
    </template>
    <template v-else>
      <Seal type="warning" v-if="detailData.is_deleted == 1">已删除</Seal>
    </template>
  
    <van-popup custom-class="pay-drawer" position="bottom" :show="settingPayPlanShow">
    <SettingPayPlan
      v-if="detailData.pay_plan && detailData.pay_plan.length > 0"
      :orderId="orderId"
      :type="detailData.type"
      :projectOption="projectOption"
      :list="detailData.pay_plan"
      :totalMoney="totalMoney"
      @close="cancelSetting"
    />
    </van-popup>
    
    <van-popup custom-class="pay-drawer" position="bottom" :show="addPayRecondShow">
    <AddPayRecond 
      v-if="detailData.pay_log && detailData.pay_plan.length > 0"
      :orderId="orderId"
      :info="detailData.pay_log"
      :paylist="detailData.pay_plan"
      :orderMoney="orderMoney"
      :totalMoney="totalMoney"
      :otherMoney="otherMoney"
      @close="cancelAdd"
    />
    </van-popup>


    <van-dialog id="van-dialog" />
    <van-dialog
      use-slot
      title="驳回"
      :show="rejectDialog"
      show-cancel-button
      @close="onRejectClose"
      @cancel="onRejectClose"
      @confirm="onRejectConfirm"
    >
      <van-field
        :value="rejectReason"
        type="textarea"
        :placeholder="`请输入驳回原因`"
        autosize
        :border="false"
        @input="onReasonInputChange"
        disable-default-padding
        input-class="reject-reason"
      />
    </van-dialog>

    <van-popup
      :show="popupShow"
      position="right"
      custom-class="drawer"
      @close="popupShow = false"
    >
      <view class="drawer-content">
        <van-cell-group>
          <van-cell
            title-width="80px"
            title="回款期次"
            is-link
            :value="checkedPeriodName || '请选择'"
            @click="openSheet('periodOptions')"
          />
          <van-field
            required
            type="number"
            :value="formData.pay_money"
            input-align="right"
            clearable
            label="回款金额"
            placeholder="请输入"
            @input="({ detail }) => (formData.pay_money = detail)"
          />
          <van-cell
            required
            title="支付方式"
            is-link
            :value="formData.pay_type || '请选择'"
            @click="openSheet('payTypeOptions')"
          />
          <van-cell
            required
            title-width="100px"
            title="回款日期"
            is-link
            :value="formData.pay_date || '请选择'"
            @click="datePickerShow = true"
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
      </view>
      <view class="drawer-footer">
        <van-button
          type="default"
          custom-class="btn reset"
          round
          plan
          @click="handleDrawerReset"
          >取 消</van-button
        >
        <van-button
          type="primary"
          custom-class="btn"
          round
          :loading="addLoading"
          @click="handleDrawerConfirm"
          >确 定</van-button
        >
      </view>
    </van-popup>

    <DatePicker
      :show="datePickerShow"
      @close="datePickerShow = false"
      @confirm="onDatePickerConfirm"
      :max-date="currentDate"
    />
    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="sheetShow = false"
      @select="onSheetSelect"
    />
  </view>
</template>

<script>
import StudentStatusChangeRecord from "./components/studentStatusChangeRecord.vue";
import OrderInfo from "./components/orderInfo.vue";
import ProjectInfo from "./components/projectInfo.vue";
import PayRecord from "./components/payRecord.vue";
import ChangeRecord from "./components/changeRecord.vue";
import DatePicker from "@/components/datePicker/index.vue";
import Seal from "@/components/seal/index.vue";
import SettingPayPlan from './components/settingPayPlan.vue'
import AddPayRecond from './components/addPayRecond.vue'
import { mapGetters } from "vuex";
import {
  getCrmOrderDetail,
  crmOrderApprove,
  hurryUp,
  payLogCreate,
  orderUnusualApprove,
  getOrderTransactionList,
} from "@/api/order";
import { uploadImage } from "@/api/customer";
import { accAdd } from "@/utils/index";
import Dialog from "@/wxcomponents/vant/dialog/dialog";


export default {
  components: {
    OrderInfo,
    ProjectInfo,
    PayRecord,
    DatePicker,
    ChangeRecord,
    Seal,
    StudentStatusChangeRecord,
    SettingPayPlan,
    AddPayRecond,
  },
  data() {
    return {
      detailData: {
        surname: "",
        project_name: "",
        create_time: "",
        order_money: "",
        pay_plan: [],
        pay_log: [],
        project: "[]",
        verify_step: [],
        verify_status: 0, // 审批状态，0：等待审批 ，1：已审批， 2：多人审批进行中 4：审批拒绝/驳回）
        reshuffle: '',    // 是否异动 优质则为异动
        is_my_review: '',  // 是否有审批权限 1，是 0，否
      },
      stepActive: 0,
      stepActiveColor: "#199fff",
      steps: [],
      isApprove: false, // 是否是审批
      isChange: false,  // 是否是异动
      isChannel: false, // 是否是渠道订单
      isRecruit: false, // 是否是招生订单

      rejectDialog: false,
      rejectReason: "",
      orderId: "",
      verifyId: "",
      //添加回款记录
      currentDate: new Date().getTime(),
      popupShow: false,
      sheetShow: false,
      sheetActions: [],
      sheetChecked: "",
      datePickerShow: false,
      checkedPeriodName: "",
      
      addPayRecondShow: false,
      settingPayPlanShow: false,

      formData: {
        plan_id: "",
        pay_date: "",
        pay_type: "",
        pay_money: "",
      },
      orderMoney: "0.00",
      totalMoney: "0.00",
      otherMoney: "0.00",
      addLoading: false,
      // 上传
      fileList: [],
      unusualIndex: 0,
      // 学籍异动
      orderTransactionData: [],
      projectOption: [],
      verifyTypeMaps: {
        0: {
          text: "新订单",
          type: "success",
        },
        1: {
          text: "申请退款",
          type: "warning",
        },
        2: {
          text: "申请作废",
          type: "danger",
        },
        3: {
          text: "申请退差价",
          type: "warning",
        },
      },
    };
  },
  computed: {
    ...mapGetters(["payTypeOptions", 'expenseType']),
    periodOptions() {
      return (this.detailData.pay_plan || []).map((item, index) => {
        return ({
          name: `第${index + 1}期 ${item.day} ￥${item.money}`,
          value: item.id
        })
      });
    },
  },
  onLoad({ orderId, approve, change, verifyId }) {
    this.isApprove = approve == 1; // 是否审批 1 审批, 2 招生订单，3渠道订单
    this.isChange = change == 1; // 是否异动 1 异动
    this.isRecruit = approve == 2 
    this.isChannel = approve == 3

    this.orderId = orderId;
    this.verifyId = verifyId;
    this.passParams = {
      isApprove: this.isApprove,
      isChange: this.isImage,
      orderId: orderId,
      verifyId: verifyId
    }
    if (this.isChange) {
      uni.setNavigationBarTitle({ title: "异动详情" });
    }
    this.getCrmOrderDetail(true);
    this.getOrderTransactionList();
  },
  methods: {
    onAdd() {
      this.addPayRecondShow = true
    },
    onSetting() {
      this.settingPayPlanShow = true
    },
    cancelAdd() {
      this.addPayRecondShow = false
      this.getCrmOrderDetail(true)
      this.getOrderTransactionList();
    },
    cancelSetting() {
      this.settingPayPlanShow = false
      this.getCrmOrderDetail(true)
      this.getOrderTransactionList();
    },
    async getOrderTransactionList() {
      const data = { order_id: this.orderId };
      const res = await getOrderTransactionList(data);
      if (res.code === 0) {
        this.orderTransactionData = res.data;
      }
    },
    // 上传凭证
    async handleAfterRead({ detail }) {
      const { file } = detail;
      const { url } = await uploadImage(file);
      this.fileList.push({ url, isImage: true });
    },
    handleTabsChange({ detail }) {
      this.unusualIndex = detail.index > 2 ? detail.index - 3 : 0;
    },
    //添加回款记录
    async handleDrawerConfirm() {
      if (this.formData.pay_money === "") {
        uni.showToast({
          icon: "none",
          title: "回款金额不能为空",
        });
        return;
      }
      if (this.formData.pay_type === "") {
        uni.showToast({
          icon: "none",
          title: "支付方式不能为空",
        });
        return;
      }
      if (this.formData.pay_date === "") {
        uni.showToast({
          icon: "none",
          title: "回款日期不能为空",
        });
        return;
      }
      const data = {
        ...this.formData,
        receipt_file: this.fileList.map((item) => item.url),
        order_id: this.orderId,
      };
      this.addLoading = true;
      const res = await payLogCreate(data).catch(() => {});
      this.addLoading = false;
      if (res.code === 0) {
        this.handleDrawerReset();
        this.getCrmOrderDetail();
      }
    },
    handleDrawerReset() {
      this.popupShow = false;
      for (const k in this.formData) {
        this.formData[k] = "";
      }
      this.checkedPeriodName = "";
    },
    //选择 支付方式，回款计划
    openSheet(key) {
      this.sheetChecked = key;
      this.sheetActions = this[key];
      this.sheetShow = true;
    },
    onSheetSelect({ detail }) {
      if (this.sheetChecked === "periodOptions") {
        this.formData.plan_id = detail.value;
        this.checkedPeriodName = detail.name;
        return;
      }
      if (this.sheetChecked === "payTypeOptions") {
        this.formData.pay_type = detail.name;
      }
    },
    onDatePickerConfirm(date) {
      this.formData.pay_date = date;
      this.datePickerShow = false;
    },
    // 订单审批操作相关
    onReasonInputChange({ detail }) {
      this.rejectReason = detail;
    },
    onRejectConfirm() {
      // 异动驳回
      if (this.isChange) {
        this.orderUnusualApprove(2, this.rejectReason);
      } else {
        // 订单驳回
        this.crmOrderApprove(2, this.rejectReason);
      }
    },
    onRejectClose() {
      this.rejectDialog = false;
      this.rejectReason = "";
    },
    handleTabbarChange({ detail }) {
      console.log('handleTabbarChange', detail);
      let _this = this
      const { order_no, create_time, surname, order_money, pay_money, overdue_money, order_id } = this.detailData;
      switch (detail) {
        case "1":
          this.detailData.reshuffle ? this.orderUnusualApprove(detail) : this.crmOrderApprove(detail) 
        break;
        case "2":
          this.rejectDialog = true;
        break;
        case '3':
          Dialog.confirm({ title: "提醒", message: "确定要撤回此订单吗？" })
          .then(() => { this.crmOrderApprove(detail) })
          .catch(() => { });
        break;
        case "4":
          Dialog.confirm({ title: "提醒", message: "确定要删除此订单吗？" })
          .then(() => { this.crmOrderApprove(detail) })
          .catch(() => { });
        break;
        case "5":
          let orderData = { order_no, create_time, surname, order_money, pay_money, overdue_money, order_id }
          uni.navigateTo({ url: `/subPackages/applyRefund/index?orderData=${JSON.stringify(orderData)}`})
          break;
        case "6":
          uni.navigateTo({ 
            url: `/subPackages/differentChange/index?order_id=${order_id}`,
            events: {
              updateData() {
                _this.getCrmOrderDetail(true)
                _this.getOrderTransactionList();
              }
            }
          })
        break;
        case "7" :
          this.hurryUp()
        break;
      }
    },
    // 催办
    async hurryUp() {
      const data = { order_id: this.orderId};
      const res = await hurryUp(data);
      if (res.code == 0) {
        uni.showToast({ icon: 'none', title: '催办成功' })
      }
    },
    // 订单操作 1、通过，2：拒绝 , 3:撤销/作废订单，4、删除订单
    async crmOrderApprove(action, tips = "") {
      const data = { order_id: this.orderId, action, tips };
      const res = await crmOrderApprove(data);
      if (res.code === 0) {
        this.getCrmOrderDetail();
      }
    },
    // 订单异动审批
    async orderUnusualApprove(action, tips = "") {
      const data = { id: this.detailData.reshuffle, verify: action, tips };
      const res = await orderUnusualApprove(data);
      if (res.code === 0) {
        this.getCrmOrderDetail();
      }
    },
    // 更新列表当前条数据(当前详情发生变化时)
    updateListItem(data) {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.$vm && prevPage.$vm.updateItem && prevPage.$vm.updateItem(data);
    },
    // 金额计算
    computeMoney(arr) {
      let totalMoney = 0, otherMoney = 0, orderMoney = 0
      if (!arr) return;
      for(let i = arr.length - 1; i >= 0; i--) {
        let item = arr[i]
        if (item.type == 1) {
          totalMoney = accAdd(totalMoney, item.money)
        } else {
          otherMoney = accAdd(otherMoney, item.money)
        }
      }
      orderMoney = accAdd(totalMoney, otherMoney)
      return { totalMoney, otherMoney, orderMoney }
    },
    // 处理详情接口返回的项目数据
    resolveProjectData(projectData) {
      projectData = JSON.parse(projectData);
      if (projectData && projectData.length) {
        let _projectData = projectData.map((item) => {
          item.price = item.project_price || item.total_money;
          return item;
        });
        return _projectData;
      }
      return [];
    },
    // 处理
    resolvePlanlog(planLog = [], payPlan = []) {
      let types = this.expenseType,
        cacheName = "",
        cacheIndex = [];

      if (payPlan.length <= 0 || payPlan.length <= 0) return {}
      payPlan = payPlan.map((item) => {
        item.name = types[item.type];
        item.project_ids = item.project_ids || item.major_detail_ids || ''
        return item;
      });

      planLog = planLog.map((item) => {
        let pay_plan_ids = item.pay_plan_id.split(",") || [];

        payPlan.map((plan, i) => {
          let id = String(plan.id);
          if (pay_plan_ids.indexOf(id) !== -1) {
            cacheName += cacheName ? `,${plan.name}` : plan.name;
            cacheIndex.push(i);
          }
        });

        item.planCheckedName = cacheName;
        item.planCheckedIndex = cacheIndex;
        console.log("planCheckedIndex", item.planCheckedIndex);

        item.receipt_file = (item.receipt_file || []).map((file, index) => {
          return { name: "回款凭证" + (index + 1), url: file , isImage: true};
        })

        return item;
      });

      return { planLog, payPlan };
    },
    // 生成项目配置数据
    generatorrojectOption(arr) {
    // 获取所属项目选项
      if (!arr) return [];
      let projectOption = arr.map(item => ({ 
        value: item.id, 
        name: item.project_name + (item.major?.value || '')
      }))
      console.log("projectOption", projectOption, arr);
      return projectOption
    },
    // 获取详情
    async getCrmOrderDetail(isOnload) {
      const data = {
        order_id: this.orderId,
      };
      if (this.verifyId) {
        data.verify_id = this.verifyId;
      }
      const res = await getCrmOrderDetail(data);
      let _data = res.data
      // 处理已选项目数据
      _data.projectData = this.resolveProjectData(_data.project);
      // 处理回款计划与回款记录数据
      let plan = this.resolvePlanlog(_data.pay_log, _data.pay_plan);
      _data.pay_log = plan.planLog;
      _data.pay_plan = plan.payPlan;

      // 生成项目配置数据
      this.projectOption = this.generatorrojectOption(_data.projectData)

      // 统计数据处理
      // let { totalMoney, orderMoney, otherMoney } = this.computeMoney(_data.pay_plan)
      this.totalMoney = _data.order_money
      this.otherMoney = _data.other_money
      this.orderMoney = accAdd(_data.other_money, _data.order_money)
          
      
      this.detailData = _data;
      !isOnload && this.updateListItem(res.data);
      const approveStatusMap = {
        1: "待审核",
        2: "（多人）审核中",
        3: "审核通过",
        8: "已撤销审核",
        9: "驳回不通过",
      };
      const approveStatusIconMap = {
        3: "checked",
        8: "clear",
        9: "clear",
      };
      const approveStatusColorMap = {
        8: "#c0c4cc",
        9: "#f56c6c",
        3: "#59D234",
      };
      let stspData = res.data.verify_step.map((item, index) => {
        if (item.status) {
          this.stepActive = index + 1;
        }
        if (approveStatusColorMap[item.status]) {
          this.stepActiveColor = approveStatusColorMap[item.status];
        }
        return {
          text: item.staff_name,
          desc: approveStatusMap[item.status] || "待审核",
          activeIcon: approveStatusIconMap[item.status],
        };
      })
     
      let steps = [
        {
          text: res.data.submit_name,
          desc: "提交审批",
        }
      ];
      if (stspData.length) {
        steps = [
          ...steps,
          ...stspData
        ]
      } else {
        steps = [
          ...steps,
          {
            text: res.data.staff_name,
            desc: "待审核",
          }
        ]
      }
      // 拒绝，撤销不用加审核完成
      if (![8, 9].includes(res.data.verify_status)) {
        if (this.stepActive === res.data.verify_step.length) {
          this.stepActive = this.stepActive + 1;
        }
        steps.push({
          text: "审批",
          desc: "完成",
        });
      }
      this.steps = steps;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.order-detail {
  min-height: 100%;
  padding-bottom: calc(50px + constant(safe-area-inset-bottom));
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
  &-header {
    padding: 20rpx 20rpx 0;
    &-title {
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    &-other {
      color: @text-color-grey;
      font-size: @font-size-md;
    }
  }
  &-steps {
    padding: 0 20rpx;
  }

  /deep/.reject-reason {
    min-height: 40rpx;
  }
  /deep/.drawer {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    &-footer {
      text-align: center;
      padding: 40rpx 20rpx;
      .btn {
        width: 45%;
        &.reset {
          margin-right: 20rpx;
        }
      }
    }
  }
}

/deep/.pay-drawer {
  width: 100%;
  height: 100%;
}

/deep/.van-icon-checked {
  color: #59D234;
}
</style>