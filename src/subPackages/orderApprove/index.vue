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
      :skeleton-loading="skeletonLoading"
      @load-more="handleLoadMore"
      @refresh="handleRefresh"
      class="load-more"
    >
      <view v-for="(item, index) in listData" :key="item.id"
        class="item" @click="toDetail(item.order_id, item.id, index)"
      >
        <view class="item-submit">
          <view class="item-submit-name finish" v-if="item.finish_staff_id || item.status == 8">
            <text>{{ item.submit_name || "--" }}</text>
            提交了{{ verifyTypeMap[item.verify_type] }}审批
          </view>
          <view class="item-submit-name" v-else>
            <text>{{ item.submit_name || "--" }}</text>
            提交了{{ verifyTypeMap[item.verify_type] }}审批
          </view>

          <view class="item-submit-time">{{ item.create_time }} </view>
        </view>

        <view class="item-customer">
          <view class="">
            {{ item.surname || "" }}
            <span v-if="item.jiebie_name">-{{ item.jiebie_name }}-</span>
            {{ item.project_name }}
          </view>

          <view class="item-tag" style="margin-top: 4rpx;">
            <template v-if="[3, 8, 9].includes(item.status)">
              <van-tag type="success" plain v-if="item.status == 3">已通过</van-tag>
              <van-tag color="#999" plain v-if="item.status == 8">已撤销</van-tag>
              <van-tag type="warning" plain v-if="item.status == 9">已驳回</van-tag>
            </template>
          </view>
        </view>

        <view class="item-desc">
          <view class="">
            <!-- <van-icon name="after-sale" size="28rpx" /> -->
            <text style="margin: 0rpx 10rpx 0rpx 4rpx;">订单总金额{{ item.total_money | moneyFormat }}</text>
            <!-- <van-icon name="after-sale" size="28rpx" /> -->
            <text style="margin-left: 4rpx;">实收金额{{ item.pay_money | moneyFormat }}</text>
          </view>
          <view class="item-tag">
            <van-tag :type="verifyTypeMaps[item.verify_type].type" plain>
              {{ verifyTypeMaps[item.verify_type].text }}
            </van-tag>
          </view>
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
import { accAdd } from '@/utils/index';

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
      skeletonLoading: false,
      pageNum: 1,
      listTotal: 0,
      searchData: {},
      keyword: "",
      drawerShow: false,
      checkedIndex: null,
      verifyTypeMap: {
        0: "订单",
        1: "订单退款",
        2: "订单作废",
        3: "订单退差价",
      },
      verifyTypeMaps: {
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
    this.getCrmApproveOrder();
  },
  methods: {
    accAdd: accAdd,
    // 更新查看详情的那条数据（用于详情发生变化）
    updateItem(data) {
      // console.log("updateItem(", data, this.checkedIndex);
      if (data && this.checkedIndex !== null) {
        let item = this.listData[this.checkedIndex] 
        item.finish_staff_id = data.verify_uid;
        item.status = data.final_status;
        item.verify_status = data.verify_status;
        item.order_money = data.order_money;
        item.pay_money = data.pay_money;
        this.listData[this.checkedIndex] = item
      }
    },
    toDetail(orderId, verifyId, index) {
      this.checkedIndex = index;
      uni.navigateTo({
        url: `/subPackages/orderDetail/index?orderId=${orderId}&verifyId=${verifyId}&approve=1`,
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
      const res = await getCrmApproveOrder(data).catch(() => {});
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
.order-approve-list {
  height: 100%;
  width: 100%;
  overflow: hidden;

  /deep/.load-more {
    height: calc(100% - 50px);
  }

  .item {
    width: 100%;
    padding: 20rpx;
    border-bottom: 2rpx solid #efefef;
    &:active {
      background-color: #f2f6fc;
    }
    &-submit {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10rpx;

      &-name {
        color: @text-color-grey;
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
        margin-right: 5rpx;
        color: @text-color-grey;
      }
    }

    &-customer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      margin: 20rpx 0;
      font-size: @font-size-md;
    }

    &-desc {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 20rpx 0 0;
      color: @text-color-grey;
    }

    &-tag {
      margin-left: 10rpx;
      min-width: 160rpx;
      text-align: right;
    }
  }
}
</style>