<template>
  <view class="data-board">
    <NavBar title="数据看板" />
    <view>
      <van-cell
        is-link 
        :title="dataRangeTitle"
        title-class="cell-title"
        :value="activeSheet[activeSheetIndex - 1].name"
        value-class="cell-value"
        custom-class="cell"
        @click="activeSheetShow = true"
      />
    </view>
    <view class="data-board-content">
      <Panel
        title="销售简报"
        :sheet-actions="briefingActionSheet"
        v-model="briefingType"
        @sheet-change="getBriefing"
      >
        <SalesData :data="briefingData" :orgData="briefingDataOrg"/>
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
        <TrendBar
          @change="getTrendData"
          v-model="trendType"
          :data="trendData"
        />
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
        title="客户分析"
        actionType="time"
        v-model="customerRankMonth"
        @sheet-change="getCustomerRankData"
      >
        <view class="customer-actions">
          <van-button
            @click="customerActive = 1"
            :type="customerActive === 1 ? 'warning' : 'default'"
            size="small"
            round
            custom-style="padding:4rpx 0;width:200rpx;"
            >客户来源</van-button
          >
          <van-button
            @click="customerActive = 2"
            :type="customerActive === 2 ? 'warning' : 'default'"
            size="small"
            round
            custom-style="padding:4rpx 0;width:200rpx;"
            >客户拥有量</van-button
          >
        </view>
        <Pie :data="customerPieData" v-if="customerActive === 1" />
        <InputRankBar v-else :data="customerRankData" />
      </Panel>
    </view>

    <van-action-sheet
      overlay
      :show="activeSheetShow"
      :actions="activeSheet"
      @close="activeSheetShow = false"
      @select="handlerActiveSheet"
    />
  </view>
</template>

<script>
//图表是定制过的： https://echarts.apache.org/zh/builder.html      version: 4.8.0
import Panel from "./components/Panel";
import SalesData from "./components/SalesData";
import GaugeChart from "./components/GaugeChart";
import TrendBar from "./components/TrendBar";
import RankBar from "./components/RankBar";
import InputRankBar from "./components/InputRankBar";
import Pie from "./components/Pie";
import NavBar from "@/components/navBar/index";
import {
  getBriefing,
  getBriefingOrg,
  performanceIndicators,
  getTrendData,
  getSalesRankData,
  getCustomerRankData,
} from "@/api/dataBoard";
import { mapGetters } from "vuex";
import subscribeMessage from "@/mixins/subscribeMessage";
export default {
  mixins: [subscribeMessage],
  components: {
    Panel,
    SalesData,
    GaugeChart,
    TrendBar,
    RankBar,
    InputRankBar,
    NavBar,
    Pie,
  },
  data() {
    return {
      // 销售简报
      briefingType: 6,
      briefingData: {},
      briefingDataOrg: {},
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
      // 动作面板
      activeSheetShow: false,
      activeSheetIndex: 1,
      activeSheet: [
        { name: '按回款创建时间', value: 1 },
        { name: '按申请入账时间', value: 2 },
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
      // 客户分析
      customerRankData: [],
      customerPieData: [],
      customerRankMonth: new Date().getTime(),
      pageIsShow: true,
      customerActive: 1,

      staffName: '',
      staffNameLength: 0,
    };
  },
  computed: {
    ...mapGetters(['checkedStaffData', "checkedStaffIds", 'userInfo']),
    dataRangeTitle() {
      const len = this.checkedStaffData.length 
      return ( len
        ? `${this.checkedStaffData[0].title} 等${len}个范围`
        : ''
      ) 
    },
  },
  watch: {
    checkedStaffIds() {
      if (this.pageIsShow) {
        this.getBriefing();
        this.performanceIndicators();
        this.getTrendData();
        this.getSalesRankData();
        this.getCustomerRankData();
      }
    },
  },
  onLoad() {
    this.initTrendYearOptions();
  },
  onShow() {
    this.pageIsShow = true;
    this.getBriefing();
    this.performanceIndicators();
    this.getTrendData();
    this.getSalesRankData();
    this.getCustomerRankData();
  },
  onHide() {
    this.pageIsShow = false;
    this.activeSheetShow = false
  },
  methods: {
    handlerActiveSheet({ detail }) {
      this.activeSheetIndex = detail.value
      this.getBriefing();
      this.performanceIndicators();
      this.getTrendData();
      this.getSalesRankData();
      this.getCustomerRankData();
    },
    // 销售简报
    async getBriefing() {
      const data = {
        type: this.briefingType,
        arr_uid: this.checkedStaffIds,
        returned_type: this.activeSheetIndex,
        select_type: 1,
      };

      const dataOrg = {
        type: this.briefingType,
        arr_uid: this.checkedStaffIds,
        returned_type: this.activeSheetIndex,
        select_type: 2,
      };

      const keys = ['briefingData', 'briefingDataOrg']
      
      const res = await Promise.all([ getBriefing(data), getBriefingOrg(dataOrg) ])

      if (res && res.length >= 0) {
        for (let i = 0, ii = res.length; i < ii; i++) {
          const item = res[i], key = keys[i]
          if (item.code == 0) {
            this[key] = item.data
          }
        }
      }
    },
    // 业绩指标
    async performanceIndicators() {
      const data = {
        type: this.performanceType,
        arr_uid: this.checkedStaffIds,
        returned_type: this.activeSheetIndex,
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
        arr_uid: this.checkedStaffIds,
        returned_type: this.activeSheetIndex,
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
      this.salesRankCheckedData = this.salesRankData[
        keyNameMap[this.rankType]
      ].filter((item, index) => index < 10);
    },
    async getSalesRankData() {
      const date = new Date(this.salesRankMonth);
      const data = {
        month: `${date.getFullYear()}-${date.getMonth() + 1}`,
        arr_uid: this.checkedStaffIds,
        returned_type: this.activeSheetIndex,
      };
      const res = await getSalesRankData(data).catch(() => {});
      if (res.code === 0) {
        const keyNameMap = {
          1: "payRank",
          2: "orderRank",
          3: "refundRank",
        };
        this.salesRankData = res.data;
        this.salesRankCheckedData = this.salesRankData[
          keyNameMap[this.rankType]
        ].filter((item, index) => index < 10);
      }
    },
    // 客户分析
    async getCustomerRankData() {
      const date = new Date(this.customerRankMonth);
      const data = {
        month: `${date.getFullYear()}-${date.getMonth() + 1}`,
        arr_uid: this.checkedStaffIds,
        returned_type: this.activeSheetIndex,
      };
      const res = await getCustomerRankData(data).catch(() => {});
      if (res.code === 0) {
        this.customerPieData = res.data.cake;
        this.customerRankData = res.data.chart.filter(
          (item, index) => index < 10
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.data-board {
  height: 100%;
  overflow: hidden;
  .flex();
  flex-direction: column;
  background-color: #f2f6fc;
  /deep/.panel {
    margin-bottom: 20rpx;
  }
  
  /deep/.cell-title {
    width: 400rpx;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: @font-size-sm;
    color: @text-color;
  }

  /deep/.cell-value {
    width: 200rpx;
    font-size: @font-size-sm;
    color: @text-color-grey;
  }

  &-content {
    padding: 20rpx;
    overflow-y: auto;
  }
  .customer-actions {
    .flex-c-a();
  }
  
  /deep/.cell {
    background: transparent;
  }
}
</style>