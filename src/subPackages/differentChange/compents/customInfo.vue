<template>
  <view class="add-curtomer">
    <van-cell-group custom-class="group-cell">
      <van-field
        required
        :value="formData.surname"
        label="客户姓名"
        input-align="right"
        label-class="label"
        input-class="input"
        title-width="200rpx"
        placeholder="请输入客户姓名"
        @blur="
          ({ detail }) =>
            detail.value !== formData.surname &&
            $emit('input-blur', { surname: detail.value })
        "
      />
      <van-field
        :value="formData.mobile"
        required
        type="number"
        :border="false"
        label="手机号码"
        label-class="label"
        input-align="right"
        input-class="input"
        title-width="200rpx"
        placeholder="请输入手机号码"
        @blur="
          ({ detail }) =>
            detail.value !== formData.mobile &&
            $emit('input-blur', { mobile: detail.value })
        "
      />
      <van-field
        required
        type="idcard"
        label="身份证号"
        input-align="right"
        label-class="label"
        input-class="input"
        title-width="200rpx"
        placeholder="请输入身份证号"
        :value="formData.id_card_number"
        @blur="
          ({ detail }) =>
            detail.value !== formData.id_card_number &&
            $emit('input-blur', { id_card_number: detail.value })
        "
      />
      <van-field
        :value="formData.order_money"
        required
        type="number"
        label="学费金额"
        label-class="label"
        input-class="input"
        title-width="200rpx"
        placeholder="请输入订单金额"
        input-align="right"
        @blur="
          ({ detail }) =>
            detail.value !== formData.order_money &&
            $emit('input-blur', { order_money: detail.value })
        "
      />
      <van-cell
        title="订单来源"
        is-link
        title-width="200rpx"
        :value="formData.source || '请选择'"
        @click="openSheet('fromOptions')"
      />
      <van-cell
        is-link
        title="共享业绩"
        title-width="200rpx"
        :value="checkedStaffName || '请选择'"
        @click="selectShow = true"
      />
      <van-cell title="开通网课" title-class="label" required>
        <template #right-icon>
          <van-radio-group
            direction="horizontal"
            :value="formData.online_course" 
            @change="({ detail }) => (formData.online_course = detail)"
          >
            <van-radio name="1">是</van-radio>
            <van-radio name="0">否</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group custom-class="group-cell">
      <van-cell title="报名类型" title-class="label" value-class="input">
        <template #right-icon>
          <van-radio-group
            direction="horizontal"
            :value="formData.type"
            @change="handleTypeChange"
          >
            <van-radio :name="0" label-class="input">职业教育</van-radio>
            <van-radio :name="1" label-clas="input">学历教育</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      
      <template v-if="formData.type == 0">
        <van-cell
          is-link
          required
          title="报名项目"
          title-class="label"
          value-class="input"
          title-width="200rpx"
          :value="checkedProjectName || '请选择'"
          @click="openSelceProjectSheet"
        />
        <van-cell
          is-link
          title="届别名称"
          title-width="200rpx"
          :value="formData.jiebie_name || '请选择'"
          @click="openSheet('gradeOptions')"
        />

        <view v-for="(item, index) in formData.projectData" :key="item.id">
          <van-cell
            is-link
            required
            title="项目价格"
            title-class="label"
            value-class="input"
            title-width="200rpx"
            :value="item.price"
          />

          <van-field
            required
            type="number"
            input-class="input"
            input-align="right"
            label-class="label"
            title-width="400rpx"
            placeholder="请输入实收金额"
            :adjust-position="undefined"
            :cursor-spacing="1"
            :value="item.pay_money"
            :label="`${item.project_name}-实收金额`"
            @input="({ detail }) => (formData.projectData[index].pay_money = detail)"
            @blur="({ detail }) => 
              detail.value !== item.pay_money && 
              $emit('dynamic-input', 'projectData', detail.value, index)
            "
          />
        </view>
      </template>

      <template v-else>
        <van-cell
          is-link
          required
          title="报名专业"
          title-class="label"
          value-class="input"
          title-width="200rpx"
          :value="checkedProjectName || '请选择'"
          @click="openSelceProjectSheet"
        />
        <van-cell
          is-link
          title="届别名称"
          title-width="200rpx"
          :value="gradeCheckedName || '请选择'"
          @click="openSheet('gradeOptions')"
        />

        <view v-for="(item, index) in formData.projectData" :key="item.id">
          <van-cell
            is-link
            required
            title="总学费"
            title-width="200rpx"
            title-class="label"
            value-class="input"
            :value="item.price"
          />

          <van-field
            required
            type="number"
            label-class="label"
            input-class="input"
            placeholder="请输入实收金额"
            input-align="right"
            title-width="400rpx"
            confirm-type=“确定”
            :value="item.pay_money"
            :label="`${item.project_name}-实收金额`"
            @input="({ detail }) => (formData.projectData[index].pay_money = detail)"
          />
        </view>
      </template>

      <van-field
        autosize
        :border="false"
        input-align="right"
        label="备注信息"
        type="textarea"
        label-class="label"
        input-class="input"
        :value="from.tips"
        placeholder="请输入备注"
        @blur="
          ({ detail }) =>
            detail.value !== formData.tips &&
            $emit('input-blur', { tips: detail.value })
        "
      >
      </van-field>
    </van-cell-group>

    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="sheetShow = false"
      @select="onSheetSelect"
    />

    <Select
      :show="selectShow"
      @close="selectShow = false"
      @confirm="handleSelectChange"
      :options="staffOptions"
      option-name="staff_name"
      option-value="staff_id"
      :value="currentStaffs"
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
import SelectProject from "./selectProject.vue";
import SelectEduProject from "./selectEduProject.vue";
import { mapGetters } from "vuex";


