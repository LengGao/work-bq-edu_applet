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
        @input="({ detail }) => (formData.surname = detail)"
        placeholder="请输入客户姓名"
      />
      <van-field
        :value="formData.mobile"
        required
        type="number"
        label="手机号码"
        label-class="label"
        input-align="right"
        input-class="input"
        title-width="200rpx"
        placeholder="请输入手机号码"
        @input="({ detail }) => (formData.mobile = detail)"
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
        @input="({ detail }) => (formData.id_card_number = detail)"
      />
      <van-cell
        is-link
        required
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
          :value="gradeCheckedName || '请选择'"
          @click="openSheet('gradeOptions')"
        />

        <view v-for="(item, index) in formData.projectData" :key="item.id">
          <van-cell
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
            placeholder="请输入实收金额"
            title-width="400rpx"
            :value="item.pay_money"
            :label="`${item.project_name}-实收学费金额`"
            @change="({ detail }) => handleInput(detail, index, item)"
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
            input-align="right"
            title-width="400rpx"
            placeholder="请输入实收金额"
            :value="item.pay_money"
            :label="`${item.major_name}-实收学费金额`"
            @change="({ detail }) => handleInput(detail, index, item)"
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
        :value="formData.tips"
        placeholder="请输入备注"
        @input="({ detail }) => (formData.tips = detail)"
      >
      </van-field>
    </van-cell-group>

    <view style="display: block; height: 320rpx;"></view>

    <view class="footer">
      <view class="footer-submit">
        <van-button round @click="handleCancel">取消</van-button>
        <van-button round type="primary" @click="handleSave">下一步</van-button>
      </view>
    </view>

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
import Select from "@/components/select/index.vue";
import DatePicker from "@/components/datePicker/index.vue";
import SelectProject from "./components/selectProject.vue";
import SelectEduProject from "./components/selectEduProject.vue";
import { categoryGetSessionList, getCateProjectDetail } from "@/api/customer";
import { mapGetters } from "vuex";
import { accAdd } from '@/utils/index'

