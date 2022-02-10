<template>
  <view class="config-plan">
    <view class="config-plan-content">
      <van-cell-group
        custom-class="group-cell"
        v-for="(item, index) in planData"
        :key="index"
      >
        <van-cell>
          <view slot="title" class="plan-title"> 第{{ index + 1 }}期 </view>
          <view class="actions">
            <view
              class="btn"
              v-if="planData.length > 1"
              @click="handleDelPlan(index)"
            >
              <van-icon name="delete" />
              <span class="btn-name">删除</span>
            </view>
            <view class="btn add" @click="handleAddPlan">
              <van-icon name="add" />
              <span class="btn-name">新增</span>
            </view>
          </view>
        </van-cell>
        <van-cell
          required
          title="计划回款日期"
          :value="item.day || '请选择'"
          is-link
          @click="openDatePicker(index)"
        />
        <van-field
          :value="item.money"
          required
          label="计划回款金额"
          placeholder="请输入金额"
          input-align="right"
          type="number"
          @input="({ detail }) => (planData[index].money = detail)"
        />
      </van-cell-group>
    </view>
    <view class="config-plan-footer">
      <van-button
        round
        type="primary"
        :loading="saveLoading"
        @click="handleSave"
        >保 存</van-button
      >
    </view>
    <DatePicker
      :show="datePickerShow"
      @close="datePickerShow = false"
      @cancel="datePickerShow = false"
      @confirm="handleDateChange"
      :value="currentDate"
      :min-date="currentDate"
    >
    </DatePicker>
  </view>
</template>

<script>
import DatePicker from "@/components/datePicker/index.vue";
import { createOrderPayPlan } from "@/api/order";
export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      currentDate: new Date().getTime(),
      datePickerShow: false,
      checkedIndex: 0,
      planData: [
        {
          day: "",
          money: "",
        },
      ],
      saveLoading: false,
      orderId: "",
    };
  },
  onLoad({ orderId }) {
    this.orderId = orderId;
  },
  methods: {
    handleSave() {
      for (const item of this.planData) {
        if (!item.day || !item.money) {
          uni.showToast({
            icon: "none",
            title: "计划回款日期，金额不能为空",
          });
          return;
        }
      }
      this.createOrderPayPlan();
    },
    async createOrderPayPlan() {
      const data = {
        data: JSON.stringify(this.planData),
      };
      if (this.orderId) {
        data.order_id = this.orderId;
      }
      this.saveLoading = true;
      const res = await createOrderPayPlan(data).catch(() => {});
      this.saveLoading = false;
      if (res.code === 0) {
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        if (prevPage && prevPage.$vm.getPlanData) {
          prevPage.$vm.getPlanData(res.data);
        }
        uni.navigateBack();
      }
    },
    handleDelPlan(index) {
      this.planData.splice(index, 1);
    },
    handleAddPlan() {
      this.planData.push({
        day: "",
        money: "",
      });
    },
    openDatePicker(index) {
      this.checkedIndex = index;
      this.datePickerShow = true;
    },
    handleDateChange(date) {
      this.planData[this.checkedIndex].day = date;
      this.datePickerShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.config-plan {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  &-content {
    flex: 1;
    overflow-y: auto;
  }
  &-footer {
    padding: 40rpx;
    /deep/.van-button {
      width: 100%;
    }
  }
  /deep/.group-cell {
    border-top: 20rpx solid #f2f6fc;
    .plan-title {
      font-weight: bold;
      &::before {
        display: inline-block;
        content: "";
        width: 3px;
        height: 15px;
        margin-right: 8rpx;
        background-color: @primary;
        vertical-align: text-bottom;
      }
    }
    .actions {
      .flex-c();
      justify-content: flex-end;
      .btn {
        color: #888;
        padding: 0 10rpx;
        &-name {
          margin-left: 4rpx;
        }

        &:active {
          background-color: #f6f6f6;
        }
      }
    }
  }
}
</style>