export default {
  components: {
    Select,
    SelectProject,
    SelectEduProject,
    DatePicker,
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // 选择支付方式
      sheetShow: false, // 是否显示面板
      sheetActions: [], // 当前面板数据
      sheetChecked: "", // 当前面板数据key
      
      selectShow: false, // 客户共享
      selectProjectShow: false, // 选择职称项      
      selectEduProjectShow: false, // 选择学历项目
      currentStaffs: [
        {
          staff_name: '',
          staff_id: '',
        }
      ],

      checkedProjectName: "", // 当前报名职称项目/院校专业
      checkedStaffName: "", // 当前共享业绩人
      gradeCheckedName: "", // 当前届别名称
      formData: {
        id: "",
        surname: "", // 用户名
        mobile: "",  // 手机号
        id_card_number: "", // 身份证
        order_money: "",  // 学费金额
        source: '', // 客户来源
        online_course: '', // 是否开通网课
        union_staff_id: '',  // 共享业绩
        type: 0,  // 报名类型 
        jiebie_id: "",  // 
        is_new: '2',  // 1，新客户 2，就客户 
        tips: "",  // 备注信息
        projectData: [], // 职称项目/学历专业 数据
      },
    };
  },
  computed: {
    ...mapGetters(["staffOptions", "payTypeOptions", 'gradeOptions', 'fromOptions']),
  },
  mounted() {
    console.log("2", this.data);
    this.formData = this.data
    
    this.resolveSaffData(this.data)
  },
  methods: {
    resolveSaffData(data) {
      let saffName = data.staff_name || '',
          staffId = data.union_staff_id || ''
      let list_1 = saffName.split(',')
      let list_2 = staffId.split(',')
      let current = list_1.map((item, index) => {
        return {
          staff_name: item,
          staff_id: list_2[index]
        }
      })

      if (current.length > 0) { 
        this.currentStaffs = current
        this.handleSelectChange(current)
      }
    },
    // 打开选择客户回款日期、支付方式
    openSheet(key) {
      this.sheetChecked = key;
      this.sheetShow = true; 
      if (key === 'gradeOptions') {
        if (this.formData.projectData && !this.formData.projectData.length) {
          uni.showToast({ icon: "none", title: "请先选择项目" });
          return undefined;
        } else if (this.formData.type == 0) {
          return undefined;
        }
      }
      this.sheetActions = this[key];
    },
    onSheetSelect({ detail }) {
      if (this.sheetChecked === "payTypeOptions") {
        this.formData.pay_type = detail.name;
        this.$emit('input-blur', { pay_type: detail.name})
        return;
      }
      if (this.sheetChecked === "gradeOptions") {
        this.formData.jiebie_name = detail.name;
        this.formData.jiebie_id = detail.value;
        this.$emit('input-blur', { jiebie_id: detail.value})
        return;
      }
      if (this.sheetChecked === 'fromOptions') {
        this.formData.source = detail.name
        this.$emit('input-blur', { source: detail.name})
      }
    },
    // 打开报名项目弹窗
    openSelceProjectSheet() {
      if (this.formData.type == 0) {
        this.selectProjectShow = true;
      } else {
        this.selectEduProjectShow = true;
      }
    },
    // 报名类型切换
    handleTypeChange({ detail }) {
      this.formData.type = detail;
      this.checkedProjectName = "";
      this.formData.projectData = [];
      this.$refs.selectProject.resset();
      this.$refs.selectEduProject.resset(); 
      this.$emit("input-blur", { type: detail })
    },
    // 选择学历项目
    handleSelectEduProjectChange(project = []) {
      this.checkedProjectName = project.map((item) => {
        return `${item.school_name}-${item.level_name}-${item.major_name}`
      }).join(",")
  
      let _project = project.map(item => {
        item.pay_money = ''
        return item
      })
      
      this.formData.projectData = _project
      
      this.selectEduProjectShow = false;
      this.$emit('input-blur', { projectData: _project })
    },
    // 选择职称项目
    handleSelectProjectChange(project = []) {
      let idStr = project.map(item => item.value).join(',')
      this.checkedProjectName = project.map(item => item.name).join(',')
      this.selectProjectShow = false;
      this.getCateProjectDetail(idStr);x
    },
    // 选择业绩共享人
    handleSelectChange(checked) {
      let union_staff_id = checked.map((item) => item.staff_id).join(","),
          staff_name = checked.map((item) => item.staff_name).join(",");

      this.checkedStaffName = staff_name
      this.formData.union_staff_id = union_staff_id
      this.selectShow = false;
      this.$emit('input-blur', { union_staff_id: union_staff_id })
    },
    // 取消
    handleCancel() {
      uni.navigateBack()
    },
    // 保存
    handleSave() {
      const validator = [
        { key: "surname", errmsg: "客户姓名不能为空" },
        { key: "id_card_number", errmsg: "请输入正确的身份证号码", minLength: 18 },
        { key: "mobile", errmsg: "请输入正确的手机号", reg: /^1[3-9]\d{9}$/ },
        { key: "projectData", errmsg: "请选择报名项目或专业", minLength: 1, },
        { key: "order_money", errmsg: "请输入学费金额" },
        { key: "online_course", errmsg: "请选择是否开通网课" },
      ]

      const callback = () => {
        let params = this.getParams()
        uni.navigateTo({
          url: '/subPackages/paymentPlan/index?params=' + encodeURIComponent(JSON.stringify(params))
        })
      }

      this.validate(validator, callback)
    },
    validate(arr, cb) {
      for (const item of arr) {
        if (!this.formData[item.key]) {
          uni.showToast({ icon: "none", title: item.errmsg })
          return;
        }
        if (item.reg) {
          if (!item.reg.test(this.formData[item.key])) {
            uni.showToast({ icon: "none", title: item.errmsg })
            return;
          }
        }
        if (item.minLength) {
          if (this.formData[item.key].length < item.minLength) {
            uni.showToast({ icon: "none", title: item.errmsg })
            return;
          }
        }
        if (item.key === 'projectData') {
          this.formData[item.key].forEach(ele => {
            if (!ele.pay_money) {
              uni.showToast({ icon: 'none', title: `请输入 ${item.project_name} 的实收金额` })
              throw new Error("pay_money is null");
            }
          })
        }
      }
      
      if (cb) cb();
    },
    getParams() {
      let formData = this.formData,
      data = {
        order_token: Date.now(),
        id: formData.id,
        order_money: formData.order_money,
        surname: formData.surname,
        mobile: formData.mobile,
        id_card_number: formData.id_card_number,
        tips: formData.tips,
        union_staff_id: formData.union_staff_id,
        type: formData.type,
        jiebie_id: formData.jiebie_id,
        source: formData.source,
        is_new: formData.is_new,
        online_course: formData.online_course,
        project_pay_money: {},
      };

      data.project = formData.projectData.map((item) => {
        data.project_pay_money[item.id] = item.pay_money;
        return item.id;
      })

      return data
    },
    // 上传凭证
    async handleAfterRead({ detail }) {
      const { file } = detail;
      const { url } = await uploadImage(file);
      this.fileList.push({ url, isImage: true });
    },
    // 已选职称项目详情
    async getCateProjectDetail(idStr) {
      if (!idStr) {
        this.formData.projectData = [];
        return;
      }
      const data = { id: idStr }
      const res = await getCateProjectDetail(data);

      if (res.code === 0) {
        let _project = res.data.map(item => {
          item.pay_money = ''
          return item
        });
        
        this.formData.projectData = _project
        this.$emit('input-blur', { projectData: _project })

        this.getGradeOptions(res.data[0].category_id)
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
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";

.add-curtomer {
  width: 100%;
  overflow: hidden;
  padding-bottom: 300rpx;

  /deep/.group-cell {
    border-top: 20rpx solid #f2f6fc;
  }

  /deep/.title {
    font-size: @font-size-md;
  }

  /deep/.value {
    font-size: @font-size-md;
  }

  /deep/.label {
    font-size: @font-size-md;
  }

  /deep/.input {
    font-size: @font-size-md;
  }
}
</style>