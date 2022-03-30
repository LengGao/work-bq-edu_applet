<template>
  <view class="collection-details">
    <view class="collection-details-header">
      <view class="money">{{ data.org_name }}-回款{{ data.receivable_money }}元</view>
      <view class="staff">{{ data.staff_name }} | {{ data.pay_date }}</view>
    </view>
    <van-tabs color="#199fff" animated swipeable :ellipsis="false">
      <van-tab title="回款信息">
        <van-cell
          title="机构名称"
          title-class="title"
          value-class="value"
          :value="data.org_name"
        />
        <van-cell
          title="业绩归属"
          title-class="title"
          value-class="value"
          @click="toOrderDetail"
          :value="data.staff_name"
        />
        <van-cell
          title="回款日期"
          title-class="title"
          value-class="value"
          :value="data.pay_date"
        />
        <van-cell
          title="回款总金额"
          title-class="title"
          value-class="value"
          :value="data.receivable_money | moneyFormat"
        />

        <van-cell
          title="关联订单数"
          title-class="title"
          value-class="value"
          :value="data.order_num"
        />
        <van-cell
          title-width="100px"
          title="备注信息"
          title-class="title"
          value-class="value"
          :value="data.note || '无'"
        />
      </van-tab>
      <van-tab title="关联订单">
        <view class="item" v-for="item in list" :key="item.id">
          <view class="item-info">
            <view class="item-info-user"
              >{{ item.user_name }}-{{ item.project_name }}</view
            >
            <view class="item-info-money">
              应收{{ item.order_money | moneyFormat }}
              <text style="margin-left: 20rpx"
                >本次{{ item.receivable_money | moneyFormat }}</text
              >
              <text style="margin-left: 20rpx"
                >已收{{ item.pay_money | moneyFormat }}</text
              ></view
            >
          </view>
          <view class="item-status">
            <van-tag plain :color="item.pay_status | orderTagColor">{{
              item.pay_status | orderStatus
            }}</van-tag>
          </view>
        </view>
      </van-tab>
    </van-tabs>
    <van-tabbar
      v-if="!data.check_state"
      @change="handleTabbarChange"
      active-color="#43d100"
      inactive-color="#fd6500"
      active="1"
    >
      <van-tabbar-item icon="clear" name="2">驳回</van-tabbar-item>
      <van-tabbar-item icon="checked" name="1">通过</van-tabbar-item>
    </van-tabbar>
    <Seal type="warning" v-if="data.check_state === -1">已驳回</Seal>
    <Seal type="success" v-if="data.check_state === 2">已通过</Seal>
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
import { reviewReceivableOrder, getReceivableInfo } from "@/api/order";
import Seal from "@/components/seal/index.vue";
export default {
  components: {
    Seal,
  },
  data() {
    return {
      rejectReason: "",
      rejectDialog: false,
      data: {
        org_name: "",
        receivable_money: "",
        staff_name: "",
        pay_date: "",
      },
      logId: "",
      list: [],
    };
  },
  onLoad({ logId }) {
    this.logId = logId;
    this.getReceivableInfo();

  },
  methods: {
    async getReceivableInfo() {
      const data = {
        log_id: this.logId,
      };
      const res = await getReceivableInfo(data);
      if (res.code === 0) {
        this.data = res.data.data;
        this.list = res.data.list;
      }
    },
    handleTabbarChange({ detail }) {
      if (detail === "2") {
        this.rejectDialog = true;
      }
      if (detail === "1") {
        this.reviewReceivableOrder(2);
      }
    },
    onReasonInputChange({ detail }) {
      this.rejectReason = detail;
    },
    onRejectConfirm() {
      this.reviewReceivableOrder(-1, this.rejectReason);
    },
    onRejectClose() {
      this.rejectDialog = false;
      this.rejectReason = "";
    },
    async reviewReceivableOrder(check_state, rejected_note) {
      const data = {
        check_state,
        log_id: this.logId,
        rejected_note,
      };
      const res = await reviewReceivableOrder(data);
      if (res.code === 0) {
        this.updateListItem(check_state);
        setTimeout(() => {
          uni.navigateBack();
        }, 700);
      }
    },
    // 更新列表当前条数据(当前详情发生变化时)
    updateListItem(data) {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.$vm && prevPage.$vm.updateItem && prevPage.$vm.updateItem(data);
    },
    toOrderDetail() {
      uni.navigateTo({
        url: `/subPackages/orderDetail/index?orderId=${this.data.order_id}`,
      });
    },
    previewImage(urls, index) {
      uni.previewImage({
        urls,
        current: urls[index],
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.collection-details {
  &-header {
    padding: 20rpx;
    border-bottom: 20rpx solid #f2f6fc;
    .money {
      font-weight: bold;
      font-size: @font-size-lg;
      margin-bottom: 5rpx;
    }
    .staff {
      font-size: @font-size-md;
      color: @text-color-grey;
    }
  }
  /deep/.title {
    flex: inherit;
    flex-shrink: 0;
    color: #969799;
  }
  /deep/.value {
    color: @text-color;
  }
  .item {
    .flex-c-b();
    margin-left: 40rpx;
    padding: 20rpx 20rpx 20rpx 0;
    border-bottom: 1rpx solid #ebedf0;
    &-info {
      &-user {
        font-size: @font-size-md;
        margin-bottom: 6rpx;
      }
      &-money {
        color: @text-color-grey;
      }
    }
    &-status {
      flex-shrink: 0;
      align-self: flex-start;
    }
  }
}
</style>