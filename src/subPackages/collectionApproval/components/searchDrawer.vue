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
            title="业绩归属"
            title-width="80px"
            is-link
            :value="checkedStaffName || '请选择'"
            @click="selectStaffShow = true"
          />
          <van-cell
            title="支付方式"
            is-link
            :value="searchData.pay_type || '请选择'"
            @click="openSheet('payTypeOptions')"
          />
          <van-cell
            title="入账状态"
            is-link
            :value="checkedDealName || '请选择'"
            @click="openSheet('dealOptions')"
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
            input-align="right"
            clearable
            :value="searchData.moneyStart"
            @input="({ detail }) => (searchData.moneyStart = detail)"
            label="回款金额-起"
            placeholder="请输入"
          />
          <van-field
            type="number"
            input-align="right"
            clearable
            :value="searchData.moneyEnd"
            @input="({ detail }) => (searchData.moneyEnd = detail)"
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
        staff_id: "",
        dateStart: "",
        dateEnd: "",
        date: "",
        pay_type: "",
        verify_status: "",
        moneyStart: "",
        moneyEnd: "",
        pay_money: "",
      },
      datePickerShow: false,
      datePickerKey: "",
      selectStaffShow: false,
      checkedStaffName: "",
      sheetShow: false,
      sheetActions: [],
      sheetChecked: "",
      checkedDealName: "",
      dealOptions: [
        {
          value: 0,
          name: "待入账",
        },
        {
          value: 1,
          name: "已入账",
        },
        {
          value: 2,
          name: "已驳回",
        },
      ],
      selectTagShow: false,
    };
  },
  computed: {
    ...mapGetters(["staffOptions", "payTypeOptions"]),
  },
  methods: {
    handleDrawerReset() {
      for (const k in this.searchData) {
        this.searchData[k] = "";
      }
      this.checkedStaffName = "";
      this.checkedDealName = "";
      this.$emit("search", {});
    },
    handleDrawerConfirm() {
      const { dateStart, dateEnd, moneyStart, moneyEnd, ...rest } =
        this.searchData;
      if (dateStart && dateEnd) {
        rest.date = [dateStart, dateEnd].join(" - ");
      } else {
        rest.date = "";
      }

      if (moneyStart && moneyEnd) {
        rest.pay_money = [moneyStart, moneyEnd].join(" - ");
      } else {
        rest.pay_money = "";
      }
      this.$emit("search", rest);
    },
    //选择 入账状态 支付方式
    openSheet(key) {
      this.sheetChecked = key;
      this.sheetActions = this[key];
      this.sheetShow = true;
    },
    onSheetSelect({ detail }) {
      if (this.sheetChecked === "payTypeOptions") {
        this.searchData.pay_type = detail.name;
        return;
      }
      if (this.sheetChecked === "dealOptions") {
        this.searchData.verify_status = detail.value;
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