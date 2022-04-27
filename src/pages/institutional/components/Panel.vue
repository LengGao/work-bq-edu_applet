<template>
  <view class="panel">
    <view class="panel-header">
      <view class="panel-header-title">{{ title }}</view>
        <view class="panel-header-btn">
          <view v-if="actionType === 'dates'">
            <text class="panel-time" @click.native="openDatePicker('start')">{{ startDate }}</text>
            <!-- <text class="panel-time">{{ startDate }}</text> -->
            <van-icon name="minus" custom-style="margin: 0 30rpx;" />
            <!-- <text class="panel-time">{{ endDate }}</text> -->
            <text class="panel-time" @click.native="openDatePicker('end')">{{ endDate }}</text>
            <van-icon style="`margin-left:4rpx; transition:transform 0.3s;${sheetShow ? 'transform:rotate(90deg)' : ''}`" name="arrow" />
          </view>
          <view v-else> {{ getButtonName }} </view> 
      </view>
    </view>
    <view class="panel-body">
      <slot></slot>
    </view>

    <van-action-sheet
      v-if="actionType === 'time'"
      :show="sheetShow"
      :actions="sheetActions"
      @close="onSheetClose"
    >
      <van-datetime-picker
        type="year-month"
        :value="value"
        :min-date="minDate"
        @cancel="onSheetClose"
        @confirm="onTimeConfirm"
      />
    </van-action-sheet>
    
    <template v-else-if="actionType === 'dates'">
    <van-action-sheet :show="startDateShow" :actions="sheetActions">
      <van-datetime-picker
        type="date"
        title="开始时间"
        :value="start"
        :max-date="end"
        @cancel="onSheetClose"
        @confirm="onStartDate()"
      />
    </van-action-sheet>

      <van-action-sheet :show="endDateShow" :actions="sheetActions" >
        <van-datetime-picker
          type="date"
          title="结束时间"
          :value="end"
          :min-date="start"
          @cancel="onSheetClose"
          @confirm="onEndDate()"
        />
      </van-action-sheet>
    </template>

    <van-action-sheet
      v-else
      :show="sheetShow"
      :actions="sheetActions"
      @close="onSheetClose"
      @select="onSheetSelect"
    />
  </view>
</template>

<script>
export default {
  name: "Panel",
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    sheetActions: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: "",
    },
    actionType: {
      type: String,
      default: "",
    },
    start: {
      type: Number,
      default: new Date().getTime()
    },
    end: {
      type: Number,
      default: new Date().getTime(),
    },
  },
  data() {
    return {
      startDateShow: false,
      endDateShow: false,
      sheetShow: false,
      minDate: new Date("2015").getTime(),
    };
  },
  computed: {
    getButtonName() {
      if (this.actionType === "time") {
        const date = new Date(this.value || "");
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
      }
      if (!this.sheetActions.length) {
        return "";
      }
      const target = this.sheetActions.filter(
        (item) => item.value == this.value
      );
      if (!target.length) {
        return "";
      }
      return target[0].name || "";
    },
    startDate: function ()  {
      return this.dateTimeFormat(this.start)
    },
    endDate: function () {
      return this.dateTimeFormat(this.end)
    }
  },
  methods: {
    openDatePicker(key) {
      if (key === 'start') {
        this.startDateShow = true
      } else if (key === 'end') {
        this.endDateShow = true
      } else {
        this.startDateShow = true
      }
    },
    dateTimeFormat(val) {
        let date = new Date(val),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate()
        return `${year}-${month < 10 ? '0' + month : month }-${day < 10 ? '0' + day : day}`
    },
    onStartDate({ detail }) {
      this.$emit("start-select", detail);
      this.startDateShow = false
    },
    onEndDate({ detail }) {
      this.$emit("end-select", detail);
      this.endDateShow = false
    },
    onTimeConfirm({ detail }) {
      this.$emit("input", detail);
      this.$emit("sheet-change", detail);
      this.onSheetClose();
    },
    openSheet() {
      this.sheetShow = true;
    },
    onSheetSelect({ detail }) {
      this.$emit("input", detail.value);
      this.$emit("sheet-change", { ...detail });
    },
    onSheetClose() {
      this.sheetShow = false;
      this.startDateShow = false
      this.endDateShow = false
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.panel {
  font-size: @font-size-md;
  &-header {
    .flex-c-b();
    background-color: #fff;
    padding: 24rpx;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    border-bottom: 1rpx solid #efefef;
    &:active {
      background-color: #f2f3f5;
    }
    &-title {
      color: @text-color;
    }
    &-btn {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      color: #999;
    }
  }
  &-body {
    background-color: #fff;
    padding: 20rpx;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    position: relative;
  }
  &-time {
    font-size: @font-size-sm;
    color: @text-color;
  }
}
</style>