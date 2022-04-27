<template>
  <view class="order-list">
    <SearchBar
      :sheetActions="listTypes"
      v-model="listType"
      @sheet-change="handleListTypeChange"
      @search="handleSearch"
      placeholder="请输入客户姓名"
      @filter-click="drawerShow = true"
    />
    <LoadMore
      :data="listData"
      :total="listTotal"
      :load-loading="listLoading"
      :refresh-loading="listRefreshLoading"
      :skeleton-loading="skeletonLoading"
      @load-more="handleLoadMore"
      @refresh="handleRefresh"
      class="load-more"
    >
      <view
        class="item"
        v-for="(item, index) in listData"
        :key="item.order_id"
        @click="toDetail(item.order_id, index, item.reshuffle)"
      >
        <view class="item-info">
          <view class="item-info-user">
            {{ item.surname || "" }}
            <span v-if="item.jiebie_name">-{{ item.jiebie_name }}</span>
            -{{ item.project_name }}
            <text class="tag" v-if="item.reshuffle">异</text>
          </view>
          <view class="item-info-money">
            订单总金额 {{ item.total_money | moneyFormat }} 
            / 实收金额 {{ accAdd(item.pay_money, item.other_money) | moneyFormat }}
          </view>
        </view>
        <view class="item-status">
          <van-tag plain :color="item.verify_status | orderApplyStatus">
            {{ item.verify_status | orderApplyStatus(true) }}
          </van-tag>
        </view>
      </view>
    </LoadMore>
    <SearchDrawer
      :show="drawerShow"
      @close="drawerShow = false"
      @search="handleDrawerSearch"
    />
  </view>
</template>

<script>
import LoadMore from "@/components/loadMore/index.vue";
import SearchBar from "@/components/searchBar/index.vue";
import SearchDrawer from "./components/searchDrawer.vue";
import { getCrmOrderList } from "@/api/order";
import { accAdd } from '@/utils/index';

export default {
  components: {
    SearchBar,
    LoadMore,
    SearchDrawer,
  },
  data() {
    return {
      listType: 2,
      listTypes: [
        { name: "渠道订单", value: 1 },
        { name: "招生订单", value: 2 },
      ],
      listData: [],
      listRefreshLoading: false,
      listLoading: false,
      skeletonLoading: false,
      pageNum: 1,
      listTotal: 0,
      searchData: {},
      keyword: "",
      drawerShow: false,
      checkedIndex: null,
      verifyTypeMap: {
        0: {
          text: "新订单",
          type: "success",
        },
        1: {
          text: "申请退款",
          type: "warning",
        },
        2: {
          text: "申请作废",
          type: "danger",
        },
        3: {
          text: "申请退差价",
          type: "warning",
        },
      },
    };
  },
  onLoad() {
    this.skeletonLoading = true;
    this.getCrmOrderList();
  },
  methods: {
    accAdd: accAdd,
    handleListTypeChange() {
      this.pageNum = 1;
      this.skeletonLoading = true;
      this.getCrmOrderList();
    },
    handleDrawerSearch(data) {
      this.searchData = data;
      this.pageNum = 1;
      this.getCrmOrderList();
      this.drawerShow = false;
    },
    // 更新查看详情的那条数据（用于详情发生变化）
    updateItem(data) {
      if (data && this.checkedIndex !== null) {
        let item = this.listData[this.checkedIndex] 
        item.verify_status = data.verify_status;
        item.order_money = data.order_money;
        item.pay_money = data.pay_money;
        this.listData[this.checkedIndex] = item
      }
    },
    toDetail(orderId, index, change) {
      this.checkedIndex = index;
      let approve = this.listType == 2 ? 2 : 3       
      uni.navigateTo({
        url: `/subPackages/orderDetail/index?orderId=${orderId}&approve=${approve}&change=${change}`,
      });
    },
    handleSearch(val) {
      this.pageNum = 1;
      this.keyword = val;
      this.getCrmOrderList();
    },
    handleLoadMore() {
      this.pageNum++;
      this.listLoading = true;
      this.getCrmOrderList();
    },
    handleRefresh() {
      this.listRefreshLoading = true;
      this.pageNum = 1;
      this.getCrmOrderList();
    },
    async getCrmOrderList() {
      this.checkedIds = [];
      const data = {
        page: this.pageNum,
        channel: this.listType,
        keyword: this.keyword,
        ...this.searchData,
      };
      const res = await getCrmOrderList(data).catch(() => {});
      this.listRefreshLoading = false;
      this.listLoading = false;
      this.skeletonLoading = false;
      if (res.code === 0) {
        if (this.pageNum === 1) {
          this.listData = res.data.list;
        } else {
          this.listData.push(...res.data.list);
        }
        this.listTotal = res.data.total;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";

.order-list {
  height: 100%;
  /deep/.load-more {
    height: calc(100% - 50px);
  }
  .item {
    .flex-c-b();
    padding: 20rpx;
    border-bottom: 2rpx solid #efefef;
    &:active {
      background-color: #f2f6fc;
    }
    &-info {
      &-user {
        margin-bottom: 10rpx;
        min-width: 100rpx;
        margin-right: 10rpx;
        font-size: @font-size-md;
      }
      &-money {
        margin: 20rpx 0 0;
        color: @text-color-grey;
      }
    }
    &-status {
      flex-shrink: 0;
    }
  }
  .tag {
    display: inline-block;
    border: 1rpx solid @warning;
    font-size: 20rpx;
    border-radius: 50%;
    width: 30rpx;
    height: 30rpx;
    text-align: center;
    line-height: 30rpx;
    color: @warning;
    vertical-align: top;
  }
}
</style>