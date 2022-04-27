<template>
  <view class="different-change">
    <van-tabs
      sticky
      animated
      type="line"
      color="#199fff"
      title-active-color="#199fff"
      :active="active"
      :z-index="100"
      @change="handlerTabChange"
    >
      <van-tab title="基本信息">
        <CustomInfo
          v-if="formData.order_id && projectData.length"
          :data="formData"
          :project-data="projectData"
          :staff-data="currentStaffs"
          @dynamic-input="dynamicInput"
          @open-select="onOpenSelect"
          @open-sheet="onOpenSheet"
        />
      </van-tab>
      <van-tab title="回款计划">
        <ConfigPlan
          v-if="payPlan.length > 0"
          :list="payPlan"
          :currentProjectIds="currentProjectIds"
          :currentProjectName="currentProjectName"
          @dynamic-input="dynamicInput"
          @open-select="onOpenSelect"
          @open-sheet="onOpenSheet"
          @open-picker="openPicker"
        />
      </van-tab>
      <van-tab title="回款记录">
        <PlanInfo
          v-if="payLog.length > 0"
          :logs="payLog"
          :orderMoney="formData.order_money"
          :totalMoney="formData.total_money"
          :otherMoney="formData.other_money"
          @dynamic-input="dynamicInput"
          @open-select="onOpenSelect"
          @open-sheet="onOpenSheet"
          @open-picker="openPicker"
        />
      </van-tab>
    </van-tabs>

    <view style="display: block; height: 320rpx;"></view>
    <view class="footer">
      <view class="tags" v-if="active === 2">
        *回款时必须保证回款金额等于所选回款计划的总金额，如不相等请先修改回款计划
      </view>

      <view class="footer-submit">
        <van-button round @click.native="handleCancel">取消</van-button>
        <van-button
          round type="primary" :loading="saveLoading" @click.native="handleSave">保存</van-button>
      </view>
    </view>

    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="sheetShow = false"
      @select="handlerSheetSelect"
    />

    <DatePicker
      :show="dateShow"
      @close="dateShow = false"
      @cancel="dateShow = false"
      @confirm="handleDateChange"
      :value="currentDate"
    />

    <Select
      multiple
      :show="selectStaffShow"
      :options="staffOptions"
      option-name="staff_name"
      option-value="staff_id"
      :value="currentStaffs"
      @confirm="handleSelectChange"
      @close="selectStaffShow = false"
    />

    <SelectOfPlan
      multiple
      :show="projectShow"
      :options="projectOption"
      :value="currentProjectData"
      @confirm="handleSelectOfProject"
      @close="projectShow = false"
    />

    <SelectOfLog
      multiple
      :show="planShow"
      :options="planOptions"
      :value="currentPlanData"
      @confirm="handleSelectLog"
      @close="planShow = false"
    />

    <SelectProject
      v-if="formData.type == 0"
      :show="selectOccProjectShow"
      @close="selectOccProjectShow = false"
      @confirm="handleSelectProjectChange"
      ref="selectProject"
      :value="projectData"
    />

    <SelectEduProject
      v-if="formData.type == 1"
      ref="selectEduProject"
      :show="selectEduProjectShow"
      @close="selectEduProjectShow = false"
      @confirm="handleSelectEduProjectChange"
    />
    
  </view>
</template>

<script>
import CustomInfo from "./components/customInfo";
import ConfigPlan from "./components/configPlan";
import PlanInfo from "./components/planInfo";
import Select from "@/components/select/index";
import SelectOfPlan from "@/components/select/index";
import SelectOfLog from "@/components/select/index";
import SelectProject from "./components/selectProject";
import SelectEduProject from "./components/selectEduProject";
import DatePicker from "@/components/datePicker/index";
import { getCrmOrderDetail, orderReshuffle } from "@/api/order";
import { categoryGetSessionList, getCateProjectDetail } from "@/api/customer";
import { mapGetters } from "vuex";
import { accAdd } from "@/utils/index";
import Validator from "@/utils/validator";
import { getPlanYearOptions, currentYear } from "@/utils/date";

