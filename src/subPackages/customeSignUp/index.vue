<template>
  <view class="add-curtomer">
    <van-cell-group custom-class="group-cell">
      <van-field
        required
        :value="formData.surname"
        input-align="right"
        label="客户姓名"
        label-class="pay_label"
        input-class="pay_input"
        @input="({ detail }) => (formData.surname = detail)"
        placeholder="请输入客户姓名"
      />
      <van-field
        :value="formData.id_card_number"
        required
        type="idcard"
        label="身份证号"
        label-class="pay_label"
        input-class="pay_input"
        placeholder="请输入身份证号"
        @input="({ detail }) => (formData.id_card_number = detail)"
        input-align="right"
      />
      <van-field
        :value="formData.mobile"
        required
        type="number"
        label="手机号码"
        label-class="pay_label"
        input-class="pay_input"
        placeholder="请输入手机号码"
        @input="({ detail }) => (formData.mobile = detail)"
        input-align="right"
        :border="false"
      />
    </van-cell-group>
    <van-cell-group custom-class="group-cell">
      <van-cell title="报名类型" title-class="pay_label" value-class="pay_input">
        <template #right-icon>
          <van-radio-group
            :value="formData.type"
            direction="horizontal"
            @change="handleTypeChange"
          >
            <van-radio name="0" label-class="pay_input">职业教育</van-radio>
            <van-radio name="1" label-clas="pay_input">学历教育</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-cell
        required
        title="报名项目"
        title-width="200rpx"
        is-link
        title-class="pay_label"
        value-class="pay_input"
        :value="checkedProjectName || '请选择'"
        @click="openSelceProjectSheet"
      />
      <van-cell
        title="届别名称"
        is-link
        title-width="200rpx"
        :value="gradeCheckedName || '请选择'"
        @click="openSheet('gradeOptions')"
      />
      <van-field
        :value="formData.order_money"
        required
        type="number"
        label="学费金额"
        label-class="pay_label"
        input-class="pay_input"
        placeholder="请输入订单金额"
        @input="({ detail }) => (formData.order_money = detail)"
        input-align="right"
      />
      <template v-for="(item, index) in formData.projectData">
        <van-field
          :key="item.id"
          :value="item.pay_money"
          required
          type="number"
          label-class="pay_label"
          input-class="pay_input"
          :label="item.project_name + '-实收金额'"
          placeholder="请输入订单金额"
          @input="({ detail }) => (formData.projectData[index].pay_money = detail)"
          input-align="right"
        />
      </template>
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
          label-class="pay_label"
          input-class="pay_input"
          placeholder="请输入考前辅导费"
          @input="({ detail }) => (formData.pre_tutor = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.examination"
          type="number"
          label="报考费"
          label-class="pay_label"
          input-class="pay_input"
          placeholder="请输入报考费"
          @input="({ detail }) => (formData.examination = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.textbook"
          type="number"
          label="教材费"
          label-class="pay_label"
          input-class="pay_input"
          placeholder="请输入教材费"
          @input="({ detail }) => (formData.textbook = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.graduation_guidance"
          type="number"
          label="毕设指导费"
          label-class="pay_label"
          input-class="pay_input"
          placeholder="请输入毕设指导费"
          @input="({ detail }) => (formData.graduation_guidance = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.thesis_defense"
          type="number"
          label="论文答辩费"
          label-class="pay_label"
          input-class="pay_input"
          placeholder="请输入论文答辩费"
          @input="({ detail }) => (formData.thesis_defense = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.platform_fee"
          type="number"
          label="平台费"
          label-class="pay_label"
          input-class="pay_input"
          placeholder="请输入平台费"
          @input="({ detail }) => (formData.platform_fee = detail)"
          input-align="right"
        />
        <van-field
          :value="formData.others"
          type="number"
          label="其他费用"
          label-class="pay_label"
          input-class="pay_input"
          placeholder="请输入其他费用"
          @input="({ detail }) => (formData.others = detail)"
          input-align="right"
        />
      </template>

      <van-field
        :value="from.tips"
        label="备注信息"
        label-class="pay_label"
        input-class="pay_input"
        type="textarea"
        placeholder="请输入备注"
        autosize
        @input="({ detail }) => (formData.tips = detail)"
        input-align="right"
        :border="false"
      />
    </van-cell-group>


    <view class="add-curtomer-submit add-curtomer-submit-flex">
      <van-button round @click="handleCancel" style="margin-right: 30rpx;">取消</van-button>
      <van-button round type="primary" :disabled="!checked" @click="handleSave">下一步</van-button>
    </view>

    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="sheetShow = false"
      @select="onSheetSelect"
    />
    <DatePicker
      :show="datePickerShow"
      @close="datePickerShow = false"
      @cancel="datePickerShow = false"
      @confirm="handleDateChange"
      :value="currentDate"
      :max-date="currentDate"
    >
    </DatePicker>
    <Select
      :show="selectShow"
      @close="selectShow = false"
      @confirm="handleSelectChange"
      :options="staffOptions"
      option-name="staff_name"
      option-value="staff_id"
      multiple
    />
    <SelectProject
      :show="selectProjectShow"
      @close="selectProjectShow = false"
      @confirm="handleSelectProjectChange"
      ref="selectProject"
    />
    <SelectEduProject
      ref="selectEduProject"
      :show="selectEduProjectShow"
      @close="selectEduProjectShow = false"
      @confirm="handleSelectEduProjectChange"
    />
  </view>
