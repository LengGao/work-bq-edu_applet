<template>
  <view class="order-list">
    <SearchBar @search="handleSearch" />
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
        <view class="item-info">
          <view class="item-info-user">
            {{ item.surname || "" }}-{{ item.project_name }}
          </view>
          <view class="item-info-money"
            >应收 {{ item.order_money | moneyFormat }} / 已收
            {{ item.pay_money | moneyFormat }}
          </view>
        </view>
        <view class="item-status">
          <van-tag plain :color="item.verify_status | orderApplyStatus">{{
            item.verify_status | orderApplyStatus(true)
          }}</van-tag>
        </view>
      </view>
    </LoadMore>
  </view>
</template>

<script>
import SearchBar from "@/components/searchBar/index.vue";
import LoadMore from "@/components/loadMore/index.vue";
import { getCrmOrderList } from "@/api/order";
export default {
  components: {
    SearchBar,
    LoadMore,
  },
  data() {
    return {
      listData: [],
      listRefreshLoading: false,
      listLoading: false,
      pageNum: 1,
      listTotal: 0,
      searchData: {
        keyword: "",
      },
    };
  },
  onShow() {
    this.getCrmOrderList();
  },
  methods: {
    toDetail(orderId) {
      uni.navigateTo({
        url: `/pages/orderDetail/index?orderId=${orderId}`,
      });
    },
    handleSearch(val) {
      this.pageNum = 1;
      this.searchData.keyword = val;
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
        ...this.searchData,
      };
      const res = await getCrmOrderList(data);
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
        font-size: 32rpx;
      }
      &-money {
        color: @f-c-999;
      }
    }
    &-status {
      flex-shrink: 0;
    }
  }
}
</style>