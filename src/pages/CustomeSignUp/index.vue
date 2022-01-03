<template>
  <view class="add-curtomer">
    <van-cell-group custom-class="group-cell">
      <van-field
        required
        :value="formData.surname"
        input-align="right"
        label="客户姓名"
        @input="({ detail }) => (formData.surname = detail)"
        placeholder="请输入客户姓名"
      />
      <van-field
        :value="formData.id_card_number"
        required
        type="idcard"
        label="身份证号"
        placeholder="请输入身份证号"
        @input="({ detail }) => (formData.id_card_number = detail)"
        input-align="right"
      />
      <van-field
        :value="formData.mobile"
        required
        type="number"
        label="手机号码"
        placeholder="请输入手机号码"
        @input="({ detail }) => (formData.mobile = detail)"
        input-align="right"
        :border="false"
      />
    </van-cell-group>
    <van-cell-group custom-class="group-cell">
      <van-cell title="报名类型">
        <template #right-icon>
          <van-radio-group
            :value="formData.type"
            direction="horizontal"
            @change="({ detail }) => (formData.type = detail)"
          >
            <van-radio name="0">职业教育</van-radio>
            <van-radio name="1">学历教育</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-cell
        required
        title="报名项目"
        title-width="200rpx"
        is-link
        :value="checkedProjectName || '请选择'"
        @click="selectProjectShow = true"
      />
      <van-field
        :value="formData.order_money"
        required
        type="number"
        label="订单金额"
        placeholder="请输入订单金额"
        @input="({ detail }) => (formData.order_money = detail)"
        input-align="right"
      />
      <van-cell
        title="共享业绩"
        is-link
        title-width="160rpx"
        :value="checkedStaffName || '请选择'"
        @click="selectShow = true"
      />
      <template v-if="formData.type === '1'">
        <van-field
          :value="formData.pre_tutor"
          type="number"
          label="考前辅导费"
          placeholder="请输入考前辅导费"
          @input="({ detail }) => (formData.pre_tutor = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.examination"
          type="number"
          label="报考费"
          placeholder="请输入报考费"
          @input="({ detail }) => (formData.examination = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.textbook"
          type="number"
          label="教材费"
          placeholder="请输入教材费"
          @input="({ detail }) => (formData.textbook = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.graduation_guidance"
          type="number"
          label="毕设指导费"
          placeholder="请输入毕设指导费"
          @input="({ detail }) => (formData.graduation_guidance = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.thesis_defense"
          type="number"
          label="论文答辩费"
          placeholder="请输入论文答辩费"
          @input="({ detail }) => (formData.thesis_defense = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.platform_fee"
          type="number"
          label="平台费"
          placeholder="请输入平台费"
          @input="({ detail }) => (formData.platform_fee = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.others"
          type="number"
          label="其他费用"
          placeholder="请输入其他费用"
          @input="({ detail }) => (formData.others = detail)"
          input-align="right"
        />
      </template>

      <van-field
        :value="from.tips"
        label="备注"
        type="textarea"
        placeholder="请输入备注"
        autosize
        @input="({ detail }) => (formData.tips = detail)"
        input-align="right"
        :border="false"
      />
    </van-cell-group>
    <van-cell-group custom-class="group-cell">
      <van-cell
        title="回款期次"
        is-link
        :value="formData.education || '请选择'"
        @click="openSheet('eduOptions')"
      />
      <van-field
        :value="formData.pay_money"
        required
        type="number"
        label="回款金额"
        placeholder="请输入回款金额"
        @input="({ detail }) => (formData.pay_money = detail)"
        input-align="right"
      />
      <van-cell
        title="支付方式"
        is-link
        title-width="200rpx"
        :value="formData.pay_type || '请选择'"
        @click="openSheet('payOptions')"
      />
      <van-cell
        title="回款日期"
        is-link
        :value="formData.pay_day || '请选择'"
        @click="datePickerShow = true"
      />
      <van-cell title="回款凭证" title-width="160rpx" :border="false">
        <van-uploader
          :file-list="fileList"
          @after-read="handleAfterRead"
          deletable
          @delete="({ detail }) => fileList.splice(detail.index, 1)"
        />
      </van-cell>
    </van-cell-group>

    <view class="add-curtomer-submit">
      <van-button type="primary" round @click="handleSave(1)"
        >提交订单</van-button
      >
    </view>

    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="sheetShow = false"
      @select="onSheetSelect"
    />
    <van-calendar
      :show="datePickerShow"
      @close="datePickerShow = false"
      @confirm="handleDateChange"
      :show-confirm="false"
    />
    <Select
      :show="selectShow"
      @close="selectShow = false"
      @confirm="handleSelectChange"
      :options="staffOptions"
      multiple
    />
    <SelectProject
      :show="selectProjectShow"
      @close="selectProjectShow = false"
      @confirm="handleSelectProjectChange"
    />
  </view>