</template>

<script>
import {
  categoryGetSessionList,
  getCateProjectDetail,
  uploadImage,
} from "@/api/customer";
import DatePicker from "@/components/datePicker/index.vue";
import Select from "@/components/select/index.vue";
import SelectProject from "./components/selectProject.vue";
import SelectEduProject from "./components/selectEduProject.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Select,
    SelectProject,
    SelectEduProject,
    DatePicker,
  },
  data() {
    return {
      checked: true,
      saveLoading: false,
      currentDate: new Date().getTime(),
      checkedStaffName: "",
      formData: {
        surname: "", // 用户名
        mobile: "",  // 手机号
        id_card_number: "", // 身份证
        type: "0",  // 报名类型 
        union_staff_id: '',  // 报名项目
        order_money: "",  // 订单金额
        jiebie_id: "",
        examination: "", //
        textbook: "", // 
        thesis_defense: "",
        platform_fee: "",
        tips: "",
        id: "",
        source: '', // 客户来源
        projectData: [],
        graduation_guidance: "",  // 毕业设计费用
        others: "", // 其他费用
      },
      // 届别
      gradeCheckedName: "",
      // 选择支付方式
      sheetShow: false,
      sheetActions: [],
      sheetChecked: "",
      // 回款日期
      datePickerShow: false,
      // 客户共享
      selectShow: false,
      //选择职称项目
      selectProjectShow: false,
      checkedProjectName: "",
      // 选择学历项目
      selectEduProjectShow: false,
    };
  },
  computed: {
    ...mapGetters(["staffOptions", "payTypeOptions", 'gradeOptions' ]),
  },
  onLoad({ userId = "", userName = "", userMobile = "", userIdCard = "", source = "" }) {
    this.formData.id = userId;
    this.formData.surname = userName;
    this.formData.mobile = userMobile;
    this.formData.id_card_number = userIdCard;
    this.formData.source = source
  },
  methods: {
    // 报名类型切换
    handleTypeChange({ detail }) {
      this.formData.type = detail;
      this.formData.projectData = [];
      this.checkedProjectName = "";
      this.$refs.selectEduProject.resset();
      this.$refs.selectProject.resset();
    },
    // 打开报名项目弹窗
    openSelceProjectSheet() {
      if (this.formData.type == 0) {
        this.selectProjectShow = true;
      } else {
        this.selectEduProjectShow = true;
      }
    },
    // 动态获取界别
    async getGradeOptions(data) {
      let param = { category_id: data }
      const res = await categoryGetSessionList(param).catch(() => {})
      if (res.code == 0) {
        let gradeOptions = res.data.map(item => ({ name: item.title, value: item.id }))
        if (gradeOptions.length > 0) {
          this.sheetActions = gradeOptions
        } else {
          this.sheetActions = [{ name: '暂无数据', value: '' }]
        }
      }
    },
    toConfigPlan() {
      uni.navigateTo({
        url: "/subPackages/payPlanConfig/index",
      });
    },
    // 取消
    handleCancel() {
      uni.navigateBack()
    },
    // 保存
    handleSave() {
      this.validate(
        [
          {
            key: "surname",
            errmsg: "客户姓名不能为空",
          },
          {
            key: "id_card_number",
            errmsg: "请输入正确的身份证号码",
            minLength: 18,
          },
          {
            key: "mobile",
            errmsg: "请输入正确的手机号",
            reg: /^1[3-9]\d{9}$/,
          },
          {
            key: "projectData",
            errmsg: "请选择报名项目",
            minLength: 1,
          },
          {
            key: "order_money",
            errmsg: "请输入订单金额",
          },
        ],
        () => {
          let params = this.getParams()
          uni.navigateTo({
            url: '/subPackages/paymentPlan/index?params=' + encodeURIComponent(JSON.stringify(params))
          })
        }
      );
    },
    validate(arr, cb) {
      for (const item of arr) {
        if (!this.formData[item.key]) {
          uni.showToast({
            icon: "none",
            title: item.errmsg,
          });
          return;
        }
        if (item.reg) {
          if (!item.reg.test(this.formData[item.key])) {
            uni.showToast({
              icon: "none",
              title: item.errmsg,
            });
            return;
          }
        }
        if (item.minLength) {
          if (this.formData[item.key].length < item.minLength) {
            uni.showToast({
              icon: "none",
              title: item.errmsg,
            });
            return;
          }
        }
      }
      cb && cb();
    },
    // 上传凭证
    async handleAfterRead({ detail }) {
      const { file } = detail;
      const { url } = await uploadImage(file);
      this.fileList.push({ url, isImage: true });
    },
    // 选择学历项目
    handleSelectEduProjectChange(project) {
      console.log("handleSelectEduProjectChange", project);
      this.formData.projectData = project.map(item => {
          item.pay_money = ''
          return item
      });
      this.checkedProjectName = project.map(
          item => {`${item.school_name}-${item.level_name}-${item.major_name}`
      }).join(",");
      this.selectEduProjectShow = false;
    },
    // 选择职称项目
    handleSelectProjectChange(project) {
      console.log("handleSelectProjectChange", project);
      const idStr = project.length
        ? project.map((item) => item.value).join(",")
        : "";
      this.checkedProjectName = project.length
        ? project.map((item) => item.name).join(",")
        : "";
      this.selectProjectShow = false;
      this.getCateProjectDetail(idStr);
      
    },
    // 已选职称项目详情
    async getCateProjectDetail(idStr) {
      if (!idStr) {
        this.formData.projectData = [];
        return;
      }
      const data = {
        id: idStr,
      };
      const res = await getCateProjectDetail(data);
      if (res.code === 0) {
        this.formData.projectData = res.data.map(item => {
          item.pay_money = ''
          return item
        });
        this.getGradeOptions(res.data[0].category_id)
      }
    },
    // 选择业绩共享人
    handleSelectChange(checked) {
      this.selectShow = false;
      this.checkedStaffName = checked.map((item) => item.staff_name).join(",");
      this.formData.union_staff_id = checked
        .map((item) => item.staff_id)
        .join(",");
    },
    // 回款日期
    handleDateChange(day) {
      this.formData.pay_day = day;
      this.datePickerShow = false;
    },
    // 打开选择客户回款日期、支付方式
    openSheet(key) {
      if (key === 'gradeOptions' && !this.formData.projectData.length) {
        uni.showToast({
          icon: "none",
          title: "请先选择项目",
        });
        return;
      }
      if (this.formData.type != 0) {
        this.sheetActions = this[key];
      }
      this.sheetShow = true; 
      this.sheetChecked = key;
    },
    onSheetSelect({ detail }) {
      if (this.sheetChecked === "payTypeOptions") {
        this.formData.pay_type = detail.name;
        return;
      }
      if (this.sheetChecked === "gradeOptions") {
        this.gradeCheckedName = detail.name;
        this.formData.jiebie_id = detail.value;
        return;
      }
    },
    getParams() {
      console.log("getParams1", this.formData);
      let data = {
        order_token: Date.now(),
        id: this.formData.id,
        order_money: this.formData.order_money,
        surname: this.formData.surname,
        mobile: this.formData.mobile,
        id_card_number: this.formData.id_card_number,
        tips: this.formData.tips,
        union_staff_id: this.formData.union_staff_id,
        type: this.formData.type,
        jiebie_id: this.formData.jiebie_id,
        source: this.formData.source,
        project_pay_money: {}
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
          project: this.formData.projectData.map((item) => {
            if (!item.pay_money) {
              uni.showToast({
                icon: 'none',
                title: `请输入 ${item.project_name} 的实收金额`
              })
              throw new Error("pay_money is null");
            }
            data.project_pay_money[item.id] = item.pay_money;
            return item.id;
          })
        };
      } else {
        // 安监报名参数
        data = {
          ...data,
          project: this.formData.projectData.map((item) => {
            if (!item.pay_money) {
              uni.showToast({
                icon: 'none',
                title: `请输入 ${item.project_name} 的实收金额`
              })
              throw new Error("pay_money is null");
            }
            data.project_pay_money[item.id] = item.pay_money;
            return item.id;
          })
        };
      }  

      return data
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
/deep/.pay_label {
  width: 400rpx;
  font-size: @font-size-md;
}
/deep/.pay_input {
  font-size: @font-size-md;
}
.add-curtomer {
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 240rpx;
  /deep/.group-cell {
    border-top: 20rpx solid #f2f6fc;
  }
  /deep/.period {
    .flex-c();
    &-btn {
      color: @primary;
      margin-left: 10rpx;
    }
  }
  &-submit {
    padding-bottom: 60rpx;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    background-color: #fff;
    z-index: 100;

    &-submit-flex {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    /deep/.van-button {
      width: 40%;
    }
  }
  .agreement-checkbox {
    padding: 20rpx 0;
    .flex-c-c();
    .link {
      color: @primary;
    }
  }
}
</style>