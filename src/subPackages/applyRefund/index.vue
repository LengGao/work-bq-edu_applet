<template>
  <view class="refund">
    <view class="refund-content">
      <van-notice-bar
        left-icon="volume-o"
        text="您可以在此申请作废/退款订单，只有审批通过后才有效。订单作废/退款后将关闭学员的课程，不能再开课和计算业绩。"
      />
      <van-cell-group :border="false">
        <van-cell>
          <template #title>
            <Title title="订单信息" custom-style="padding:0"> </Title>
          </template>
        </van-cell>
        <van-cell
          title="订单编号"
          title-width="200rpx"
          :value="orderData.order_no"
        >
        </van-cell>
        <van-cell title="订单时间" :value="orderData.create_time"> </van-cell>
        <van-cell title="收费学生" :value="orderData.surname"> </van-cell>
        <van-cell title="应收金额" :value="orderData.order_money | moneyFormat">
        </van-cell>
        <van-cell title="已付金额" :value="orderData.pay_money | moneyFormat">
        </van-cell>
        <van-cell
          title="欠费金额"
          :value="orderData.overdue_money | moneyFormat"
        >
        </van-cell>
      </van-cell-group>
      <van-cell-group :border="false">
        <van-cell>
          <template #title>
            <Title title="退款作废" custom-style="padding:0"> </Title>
          </template>
        </van-cell>
        <van-cell title="操作类型" title-width="200rpx">
          <template>
            <van-radio-group
              :value="formData.type"
              @change="({ detail }) => (formData.type = detail)"
              direction="horizontal"
            >
              <van-radio name="1">退款</van-radio>
              <van-radio name="2">作废</van-radio>
              <van-radio name="3">退差价</van-radio>
            </van-radio-group>
          </template>
        </van-cell>
        <block v-if="['1', '3'].includes(formData.type)">
          <van-cell
            title="退款方式"
            is-link
            required
            title-width="200rpx"
            @click="sheetShow = true"
            :value="formData.refund_type || '请选择'"
          >
          </van-cell>
          <van-field
            required
            type="number"
            :value="formData.refund_money"
            input-align="right"
            label="退款金额"
            placeholder="请输入"
            @input="({ detail }) => (formData.refund_money = detail)"
          />
        </block>
        <van-field
          required
          :value="formData.reason"
          input-align="right"
          :label="`${['1', '3'].includes(formData.type) ? '退款' : '作废'}原因`"
          autosize
          type="textarea"
          placeholder="请输入"
          @input="({ detail }) => (formData.reason = detail)"
        />
        <van-cell
          :border="false"
          required
          :title="`${['1', '3'].includes(formData.type) ? '退款' : '作废'}凭证`"
          title-width="160rpx"
        >
          <van-uploader
            :file-list="formData.voucher"
            @after-read="handleAfterRead"
            deletable
            @delete="({ detail }) => formData.voucher.splice(detail.index, 1)"
          />
        </van-cell>
        <view class="upload-tips">*请上传钉钉的退款/作废订单的审批凭证</view>
      </van-cell-group>
    </view>
    <view class="refund-footer">
      <van-button
        round
        type="primary"
        :loading="saveLoading"
        @click="handleSave"
        >确 定</van-button
      >
    </view>
    <van-action-sheet
      :show="sheetShow"
      :actions="payTypeOptions"
      @close="sheetShow = false"
      @select="({ detail }) => (formData.refund_type = detail.name)"
    />
  </view>
</template>

<script>
import Title from "@/components/title/index.vue";
import { mapGetters } from "vuex";
import { uploadImage } from "@/api/customer";
import { refundInvalid } from "@/api/order";
export default {
  components: {
    Title,
  },
  data() {
    return {
      orderData: {},
      sheetShow: false,
      saveLoading: false,
      formData: {
        type: "1",
        refund_type: "",
        refund_money: "",
        reason: "",
        voucher: [],
      },
      // 上传
    };
  },
  computed: {
    ...mapGetters(["payTypeOptions"]),
  },
  onLoad({ orderData }) {
    this.orderData = JSON.parse(orderData || "{}");
  },
  methods: {
    handleSave() {
      const rules1 = [
        { key: "refund_type", message: "请选择退款方式" },
        { key: "refund_money", message: "请选输入退款金额" },
        { key: "reason", message: "请输入退款原因" },
        { key: "voucher", message: "请上传退款凭证" },
      ];
      const rules2 = [
        { key: "reason", message: "请输入作废原因" },
        { key: "voucher", message: "请上传作废凭证" },
      ];
      const rules = this.formData.type === "2" ? rules2 : rules1;
      for (const item of rules) {
        if (!this.formData[item.key] || !this.formData[item.key].length) {
          uni.showToast({
            icon: "none",
            title: item.message,
          });
          return;
        }
      }
      this.refundInvalid();
    },
    // 申请退款作废
    async refundInvalid() {
      const data = {
        ...this.formData,
        voucher: this.formData.voucher.map((item) => item.url),
        order_id: this.orderData.order_id,
      };
      this.saveLoading = true;
      const res = await refundInvalid(data).catch(() => {
        this.saveLoading = false;
      });

      if (res.code === 0) {
        setTimeout(() => {
          this.saveLoading = false;
          const pages = getCurrentPages();
          const prevPage = pages[pages.length - 2];
          prevPage && prevPage.$vm && prevPage.$vm.getCrmOrderDetail();
          uni.navigateBack();
        }, 500);
      }
    },
    // 上传凭证
    async handleAfterRead({ detail }) {
      const { file } = detail;
      const { url } = await uploadImage(file);
      this.formData.voucher.push({ url, isImage: true });
    },
  },
};
</script>

<style lang="less" scoped>
.refund {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-content {
    flex: 1;
    overflow-y: auto;
    .upload-tips {
      color: red;
      padding: 10rpx 20rpx;
    }
  }
  &-footer {
    flex-shrink: 0;
    padding: 40rpx;
    /deep/.van-button {
      width: 100%;
    }
  }
}
</style>