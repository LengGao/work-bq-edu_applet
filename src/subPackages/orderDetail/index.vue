<template>
<page-meta :page-style="addPayRecondShow || settingPayPlanShow ? 'overflow: hidden;' : '' " >
  <view class="order-detail">
    <template v-if="reshuffleListLength || steps.length">
      <van-notice-bar v-if="text !== ''" wrapable left-icon="volume-o" :text="text" />
      <van-notice-bar v-if="tips !== ''" wrapable left-icon="volume-o" :text="tips"/>
    </template>

    <view class="order-detail-header">
      <view class="order-detail-header-title"
        >{{ detailData.surname || "" }} - {{detailData.project_name || ""}}
        <van-tag :type="verifyType.level" plain> {{ verifyType.text }} </van-tag>
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
        <OrderInfo v-if="orderId" :data="detailData" />
      </van-tab>

      <van-tab title="项目信息">
        <ProjectInfo v-if="orderId" :data="detailData" />
      </van-tab>

      <van-tab title="回款记录">
        <PayRecord
          v-if="orderId"
          :isApprove="isApprove"
          :isChannel="isChannel"        
          :data="detailData"
          @add-click="onAdd"
          @setting="onSetting"
        />
      </van-tab>

      <template v-if="orderTransactionData.length > 0">
        <van-tab v-for="(item, index) in orderTransactionData" :key="item.id" :title="`学籍异动${index + 1}`">
          <StudentStatusChangeRecord :data="item" />
        </van-tab>
      </template>

      <template v-if="reshuffleListLength">
        <van-tab v-for="(item, index) in detailData.reshuffle_list" :key="index" :title="`异动记录${index + 1}`">
          <ChangeRecord :data="item.new_detail" />
        </van-tab>
      </template>
    </van-tabs>

    <template v-if="isApprove">
      <van-tabbar :active="1" active-color="#43d100" inactive-color="#fd6500" @change="handleTabbarChange" >
        <van-tabbar-item v-for="button in buttons" :key="button.name" :icon="button.icon" :name="button.name">
          <text :style="'color:' + button.color + ';'"> {{ button.text }} </text>
        </van-tabbar-item>
      </van-tabbar>
    </template>

    <template v-else>
      <van-tabbar @change="handleTabbarChange">
        <van-tabbar-item v-for="button in buttons" :key="button.name" :icon="button.icon" :name="button.name">
          <text :style="'color:' + button.color + ';'"> {{ button.text }} </text>
        </van-tabbar-item>
      </van-tabbar>
    </template>

    <template v-for="(seal, index) in seals">
      <Seal :key="index" :type="seal.type">{{ seal.text }}</Seal>
    </template>
    
    <template v-if="!delayLoad">
    <van-popup custom-class="pay-drawer" position="bottom" :show="settingPayPlanShow" lock-scroll>
      <SettingPayPlan
        :orderId="orderId"
        :type="detailData.type"
        :totalMoney="totalMoney"
        :projectOption="projectOption"
        @close="cancelSetting"
      />
    </van-popup>
    
    <van-popup custom-class="pay-drawer" position="bottom" :show="addPayRecondShow" lock-scroll> 
      <AddPayRecond 
        :orderId="orderId"
        :payPlans="payPlan"
        :orderMoney="orderMoney"
        :totalMoney="totalMoney"
        :otherMoney="otherMoney"
        @close="cancelAdd"
      />
    </van-popup>
    </template>


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
  </view>

