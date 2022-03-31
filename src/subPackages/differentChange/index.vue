<template>
  <view class="different-change">
    <van-tabs
      animated
      type="line"
      color="#199fff"
      title-active-color="#199fff"
      tab-class="custom-tab"
      :active="active"
      @change="handldeTabChange"
    >
      <van-tab title="基本信息">
        <CustomInfo
          v-if="formData.order_id"
          :data="formData"
          @input-blur="modifyUserInfo"
          @dynamic-input="dynamicInput"
        />
      </van-tab>
      <van-tab title="回款计划">
        <ConfigPlan
          v-if="formData.pay_plan && formData.pay_plan.length > 0"
          :list="formData.pay_plan"
          :projectOption="projectOption"
          :totalMoney="formData.totalMoney"
          @dynamic-input="dynamicInput"
        />
      </van-tab>
      <van-tab title="回款记录">
        <PlanInfo
          v-if="formData.pay_log && formData.pay_plan.length > 0"
          :info="formData.pay_log"
          :paylist="formData.pay_plan"
          :orderMoney="formData.orderMoney"
          :totalMoney="formData.totalMoney"
          :otherMoney="formData.otherMoney"
          @dynamic-input="dynamicInput"
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
  </view>
</template>

<script>
import CustomInfo from "./compents/customInfo.vue";
import ConfigPlan from "./compents/configPlan.vue";
import PlanInfo from "./compents/planInfo.vue";
import { getCrmOrderDetail, orderReshuffle } from "@/api/order";
import { mapGetters } from "vuex";
import { accAdd } from "@/utils/index";
import Validator from "@/utils/validator";

