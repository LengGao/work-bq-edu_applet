<template>
  <view class="data-board">
    <NavBar title="机构看板" />
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
        title="数据概览"
        actionType="dates"
        :start="startData"
        :end="endDate"
        @sheet-change="updateDataForTime"
        @start-select="onStartDateSelected"
        @end-select="onEndDateSelected"
      >
        <SalesData :data="briefingData" />
      </Panel>

      <Panel title="销售增量数据">
        <RankBar
          @change="handleRankTypeChange"
          :value="salesRankType"
          :data="saleData"
          :seriesName="seriesNameSale"
          dataType="salesRank"
        />
      </Panel>

      <Panel title="学生增量数据">
        <RankBar
          @change="handleRankTypeChange"
          :value="studentRankType"
          :data="studentData"
          :seriesName="seriesNameStudent"
          chartColor="#199fff"
          dataType="studentRank"
        />
      </Panel>
      
      <Panel title="学费增量数据">
        <RankBar
          @change="handleRankTypeChange"
          :value="tuitionRankType"
          :data="tuitionData"
          :seriesName="seriesNameTuition"
          chartColor="#43d100"
          dataType="tuitionRank"
        />
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
  getUserId,
  getBriefing,
  getOrgSalesRank,
  getOrgStudentRank,
  getOrgTuitionRank,
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
      briefingDate: [],
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

      // 销售数据
      salesRankData: {
        overdue_money: [],
        pay_money: [],
        refund_money: [],
        total_money: []
      },
      salesRankType: "pay_money",
      salesRankIndex: 0,
      salesRankTypes: [
        {
          label: "回款金额",
          value: "pay_money",
        },
        {
          label: "欠缴金额",
          value: "overdue_money",
        },
        {
          label: "订单金额",
          value: "total_money",
        },
        {
          label: "退款金额",
          value: "refund_money",
        }
      ],
      // 学生数据
      studentRankData: {
        archives_total: [],
        not_registered_total: [],
        registered_total: [],
        user_total: []
      },
      studentRankType: "user_total",
      studentRankIndex: 0,
      studentRankTypes: [
        {
          label: "用户总数",
          value: "user_total",
        },
        {
          label: "学生档案数",
          value: "archives_total",
        },
        {
          label: "已报名",
          value: "registered_total",
        },
        {
          label: "未报名",
          value: "not_registered_total",
        }
      ],

      // 学费排行
      tuitionRankData: {
        orderMoney: [],
        payMoney: [],
        entryMoney: []
      },
      tuitionRankType: "orderMoney",
      tuitionRankIndex: 0,
      tuitionRankTypes: [
        {
          label: "订单金额",
          value: "orderMoney",
        },
        {
          label: "回款金额",
          value: "payMoney",
        },
        {
          label: "入账金额",
          value: "entryMoney",
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
      staffName: '',
      staffNameLength: 0,
      pageIsShow: true,                             // 控制权限请求时机                          
      startData: new Date().getTime(),
      endDate: new Date().getTime(),
      dataRange: ['', ''],
    };
  },
  computed: {
    ...mapGetters(['userInfo','checkedStaffIds', 'checkedStaffData']),
    dataRangeTitle() {
      const len = this.checkedStaffData.length 
      return ( len
        ? `${this.checkedStaffData[0].title} 等${len}个范围`
        : ''
      ) 
    },
    seriesNameSale() {
      return this.salesRankTypes.find(item => item.value === this.salesRankType).label
    },
    seriesNameStudent() {
      return this.studentRankTypes.find(item => item.value === this.studentRankType).label
    },
    seriesNameTuition() {
      return this.tuitionRankTypes.find(item => item.value === this.tuitionRankType).label
    },
    saleData() {
      let key = this.salesRankType, data = this.salesRankData
      // console.log(data, key, data[key]);
      return ( data 
        ? Array.isArray(data[key])
          ? data[key].slice(0, 20)
          : []
        : []
      )
    },
    studentData() {
      let key = this.studentRankType, data = this.studentRankData
      return data ? data[key].slice(0, 20) : []
    },
    tuitionData() {
      let key = this.tuitionRankType, data = this.tuitionRankData
      // console.log(data, key, data[key] );
      return ( data 
        ? Array.isArray(data[key])
          ? data[key].slice(0, 20)
          : []
        : []
      )
    },
  },
  watch: {
    checkedStaffIds(val) {
      if (this.pageIsShow) {
        // console.log("checkedStaffIds", val)
        // this.checkedStaffIds = val
        this.updateDataForTime()
      }
    },
  },
  onLoad() {
    this.dataRange = [
      this.dateTimeFormat(this.startData),
      this.dateTimeFormat(this.endDate)
    ]
  },
  onShow() {
    this.pageIsShow = true;
    // if (this.checkedStaffIds.length) {
    this.updateDataForTime()
    // }
  },
  onHide() {
    this.pageIsShow = false;
    this.activeSheetShow = false
  },
  methods: {
    onStartDateSelected(detail) {
      this.startData = detail
      this.dataRange[0] = this.dateTimeFormat(detail)
      this.updateDataForTime()
    },
    onEndDateSelected(detail) {
      this.endDate = detail
      this.dataRange[1] = this.dateTimeFormat(detail)
      this.updateDataForTime()
    },
    handlerActiveSheet({ detail }) {
      this.activeSheetIndex = detail.value
      this.updateDataForTime()
    },
    // 销售龙虎榜
    handleRankTypeChange(type, dataType) {
      switch (dataType) {
        case 'salesRank':
          this.salesRankType = type
        break;
        case 'studentRank':
          this.studentRankType = type
        break;
        case 'tuitionRank':
          this.tuitionRankType = type
        break;
      }
    },
    // 更新数据
    async updateDataForTime() {
      let [start_date, end_date] = this.dataRange
      let arr_id = this.checkedStaffIds
      let params = {
        start_date,
        end_date,
        arr_uid: arr_id,
        select_type: 2,
        returned_type: this.activeSheetIndex
      }
      this.getBriefing(params)
      this.getOrgSalesRank(params)
      this.getOrgStudentRank(params)
      this.getOrgTuitionRank(params)
    },
    // 销售简报
    async getBriefing(params) {
      const res = await getBriefing(params).catch(() => {});
      if (res.code === 0) {
        this.briefingData = res.data;
      }
    },
    // 销售数据
    async getOrgSalesRank(params) {
      const res = await getOrgSalesRank(params).catch(() => {});
      if (res.code === 0) {
        this.salesRankData = res.data;
      }
    },
    // 学生数据
    async getOrgStudentRank(params) {
      const res = await getOrgStudentRank(params).catch(() => {});
      if (res.code === 0) {
        this.studentRankData = res.data;
      }
    },
    // 学费
    async getOrgTuitionRank(params) {  
      const res = await getOrgTuitionRank(params).catch(() => {});
      if (res.code === 0) {
        this.tuitionRankData = res.data;
      }
    },
    async getUserId(arr_uid, arr_group) {
      const data = {
        arr_uid,
        arr_group,
      };
      const res = await getUserId(data);
      if (res.code === 0) {
        // console.log("getUserId", res.data);
      }
    },
    // 时间格式化
    dateTimeFormat(val) {
        let date = new Date(val),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate()
        return `${year}-${month < 10 ? '0' + month : month }-${day < 10 ? '0' + day : day}`
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