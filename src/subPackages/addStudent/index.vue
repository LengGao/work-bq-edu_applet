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
      <van-cell
        required
        title="机构名称"
        title-width="200rpx"
        is-link
        :value="checkedStaffName || '请选择'"
        @click="selectShow = true"
      />
      <van-cell required title="报名类型">
        <template #right-icon>
          <van-radio-group
            :value="formData.type"
            direction="horizontal"
            @change="handleTypeChange"
          >
            <van-radio name="0">职业教育</van-radio>
            <van-radio name="1">学历教育</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-cell
        required
        title="报名项目"
        title-width="80px"
        is-link
        :value="checkedProjectName || '请选择'"
        @click="openSelceProjectSheet"
      />
      <van-cell required title="开通网课">
        <template #right-icon>
          <van-radio-group
            :value="formData.open_course"
            direction="horizontal"
            @change="({ detail }) => (formData.open_course = detail)"
          >
            <van-radio name="0">否</van-radio>
            <van-radio name="1">是</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-cell
        :border="false"
        title="届别名称"
        is-link
        :value="gradeCheckedName || '请选择'"
        @click="sheetShow = true"
      />
    </van-cell-group>

    <view class="add-curtomer-submit">
      <view class="agreement-checkbox">
        <van-checkbox
          :value="checked"
          shape="square"
          @change="({ detail }) => (checked = detail)"
          >我已阅读并同意</van-checkbox
        >
        <view class="link" @click="toAgreement">《用户协议和隐私政策》</view>
      </view>
      <van-button
        type="primary"
        :loading="saveLoading"
        round
        :disabled="!checked"
        @click="handleSave"
        >开 课</van-button
      >
    </view>

    <Select
      :show="selectShow"
      @close="selectShow = false"
      @confirm="handleSelectChange"
      :options="institutionOptions"
    />
    <SelectProject
      :show="selectProjectShow"
      @close="selectProjectShow = false"
      @confirm="handleSelectProjectChange"
      :from_organization_id="formData.from_organization_id"
      ref="selectProject"
    />
    <SelectEduProject
      ref="selectEduProject"
      :from_organization_id="formData.from_organization_id"
      :show="selectEduProjectShow"
      @close="selectEduProjectShow = false"
      @confirm="handleSelectEduProjectChange"
    />
    <van-action-sheet
      :show="sheetShow"
      :actions="gradeOptions"
      @close="sheetShow = false"
      @select="onSheetSelect"
    />
  </view>
</template>

