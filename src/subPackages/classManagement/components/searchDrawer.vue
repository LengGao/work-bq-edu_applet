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
          <!-- <van-cell
            title="所属机构"
            title-width="80px"
            is-link
            :value="checkedOrgName || '请选择'"
            @click="selectOrgShow = true"
          /> -->
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
          <!-- <van-cell
            title="所属老师"
            title-width="80px"
            is-link
            :value="checkedStaffName || '请选择'"
            @click="selectStaffShow = true"
          />
          <van-cell
            title="客户性质"
            is-link
            :value="typeName || '请选择'"
            @click="openSheet('typeOptions')"
          />
          <van-cell
            title-width="80px"
            title="开课状态"
            is-link
            :value="checkedOpenName || '请选择'"
            @click="openSheet('openOptions')"
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
            :border="false"
            :value="searchData.dateEnd || '请选择'"
            @click="openDatePcker('dateEnd')"
          /> -->
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
    <!-- <DatePicker
      :show="datePickerShow"
      @close="datePickerShow = false"
      @confirm="onDatePickerConfirm"
    /> -->
    <!-- <Select
      :show="selectOrgShow"
      @close="selectOrgShow = false"
      @confirm="handleSelectOrgChange"
      :options="orgOptions"
      option-name="institution_name"
      option-value="institution_id"
    /> -->
    <Select
      :show="selectProjectShow"
      @close="selectProjectShow = false"
      @confirm="handleSelectProjectChange"
      :options="projectOptions"
      option-name="project_name"
      option-value="project_id"
    />
    <Select
      :show="selectCategoryShow"
      @close="selectCategoryShow = false"
      @confirm="handleSelectCategoryChange"
      :options="categoryOptions"
      option-name="category_name"
      option-value="category_id"
    />
    <!-- <Select
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
    /> -->
  </view>
</template>

<script>
import Select from "@/components/select/index2.vue";
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
        from_org: "",
        category_id: "",
        project_id: "",
        staff_id: "",
        type: "",
        open_course: "",
        dateStart: "",
        dateEnd: "",
        date: "",
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
      typeName: "",
      checkedOpenName: "",
      checkedOrgName: "",
      selectOrgShow: "",
      typeOptions: [
        {
          name: "招生客户",
          value: 1,
        },
        {
          name: "渠道客户",
          value: 2,
        },
      ],
      openOptions: [
        {
          name: "已开课",
          value: 1,
        },
        {
          name: "未开课",
          value: 2,
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      "projectOptions",
      "categoryOptions",
      // "staffOptions",
      // "orgOptions",
    ]),
  },
  methods: {
    handleDrawerReset() {
      for (const k in this.searchData) {
        this.searchData[k] = "";
      }
      this.checkedProjectName = "";
      this.checkedCategorytName = "";
      this.checkedStaffName = "";
      this.typeName = "";
      this.checkedOpenName = "";
      this.$emit("search", {});
    },
    handleDrawerConfirm() {
      const { dateStart, dateEnd, ...rest } = this.searchData;
      if (dateStart && dateEnd) {
        rest.date = [dateStart, dateEnd].join(" - ");
      } else {
        rest.date = "";
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
      if (this.sheetChecked === "openOptions") {
        this.searchData.open_course = detail.value;
        this.checkedOpenName = detail.name;
      }
      if (this.sheetChecked === "typeOptions") {
        this.typeName = detail.name;
        this.searchData.type = detail.value;
      }
    },
    // 选择业绩归属人
    handleSelectStaffChange(checked) {
      if (!Array.isArray(checked)) checked = [checked];
      this.selectStaffShow = false;
      this.checkedStaffName = checked.map((item) => item.staff_name).join(",");
      this.searchData.staff_id = checked.map((item) => item.staff_id).join(",");
    },
    // 选择分类
    handleSelectCategoryChange(checked) {
      if (!Array.isArray(checked)) checked = [checked];
      this.selectCategoryShow = false;
      this.searchData.category_id = checked.map((item) => item.category_id).join(",");
      this.checkedCategorytName = checked.map((item) => item.category_name).join("，");
    },
    // 选择机构
    handleSelectOrgChange(checked) {
      if (!Array.isArray(checked)) checked = [checked];
      this.selectOrgShow = false;
      this.searchData.from_org = checked.institution_id;
      this.checkedOrgName = checked.institution_name;
    },
    // 选择项目
    handleSelectProjectChange(checked) {
      if (!Array.isArray(checked)) checked = [checked];
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