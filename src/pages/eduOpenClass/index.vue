<template>
  <view class="customer-list">
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
      <view class="item" v-for="item in listData" :key="item.id">
        <view class="item-info">
          <view class="item-info-status">
            <view class="user-name"
              >{{ item.surname }}-{{ item.project_name }}</view
            >
            <van-tag plain type="success" v-if="row.open_course"
              >已开课</van-tag
            >
            <van-tag plain type="warning" v-else>未开课</van-tag>
          </view>
          <view class="item-info-time"
            >{{ item.create_time }} | {{ item.customer_type || "--" }}
          </view>
        </view>
        <view class="item-actions">
          <van-icon
            name="orders-o"
            size="40rpx"
            @click="makePhoneCall(item.mobile)"
          />
          <view class="btn-name">开课</view>
        </view>
      </view>
    </LoadMore>
    <DragButton @tap="toAdd" />
  </view>
</template>

<script>
import SearchBar from "@/components/searchBar/index.vue";
import LoadMore from "@/components/loadMore/index.vue";
import DragButton from "@/components/dragButton/index.vue";
import { projectUser } from "@/api/customer";
export default {
  components: {
    SearchBar,
    LoadMore,
    DragButton,
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
    this.projectUser();
  },
  methods: {
    toAdd() {
      uni.navigateTo({
        url: "/pages/addCustomer/index",
      });
    },
    handleSearch(val) {
      this.pageNum = 1;
      this.searchData.keyword = val;
      this.projectUser();
    },
    handleLoadMore() {
      this.pageNum++;
      this.listLoading = true;
      this.projectUser();
    },
    handleRefresh() {
      this.listRefreshLoading = true;
      this.pageNum = 1;
      this.projectUser();
    },
    async projectUser() {
      this.checkedIds = [];
      const data = {
        page: this.pageNum,
        ...this.searchData,
      };
      const res = await projectUser(data);
      this.listRefreshLoading = false;
      this.listLoading = false;
      if (this.pageNum === 1) {
        this.listData = res.data.list;
      } else {
        this.listData.push(...res.data.list);
      }
      this.listTotal = res.data.total;
    },
    makePhoneCall(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber,
        fail(err) {
          console.log(err);
        },
      });
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
      &-status {
        margin-bottom: 10rpx;
        .flex();
        .user-name {
          margin-right: 10rpx;
          font-size: 32rpx;
          flex: 1;
        }
      }
      &-time {
        color: @f-c-999;
      }
    }
    &-actions {
      margin-left: 20rpx;
      text-align: center;
      color: @primary;
      .btn-name {
        font-size: 24rpx;
      }
    }
  }
}
</style>