</template>

<script>
import {
  getCustomfieldOptions,
  getStaffList,
  getCateProjectDetail,
  createCrmOrder,
  uploadImage,
} from "@/api/customer";
import Select from "@/components/select/index.vue";
import SelectProject from "./components/selectProject.vue";
export default {
  components: {
    Select,
    SelectProject,
  },
  data() {
    return {
      checkedStaffName: "",
      formData: {
        surname: "",
        mobile: "",
        id_card_number: "",
        type: "0",
        union_staff_id: "",
        order_money: "",
        pay_money: "",
        pre_tutor: "",
        examination: "",
        textbook: "",
        graduation_guidance: "",
        thesis_defense: "",
        platform_fee: "",
        others: "",
        tips: "",
        pay_day: "",
        pay_type: "",
      },
      // 选择客户来源、学历
      sheetShow: false,
      payOptions: [],
      sheetActions: [],
      sheetChecked: "",
      eduOptions: [],
      // 省市区弹窗
      datePickerShow: false,
      // 客户共享
      selectShow: false,
      staffOptions: [],
      //选择项目
      selectProjectShow: false,
      checkedProjectName: "",
      projectData: [],
      // 上传
      fileList: [],
    };
  },
  onLoad() {
    this.getCustomfieldOptions();
    this.getStaffList();
  },
  methods: {
    // 保存
    handleSave(type) {
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!this.formData.surname) {
        uni.showToast({
          icon: "none",
          title: "客户姓名不能为空",
        });
        return;
      }

      if (!phoneReg.test(this.formData.mobile)) {
        uni.showToast({
          icon: "none",
          title: "请输入正确的手机号",
        });
        return;
      }

      this.createCrmOrder(type);
    },
    async handleAfterRead({ detail }) {
      console.log(detail);
      const { file } = detail;
      const { url } = await uploadImage(file);
      this.fileList.push({ url, isImage: true });
    },
    // 选择项目
    handleSelectProjectChange(project) {
      const idStr = project.length
        ? project.map((item) => item.value).join(",")
        : "";
      this.checkedProjectName = project.length
        ? project.map((item) => item.name).join(",")
        : "";
      this.selectProjectShow = false;
      this.getCateProjectDetail(idStr);
    },
    // 已选项目详情
    async getCateProjectDetail(idStr) {
      if (!idStr) {
        this.projectData = [];
        return;
      }
      const data = {
        id: idStr,
      };
      const res = await getCateProjectDetail(data);
      if (res.code === 0) {
        this.projectData = res.data;
      }
    },
    // 选择客户共享人
    handleSelectChange(checked) {
      console.log(checked);
      this.selectShow = false;
      this.checkedStaffName = checked.map((item) => item.name).join(",");
      this.formData.union_staff_id = checked
        .map((item) => item.value)
        .join(",");
    },
    // 日期格式
    formatDate(date) {
      date = new Date(date);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    handleDateChange({ detail }) {
      this.formData.pay_day = this.formatDate(detail);
      this.datePickerShow = false;
    },
    // 选择客户来源、学历
    openSheet(key) {
      this.sheetChecked = key;
      this.sheetActions = this[key];
      this.sheetShow = true;
    },
    onSheetSelect({ detail }) {
      if (this.sheetChecked === "payOptions") {
        this.formData.pay_type = detail.name;
        return;
      }
      if (this.sheetChecked === "eduOptions") {
        this.formData.education = detail.name;
        return;
      }
    },
    // 报名缴费
    async createCrmOrder() {
      let data = {
        order_token: Date.now(),
        id: 22589,
        order_money: this.formData.order_money,
        surname: this.formData.surname,
        mobile: this.formData.mobile,
        id_card_number: this.formData.id_card_number,
        tips: this.formData.tips,
        union_staff_id: this.formData.union_staff_id,
        type: this.formData.type,
        receipt_file: this.fileList.map((item) => item.url),
      };
      // 学历报名参数
      if (this.formData.type == 1) {
        data = {
          ...data,
          pre_tutor: this.formData.pre_tutor || 0,
          textbook: this.formData.textbook || 0,
          graduation_guidance: this.formData.graduation_guidance || 0,
          thesis_defense: this.formData.thesis_defense || 0,
          platform_fee: this.formData.platform_fee || 0,
          others: this.formData.others || 0,
          examination: this.formData.examination || 0,
          project: JSON.stringify(
            this.majorData.map((item) => ({
              id: item.id,
              type: {
                id: item.type_id,
                value: item.type_name,
              },
              university: {
                id: item.school_id,
                value: item.school_name,
              },
              level: {
                id: item.level_id,
                value: item.level_name,
              },
              major: {
                id: item.major_id,
                value: item.major_name,
              },
              total_money: item.price,
              lower_price: item.lowest_price,
              service_period: item.service_period,
              service_type: item.service_type,
              service_effective: item.service_effective,
              project: {
                id: item.project_id,
                value: item.project_name,
              },
            }))
          ),
        };
      } else {
        // 安监报名参数
        data = {
          ...data,
          project: JSON.stringify(
            this.projectData.map((item) => ({
              id: item.id,
              project_name: item.project_name,
              project_price: item.price,
              lower_price: item.lowest_price,
              must_price: item.must_price,
              service_effective: item.service_effective,
              service_period: item.service_period,
              service_type: item.service_type,
            }))
          ),
        };
      }
      // let pay_plan = [
      //   {
      //     pay_day: this.formData.pay_day,
      //     pay_money: this.formData.pay_money,
      //     pay_type: this.formData.pay_type,
      //   },
      // ];
      // if (this.planOptions.length) {
      //   pay_plan = this.planOptions.map((item, index) => {
      //     if (index === this.formData.planIndex) {
      //       return {
      //         ...item,
      //         pay_day: this.formData.pay_day,
      //         pay_money: this.formData.pay_money,
      //         pay_type: this.formData.pay_type,
      //       };
      //     }
      //     return item;
      //   });
      // }
      // data.pay_plan = JSON.stringify(pay_plan);
      console.log(data);
      const res = await createCrmOrder(data);
      console.log(res);
    },
    // 获取老师选项
    async getStaffList() {
      const data = {
        limit: 9999,
      };
      const res = await getStaffList(data);
      this.staffOptions = res.data.list.map((item) => ({
        name: item.staff_name,
        value: item.staff_id,
      }));
    },
    // 获取支付方式
    async getCustomfieldOptions() {
      const data = {
        field_name: "payment_method",
      };
      const res = await getCustomfieldOptions(data);
      if (res.code === 0) {
        this.payOptions = res.data.field_content.map((item) => ({
          name: item,
        }));
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
page {
  height: 100%;
  overflow: hidden;
}
.add-curtomer {
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 200rpx;
  /deep/.group-cell {
    border-top: 20rpx solid #f2f6fc;
  }
  &-submit {
    padding-bottom: 60rpx;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    text-align: center;
    background-color: #fff;
    z-index: 100;
    /deep/.van-button {
      width: 80%;
    }
  }
}
</style>