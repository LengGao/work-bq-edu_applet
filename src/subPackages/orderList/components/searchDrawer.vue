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
            title="所属分类"
            title-width="80px"
            is-link
            :value="checkedCategorytName || '请选择'"
            @click="selectCategoryShow = true"
          />
          <van-cell
            title="所属项目"
            title-width="80px"
            is-link
            :value="checkedProjectName || '请选择'"
            @click="selectProjectShow = true"
          />
          <van-cell
            title="业绩归属"
            title-width="80px"
            is-link
            :value="checkedStaffName || '请选择'"
            @click="selectStaffShow = true"
          />
          <van-cell
            title="支付状态"
            is-link
            :value="checkedPayStatusName || '请选择'"
            @click="openSheet('payStatusOptions')"
          />
          <van-cell
            title-width="80px"
            title="审核状态"
            is-link
            :value="checkedApproveName || '请选择'"
            @click="openSheet('approveOptions')"
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
          <van-field
            type="number"
            :value="searchData.order_money[0]"
            input-align="right"
            clearable
            label="订单金额-起"
            placeholder="请输入"
            @input="({ detail }) => (searchData.order_money[0] = detail)"
          />
          <van-field
            type="number"
            :value="searchData.order_money[1]"
            input-align="right"
            clearable
            label="订单金额-止"
            placeholder="请输入"
            @input="({ detail }) => (searchData.order_money[1] = detail)"
          />
          <van-field
            type="number"
            input-align="right"
            clearable
            :value="searchData.pay_money[0]"
            @input="({ detail }) => (searchData.pay_money[0] = detail)"
            label="回款金额-起"
            placeholder="请输入"
          />
          <van-field
            type="number"
            input-align="right"
            clearable
            :value="searchData.pay_money[1]"
            @input="({ detail }) => (searchData.pay_money[1] = detail)"
            label="回款金额-止"
            :border="false"
            placeholder="请输入"
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
      :show="selectProjectShow"
      @close="selectProjectShow = false"
      @confirm="handleSelectProjectChange"
      :options="projectOptions"
      option-name="project_name"
      option-value="project_id"
      multiple
    />
    <Select
      :show="selectCategoryShow"
      @close="selectCategoryShow = false"
      @confirm="handleSelectCategoryChange"
      :options="categoryOptions"
      option-name="category_name"
      option-value="category_id"
      multiple
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
        category_id: "",
        project_id: "",
        staff_id: "",
        pay_status: "",
        verify_status: "",
        dateStart: "",
        dateEnd: "",
        date: "",
        order_money: ["", ""],
        pay_money: ["", ""],
      },
      datePickerShow: false,
      datePickerKey: "",
      selectProjectShow: false,
      checkedProjectName: "",
      selectCategoryShow: false,
      checkedCategorytName: "",
      selectStaffShow: false,
      checkedStaffName: "",
      sheetShow: false,
      sheetActions: [],
      sheetChecked: "",
      checkedPayStatusName: "",
      checkedApproveName: "",
    };
  },
  computed: {
    ...mapGetters([
      "projectOptions",
      "categoryOptions",
      "staffOptions",
      "approveOptions",
      "payStatusOptions",
    ]),
  },
  methods: {
    handleDrawerReset() {
      for (const k in this.searchData) {
        this.searchData[k] = "";
      }
      this.searchData.order_money = ["", ""];
      this.searchData.pay_money = ["", ""];
      this.checkedProjectName = "";
      this.checkedCategorytName = "";
      this.checkedStaffName = "";
      this.checkedPayStatusName = "";
      this.checkedApproveName = "";
      this.searchData.dateStart = "";
      this.searchData.dateEnd = "";
      this.$emit("search", {});
    },
    handleDrawerConfirm() {
      const { dateStart, dateEnd, ...rest } = this.searchData;
      if (dateStart && dateEnd) {
        rest.date = [dateStart, dateEnd].join(" - ");
      } else {
        rest.date = "";
      }
      rest.order_money = rest.order_money.join(" - ");
      if (rest.order_money === " - ") {
        rest.order_money = "";
      }
      rest.pay_money = rest.pay_money.join(" - ");
      if (rest.pay_money === " - ") {
        rest.pay_money = "";
      }
      this.$emit("search", rest);
    },
    //选择 支付状态，审核状态
    openSheet(key) {
      this.sheetChecked = key;
      this.sheetActions = this[key];
      this.sheetShow = true;
    },
    onSheetSelect({ detail }) {
      if (this.sheetChecked === "approveOptions") {
        this.searchData.verify_status = detail.value;
        this.checkedApproveName = detail.name;
      }
      if (this.sheetChecked === "payStatusOptions") {
        this.checkedPayStatusName = detail.name;
        this.searchData.pay_status = detail.value;
      }
    },
    // 选择业绩归属人
    handleSelectStaffChange(checked) {
      this.selectStaffShow = false;
      this.checkedStaffName = checked.map((item) => item.staff_name).join(",");
      this.searchData.staff_id = checked.map((item) => item.staff_id).join(",");
    },
    // 选择分类
    handleSelectCategoryChange(checked) {
      this.selectCategoryShow = false;
      this.searchData.category_id = checked
        .map((item) => item.category_id)
        .join(",");
      this.checkedCategorytName = checked
        .map((item) => item.category_name)
        .join("，");
    },
    // 选择项目
    handleSelectProjectChange(checked) {
      this.selectProjectShow = false;
      this.searchData.project_id = checked
        .map((item) => item.project_id)
        .join(",");
      this.checkedProjectName = checked
        .map((item) => item.project_name)
        .join("，");
    },
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