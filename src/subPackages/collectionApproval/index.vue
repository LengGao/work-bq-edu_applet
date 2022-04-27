<template>
  <view class="customer-list">
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
        :key="item.id"
        @click="() => toDetail(item, index)"
      >
        <view class="item-info">
          <view class="item-info-user">
            <text>
              {{ listType === 1 ? item.surname : item.org_name }}-回款
            </text>
            <text style="margin-left: 8rpx;">
              {{listType === 1 ? item.pay_money : item.receivable_money }}元
            </text>
          </view>
          <view class="item-info-staff" style="margin-top: 20rpx;">
            {{ item.staff_name || "--" }} | {{ item.create_time }}
          </view>
        </view>
        <view
          v-if="listType === 1"
          :class="['item-status', `item-status--${statusMap[item.verify_status || 0].type}` ]"
        >
          {{ statusMap[item.verify_status || 0].text }}
        </view>
        <view
          v-else
          :class="[ 'item-status', `item-status--${channelStatusMap[item.check_state || 0].type}` ]"
        >
          {{ channelStatusMap[item.check_state || 0].text }}
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
import { getReturnPaymentList, getOrgReceivableList } from "@/api/order";
export default {
  components: {
    SearchBar,
    LoadMore,
    SearchDrawer,
  },
  data() {
    return {
      listType: 1,
      listTypes: [
        {
          name: "招生回款",
          value: 1,
        },
        {
          name: "渠道回款",
          value: 2,
        },
      ],
      listData: [],
      listRefreshLoading: false,
      listLoading: false,
      skeletonLoading: false,
      pageNum: 1,
      listTotal: 0,
      keyword: "",
      searchData: {},
      drawerShow: false,
      statusMap: {
        0: {
          text: "待入账",
          type: "default",
        },
        1: {
          text: "已入账",
          type: "success",
        },
        2: {
          text: "已驳回",
          type: "warning",
        },
        3: {
          text: "确认中",
          type: "default",
        },
      },
      channelStatusMap: {
        0: {
          text: "待确认",
          type: "default",
        },
        1: {
          text: "已确认",
          type: "primary",
        },
        2: {
          text: "已入账",
          type: "success",
        },
        "-1": {
          text: "已驳回",
          type: "warning",
        },
      },
      checkedIndex: null,
    };
  },
  onLoad() {
    this.skeletonLoading = true;
    this.getApproveList();
  },
  methods: {
    handleListTypeChange() {
      this.pageNum = 1;
      this.skeletonLoading = true;
      this.getApproveList();
    },
    handleDrawerSearch(data) {
      this.searchData = data;
      this.pageNum = 1;
      this.getApproveList();
      this.drawerShow = false;
    },
    // 更新查看详情的那条数据（用于详情发生变化）
    updateItem(staus) {
      if (staus && this.checkedIndex !== null) {
        if (this.listType === 1) {
          this.listData[this.checkedIndex].verify_status = staus;
        } else {
          this.listData[this.checkedIndex].check_state = staus;
        }
      }
    },
    toDetail(row, index) {
      this.checkedIndex = index;
      if (this.listType === 1) {
        const queryStr = JSON.stringify(row);
        uni.navigateTo({
          url: `/subPackages/collectionDetails/index?data=${queryStr}`,
        });
      } else {
        uni.navigateTo({
          url: `/subPackages/channelCollectionDetails/index?logId=${row.log_id}`,
        });
      }
    },
    handleSearch(val) {
      this.pageNum = 1;
      this.keyword = val;
      this.getApproveList();
    },
    handleLoadMore() {
      this.pageNum++;
      this.listLoading = true;
      this.getApproveList();
    },
    handleRefresh() {
      this.listRefreshLoading = true;
      this.pageNum = 1;
      this.getApproveList();
    },
    async getApproveList() {
      const data = {
        page: this.pageNum,
        keyword: this.keyword,
        ...this.searchData,
      };
      let api = getReturnPaymentList;
      if (this.listType === 2) {
        const statusMap = {
          0: 0,
          1: 2,
          2: -1,
        };
        data.check_state =
          statusMap[this.searchData.verify_status] !== undefined
            ? statusMap[this.searchData.verify_status]
            : -2;
        api = getOrgReceivableList;
      }
      const res = await api(data).catch(() => {});
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
.customer-list {
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
        font-size: @font-size-md;
        margin-bottom: 4rpx;
      }
      &-staff {
        color: @text-color-grey;
      }
    }
    &-status {
      align-self: flex-start;
      color: #888;
      &::before {
        display: inline-block;
        content: "";
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        background-color: #888;
        vertical-align: middle;
        margin-right: 8rpx;
      }
      &--success {
        color: @success;
        &::before {
          background-color: @success;
        }
      }
      &--warning {
        color: @warning;
        &::before {
          background-color: @warning;
        }
      }
      &--primary {
        color: @primary;
        &::before {
          background-color: @primary;
        }
      }
    }
  }
}
</style>