<script>
import { getOrganizationOptions, orderOpen } from "@/api/order";
import Select from "@/components/select/index.vue";
import SelectProject from "./components/selectProject.vue";
import SelectEduProject from "./components/selectEduProject.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Select,
    SelectProject,
    SelectEduProject,
  },
  data() {
    return {
      checked: false,
      saveLoading: false,
      checkedStaffName: "",
      formData: {
        surname: "",
        mobile: "",
        id_card_number: "",
        type: "0",
        from_organization_id: "",
        open_course: "",
        projectData: [],
        jiebie_id: "",
      },
      // 选择机构
      selectShow: false,
      //选择职称项目
      selectProjectShow: false,
      checkedProjectName: "",
      // 选择学历项目
      selectEduProjectShow: false,
      // 选择届别
      sheetShow: false,
      gradeCheckedName: "",
    };
  },
  computed: {
    ...mapGetters(["orgOptions", "gradeOptions"]),
    institutionOptions() {
      return this.orgOptions.map((item) => ({
        name: item.institution_name,
        value: item.institution_id,
      }));
    },
  },
  methods: {
    toAgreement() {
      uni.navigateTo({
        url: "/pages/agreement/index",
      });
    },
    //选择届别
    onSheetSelect({ detail }) {
      this.gradeCheckedName = detail.name;
      this.formData.jiebie_id = detail.value;
    },
    // 选择机构
    handleSelectChange(checked) {
      this.selectShow = false;
      this.checkedStaffName = checked.name;
      this.formData.from_organization_id = checked.value;
      this.resetChecked();
    },
    // 报名类型切换
    handleTypeChange({ detail }) {
      this.formData.type = detail;
      this.resetChecked();
    },
    resetChecked() {
      this.formData.projectData = [];
      this.checkedProjectName = "";
      this.$refs.selectEduProject.resset();
      this.$refs.selectProject.resset();
    },
    // 打开报名项目弹窗
    openSelceProjectSheet() {
      if (!this.formData.from_organization_id) {
        uni.showToast({
          icon: "none",
          title: "请先选择机构",
        });
        return;
      }
      if (this.formData.type == 0) {
        this.selectProjectShow = true;
      } else {
        this.selectEduProjectShow = true;
      }
    },
    // 选择学历项目
    handleSelectEduProjectChange(project) {
      this.formData.projectData = project;
      this.checkedProjectName = project
        .map(
          (item) => `${item.school_name}-${item.level_name}-${item.major_name}`
        )
        .join(",");
      this.selectEduProjectShow = false;
    },

    // 选择职称项目
    handleSelectProjectChange(project) {
      this.checkedProjectName = project.length
        ? project
            .map((item) => `${item.project_name}-${item.class_type_name}`)
            .join("，")
        : "";
      this.formData.projectData = project;
      this.selectProjectShow = false;
    },
    // 保存
    handleSave() {
      this.validate(
        [
          {
            key: "surname",
            errmsg: "客户姓名不能为空",
          },
          // {
          //   key: "id_card_number",
          //   errmsg: "请输入正确的身份证号码",
          //   minLength: 18,
          // },
          // {
          //   key: "mobile",
          //   errmsg: "请输入正确的手机号",
          //   reg: /^1[3-9]\d{9}$/,
          // },
          {
            key: "from_organization_id",
            errmsg: "请选择机构",
          },
          {
            key: "projectData",
            errmsg: "请选择报名项目",
            minLength: 1,
          },
          {
            key: "open_course",
            errmsg: "请选择是否开通网课",
          },
        ],
        () => {
          this.orderOpen();
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
    // 开课
    async orderOpen() {
      const data = {
        student: JSON.stringify([
          {
            surname: this.formData.surname,
            mobile: this.formData.mobile,
            id_card_number: this.formData.id_card_number,
          },
        ]),
        type: this.formData.type,
        jiebie_id: this.formData.jiebie_id,
        open_course: this.formData.open_course,
        from_organization_id: this.formData.from_organization_id,
      };
      if (this.formData.type == 0) {
        data.project = JSON.stringify(
          this.formData.projectData.map((item) => {
            return {
              id: item.id,
              project_name: item.project_name,
              class_type_name: item.class_type_name,
              price: item.class_type_price,
              class_type_id: item.class_type_id,
              service_effective: item.service_effective,
              service_period: item.service_period,
              service_type: item.service_type,
            };
          })
        );
      } else {
        data.project = JSON.stringify(
          this.formData.projectData.map((item) => {
            return {
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
              project: {
                id: item.project_id,
                value: item.project_name,
              },
              org_university_id: item.org_university_id,
              price: item.price,
            };
          })
        );
      }
      this.saveLoading = true;
      const res = await orderOpen(data).catch(() => {
        this.saveLoading = false;
      });
      if (res.code === 0) {
        setTimeout(() => {
          this.saveLoading = false;
          this.reloadList();
          uni.navigateBack();
        }, 800);
      }
    },
    // 更新列表
    reloadList() {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage && prevPage.onLoad(prevPage.options);
    },
    // 获取机构
    async getOrganizationOptions() {
      const res = await getOrganizationOptions();
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
    width: 100%;
    left: 0;
    text-align: center;
    background-color: #fff;
    z-index: 100;
    /deep/.van-button {
      width: 80%;
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