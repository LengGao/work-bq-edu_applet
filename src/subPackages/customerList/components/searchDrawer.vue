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
            title="客户来源"
            is-link
            :value="searchData.sources || '请选择'"
            @click="openSheet('fromOptions')"
          />
          <van-cell
            title="所属老师"
            title-width="80px"
            is-link
            :value="checkedStaffName || '请选择'"
            @click="selectStaffShow = true"
          />
          <van-cell
            title-width="100px"
            title="创建时间-起"
            is-link
            :value="searchData.dateStart || '请选择'"
            @click="openDatePcker('dateStart')"
          />
          <van-cell
            title-width="100px"
            title="创建时间-止"
            is-link
            :value="searchData.dateEnd || '请选择'"
            @click="openDatePcker('dateEnd')"
          />
          <van-cell
            title="客户属性"
            is-link
            :value="checkedTypeName || '请选择'"
            @click="openSheet('customerTypeOptions')"
          />
          <van-cell
            title="成交状态"
            is-link
            :value="checkedDealName || '请选择'"
            @click="openSheet('dealOptions')"
          />
          <van-cell
            title="客户标签"
            is-link
            :value="searchData.tags || '请选择'"
            @click="selectTagShow = true"
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
    <Select
      :show="selectStaffShow"
      @close="selectStaffShow = false"
      @confirm="handleSelectStaffChange"
      :options="staffOptions"
      option-name="staff_name"
      option-value="staff_id"
      multiple
    />
    <Select
      :show="selectTagShow"
      @close="selectTagShow = false"
      @confirm="handleSelectTagChange"
      :options="tagOptions"
      option-name="name"
      option-value="name"
      multiple
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
import Select from "@/components/select/index.vue";
import DatePicker from "@/components/datePicker/index.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    DatePicker,
    Select,
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
        sources: "",
        staff_id: "",
        dateStart: "",
        dateEnd: "",
        day: "",
        type: "",
        deal: "",
        tags: "",
      },
      datePickerShow: false,
      datePickerKey: "",
      selectStaffShow: false,
      checkedStaffName: "",
      sheetShow: false,
      sheetActions: [],
      sheetChecked: "",
      checkedTypeName: "",
      customerTypeOptions: [
        {
          name: "独立客户",
          value: 1,
        },
        {
          name: "共享客户",
          value: 2,
        },
      ],
      checkedDealName: "",
      dealOptions: [
        {
          name: "已成交",
          value: 1,
        },
        {
          name: "未成交",
          value: 2,
        },
      ],
      selectTagShow: false,
    };
  },
  computed: {
    ...mapGetters(["staffOptions", "fromOptions", "tagOptions"]),
  },
  methods: {
    handleDrawerReset() {
      for (const k in this.searchData) {
        this.searchData[k] = "";
      }
      this.checkedStaffName = "";
      this.checkedTypeName = "";
      this.$emit("search", {});
    },
    handleDrawerConfirm() {
      const { dateStart, dateEnd, ...rest } = this.searchData;
      if (dateStart && dateEnd) {
        rest.day = [dateStart, dateEnd].join(" - ");
      } else {
        rest.day = "";
      }
      this.$emit("search", rest);
    },
    //选择 客户来源 客户属性 成交状态
    openSheet(key) {
      this.sheetChecked = key;
      this.sheetActions = this[key];
      this.sheetShow = true;
    },
    onSheetSelect({ detail }) {
      if (this.sheetChecked === "fromOptions") {
        this.searchData.sources = detail.name;
        return;
      }

      if (this.sheetChecked === "customerTypeOptions") {
        this.searchData.type = detail.value;
        this.checkedTypeName = detail.name;
        return;
      }
      if (this.sheetChecked === "dealOptions") {
        this.searchData.deal = detail.value;
        this.checkedDealName = detail.name;
      }
    },
    // 选择所属老师
    handleSelectStaffChange(checked) {
      this.selectStaffShow = false;
      this.checkedStaffName = checked.map((item) => item.staff_name).join(",");
      this.searchData.staff_id = checked.map((item) => item.staff_id).join(",");
    },
    // 选择客户标签
    handleSelectTagChange(checked) {
      this.selectTagShow = false;
      this.searchData.tags = checked.map((item) => item.name).join(",");
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