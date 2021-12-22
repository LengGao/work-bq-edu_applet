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
  </view>
</template>

<script>
import Panel from "./components/Panel.vue";
import SalesData from "./components/SalesData.vue";
import GaugeChart from "./components/GaugeChart.vue";
import { getBriefing, performanceIndicators } from "@/api/dataBoard";
export default {
  components: {
    Panel,
    SalesData,
    GaugeChart,
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
    };
  },
  onLoad() {
    this.getBriefing();
    this.performanceIndicators();
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
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.data-board {
  height: 100%;
  background-color: #f2f6fc;
  padding: 20rpx;
  /deep/.panel {
    margin-bottom: 20rpx;
  }
}
</style>