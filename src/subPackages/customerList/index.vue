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
        v-for="item in listData"
        :key="item.id"
        @click="toDetails(item)"
      >
        <view class="item-info">
          <view class="item-info-status">
            <view class="user-name">{{ item.name }}</view>
            <van-tag plain type="success" v-if="item.deal_num">已成交</van-tag>
            <van-tag plain type="warning" v-else>未成交</van-tag>
          </view>
          <view class="item-info-time"
            >{{ item.create_time }} | {{ item.from || "--" }}
          </view>
        </view>
        <view class="item-actions" @click.stop="() => false">
          <view class="btn">
            <van-icon
              name="phone"
              size="50rpx"
              @click="makePhoneCall(item.mobile)"
            />
            <view>电话</view>
          </view>
          <view class="btn add">
            <van-icon name="add-square" size="50rpx" @click="toSignUp(item)" />
            <view>报名</view>
          </view>
        </view>
      </view>
    </LoadMore>
    <DragButton @tap="toAdd" />
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
import DragButton from "@/components/dragButton/index.vue";
import SearchDrawer from "./components/searchDrawer.vue";
import { getCrmCustomerList } from "@/api/customer";
export default {
  components: {
    SearchBar,
    LoadMore,
    DragButton,
    SearchDrawer,
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
      skeletonLoading: false,
      pageNum: 1,
      listTotal: 0,
      keyword: "",
      searchData: {},
      drawerShow: false,
    };
  },
  onLoad() {
    this.skeletonLoading = true;
    this.getCrmCustomerList();
  },
  methods: {
    handleListTypeChange() {
      this.pageNum = 1;
      this.skeletonLoading = true;
      this.getCrmCustomerList();
    },
    handleDrawerSearch(data) {
      this.searchData = data;
      this.pageNum = 1;
      this.getCrmCustomerList();
      this.drawerShow = false;
    },
    toAdd(e) {
      if (e) {
        uni.navigateTo({
          url: "/subPackages/addCustomer/index",
        });  
      }
    },
    toSignUp(row) {
      uni.navigateTo({
        url: `/subPackages/customeSignUp/index?userId=${row.id}&userName=${
          row.name || ""
        }&userMobile=${row.mobile || ""}&userIdCard=${
          row.id_card_number || ""
        }&source=${
          row.from || ""
        }`,
      });
    },
    toDetails({ uid, id }) {
      uni.navigateTo({
        url: `/subPackages/customerDetails/index?uid=${uid}&cid=${id}`,
      });
    },
    handleSearch(val) {
      this.pageNum = 1;
      this.keyword = val;
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
      const data = {
        page: this.pageNum,
        keyword: this.keyword,
        ...this.searchData,
      };
      if (this.listType === 1) {
        data.staff_id = this.$store.getters.staffId;
      }
      const res = await getCrmCustomerList(data).catch(() => {});
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
    makePhoneCall(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber,
        fail(err) {
          // console.log(err
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
          font-size: @font-size-md;
        }
      }
      &-time {
        color: @text-color-grey;
      }
    }
    &-actions {
      .flex-c();
      flex-shrink: 0;
      .btn {
        text-align: center;
        color: @primary;
        &.add {
          margin-left: 40rpx;
        }
      }
    }
  }
}
</style>