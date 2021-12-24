<template>
  <view class="data-board">
    <Panel
      title="销售简报"
      :sheet-actions="briefingActionSheet"
      v-model="briefingType"
      @sheet-change="getBriefing"
    >
      <SalesData :data="briefingData" />
    </Panel>
    <Panel
      title="业绩指标"
      :sheet-actions="performanceSheet"
      v-model="performanceType"
      @sheet-change="performanceIndicators"
    >
      <GaugeChart :data="performanceData" />
    </Panel>
    <Panel
      title="销售趋势"
      :sheet-actions="trendActionSheet"
      v-model="trendYear"
      @sheet-change="getTrendData"
    >
      <TrendBar @change="getTrendData" v-model="trendType" :data="trendData" />
    </Panel>
    <Panel
      title="销售龙虎榜"
      actionType="time"
      v-model="salesRankMonth"
      @sheet-change="getSalesRankData"
    >
      <RankBar
        @change="handleRankTypeChange"
        v-model="rankType"
        :data="salesRankCheckedData"
      />
    </Panel>
    <Panel
      title="录入客户排行榜"
      actionType="time"
      v-model="customerRankMonth"
      @sheet-change="getCustomerRankData"
    >
      <InputRankBar :data="customerRankData" />
    </Panel>
  </view>
</template>

<script>
import Panel from "./components/Panel.vue";
import SalesData from "./components/SalesData.vue";
import GaugeChart from "./components/GaugeChart.vue";
import TrendBar from "./components/TrendBar.vue";
import RankBar from "./components/RankBar.vue";
import InputRankBar from "./components/InputRankBar.vue";
import {
  getBriefing,
  performanceIndicators,
  getTrendData,
  getSalesRankData,
  getCustomerRankData,
} from "@/api/dataBoard";
export default {
  components: {
    Panel,
    SalesData,
    GaugeChart,
    TrendBar,
    RankBar,
    InputRankBar,
  },
  data() {
    return {
      userIds: [],
      // 销售简报
      briefingType: 6,
      briefingData: {},
      briefingActionSheet: [
        {
          name: "今天",
          value: 6,
        },
        {
          name: "昨天",
          value: 7,
        },
        {
          name: "本月",
          value: 0,
        },
        {
          name: "上月",
          value: 1,
        },
        {
          name: "本季度",
          value: 2,
        },
        {
          name: "上季度",
          value: 3,
        },
        {
          name: "今年",
          value: 4,
        },
        {
          name: "去年",
          value: 5,
        },
      ],
      // 业绩目标
      performanceData: {},
      performanceType: 0,
      performanceSheet: [
        {
          name: "本月",
          value: 0,
        },
        {
          name: "上月",
          value: 1,
        },
        {
          name: "本季度",
          value: 2,
        },
        {
          name: "上季度",
          value: 3,
        },
        {
          name: "今年",
          value: 4,
        },
        {
          name: "去年",
          value: 5,
        },
      ],
      // 销售趋势
      trendActionSheet: [],
      trendData: [],
      trendType: 1,
      trendYear: "",
      // 销售龙虎榜
      salesRankData: {},
      salesRankCheckedData: [],
      rankType: 1,
      salesRankMonth: new Date().getTime(),
      // 录入客户排行榜
      customerRankData: [],
      customerRankMonth: new Date().getTime(),
    };
  },
  onShow() {
    this.initTrendYearOptions();
    this.getBriefing();
    this.performanceIndicators();
    this.getTrendData();
    this.getSalesRankData();
    this.getCustomerRankData();
  },
  methods: {
    // 销售简报
    async getBriefing() {
      const data = {
        type: this.briefingType,
        arr_uid: this.userIds,
      };
      const res = await getBriefing(data);
      if (res.code === 0) {
        this.briefingData = res.data;
      }
    },
    // 业绩指标
    async performanceIndicators() {
      const data = {
        type: this.performanceType,
        arr_uid: this.userIds,
      };
      const res = await performanceIndicators(data);
      if (res.code === 0) {
        this.performanceData = res.data;
      }
    },
    // 销售趋势
    initTrendYearOptions() {
      let currentYear = new Date().getFullYear();
      const minYear = 2015;
      this.trendYear = currentYear;
      while (currentYear > minYear) {
        this.trendActionSheet.push({
          name: currentYear,
          value: currentYear,
        });
        currentYear--;
      }
    },
    async getTrendData() {
      const data = {
        year: this.trendYear,
        type: this.trendType,
        arr_uid: this.userIds,
      };
      const res = await getTrendData(data).catch(() => {});
      if (res.code === 0) {
        this.trendData = res.data;
      }
    },
    // 销售龙虎榜
    handleRankTypeChange() {
      const keyNameMap = {
        1: "payRank",
        2: "orderRank",
        3: "refundRank",
      };
      this.salesRankCheckedData = this.salesRankData[keyNameMap[this.rankType]];
    },
    async getSalesRankData() {
      const date = new Date(this.salesRankMonth);
      const data = {
        month: `${date.getFullYear()}-${date.getMonth() + 1}`,
        arr_uid: this.userIds,
      };
      const res = await getSalesRankData(data).catch(() => {});
      if (res.code === 0) {
        const keyNameMap = {
          1: "payRank",
          2: "orderRank",
          3: "refundRank",
        };
        this.salesRankData = res.data;
        this.salesRankCheckedData =
          this.salesRankData[keyNameMap[this.rankType]];
      }
    },
    // 录入客户排行榜
    async getCustomerRankData() {
      const date = new Date(this.customerRankMonth);
      const data = {
        month: `${date.getFullYear()}-${date.getMonth() + 1}`,
        arr_uid: this.userIds,
      };
      const res = await getCustomerRankData(data).catch(() => {});
      if (res.code === 0) {
        this.customerRankData = res.data;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.data-board {
  background-color: #f2f6fc;
  padding: 20rpx;
  /deep/.panel {
    margin-bottom: 20rpx;
  }
}
</style>