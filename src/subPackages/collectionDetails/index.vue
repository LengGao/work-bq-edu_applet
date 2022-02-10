<template>
  <view class="collection-details">
    <view class="collection-details-header">
      <view class="money">{{ data.surname }}-回款{{ data.pay_money }}元</view>
      <view class="staff">{{ data.staff_name }} | {{ data.create_time }}</view>
    </view>
    <view class="collection-details-content">
      <van-cell
        title="客户姓名"
        title-class="title"
        value-class="value"
        :value="data.surname"
      />
      <van-cell
        title="关联订单"
        title-class="title"
        value-class="value link"
        @click="toOrderDetail"
        :value="data.title"
      />
      <van-cell
        title="订单金额"
        title-class="title"
        value-class="value"
        :value="data.order_money | moneyFormat"
      />
      <van-cell
        title="回款日期"
        title-class="title"
        value-class="value"
        :value="data.pay_date"
      />

      <van-cell
        title="回款金额"
        title-class="title"
        value-class="value"
        :value="data.pay_money | moneyFormat"
      />
      <van-cell
        title="支付方式"
        title-class="title"
        value-class="value"
        :value="data.pay_type"
      />
      <van-cell title="回款凭证" title-class="title" value-class="value">
        <template
          v-if="Array.isArray(data.receipt_file) && data.receipt_file.length"
        >
          <image
            @click="previewImage(data.receipt_file, index)"
            style="width: 80rpx; height: 60rpx; margin-left: 10rpx"
            :src="item"
            v-for="(item, index) in data.receipt_file"
            :key="index"
          />
        </template>
        <text v-else>无</text>
      </van-cell>
      <van-cell
        title="备注信息"
        title-width="100px"
        title-class="title"
        value-class="value"
        :value="data.tips || '无'"
      />
      <van-cell
        title="部门名称"
        title-class="title"
        value-class="value"
        :value="data.group_name"
      />
      <van-cell
        title="业绩归属"
        title-class="title"
        value-class="value"
        :value="data.staff_name"
      />
    </view>
    <van-tabbar
      v-if="!data.verify_status"
      @change="handleTabbarChange"
      active-color="#43d100"
      inactive-color="#fd6500"
      active="1"
    >
      <van-tabbar-item icon="clear" name="2">驳回</van-tabbar-item>
      <van-tabbar-item icon="checked" name="1">通过</van-tabbar-item>
    </van-tabbar>
    <Seal type="warning" v-if="data.verify_status === 2">已驳回</Seal>
    <Seal type="success" v-if="data.verify_status === 1">已通过</Seal>
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
import { entryLog } from "@/api/order";
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
        surname: "",
        pay_money: "",
        staff_name: "",
        create_time: "",
        surname: "",
      },
    };
  },
  onLoad({ data }) {
    data = JSON.parse(data);
    this.data = data;
  },
  methods: {
    handleTabbarChange({ detail }) {
      if (detail === "2") {
        this.rejectDialog = true;
      }
      if (detail === "1") {
        this.entryLog(1);
      }
    },
    onReasonInputChange({ detail }) {
      this.rejectReason = detail;
    },
    onRejectConfirm() {
      this.entryLog(2, this.rejectReason);
    },
    onRejectClose() {
      this.rejectDialog = false;
      this.rejectReason = "";
    },
    async entryLog(verify_status, tips) {
      const data = {
        verify_status,
        id: this.data.id,
        tips,
      };
      const res = await entryLog(data);
      if (res.code === 0) {
        this.updateListItem(verify_status);
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
  padding-bottom: 100rpx;
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
  /deep/.link {
    color: @primary;
  }
}
</style>