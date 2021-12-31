<template>
  <view class="order-detail">
    <van-notice-bar
      v-if="detailData.verify_status === 9"
      wrapable
      mode="closeable"
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
    <view class="order-detail-steps">
      <van-steps
        :steps="steps"
        :active="stepActive"
        :active-color="stepActiveColor"
      />
    </view>

    <van-tabs color="#199fff" animated swipeable>
      <van-tab title="订单信息">
        <OrderInfo :data="detailData" />
      </van-tab>
      <van-tab title="项目信息">
        <ProjectInfo :data="detailData" />
      </van-tab>
      <van-tab title="回款记录">
        <PayRecord :data="detailData" />
      </van-tab>
    </van-tabs>
    <template v-if="isApprove">
      <van-tabbar
        v-if="detailData.is_my_review"
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
  </view>
</template>

<script>
import OrderInfo from "./components/orderInfo.vue";
import ProjectInfo from "./components/projectInfo.vue";
import PayRecord from "./components/payRecord.vue";
import { getCrmOrderDetail, crmOrderApprove, hurryUp } from "@/api/order";
import Dialog from "@/wxcomponents/vant/dialog/dialog";
export default {
  components: {
    OrderInfo,
    ProjectInfo,
    PayRecord,
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
      isApprove: false,
      rejectDialog: false,
      rejectReason: "",
      orderId: "",
    };
  },
  onLoad({ orderId, approve }) {
    this.isApprove = !!approve;
    this.orderId = orderId;
    this.getCrmOrderDetail();
  },
  methods: {
    onReasonInputChange({ detail }) {
      this.rejectReason = detail;
    },
    onRejectConfirm() {
      this.crmOrderApprove(2, this.rejectReason);
    },
    onRejectClose() {
      this.rejectDialog = false;
      this.rejectReason = "";
    },
    handleTabbarChange({ detail }) {
      console.log(detail);
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
    }
  }
  &-steps {
    padding: 0 20rpx;
  }
  /deep/.reject-reason {
    min-height: 40rpx;
  }
}
</style>