export default {
  components: {
    CustomInfo,
    ConfigPlan,
    PlanInfo,
  },
  computed: {
    ...mapGetters(["expenseType"]),
  },
  data() {
    return {
      active: 0,
      formData: {
        orderMoney: '0.00', // 订单金额
        totalMoney: '0.00', // 总报名项目金额
        otherMoney: '0.00', // 其他费用 也就是回款计划中已选择的总额
      },
      eventChannel: "",
      projectOption: []
    };
  },
  onLoad(query) {
    let order_id = query.order_id || 28890;
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;
    this.getCrmOrderDetail(order_id);
  },
  methods: {
    // tabe切换
    handldeTabChange({ detail }) {
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
      console.log("computeTuitionMoney", arr);
      let cache = 0
      if (!arr) return 0
      arr.map(item => { cache = accAdd(cache, item.must_money); })
      return cache
    },
    // 输入修改
    modifyUserInfo(newData) {
      let data = { ...this.formData, ...newData };
      this.formData = data;
      this.projectOption = this.generatorrojectOption(data.projectData)
    },
    // 金额 等动态输入
    dynamicInput(key, val, index) {
      console.log("dynamicInput", key, val, index, this.formData.projectData);
      if (key === "projectData") {
        let projectData = this.formData.projectData
        this.formData.projectData[index].must_money = val;
        projectData[index].must_money = val;
        let tuituiMoney = this.computeTuitionMoney(projectData)
        this.formData.totalMoney = tuituiMoney
        this.formData.orderMoney = accAdd(this.formData.otherMoney, tuituiMoney)

      } else if (key === "planRecond") {
        let _data = this.formData.pay_log[index];
        _data = { ..._data, ...val };
        this.formData.pay_log[index] = _data;

      } else if (key === "configPlan") {
        if (!Array.isArray(val)) {
          let _data = this.formData.pay_plan[index];
          _data = { ..._data, ...val };
          this.formData.pay_plan[index] = _data;
          console.log("configPlan", this.formData.pay_plan);
        } else {
          this.formData.pay_plan = val;
        }

        let { otherMoney } = this.computeMoney(this.formData.pay_plan)
        this.formData.otherMoney = otherMoney
        this.formData.orderMoney = accAdd(otherMoney, this.formData.totalMoney)
      }
    },
    // 取消
    handleCancel() {
      uni.navigateBack();
    },
    // 保存
    async handleSave() {
      let formData = this.formData;
      formData.order_money = this.formData.totalMoney
      let param = this.resolveSubmitData(formData);
      
      if (this.validator(param)) {
        let res = await orderReshuffle(param).catch(() => {});
        if (res.code === 0) {
          uni.navigateBack().then(() => {
            uni.showToast({ icon: "none", title: `${res.message}`});
            this.eventChannel.emit("updateData", {});
          });
        }
      }
    },
    // 校验
    validator(param) {
      let projectVali = (val, key) => {
        let _val = JSON.parse(val);
        let must_money = _val.every((v) => `${v.must_money}`.length > 0);
        if (!must_money) {
          uni.showToast({ icon: "none", title: "请填写项目价格或总学费" });
        }
        return must_money;
      };

      let payPlanVali = (val, key) => {
        console.log("payPlanVali", val);
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
          } else if (`${v.pay_money}`.length <= 0) {
            uni.showToast({ icon: "none", messages: "请选择回款记录回款金额" });
          } else if (!v.pay_type) {
            uni.showToast({ icon: "none", messages: "请选择回款记录支付方式" });
          }
        })

        return paylog.length <= 0;
      };

      let rules = [
        { key: "order_id", type: "required" },
        { key: "order_money", type: "required" },
        { key: "source", type: "required" },
        { key: "online_course", type: "required" },
        { key: "project", validator: projectVali },
        { key: "pay_plan", validator: payPlanVali },
        { key: "pay_log", validator: payLog },
      ];

      let messages = [
        { key: "order_id", message: "请填写订单号" },
        { key: "order_money", message: "请输入学费金额" },
        { key: "source", message: "请选择订单来源" },
        { key: "online_course", message: "请选择是否开通网课" },
        { key: "project", message: "请配置项目信息" },
        { key: "pay_plan", message: "请详细配置回款计划" },
        { key: "pay_log", message: "请配置回款记录" },
      ];

      let validator = new Validator(rules, messages);

      return validator.checkFrom(param);
    },
    // 获取订单详情
    async getCrmOrderDetail(order_id) {
      let params = { order_id: order_id };
      let res = await getCrmOrderDetail(params).catch(() => {});
      let data = res.data;
      if (res.code == 0) {
        let _data = Object.assign(data, {
          union_staff_id: data.union_staff_id,
          source: data.source || "",
          type: data.type || 0,
        });
        // 处理已选项目数据
        _data.projectData = this.resolveProjectData(data.project);
        // 处理回款计划与回款记录数据
        let plan = this.resolvePlanlog(data.pay_log, data.pay_plan);
        _data.pay_log = plan.planLog;
        _data.pay_plan = plan.payPlan;

        // 生成项目配置数据
        this.projectOption = this.generatorrojectOption(_data.projectData)

        // 统计数据处理
        let { orderMoney, otherMoney } = this.computeMoney(_data.pay_plan)
        // _data.totalMoney = totalMoney
        _data.totalMoney = this.computeTuitionMoney(_data.projectData)
        _data.otherMoney = otherMoney
        _data.orderMoney = orderMoney

        this.formData = _data;
      }
    },
    // 处理详情接口返回的项目数据
    resolveProjectData(projectData) {
      projectData = JSON.parse(projectData);
      if (projectData && projectData.length) {
        let _projectData = projectData.map(item => {
          item.price = item.project_price || item.total_money;
          return item;
        })
        return _projectData;
      }
      return [];
    },
    // 生成项目配置数据
    generatorrojectOption(arr) {
    // 获取所属项目选项
      if (!arr) return [];
      let projectOption = arr.map(item => ({ 
        value: item.id, 
        name: item.project_name + (item.major?.value || '')
      }))
      console.log("projectOption", projectOption, arr);
      return projectOption
    },
    // 处理计划数据
    resolvePlanlog(planLog = [], payPlan = []) {
      let types = this.expenseType,
        cacheName = "",
        cacheIndex = [];

      payPlan = payPlan.map((item) => {
        item.name = types[item.type];
        item.project_ids = item.project_ids || item.major_detail_ids || ''
        return item;
      });

      planLog = planLog.map((item) => {
        let pay_plan_ids = item.pay_plan_id.split(",") || [];

        payPlan.map((plan, i) => {
          let id = String(plan.id);
          if (pay_plan_ids.indexOf(id) !== -1) {
            cacheName += cacheName ? `,${plan.name}` : plan.name;
            cacheIndex.push(i);
          }
        });

        item.planCheckedName = cacheName;
        item.planCheckedIndex = cacheIndex;
        console.log("planCheckedIndex", item.planCheckedIndex);

        item.receipt_file = (item.receipt_file || []).map((file, index) => {
          return { name: "回款凭证" + (index + 1), url: file };
        });

        return item;
      });

      return { planLog, payPlan };
    },
    // 表单数据处理
    resolveSubmitData(formData) {
      let data = { ...formData };
      // 项目信息
      data.project = JSON.stringify(formData.projectData);
      // 回款计划
      data.pay_plan = formData.pay_plan.map(item => {
        item.project_ids = item.project_ids || item.major_detail_ids || ''
        return item
      });
      // 回款记录信息处理
      data.pay_log = formData.pay_log.map((item) => {
        let _receipt_file = JSON.parse(JSON.stringify(item.receipt_file));
        item.receipt_file = _receipt_file.map((file) => file?.url);
        return item;
      });

      return data;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";

.different-change {
  position: static;
  width: 100%;
  overflow: hidden;

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    background-color: #fff;

    .tags {
      padding: 20rpx;
      margin: 20rpx 20rpx 40rpx;
      font-size: 24rpx;
      color: #ff4b4b;
      // border: @border;
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