export default {
  components: {
    Select,
    DatePicker,
    SelectProject,
    SelectEduProject,
  },
  data() {
    return {
      sheetShow: false, // 是否显示面板
      sheetActions: [], // 当前面板数据
      sheetChecked: "", // 当前面板数据key
      
      selectShow: false, // 客户共享
      selectProjectShow: false, // 选择职称项      
      selectEduProjectShow: false, // 选择学历项目

      checkedProjectName: "", // 当前报名职称项目/院校专业
      checkedStaffName: "", // 当前共享业绩人
      gradeCheckedName: "", // 当前届别名称
      
      formData: {
        id: "",      // 用户Id
        surname: "", // 用户名
        mobile: "",  // 手机号
        id_card_number: "", // 身份证
        source: '', // 客户来源
        online_course: '', // 是否开通网课
        union_staff_id: '',  // 共享业绩
        type: 0,  // 报名类型 
        jiebie_id: "",  // 届别
        is_new: '2',  // 1，新客户 2 || 其他，旧客户 
        tips: "",  // 备注信息
        projectData: [], // 职称项目/学历专业 数据
      },
    };
  },
  computed: {
    ...mapGetters(["staffOptions", 'gradeOptions', 'fromOptions']),
  },
  onLoad(query) {
    // console.log("customeSignUp:", query);
    let formData = this.formData
    formData.id = query.userId || ''
    formData.surname = query.userName || ''
    formData.mobile = query.userMobile || ''
    formData.id_card_number = query.userIdCard || ''
    formData.source = query.source || ''
    formData.is_new = query.is_new || '0' 
    this.formData = formData
  },
  onUnload() {
    if (uni.getStorageSync('plan')) [
      uni.removeStorageSync("plan")
    ]
  },
  methods: {
    // 打开选择客户回款日期、支付方式
    openSheet(key) {
      this.sheetChecked = key;
      if (key === 'gradeOptions') {
        if (!this.formData.projectData.length) {
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
    // 选择
    onSheetSelect({ detail }) {
      // 届别
      if (this.sheetChecked === "gradeOptions") {
        this.gradeCheckedName = detail.name;
        this.formData.jiebie_id = detail.value;
        return;
      }
      // 来源
      if (this.sheetChecked === 'fromOptions') {
        this.formData.source = detail.name
        return;
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
    },
    // 选择学历项目
    handleSelectEduProjectChange(project = []) {
      this.checkedProjectName = project.map((item) => {
        return `${item.major_name}` // 专业名
      }).join(",")
  
      this.formData.projectData = project.map(item => {
        item.pay_money = '' // 项目实收金额
        return item
      })
      
      this.selectEduProjectShow = false;
    },
    // 选择职称项目
    handleSelectProjectChange(project = []) {
      let idStr = project.map(item => item.value).join(',')               // 项目id
      this.checkedProjectName = project.map(item => item.name).join(',')  // 项目名
      this.getCateProjectDetail(idStr);
      this.selectProjectShow = false;
    },
    // 选择业绩共享人
    handleSelectChange(checked) {
      this.checkedStaffName = checked.map((item) => item.staff_name).join(",");
      this.formData.union_staff_id = checked.map((item) => item.staff_id).join(",");
      this.selectShow = false;
    },
    // 金额输入控制
    handleInput(detail, index, item) {
      let projectData = this.formData.projectData
      projectData.forEach(p => {
        if (p.id == item.id) {
            p.pay_money = detail
          }
      })
      this.formData.projectData = projectData
    },
    // 取消
    handleCancel() {
      uni.navigateBack()
      if (uni.getStorageSync('plan')) [
        uni.removeStorageSync("plan")
      ]
    },
    // 保存
    handleSave() {
      const validator = [
        { key: "surname", errmsg: "客户姓名不能为空" },
        { key: "source", errmsg: "订单来源不能为空" },
        { key: "id_card_number", errmsg: "请输入正确的身份证号码", minLength: 18 },
        { key: "mobile", errmsg: "请输入正确的手机号", reg: /^1[3-9]\d{9}$/ },
        { key: "projectData", errmsg: "请选择报名项目或专业", minLength: 1, },
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
          this.formData['projectData'].forEach(ele => {
            let money = parseFloat(ele.pay_money)
            if ( money < 0 ) {
              if (this.formData.type == 0) {
                uni.showToast({ icon: 'none', title: `请输入 ${ele.project_name} 的实收金额` })
              } else {
                uni.showToast({ icon: 'none', title: `请输入 ${ele.major_name} 的实收金额` })
              }
              throw new Error("pay_money is null");
            }
          })
        }
      }
      
      if (cb) cb();
    },
    // 综合处理要传递给下一个页面的参数
    getParams() {
      let formData = this.formData,
      data = {
        order_token: Date.now(),
        id: formData.id,
        surname: formData.surname,
        mobile: formData.mobile,
        id_card_number: formData.id_card_number,
        source: formData.source.replace('-', '0'), // 不允许传'-'
        union_staff_id: formData.union_staff_id,
        online_course: formData.online_course,
        type: formData.type,
        jiebie_id: formData.jiebie_id,
        is_new: formData.is_new,
        tips: formData.tips,
        projectData: formData.projectData
      }; 

      // 整合项目 以及实收金额数据, 此两项用于报名提交参数，projectData 为当前选择的项目数据
      let project_pay_money = {}, project = []

      project = formData.projectData.map((item) => {
        project_pay_money[item.id] = item.pay_money;
        return item.id
      })
      data.project = project
      data.project_pay_money = project_pay_money

      // 计算报名学费总额，
      let order_money = 0
      for(let k in project_pay_money) order_money = accAdd(order_money, project_pay_money[k]);
      data.order_money = order_money

      return data
    },
    // 已选职称项目详情
    async getCateProjectDetail(idStr) {
      if (!idStr) {
        this.formData.projectData = [];
        return;
      }
      
      const res = await getCateProjectDetail({ id: idStr });
      if (res.code === 0) {
        this.formData.projectData = res.data.map(item => {
          item.pay_money = ''
          return item
        });
        
        // 只取第一个项目的届别
        this.getGradeOptions(res.data[0].category_id)
      }
    },
    // 动态获取界别
    async getGradeOptions(data) {
      let param = { category_id: data }
      const res = await categoryGetSessionList(param).catch(() => {})
      if (res.code == 0) {
        // 构造届别选项
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

  /deep/.group-cell {
    border-top: 20rpx solid #f2f6fc;
  }

  /deep/.period {
    display: flex;
    align-items: center;

    &-btn {
      color: @primary;
      margin-left: 10rpx;
    }
  }


  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
    width: 100%;

    &-submit {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 40rpx 20rpx;
      background-color: #fff;
    }

    /deep/.van-button {
      width: 300rpx;
    }
  }
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

</style>