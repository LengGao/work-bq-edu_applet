<template>
  <view class="order-detail">
    <template
      v-if="detailData.reshuffle_list && detailData.reshuffle_list.length"
    >
      <van-notice-bar
        v-if="detailData.reshuffle_list[unusualIndex].status === 3"
        wrapable
        left-icon="volume-o"
        :text="`驳回原因：${
          detailData.reshuffle_list[unusualIndex].tips || '无'
        }`"
      />
      <van-notice-bar
        v-else
        wrapable
        left-icon="volume-o"
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
        >{{ detailData.surname || "" }}-{{
          detailData.project_name || ""
        }}</view
      >
      <view class="order-detail-header-other"
        >{{ detailData.create_time || "" }} |
        <text style="color: #fd6500; margin-left: 10rpx">{{
          detailData.order_money | moneyFormat
        }}</text></view
      >
    </view>
    <view class="order-detail-steps" v-if="!isChange">
      <van-steps
        :steps="steps"
        :active="stepActive"
        :active-color="stepActiveColor"
      />
    </view>

    <van-tabs
      color="#199fff"
      animated
      swipeable
      :ellipsis="false"
      @change="handleTabsChange"
    >
      <van-tab title="订单信息">
        <OrderInfo :data="detailData" />
      </van-tab>
      <van-tab title="项目信息">
        <ProjectInfo :data="detailData" />
      </van-tab>
      <van-tab title="回款记录">
        <PayRecord
          :isApprove="isApprove"
          :data="detailData"
          @add-click="popupShow = true"
        />
      </van-tab>
      <van-tab
        :title="`异动记录${index + 1}`"
        v-for="(item, index) in detailData.reshuffle_list"
        :key="index"
      >
        <ChangeRecord :data="item.new_detail" />
      </van-tab>
    </van-tabs>
    <!-- 异动相关操作 -->
    <van-tabbar
      v-if="
        isApprove &&
        isChange &&
        detailData.reshuffle_list &&
        detailData.reshuffle_list.length &&
        detailData.reshuffle_list[0].my_reshuffle_review
      "
      @change="handleTabbarChange"
      active-color="#43d100"
      inactive-color="#fd6500"
      active="6"
    >
      <van-tabbar-item icon="clear" name="5">驳回</van-tabbar-item>
      <van-tabbar-item icon="checked" name="6">通过</van-tabbar-item>
    </van-tabbar>
    <!-- 订单相关操作 -->
    <template v-if="detailData.is_my_review && !isChange">
      <template v-if="isApprove">
        <van-tabbar
          @change="handleTabbarChange"
          active-color="#43d100"
          inactive-color="#fd6500"
          active="4"
        >
          <van-tabbar-item icon="clear" name="3">驳回</van-tabbar-item>
          <van-tabbar-item icon="checked" name="4">通过</van-tabbar-item>
        </van-tabbar>
      </template>
      <template v-else>
        <van-tabbar
          @change="handleTabbarChange"
          v-if="
            detailData.verify_status < 3 ||
            (detailData.verify_status === 1 && !detailData.reshuffle)
          "
        >
          <van-tabbar-item
            icon="smile-o"
            v-if="detailData.verify_status < 3"
            name="1"
            >催办</van-tabbar-item
          >
          <van-tabbar-item
            v-if="detailData.verify_status === 1 && !detailData.reshuffle"
            icon="revoke"
            name="2"
            >撤回</van-tabbar-item
          >
        </van-tabbar>
      </template>
    </template>
    <template
      v-if="
        isChange &&
        detailData.reshuffle_list &&
        detailData.reshuffle_list.length
      "
    >
      <Seal type="warning" v-if="detailData.reshuffle_list[0].status === 3"
        >已驳回</Seal
      >
      <Seal type="success" v-if="detailData.reshuffle_list[0].status === 2"
        >已通过</Seal
      >
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
        placeholder="请输入驳回原因"
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
import OrderInfo from "./components/orderInfo.vue";
import ProjectInfo from "./components/projectInfo.vue";
import PayRecord from "./components/payRecord.vue";
import ChangeRecord from "./components/changeRecord.vue";
import DatePicker from "@/components/datePicker/index.vue";
import Seal from "@/components/seal/index.vue";
import { mapGetters } from "vuex";
import {
  getCrmOrderDetail,
  crmOrderApprove,
  hurryUp,
  payLogCreate,
  orderUnusualApprove,
} from "@/api/order";
import { uploadImage } from "@/api/customer";
import Dialog from "@/wxcomponents/vant/dialog/dialog";
export default {
  components: {
    OrderInfo,
    ProjectInfo,
    PayRecord,
    DatePicker,
    ChangeRecord,
    Seal,
  },
  data() {
    return {
      detailData: {
        pay_plan: [],
        pay_log: [],
        project: "[]",
        verify_step: [],
        verify_status: 0,
      },
      stepActive: 0,
      stepActiveColor: "#199fff",
      steps: [],
      isApprove: false, // 是否是审批
      isChange: false, // 是否是异动
      rejectDialog: false,
      rejectReason: "",
      orderId: "",
      //添加回款记录
      currentDate: new Date().getTime(),
      popupShow: false,
      sheetShow: false,
      sheetActions: [],
      sheetChecked: "",
      datePickerShow: false,
      checkedPeriodName: "",
      formData: {
        plan_id: "",
        pay_date: "",
        pay_type: "",
        pay_money: "",
      },
      addLoading: false,
      // 上传
      fileList: [],
      unusualIndex: 0,
    };
  },
  computed: {
    ...mapGetters(["payTypeOptions"]),
    periodOptions() {
      return this.detailData.pay_plan.map((item, index) => {
        return {
          name: `第${index + 1}期 ${item.day} ￥${item.money}`,
          value: item.id,
        };
      });
    },
  },
  onLoad({ orderId, approve, change }) {
    this.isApprove = approve == 1;
    this.isChange = change == 1;
    this.orderId = orderId;
    if (this.isChange) {
      uni.setNavigationBarTitle({ title: "异动详情" });
    }
  },
  onShow() {
    this.getCrmOrderDetail();
  },
  methods: {
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
      if (this.isChange) {
        this.orderUnusualApprove(2, this.rejectReason);
      } else {
        this.crmOrderApprove(2, this.rejectReason);
      }
    },
    onRejectClose() {
      this.rejectDialog = false;
      this.rejectReason = "";
    },
    handleTabbarChange({ detail }) {
      if (detail === "1") {
        this.hurryUp();
      }
      if (detail === "2") {
        Dialog.confirm({
          title: "提醒",
          message: "确定要撤回此订单吗？",
        })
          .then(() => {
            this.crmOrderApprove(3);
          })
          .catch(() => {
            // on cancel
          });
      }
      if (detail === "3") {
        this.rejectDialog = true;
      }
      if (detail === "4") {
        this.crmOrderApprove(1);
      }
      if (detail === "5") {
        this.rejectDialog = true;
      }
      if (detail === "6") {
        this.orderUnusualApprove(1);
      }
    },
    // 催办
    async hurryUp() {
      const data = {
        order_id: this.orderId,
      };
      await hurryUp(data);
    },
    // 订单操作 1、通过，2：拒绝 , 3:撤销/作废订单，4、删除订单
    async crmOrderApprove(action, tips) {
      const data = {
        order_id: this.orderId,
        action,
        tips,
      };
      const res = await crmOrderApprove(data);
      if (res.code === 0) {
        this.getCrmOrderDetail();
      }
    },
    // 订单异动审批
    async orderUnusualApprove(action, tips = "") {
      const data = {
        id: this.detailData.reshuffle,
        verify: action,
        tips,
      };
      const res = await orderUnusualApprove(data);
      if (res.code === 0) {
        this.getCrmOrderDetail();
      }
    },
    // 获取详情
    async getCrmOrderDetail() {
      const data = {
        order_id: this.orderId,
      };
      const res = await getCrmOrderDetail(data);
      this.detailData = res.data;
      const approveStatusMap = {
        1: "待审核",
        3: "已通过",
        8: "已撤销",
        9: "已驳回",
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
      const steps = [
        {
          text: res.data.submit_name,
          desc: "提交审批",
        },
        ...res.data.verify_step.map((item, index) => {
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
        }),
      ];
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
      color: @f-c-999;
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
    width: 90%;
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
</style>