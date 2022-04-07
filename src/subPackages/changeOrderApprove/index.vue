<template>
  <view class="order-approve-list">
    <van-search
      :value="keyword"
      placeholder="请输入客户姓名"
      shape="round"
      @change="handleSearch"
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
        @click="toDetail(item.order_id, index)"
      >
        <view class="item-submit">
          <view class="item-submit-name finish" v-if="item.status > 1">
            <text>{{ item.staff_name || "--" }}</text>
            提交了异动审批
          </view>
          <view class="item-submit-name" v-else>
            <text>{{ item.staff_name || "--" }}</text>
            提交了异动审批
          </view>
          <view v-if="item.status < 2" class="item-submit-time"
            >{{ item.create_time }}
          </view>
          <template v-else>
            <van-tag type="success" plain v-if="item.status === 2">已通过</van-tag>
            <van-tag type="warning" plain v-if="item.status === 3">已驳回</van-tag>
          </template>
        </view>
        <view class="item-customer">
          {{ item.surname || "" }}-{{ item.project_name }}
        </view>
        <view class="van-multi-ellipsis--l2 item-desc" v-if="item.reason">
          备注： {{ item.reason }}
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
import { getUnusualList } from "@/api/order";
export default {
  components: {
    LoadMore,
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
    };
  },
  onLoad() {
    this.skeletonLoading = true;
    this.getUnusualList();
  },
  methods: {
    // 更新查看详情的那条数据（用于详情发生变化）
    updateItem(data) {
      if (
        data &&
        this.checkedIndex !== null &&
        data.reshuffle_list &&
        data.reshuffle_list.length
      ) {
        const targetData = data.reshuffle_list.find(
          (item) => item.id == this.listData[this.checkedIndex].id
        );
        if (targetData) {
          this.listData[this.checkedIndex].status = targetData.status;
          this.listData[this.checkedIndex].reason = targetData.reason;
        }
      }
    },
    toDetail(orderId, index) {
      this.checkedIndex = index;
      uni.navigateTo({
        url: `/subPackages/orderDetail/index?orderId=${orderId}&approve=1&change=1`,
      });
    },
    handleDrawerSearch(data) {
      this.searchData = data;
      this.pageNum = 1;
      this.getUnusualList();
      this.drawerShow = false;
    },
    handleSearch({ detail }) {
      this.pageNum = 1;
      this.keyword = detail;
      this.getUnusualList();
    },
    handleLoadMore() {
      this.pageNum++;
      this.listLoading = true;
      this.getUnusualList();
    },
    handleRefresh() {
      this.listRefreshLoading = true;
      this.pageNum = 1;
      this.getUnusualList();
    },
    async getUnusualList() {
      this.checkedIds = [];
      const data = {
        page: this.pageNum,
        keyword: this.keyword,
        ...this.searchData,
      };
      const res = await getUnusualList(data).catch(() => {});
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
        color: @text-color-grey;
      }
    }
    &-customer {
      font-size: @font-size-md;
      margin: 20rpx 0 0;
    }
    &-desc {
      margin: 20rpx 0 0;
      color: @text-color-grey;
    }
  }
}
</style>