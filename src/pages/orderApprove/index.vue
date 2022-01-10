<template>
  <view class="order-approve-list">
    <SearchBar
      @search="handleSearch"
      placeholder="请输入客户姓名"
      @filter-click="drawerShow = true"
    />
    <LoadMore
      :data="listData"
      :total="listTotal"
      :load-loading="listLoading"
      :refresh-loading="listRefreshLoading"
      @load-more="handleLoadMore"
      @refresh="handleRefresh"
      class="load-more"
    >
      <view
        class="item"
        v-for="item in listData"
        :key="item.order_id"
        @click="toDetail(item.order_id)"
      >
        <view class="item-submit">
          <view class="item-submit-name finish" v-if="item.finish_staff_id">
            <text>{{ item.submit_name || "--" }}</text>
            提交了订单审批
          </view>
          <view class="item-submit-name" v-else>
            <text>{{ item.submit_name || "--" }}</text>
            提交了订单审批
          </view>
          <view class="item-submit-time">{{ item.create_time }} </view>
        </view>
        <view class="item-customer">
          {{ item.surname || "" }}-{{ item.project_name }}
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
import SearchBar from "@/components/searchBar/index.vue";
import LoadMore from "@/components/loadMore/index.vue";
import SearchDrawer from "./components/searchDrawer.vue";
import { getCrmApproveOrder } from "@/api/order";
export default {
  components: {
    SearchBar,
    LoadMore,
    SearchDrawer,
  },
  data() {
    return {
      listData: [],
      listRefreshLoading: false,
      listLoading: false,
      pageNum: 1,
      listTotal: 0,
      searchData: {},
      keyword: "",
      drawerShow: false,
    };
  },
  onShow() {
    this.pageNum = 1;
    this.getCrmApproveOrder();
  },
  methods: {
    toDetail(orderId) {
      uni.navigateTo({
        url: `/pages/orderDetail/index?orderId=${orderId}&approve=1`,
      });
    },
    handleDrawerSearch(data) {
      this.searchData = data;
      this.pageNum = 1;
      this.getCrmApproveOrder();
      this.drawerShow = false;
    },
    handleSearch(val) {
      this.pageNum = 1;
      this.keyword = val;
      this.getCrmApproveOrder();
    },
    handleLoadMore() {
      this.pageNum++;
      this.listLoading = true;
      this.getCrmApproveOrder();
    },
    handleRefresh() {
      this.listRefreshLoading = true;
      this.pageNum = 1;
      this.getCrmApproveOrder();
    },
    async getCrmApproveOrder() {
      this.checkedIds = [];
      const data = {
        page: this.pageNum,
        keyword: this.keyword,
        ...this.searchData,
      };
      const res = await getCrmApproveOrder(data);
      this.listRefreshLoading = false;
      this.listLoading = false;
      if (this.pageNum === 1) {
        this.listData = res.data.list;
      } else {
        this.listData.push(...res.data.list);
      }
      this.listTotal = res.data.total;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.order-approve-list {
  height: 100%;
  /deep/.load-more {
    height: calc(100% - 50px);
  }
  .item {
    padding: 20rpx;
    border-bottom: 2rpx solid #efefef;
    &:active {
      background-color: #f2f6fc;
    }
    &-submit {
      .flex-c-b();
      margin-bottom: 10rpx;
      &-name {
        color: @f-c-999;
        text {
          display: inline-block;
          color: #fd6500;
          min-width: 80rpx;
          margin: 0 16rpx 0 8rpx;
        }
        &::before {
          content: "";
          display: inline-block;
          width: 10rpx;
          height: 10rpx;
          .radius(50%);
          background-color: #fd6500;
          vertical-align: middle;
        }
        &.finish {
          text {
            color: @primary;
          }
          &::before {
            display: none;
          }
        }
      }
      &-time {
        color: @f-c-999;
      }
    }
    &-customer {
      font-size:@font-size-md;
    }
  }
}
</style>