</page-meta>
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
import { getCrmOrderDetail, crmOrderApprove, hurryUp, orderUnusualApprove, getOrderTransactionList } from "@/api/order";

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
      orderId: "",                        // 订单 Id
      verifyId: "",                       // 审批 Id
      isApprove: false,                   // 是否是审批
      isChange: false,                    // 是否是异动
      isChannel: false,                   // 是否是渠道订单
      isRecruit: false,                   // 是否是招生订单
      buttons: [],                        // 权限操作按钮
      seals: [],                          // 审批状态印章

      rejectDialog: false,                // 驳回对话框
      rejectReason: "",                   // 驳回备注
      
      addPayRecondShow: false,            // 添加回款记录
      settingPayPlanShow: false,          // 配置回款计划

      project: [],                        // 项目数据
      payLog: [],                         // 记录数据
      payPlan: [],                        // 计划数据
      projectOption: [],                  // 项目选项
      verifyType: {},                     // 订单类型
      steps: [],                          // 审批进度数据
      step_list: [],                      // 原审批进度数据
      reshuffle_list: [],                 // 异动记录列表
      stepActive: 0,                      // 进度步骤索引
      stepActiveColor: "#199fff",         // 进度状态颜色
      
      detailData: {
        order_id: "",                     // 订单id
        surname: "",                      // 用户名称
        project_name: "",                 // 项目名称
        create_time: "",                  // 创建时间
        order_money: "",                  // 订单总金额
        pay_plan: [],                     // 回款计划数据
        pay_log: [],                      // 回款记录数据
        project: "[]",                    // 项目数据
        verify_step: [],                  // 审批进度
        verify_status: 0,                 // 审批状态，0：等待审批 ，1：已审批， 2：多人审批进行中 4：审批拒绝/驳回）
        reshuffle: '',                    // 是否异动 有值则为异动
        is_my_review: '',                 // 是否有审批权限 1，是 0，否
        is_deleted: '',                   // 是否已经删除权限 1，是 0，否
        refund_button: '',                // 是否有退款作废权限 1，是 0，否
      },

      orderMoney: "0.00",                 // 订单总额
      totalMoney: "0.00",                 // 学费金额
      otherMoney: "0.00",                 // 其他金额
      unusualIndex: 0,                    // 异动指针
      orderTransactionData: [],           // 学籍异动数据
      delayLoad: true,                    // 延时线管内容加载
    };
  },
  computed: {
    ...mapGetters(['expenseType']),
    reshuffleListLength: function () {
      return this.reshuffle_list.length
    },
    reshuffleId: function () {
      return this.detailData.reshuffle
    },
    verifyStatus: function () {
      return this.detailData.verify_status
    },
    text: function () {
        let reshuffleItem  = this.reshuffle_list[this.unusualIndex]
        if (this.isChange && reshuffleItem && reshuffleItem.status == 3) {
          return `驳回原因：${reshuffleItem.tips || '无'}`;
        } else if (reshuffleItem) {
          return `异动原因：${reshuffleItem.reason};${reshuffleItem.desc}`
        } else {
          return ''
        }
    },
    tips: function () {
      let rejectItem = this.step_list[0]
      if (rejectItem && this.verifyStatus == 9 && this.isChange) {
        return `驳回原因：${rejectItem.tips || '无'}`
      } else {
        return ''
      }
    }
  },
  onLoad({ orderId, approve, change, verifyId = '' }) {
    this.isApprove = approve == 1;      // 是否审批 1 审批, 2 招生订单，3渠道订单
    this.isChange = parseInt(change) > 0 ? true : false;        // 是否异动 1 异动
    this.isRecruit = approve == 2 
    this.isChannel = approve == 3
    this.orderId = orderId;
    this.verifyId = verifyId;

    this.getCrmOrderDetail(true);
    this.getOrderTransactionList();
    if (this.isChange) { uni.setNavigationBarTitle({ title: "异动详情" }) }
  },
  onReady() {
    setTimeout(() => {
      this.delayLoad = false
    }, 800)
  },
  methods: {
    // 添加回款记录
    onAdd() {
      this.addPayRecondShow = true
    },
    // 配置回款计划
    onSetting() {
      this.settingPayPlanShow = true
    },
    // 取消回款记录添加
    cancelAdd() {
      this.addPayRecondShow = false
      this.getCrmOrderDetail(true)
      this.getOrderTransactionList();
    },
    // 取消回款计划设置
    cancelSetting() {
      this.settingPayPlanShow = false
      this.getCrmOrderDetail(true)
      this.getOrderTransactionList();
    },
    // 更新列表当前条数据(当前详情发生变化时)
    updateListItem(data) {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.$vm && prevPage.$vm.updateItem && prevPage.$vm.updateItem(data);
    },
    // tabs切换时切换异动通知信息
    handleTabsChange({ detail }) {
      this.unusualIndex = detail.index > 2 ? detail.index - 3 : 0;
    },
    // 驳回备注输入
    onReasonInputChange({ detail }) {
      this.rejectReason = detail;
    },
    // tabbar 点击事件处理器
    handleTabbarChange({ detail }) {
      let { reshuffle, order_id, order_no, order_money, surname, pay_money, overdue_money, create_time } = this.detailData,
          modal = { title: "提醒", content: "", showCancel: true, cancelColor: "#199fff", confirmColor: "#199fff" }

      let invoke = null, _this = this

      switch (detail) {
        case "1":
          modal.content = '确定要通过审批吗？';
          if (reshuffle) {
            invoke = this.orderUnusualApprove;
          } else {
            invoke = this.crmOrderApprove;
          }
        break;
        case "2":
          this.rejectDialog = true;
        break;
        case '3':
          modal.content = '确定要撤回此订单吗？';
          invoke = this.crmOrderApprove;
        break;
        case "4":
          modal.content = '确定要删除此订单吗？';
          invoke = this.crmOrderApprove;
        break;
        case "5":
          let orderData = { order_no, create_time, surname, order_money, pay_money, overdue_money, order_id }
          uni.navigateTo({ url: `/subPackages/applyRefund/index?orderData=${JSON.stringify(orderData)}`})
        break;
        case "6":
          uni.navigateTo({ url: `/subPackages/differentChange/index?order_id=${order_id}`,
            events: {
              updateData() {
                _this.getCrmOrderDetail(true);
                _this.getOrderTransactionList();
              }
            }
          })
        break;
        case "7" :
          this.hurryUp()
        break;
      }

      if (invoke) {
        uni.showModal(modal).then(res => {
          if (res[1].confirm) { invoke(detail) }
        })
      }
    },
    // 驳回
    onRejectConfirm() {
      // 异动驳回 || 订单驳回
      if (this.isChange) {
        this.orderUnusualApprove(2, this.rejectReason);
      } else {        
        this.crmOrderApprove(2, this.rejectReason);
      }
    },
    // 驳回对话框关闭
    onRejectClose() {
      this.rejectDialog = false;
      this.rejectReason = "";
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
        uni.showToast({ icon: 'none', title: '操作成功' })
        setTimeout(() => {
          this.getCrmOrderDetail();
        }, 500)
      }
    },
    // 订单异动审批
    async orderUnusualApprove(action, tips = "") {
      const data = { id: this.detailData.reshuffle, verify: action, tips };
      const res = await orderUnusualApprove(data);
      if (res.code === 0) {
        uni.showToast({ icon: 'none', title: '操作成功' })
        setTimeout(() => {
          this.getCrmOrderDetail();
        }, 500)
      }
    },
    // 获取详情
    async getCrmOrderDetail(isOnload) {
      let params = { order_id: this.orderId }
      if (this.verifyId) { params.verify_id = this.verifyId; }
      let { data } = await getCrmOrderDetail(params)
      // 处理项目数据
      let project = this.resolveProjectData(data.project)
      // 处理回款计划与回款记录数据
      let plan = this.resolvePlanAndLog(data.pay_log, data.pay_plan)
      // 生成项目配置数据
      let projectOption = this.generatorrojectOption(project)
      // ？。。。尚不知
      if (!isOnload) { this.updateListItem(data) }
      // 生成订单审批状态
      let verifyType = this.generatorVerifyType(data.verify_type)
      // 处理订单审批步骤数据
      let steps = this.resolveStepData(data.verify_step, data.submit_name, data.staff_name, data.verify_status)
      // 生成权限下操作按钮
      let buttons = this.generatorArticleButton(data)
      // 生成印章
      let seals = this.generatorVerifySeal(data.reshuffle, data.reshuffle_list, data.is_deleted)
      // 统计数据处理
      this.totalMoney = data.total_money
      this.otherMoney = data.other_money
      this.orderMoney = data.order_money
      this.payPlan = plan.payPlan
      this.payLog = plan.payLog
      this.projectOption = projectOption
      this.steps = steps
      this.step_list = data.step_list
      this.reshuffle_list = data.reshuffle_list
      this.verifyType = verifyType
      this.buttons = buttons
      this.seals = seals
      this.detailData = data
    },
    // 根据订单获学籍异动详情
    async getOrderTransactionList() {
      const data = { order_id: this.orderId };
      const res = await getOrderTransactionList(data);
      if (res.code === 0) {
        this.orderTransactionData = res.data;
      }
    },
    // 处理项目数据
    resolveProjectData(project = "[]") {
      // console.log('resolveProjectData', project);
      let projectData = JSON.parse(project)
      return projectData.map(item => {
        item.price = item.project_price || item.total_money
        return item
      })
    },
    // 处理计划与记录数据
    resolvePlanAndLog(payLog = [], payPlan = []) {
      let types = this.expenseType

      // 计划数据处理
      payPlan = payPlan.map((item) => {
        item.name = types[item.type];
        item.project_ids = item.major_detail_ids || item.project_ids || ''
        return item;
      })

      // 记录数据处理
      payLog = payLog.map((item) => {
        let pay_plan_id = item.pay_plan_id

        payPlan.forEach(plan => {
          if (pay_plan_id.indexOf(`${plan.id}`) !== -1) {
            item.pay_plan_name = `${plan.year} ${plan.name} ￥${plan.money}`
          }
        })

        item.receipt_file = (item.receipt_file || []).map((file, index) => {
          return { name: "回款凭证" + (index + 1), url: file };
        });

        return item;
      });

      return { payLog, payPlan };
    },
    // 处理不进度数据
    resolveStepData(stepData = [], submitter = '', reviewer = '', verifyStatus) {
      // console.log('resolveStepData', stepData, submitter, reviewer, verifyStatus);
      const approvStepOptions = [
        { state_id: 0, test: '', desc: '待审核', activeIcon: 'checked', activeColor: '#199fff' },
        { state_id: 1, test: '', desc: '待审核', activeIcon: 'checked', activeColor: '#199fff' },
        { state_id: 2, test: '', desc: '（多人）审核中', activeIcon: 'checked', activeColor: '#199fff' },
        { state_id: 3, test: '', desc: '审核通过', activeIcon: 'checked', activeColor: '#59D234' },
        { state_id: 8, test: '', desc: '已撤销审核', activeIcon: 'clear', activeColor: '#c0c4cc' },
        { state_id: 9, test: '', desc: '驳回不通过', activeIcon: 'clear', activeColor: '#f56c6c' },
      ]

      let steps = stepData.map(step => { 
        let option = approvStepOptions.find((option => option.state_id == step.status)) 
        return {
          text: step.staff_name, 
          desc: option.desc,
          activeIcon: option.activeIcon
        }
      })
      
      steps.unshift({ text: submitter, desc: '提交了审批', activeIcon: 'checked' })
      const step = steps.length  // 1 2

      // 撤回 驳回 steps长度固定为0 通过 待审核
      if (verifyStatus <= 3 ) {
        if (step < 2) { steps.push({ text: reviewer, desc: '待审核', activeIcon: 'checked' }) }
        steps.push({ text: "审批", desc: "完成", activeIcon: 'checked' })
        if (verifyStatus == 3) {
          this.stepActive = steps.length - 1
        } else {
          this.stepActive = steps.length - 2
        }
      } else {
        this.stepActive = step - 1
      }
      this.stepActiveColor = approvStepOptions.find(option => option.state_id == verifyStatus).activeColor

      return steps
    },
    // 生成项目配置数据
    generatorrojectOption(project = []) {
      // console.log("generatorrojectOption", project);
      return project.map(item => ({
        name: (item.major && item.major.value) || item.project_name || '',
        value: item.id
      }))
    },
    // 生成当前审批状态
    generatorVerifyType(verifyType) {
      // console.log("generatorVerifyType", verifyType);
      const verifyTypeMaps = [
        { id: 0, level: 'success' , text: '新订单' },
        { id: 1, level: 'warning', text: '申请退款' },
        { id: 2, level: 'danger', text: '申请作废' },
        { id: 3, level: 'warning', text: '申请退差价' }
      ]
      return verifyTypeMaps.find(type => verifyType == type.id) || { level: 'primary', text: '旧订单' }
    },
    // 生成当前权限下可操作tabber
    generatorArticleButton(data) {
      const reshuffle_list  = data.reshuffle_list,   // 移动记录
            first_reshuffle = reshuffle_list[0],     // 首个异动
            reshuffle_len  = reshuffle_list.length,
            verify_status   = data.verify_status,    // 审批状态
            reshuffle       = data.reshuffle,        // 是否异动
            is_deleted      = data.is_deleted,       // 删除权限
            is_my_review    = data.is_my_review,     // 预览权限
            refund_button   = data.refund_button     // 回退权限

      let buttons = []
      if (this.isApprove) {
        if ( is_my_review || ( reshuffle && reshuffle_len && first_reshuffle.my_reshuffle_review )) {
          buttons = [
            { name: '2', text: '驳回', icon: 'clear', color: '#333' },
            { name: '1', text: '通过', icon: 'checked', color: '#59D234' }
          ]
        }
        // if (refund_button) {
        //   buttons.push({ name: '5', text: '退款作废', icon: 'failure', color: '#333' })
        // }
        // if ((verify_status < 4 || verify_status >= 8 ) && !reshuffle) {
        //   buttons.push({ name: '6', text: '申请异动', icon: 'orders-o', color: '#333' })
        // }
      } else if (this.isRecruit) {
        if (verify_status <= 1 && !reshuffle) {
          buttons.push({ name: '3', text: '撤回', icon: 'revoke', color: '#333' })
        }
        if (verify_status == 8 && !is_deleted) {
          buttons.push({ name: '4', text: '删除', icon: 'delete-o', color: '#333' })
        }
        if (refund_button) {
          buttons.push({ name: '5', text: '退款作废', icon: 'failure', color: '#333' })
        }
        if ((verify_status == 3 || verify_status >= 8 ) && !reshuffle) {
          buttons.push({ name: '6', text: '申请异动', icon: 'orders-o', color: '#333' })
        }
        if (verify_status < 3) {
          buttons.push({ name: '7', text: '催办', icon: 'smile-o', color: '#333' })
        }
      }

      return buttons
    },
    // 生成审批印章
    generatorVerifySeal(reshuffle, reshuffle_list, is_deleted) {
      const first = reshuffle_list[0]
      let seals = []
      if (reshuffle && first) {
        if (first.status == 2) {
          seals.push({ type: 'success', text: '已通过' })
        } else if (first.status == 3) {
          seals.push({ type: 'warning', text: '已驳回' })
        } else if (first.status == 8) {
          seals.push({ type: 'warning', text: '已撤回' })
        }
      } else if (is_deleted) {
        seals.push({ type: 'warning', text: '已删除' })
      }
      return seals
    },
  },
}
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

  /deep/.van-step__wrapper {
    align-items: flex-end;
    -webkit-box-align: flex-end;
    -webkit-align-items: flex-end;
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