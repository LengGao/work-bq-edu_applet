<template>
  <view class="data-board">
    <view class="data-board-header">
      <view class="users">
        <template v-if="users.length">
          <view class="avatar" v-for="item in checkedUser" :key="item.id">
                <text v-if="item.type === 'group'">{{item.title.substring(0,2)}}</text>
                <text v-else>{{item.title.substr(-2)}}</text>
          </view>
          <view class="avatar" v-if="users.length>6">
            <van-icon color="#199fff" name="ellipsis" />
          </view>
        </template>
        <template v-else>
          <view class="avatar" v-if="userInfo.staff_name">
            <template v-if="userInfo.head_photo">
              <image :src="userInfo.head_photo" >
            </template>
            <text v-else>{{userInfo.staff_name.substr(-2)}}</text>
          </view>
        </template>
      </view>
      <view class="btn" @click="selectUserShow = true">切换查看范围 <van-icon name="arrow" /></view>
    </view>
    <view class="data-board-content">
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
        title="录入客户排行榜"
        actionType="time"
        v-model="customerRankMonth"
        @sheet-change="getCustomerRankData"
      >
        <InputRankBar :data="customerRankData" />
      </Panel>
      <Select
        :show="selectUserShow"
        @close="selectUserShow = false"
        @confirm="handleSelectTagChange"
        :options="rangeOptions"
        option-name="title"
        option-value="id"
        multiple
      />
    </view>
  </view>
</template>

<script>
//图表是定制过的： https://echarts.apache.org/zh/builder.html
import Panel from "./components/Panel.vue";
import SalesData from "./components/SalesData.vue";
import GaugeChart from "./components/GaugeChart.vue";
import TrendBar from "./components/TrendBar.vue";
import RankBar from "./components/RankBar.vue";
import InputRankBar from "./components/InputRankBar.vue";
import Select from "@/components/select/index.vue";
import {
  getBriefing,
  performanceIndicators,
  getTrendData,
  getSalesRankData,
  getCustomerRankData,
  getGroupWithUser,
  getUserId,
} from "@/api/dataBoard";
import { mapGetters } from "vuex";
export default {
  components: {
    Panel,
    SalesData,
    GaugeChart,
    TrendBar,
    RankBar,
    InputRankBar,
    Select,
  },
  data() {
    return {
      rangeOptions: [],
      selectUserShow: false,
      userIds: [],
      users: [],
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
  computed: {
    ...mapGetters(["userInfo"]),
    checkedUser() {
      return this.users.filter((item, index) => index < 6);
    },
  },
  watch: {
    userIds() {
      this.initTrendYearOptions();
      this.getBriefing();
      this.performanceIndicators();
      this.getTrendData();
      this.getSalesRankData();
      this.getCustomerRankData();
    },
  },
  onShow() {
    this.getGroupWithUser();
    this.initTrendYearOptions();
    this.getBriefing();
    this.performanceIndicators();
    this.getTrendData();
    this.getSalesRankData();
    this.getCustomerRankData();
  },
  methods: {
    // 数据权限选项
    async getGroupWithUser() {
      const res = await getGroupWithUser();
      this.rangeOptions = [
        {
          title: "全部数据",
          id: 0,
          type: "group",
          group_tree: "-",
        },
      ].concat(res.data || []);
    },
    // 选择客户标签
    handleSelectTagChange(checkedData) {
      console.log(checkedData);
      const groupId = [];
      const userId = [];
      checkedData.forEach((item) => {
        if (item.type === "group") {
          groupId.push(item.id);
        } else {
          userId.push(item.id);
        }
      });
      this.getUserId(userId, groupId, checkedData);
    },
    async getUserId(arr_uid, arr_group, checkedData) {
      const data = {
        arr_uid,
        arr_group,
      };
      const res = await getUserId(data);
      if (res.code === 0) {
        this.selectUserShow = false;
        this.userIds = res.data;
        this.users = checkedData;
      }
    },
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
      this.salesRankCheckedData = this.salesRankData[
        keyNameMap[this.rankType]
      ].filter((item, index) => index < 10);
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
        this.salesRankCheckedData = this.salesRankData[
          keyNameMap[this.rankType]
        ].filter((item, index) => index < 10);
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
        this.customerRankData = res.data.filter((item, index) => index < 10);
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
  padding: 0 20rpx 20rpx;
  /deep/.panel {
    margin-bottom: 20rpx;
  }
  &-header {
    height: 100rpx;
    flex-shrink: 0;
    .flex-c-b();
    .users {
      .flex-c();
      .avatar {
        width: 60rpx;
        height: 60rpx;
        line-height: 60rpx;
        margin-right: 10rpx;
        .radius(50%);
        background-color: #fff;
        text-align: center;
        image {
          width: 100%;
          height: 100%;
          .radius(50%);
        }
        text {
          font-size: @font-size-xs;
          color: @primary;
        }
      }
    }

    .btn {
      padding: 18rpx 0 18rpx 18rpx;
      color: @f-c-999;
    }
  }
  &-content {
    overflow-y: auto;
  }
}
</style>