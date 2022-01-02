<template>
  <view class="customer-list">
    <SearchBar
      :sheetActions="listTypes"
      v-model="listType"
      @search="handleSearch"
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
      <view class="item" v-for="item in listData" :key="item.id">
        <view class="item-info">
          <view class="item-info-status">
            <view class="user-name">{{ item.name }}</view>
            <van-tag plain type="success" v-if="row.deal_num">已成交</van-tag>
            <van-tag plain type="warning" v-else>未成交</van-tag>
          </view>
          <view class="item-info-time"
            >{{ item.create_time }} | {{ item.from || "--" }}
          </view>
        </view>
        <view class="item-actions">
          <van-icon
            name="phone"
            size="50rpx"
            @click="makePhoneCall(item.mobile)"
            color="#81d3f8"
          />
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
import { getCrmCustomerList } from "@/api/customer";
export default {
  components: {
    SearchBar,
    LoadMore,
    DragButton,
  },
  data() {
    return {
      listType: 1,
      listTypes: [
        {
          name: "我的客户",
          value: 1,
        },
        {
          name: "全部客户",
          value: 2,
        },
      ],
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
    this.getCrmCustomerList();
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
      this.getCrmCustomerList();
    },
    handleLoadMore() {
      this.pageNum++;
      this.listLoading = true;
      this.getCrmCustomerList();
    },
    handleRefresh() {
      this.listRefreshLoading = true;
      this.pageNum = 1;
      this.getCrmCustomerList();
    },
    async getCrmCustomerList() {
      this.checkedIds = [];
      const data = {
        page: this.pageNum,
        ...this.searchData,
      };
      const res = await getCrmCustomerList(data);
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
        .flex-c();
        .user-name {
          min-width: 100rpx;
          margin-right: 10rpx;
          font-size: 32rpx;
        }
      }
      &-time {
        color: @f-c-999;
      }
    }
  }
}
</style>