<template>
  <view class="add-curtomer">
    <view class="hr"></view>    
    <van-cell-group custom-class="group-cell">
      <van-cell
        required
        title="客户姓名"
        input-align="right"
        label-class="label"
        input-class="input"
        title-width="200rpx"
        :value="formData.surname"
      />
      <van-cell
        required
        title="手机号码"
        input-align="right"
        label-class="label"
        input-class="input"
        title-width="200rpx"
        :value="formData.mobile | phoneFormat"
      >
        <template #right-icon>
          <van-icon
            custom-style="margin-left: 20rpx;"
            name="phone-o" 
            size="38rpx"
            color="#199fff" 
            @click="onPhoneCall(item.telphone)"
          />
        </template>
      </van-cell>
      <van-cell
        required
        is-link
        title="订单来源"
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
            <van-radio :name="1">是</van-radio>
            <van-radio :name="0">否</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
    </van-cell-group>

    <view class="hr"></view>
    <van-cell-group custom-class="group-cell">
      <van-cell title="报名类型" title-class="label" value-class="input">
        <text v-if="formData.type == 0">职业教育</text>
        <text v-else>学历教育</text>
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
            :value="item.must_money"
            :label="`${item.project_name}-实收金额`"
            @blur="({ detail }) => 
              detail.value !== item.must_money && 
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
          :value="formData.jiebie_name || '请选择'"
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
            :value="item.must_money"
            :label="`${item.major_name || item.major.value  }-实收金额`"
            @blur="({ detail }) => 
              detail.value !== item.must_money && 
              $emit('dynamic-input', 'projectData', detail.value, index)
            "
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
      v-if="formData.type == 0"
      :show="selectProjectShow"
      @close="selectProjectShow = false"
      @confirm="handleSelectProjectChange"
      ref="selectProject"
      :auto="true"
      :autoData="formData.projectData"
    />

    <SelectEduProject
      v-if="formData.type == 1"
      ref="selectEduProject"
      :show="selectEduProjectShow"
      @close="selectEduProjectShow = false"
      @confirm="handleSelectEduProjectChange"
      :value="formData.project_projectData"
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
import Title from "@/components/title/index.vue";

export default {
  components: {
    Title,
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
    console.log("1", this.data);
    this.formData = this.data
    this.resolveSaffData(this.data)
  },
  methods: {
    // 拨号
    onPhoneCall(phoneNumber) {
      uni.makePhoneCall({ phoneNumber})
    },
    // 处理业绩
    resolveSaffData(data) {
      // 处理 业绩共i相认
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

      // 处理当前项目
      let checkedProjectName = data.project
      let _checkedProjectName = JSON.parse(checkedProjectName) || []
      if (data.type == 0) {
        this.checkedProjectName =  _checkedProjectName.map(item => item.project_name).join(',')
      } else {
        this.checkedProjectName =  _checkedProjectName.map(item => item.major.value).join(',')
      }
    },
    // 打开选择客户回款日期、支付方式
    openSheet(key) {
      this.sheetChecked = key;
      if (key === 'gradeOptions') {
        if (this.formData.projectData && !this.formData.projectData.length) {
          uni.showToast({ icon: "none", title: "请先选择项目" });
          return undefined;
        } else if (this.formData.type == 0) {
          this.sheetShow = true; 
          return undefined;
        }
      }
      this.sheetShow = true;
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
        return `${item.major_name}`
      }).join(",")
  
      let _project = project.map(item => {
        item.must_money = ''
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
      this.getCateProjectDetail(idStr);
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
        // { key: "id_card_number", errmsg: "请输入正确的身份证号码", minLength: 18 },
        { key: "mobile", errmsg: "请输入正确的手机号", reg: /^1[3-9]\d{9}$/ },
        { key: "projectData", errmsg: "请选择报名项目或专业", minLength: 1, },
        { key: "order_money", errmsg: "请输入学费金额" },
        { key: "online_course", errmsg: "请选择是否开通网课" },
      ]

      const callback = () => {
        let params = this.getParams()
        uni.navigateTo({
          url: '/subPackages/customeSignPayPlan/index?params=' + encodeURIComponent(JSON.stringify(params))
        })
      }

      this.validate(validator, callback)
    },
    // 表单校验
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
            if (!ele.must_money) {
              uni.showToast({ icon: 'none', title: `请输入 ${item.project_name} 的实收金额` })
              throw new Error("must_money is null");
            }
          })
        }
      }
      
      if (cb) cb();
    },

    // 获取传递参数
    getParams() {
      let formData = this.formData,
      data = {
        order_token: Date.now(),
        id: formData.id,
        order_money: formData.order_money,
        surname: formData.surname,
        mobile: formData.mobile,
        // id_card_number: formData.id_card_number,
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
        data.project_pay_money[item.id] = item.must_money;
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
          item.must_money = ''
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

.hr {
  width: 100%;;
  height: 30rpx;
  background-color: @background-color;
}
</style>