// 迁移基本功能， 项目训责， 日期选择， 年费选择，金额输入
// 更新本身以及相关联内容

export default {
  components: {
    CustomInfo,
    ConfigPlan,
    PlanInfo,
    Select,
    SelectOfPlan,
    SelectOfLog,
    SelectProject,
    SelectEduProject,
    DatePicker,
  },
  computed: {
    ...mapGetters(["staffOptions", "payTypeOptions", 'gradeOptions', 'fromOptions', 'expenseType']),
  },
  data() {
    return {
      eventChannel: "",             // 路由回调通道
      active: 0,                    // tabs选项索引

      sheetShow: false,             // 是否显示面板
      sheetActions: [],             // 当前面板数据
      sheetChecked: "",             // 当前面板数据key
      
      selectStaffShow: false,       // 客户共享
      selectOccProjectShow: false,  // 选择职称项      
      selectEduProjectShow: false,  // 选择学历项目
      
      planShow: false,              // 回款计划选择器
      projectShow: false,           // 计划所属项目选择器
      dateShow: false,              // 日期选择器
      yearShow: false,              // 年份选择器
      
      dateFrom: '',                 // 日期选择器来历
      years: [],                    // 年份选择数据
      currentDate: new Date().getTime(), // 当前时间

      currentStaffs: [{             // 当前业绩共享人
        staff_id: '', 
        staff_name: ''             
      }],
      currentProjectData: [{        // 当前选中项目
        name: '',                   
        value: '',                  // 项目 id
      }],
      currentPlanData: [{           // 当前回款计划
        name: '',
        value: ''                   // 计算索引
      }],

      currentProjectIds: '',        // 复制新创建需要使用当前选中内容
      currentProjectName: '',       // 复制新创建需要使用当前选中内容
      currentPlan: {},              // 当前则在操作的计划项
      currentPlanIndex: 0,          // 当前正在操作的计划索引
      
      currentLog: {},               // 当前正在操作的记录项
      currentLogIndex: 0,           // 当前正在操作的记录项索引

      projectOption: [],            // 项目选择器选项
      planOptions: [],              // 计划选择选项
      
      projectData: [],              // 项目数据   
      payLog:  [],                  // 回款记录数据
      payPlan: [],                  // 回款计划数据

      formData: {
        uid: '',                    // 用户 id
        surname: "",                // 用户名
        mobile: "",                 // 手机号
        id_card_number: "",         // 身份证
        source: '',                 // 客户来源
        online_course: '',          // 是否开通网课
        union_staff_id: '',         // 共享业绩人 id
        staff_name: '',             // 共享业绩人 name
        type: 0,                    // 报名类型 
        jiebie_id: "",              // 届别 id 
        jiebie_name: '',            // 届别名称
        is_new: '2',                // 是否为新客户 1，新客户 2，就客户 
        tips: "",                   // 备注信息
        order_id:  '',              // 订单 id
        order_money: '',            // 订单总金额
        total_money: '',            // 所选项目学费总金额
        other_money: '',            // 配置计划中除学费外金额
      },
    };
  },
  onLoad(query) {
    let order_id = query.order_id || 28890;
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;
    this.getCrmOrderDetail(order_id);
    this.generatorYearOptions();
  },
  methods: {
    // tabe切换
    handlerTabChange({ detail }) {
      this.active = detail.name;
    },
    // 订单小结金额计算
    computeMoney(arr) {
      let totalMoney = 0, otherMoney = 0, orderMoney = 0
      if (!arr) return;
      for(let i = arr.length - 1; i >= 0; i--) {
        let item = arr[i]
        if (item.type == 1) {
          totalMoney = accAdd(totalMoney, item.money)
        } else {
          otherMoney = accAdd(otherMoney, item.money)
        }
      }
      orderMoney = accAdd(totalMoney, otherMoney)
      return { totalMoney, otherMoney, orderMoney }
    },
    // 总学费金额计算
    computeTuitionMoney(arr) {
      let cache = 0;
      (arr || []).map(item => { cache = accAdd(cache, item.must_money); })
      return cache
    },
    // 活动面板事件
    onOpenSheet(key, index, item) {
      let flag = true
      switch (key) {
        case 'gradeOptions': // 届别
          if (!this.projectData.length) {
             uni.showToast({ icon: "none", title: "请先选择项目" });
             flag = false
          } else if (this.formData.type == 0) {
            this.sheetShow = true
            flag = false
          }
        break;
        case 'fromOptions':  // 来源
        break;
        case 'payTypeOptions': // 支付方式
          this.currentPlanIndex = index
          this.currentLog = item
        break;
        case 'years':
          this.currentPlanIndex = index
          this.currentPlan = item
        break;
        default: 
          // console.log('onOpenSheet err', key);
        break;
      }

      if (flag) {
        this.sheetChecked = key;
        this.sheetShow = true;
        this.sheetActions = this[key];
      }
    },
    // 打开选择器
    onOpenSelect(selectKey, index, item) {
      // console.log('onOpenSelect', selectKey, index, item);
      switch (selectKey) {
        case 'staff': 
          this.selectStaffShow = true;
        break;
        case 'occProject':
          this.selectOccProjectShow = true;
        break;
        case 'eduProject': 
          this.selectEduProjectShow = true;
        break;
        case 'project':
          this.projectShow = true;
          this.currentPlanIndex = index
          this.currentPlan = item
          this.currentProjectData = this.generatorProjectData(item, this.projectOption)
        break;
        case 'plan':
          this.planShow = true
          this.currentPlanIndex = index
          this.currentLog = item
          this.currentPlanData = this.generatorPlanData(item, this.planOptions)
        break;
        default:
          // console.log('openSelceProject error', selectKey);
        break;
      }
    },
    // 打开选择器
    openPicker(key, from, index, item) {
      // console.log("openPicker", key, from, index, item);
      switch(key) {
        case 'date':
          if (from === 'plan') {
            this.currentPlanIndex = index
            this.currentPlan = item            
          } else {
            this.currentLogIndex = index
            this.currentLog = item
          }
          this.dateFrom = from
        break;
        default: 
          // console.log("onPicker error", key, from);
        break;
      }
      this.dateShow = true
    },
    // 活动面板选择事件，动态更新
    handlerSheetSelect({ detail }) {
      switch (this.sheetChecked) {
        case 'payTypeOptions':
          this.dynamicInput('planRecond', { pay_type: detail.name }, this.currentPlanIndex)
        break;
        case 'gradeOptions':
          this.dynamicInput('formData', { jiebie_name: detail.name, jiebie_id: detail.value })
        break;
        case 'fromOptions':
          this.dynamicInput('formData', { source: detail.name })
        break;
        case 'years':
          this.dynamicInput('configPlan', { year: detail.name }, this.currentPlanIndex)
        break;
        default:
          // console.log("handlerSheetSelect error", this.sheetChecked, detail);
        break;
      }
    },
    // 充值选择状态
    handleTypeChange({ detail }) {
      this.formData.type = detail;
      this.checkedProjectName = "";
      this.projectData = [];
      this.$refs.selectProject.resset();
      this.$refs.selectEduProject.resset(); 
    },
    // 选择学历项目
    handleSelectEduProjectChange(project = []) {
      // console.log("beichufa");
      this.projectData = project.map(item => { item.must_money = ''; return item; })
      this.projectOption = this.generatorProjectOption(this.projectData)
      this.selectEduProjectShow = false;
    },
    // 选择职称项目
    handleSelectProjectChange(project = [], init = false) {
      let idStr = project.map(item => item.value).join(',')
      this.selectOccProjectShow = false;
      this.getCateProjectDetail(idStr, init);
    },
    // 选择业绩共享人
    handleSelectChange(checked) {
      let union_staff_id = checked.map((item) => item.staff_id).join(","),
          staff_name = checked.map((item) => item.staff_name).join(",");

      this.formData.staff_name = staff_name
      this.formData.union_staff_id = union_staff_id
      this.selectStaffShow = false;
    },
    // 选择回款计划所属项目
    handleSelectOfProject(detail) {
      // console.log("currentProjectData", detail, this.currentProjectData);
      let index = this.currentPlanIndex,
          currentItem = this.currentPlan,
          ids = detail.map(item => item.value).join(','), 
          names = detail.map(item => item.name).join(',')

      currentItem.project_ids = ids
      currentItem.project_name = names
      this.currentProjectIds = currentItem.project_ids
      this.currentProjectName = currentItem.project_name
      this.dynamicInput('configPlan', { project_ids: ids, project_name: names }, index)
      this.projectShow = false
    },
    // 日期选择
    handleDateChange(detail) {
      if (this.dateFrom === 'plan') {
        this.dynamicInput('configPlan', { day: detail }, this.currentPlanIndex)
      } else {
        this.dynamicInput('planRecond', { pay_date: detail }, this.currentLogIndex)
      }
      this.dateShow = false
    },
    // 计划选择
    handleSelectLog(detail = []) {
      // console.log("handleSelectLog", detail, this.currentPlanData);
      this.planShow = false 
      let ids = [], moneyAll = 0
      detail.forEach(item => {
        if (item.major_detail_ids) {
          ids.push(item.major_detail_ids)
        } else {
          ids.push(item.project_ids)
        }
        moneyAll = accAdd(moneyAll, item.money)
      })
      this.$emit('dynamic-input', 'planRecond', { pay_money: moneyAll, pay_plan_id: ids }, this.currentLogIndex)
    },
    // 根据子组件转发事件类型动态更新props, data
    dynamicInput(key, val, index) {
      // console.log("dynamicInput", key, val, index);
      let formData = this.formData, payPlan = this.payPlan, payLog = this.payLog, projectData = this.projectData
      
      if (key === 'formData') {
        Object.keys(val).forEach(k => formData[k] = val[k])

      } else if (key === "planRecond") {
        payLog[index] = { ...payLog[index], ...val }
      } else if (key === "projectData") {

        projectData[index] = { ...projectData[index], ...val }
        let totalMoney = this.computeTuitionMoney(projectData), orderMoney = accAdd(totalMoney, formData.other_money)
        this.dynamicInput('formData', { total_money: totalMoney, order_money: orderMoney })
        this.projectOption = this.generatorProjectOption(projectData)
      
      } else if (key === "configPlan") {
        if (index !== undefined) {
          payPlan[index] = { ...payPlan[index], ... val }
        } else {
          payPlan = val
        }
        this.payPlan = payPlan
        this.planOptions = this.generatorPlanOptions(payPlan)
        let { otherMoney } = this.computeMoney(payPlan), orderMoney = accAdd(otherMoney, formData.total_money)
        this.dynamicInput('formData', { order_money: orderMoney, other_money: otherMoney })
      }
      
      // console.log(
      //   "dynamicInput:", formData,
      //   "\n projectData:", projectData,
      //   "\n pay_plan:", payPlan,
      //   "\n pay_log:", payLog
      // )
    },
    // 取消
    handleCancel() {
      uni.navigateBack();
    },
    // 保存
    async handleSave() {
      let formData = this.formData;
      let param = this.resolveSubmitData(formData);
      
      if (this.validator(param)) {
        let res = await orderReshuffle(param).catch((err) => {})
        if (res.code === 0) {
          uni.navigateBack().then(() => {
            uni.showToast({ icon: "none", title: `申请异动成功`});
            this.eventChannel.emit("updateData", {});
          });
        }
      }
    },
    // 校验
    validator(param) {
      let orderMoneyVali = (val, key) => {
        return parseFloat(val) >= 0
      }

      let projectVali = (val, key) => {
        let _val = JSON.parse(val);
        let must_money = _val.every((v) => `${v.must_money}`.length > 0);
        if (!must_money) {
          // console.log('vali' ,val, key, must_money, param);
          uni.showToast({ icon: "none", title: "请填写项目价格或总学费" });
        }
        return must_money;
      };

      let payPlanVali = (val, key) => {
        let plan = val.filter((v, i) => {
          if (!v.year) {
            uni.showToast({ icon: "none", messages: "请选择所属年份" });
          } else if (!v.pay_day) {
            uni.showToast({ icon: "none", messages: "请选择计划回款日期" });
          } else if (`${v.money}`.length <= 0) {
            uni.showToast({ icon: "none", messages: "请填写计划回款金额" });
          } else if (`${v.project_name}`.length <= 0) {
            uni.showToast({ icon: "none", messages: "请输入所属项目" });
          }
        })

        return plan.length <= 0;
      };

      let payLog = (val, key) => {
        let paylog = val.filter((v, i) => {
          if (!v.pay_date) {
            uni.showToast({ icon: "none", messages: "请选择回款记录回款日期" });
          } else if (v.pay_plan_id <= 0) {
            uni.showToast({ icon: "none", messages: "请选择回款记录回款计划" });
          } else if (`${v.pay_money}`.length <= 0 || parseFloat(v.pay_money) <= 0) {
            uni.showToast({ icon: "none", messages: "请选择回款记录回款金额, 却回款金额不能小于等于0元" });
          } else if (!v.pay_type) {
            uni.showToast({ icon: "none", messages: "请选择回款记录支付方式" });
          }
        })

        return paylog.length <= 0;
      };

      let rules = [
        { key: "order_id", type: "required" },
        { key: "order_money", validator: orderMoneyVali },
        { key: "source", type: "required" },
        { key: "online_course", type: "required" },
        { key: "project", validator: projectVali },
        { key: "pay_plan", validator: payPlanVali },
        { key: "pay_log", validator: payLog },
      ];

      let messages = [
        { key: "order_id", message: "请填写订单号" },
        { key: "order_money", message: "请输入正确订单金额" },
        { key: "source", message: "请选择订单来源" },
        { key: "online_course", message: "请选择是否开通网课" },
        { key: "project", message: "请配置项目信息" },
        { key: "pay_plan", message: "请详细配置回款计划" },
        { key: "pay_log", message: "请配置回款记录" },
      ];

      let validator = new Validator(rules, messages);

      if (!validator.checkFrom(param)) {
        validator.showToast()
        return false
      } else {
        return true
      }
    },
    // 已选职称项目详情
    async getCateProjectDetail(idStr, init) {
      if (!idStr) { return projectData = []; }
      const data = { id: idStr }
      let res = await getCateProjectDetail(data);
      if (res.code === 0) {
        let projectData = res.data.map(item => { item.must_money = ''; return item; })
        this.projectOption = this.generatorProjectOption(projectData)
        if (!init) { this.projectData = projectData }
        this.getGradeOptions(res.data[0].category_id)
      }
    },
    // 动态获取界别缺少
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
    // 获取订单详情
    async getCrmOrderDetail(order_id) {
      let params = { order_id: order_id };
      let res = await getCrmOrderDetail(params).catch(() => {});
      let data = res.data, _data = Object.create(null);
      if (res.code == 0) {
        for(let k in data) { _data[k] = data[k]; }
        this.normalizeDetailData(_data)
      }
    },
    // 规范化详情数据
    normalizeDetailData(data) {
      // console.log('normalizeDetailData start', data);
      data.union_staff_id = data.union_staff_id || ''
      data.source = data.source || ''
      data.type = data.type || 0
    
      // 处理回款计划与回款记录数据
      let plan = this.resolvePlanlog(data.pay_log, data.pay_plan);
      // 处理已选项目数据
      let projectData = this.resolveProjectData(data.project);
      // 生成当前业绩共享人选项
      let curr_staff = this.generatorSaffData(data.union_staff_id, this.staffOptions)
      // 生成项目配置数据
      let projectOption = this.generatorProjectOption(projectData)
      // 职称项目需要动态生成届别
      if (data.type == 0) this.handleSelectProjectChange(projectOption, true);
      // 生成计划配置数据
      let planOptions = this.generatorPlanOptions(plan.payPlan)
      
      // console.log('staff', curr_staff);
      this.payLog = plan.payLog
      this.payPlan = plan.payPlan
      this.projectData = projectData
      this.projectOption = projectOption
      this.planOptions = planOptions
      this.currentStaffs = curr_staff
      this.formData = data
    },
    // 处理计划数据
    resolvePlanlog(payLog = [], payPlan = []) {
      // console.log("resolvePlanlog start", payLog, payPlan);
      let types = this.expenseType

      // 计划数据处理
      payPlan = payPlan.map((item) => {
        item.name = types[item.type];
        item.project_ids = item.major_detail_ids || item.project_ids || ''
        return item;
      })

      // 记录数据处理
      payLog = payLog.map((item) => {
        let pay_plan_id = item.pay_plan_id

        payPlan.forEach(plan => {
          if (pay_plan_id.indexOf(`${plan.id}`) !== -1) {
            item.pay_plan_name = `${plan.year} ${plan.name} ￥${plan.money}`
          }
        })

        item.receipt_file = (item.receipt_file || []).map((file, index) => {
          return { name: "回款凭证" + (index + 1), url: file };
        });

        return item;
      });

      // console.log('resolvePlanlog end', payLog , payPlan);
      return { payLog, payPlan };
    },
    // 处理详情接口返回的项目数据
    resolveProjectData(projectData) {
      let list = JSON.parse(projectData) || [];
      // console.log("resolveProjectData:", list);
      return list.map(item => {
        item.price = item.project_price || item.total_money
        return item
      })
    },
    // 提交表单数据处理
    resolveSubmitData(formData) {
      let data = { ...formData },
          payLog = this.payLog,
          payPlan = this.payPlan,
          projectData = this.projectData

      // console.log(
      //   "resolveSubmitData start", data,
      //   "\n projectData:", projectData,
      //   "\n pay_plan:", payPlan,
      //   "\n pay_log:", payLog
      // );
      // 项目信息
      data.project = JSON.stringify(projectData);
      // 回款计划
      data.pay_plan = payPlan.map(item => {
        item.project_ids = item.project_ids || item.major_detail_ids || ''
        return item
      });
      // 回款记录信息处理
      data.pay_log = payLog.map((item) => {
        delete item.pay_plan_name;
        item.receipt_file =  (item.receipt_file || []).map(file => file.url || file);
        return item;
      });

      // console.log("resolveSubmitData end", data);
      return data;
    },
    // 生成项目配置数据
    generatorProjectOption(projectData = []) {
      // console.log("generatorProjectOption start", projectData);
      return projectData.map(item => ({ 
        value: item.id, 
        name:  (item.major && item.major.value) || item.major_name || item.project_name || ''
      }))
    },
    // 生成年份配置
    generatorYearOptions() {
      this.years = getPlanYearOptions().map(item => ({ name: item }))
    },
    // 生成当前业绩共享人
    generatorSaffData(staffIds, staffOptions) {
      return staffOptions.filter(staff => { staffIds.indexOf(`${staff.staff_id}`) !== -1 })
    },
    // 生成当前选额项目
    generatorProjectData(plan, projectOption = []) {
      // console.log('generatorProjectData', plan, projectOption);
      let ids = plan.major_detail_ids || plan.project_ids || ''
      return projectOption.filter(pro => ids.indexOf(`${pro.value}`) !== -1)
    },
    // 生成当前回款计划
    generatorPlanOptions(plans = []) {
      // console.log('generatorPlanData start', plans);
      return plans.map(item => ({
        name:  `${item.year} ${item.name} ￥${item.money || 0}`,
        value: item.id
      }))
    },
    // 生成当前所选计划
    generatorPlanData(log = {}, plans = []) {
      // console.log("generatorPlanData start", log, plans);
      let ids = log.pay_plan_id || ''
      return plans.filter(plan => ids.indexOf(`${plan.value}`) !== -1)
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.different-change {
  width: 100%;
  overflow: hidden;

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 66;
    width: 100%;
    background-color: #fff;

    .tags {
      padding: 20rpx;
      margin: 20rpx 20rpx 40rpx;
      font-size: 24rpx;
      color: #ff4b4b;
    }

    &-submit {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0rpx 40rpx 20rpx;
    }

    /deep/.van-button {
      width: 300rpx;
    }
  }
}
</style>