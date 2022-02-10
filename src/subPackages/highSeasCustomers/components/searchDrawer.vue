<template>
  <view>
    <van-popup
      :show="show"
      position="right"
      custom-class="drawer"
      @close="$emit('close')"
    >
      <view class="drawer-content">
        <van-cell-group>
          <van-cell
            title-width="100px"
            title="创建时间-起"
            is-link
            :value="searchData.start_time || '请选择'"
            @click="openDatePcker('start_time')"
          />
          <van-cell
            title-width="100px"
            title="创建时间-止"
            is-link
            :value="searchData.end_time || '请选择'"
            @click="openDatePcker('end_time')"
          />
        </van-cell-group>
      </view>
      <view class="drawer-footer">
        <van-button
          type="default"
          custom-class="btn reset"
          round
          plan
          @click="handleDrawerReset"
          >重 置</van-button
        >
        <van-button
          type="primary"
          custom-class="btn"
          round
          @click="handleDrawerConfirm"
          >确 定</van-button
        >
      </view>
    </van-popup>
    <DatePicker
      :show="datePickerShow"
      @close="datePickerShow = false"
      @confirm="onDatePickerConfirm"
    />
  </view>
</template>

<script>
import DatePicker from "@/components/datePicker/index.vue";
export default {
  components: {
    DatePicker,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchData: {
        start_time: "",
        end_time: "",
      },
      datePickerShow: false,
      datePickerKey: "",
    };
  },
  methods: {
    handleDrawerReset() {
      for (const k in this.searchData) {
        this.searchData[k] = "";
      }
      this.$emit("search", {});
    },
    handleDrawerConfirm() {
      this.$emit("search", { ...this.searchData });
    },
    //  选择创建时间
    openDatePcker(key) {
      this.datePickerKey = key;
      this.datePickerShow = true;
    },
    onDatePickerConfirm(date) {
      this.searchData[this.datePickerKey] = date;
      this.datePickerShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.drawer {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
  &-content {
    overflow-y: auto;
  }
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
</style>