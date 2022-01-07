<template>
  <view class="customer-list">
    <SearchBar
      :sheetActions="listTypes"
      v-model="listType"
      @sheet-change="handleListTypeChange"
      @search="handleSearch"
      @filter-click="drawerShow = true"
      placeholder="请输入客户姓名"
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
            <view class="user-name">{{
              item.name || item.nickname || "--"
            }}</view>
          </view>
          <view class="item-info-time">加入时间：{{ item.create_time }} </view>
        </view>
        <view
          class="item-actions"
          @click="receiveHighSeas(listType === 2 ? item.intent_id : item.id)"
        >
          <van-icon name="friends" size="50rpx" />
          <view>领取客户</view>
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
import {
  getCrmList,
  getDpAppletList,
  getOrgAppletList,
  receiveHighSeas,
} from "@/api/customer";
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
          name: "招生公海",
          value: 1,
        },
        {
          name: "东培公海",
          value: 2,
        },
        {
          name: "机构公海",
          value: 3,
        },
      ],
      listData: [],
      listRefreshLoading: false,
      listLoading: false,
      pageNum: 1,
      listTotal: 0,
      keyword: "",
      searchData: {},
      drawerShow: false,
    };
  },
  onShow() {
    this.getCrmList();
  },
  methods: {
    async receiveHighSeas(id) {
      const data = {
        type: this.listType,
        id,
      };
      await receiveHighSeas(data);
      this.handleListTypeChange();
    },
    handleListTypeChange() {
      this.pageNum = 1;
      this.getCrmList();
    },
    handleDrawerSearch(data) {
      this.searchData = data;
      this.pageNum = 1;
      this.getCrmList();
      this.drawerShow = false;
    },
    handleSearch(val) {
      this.pageNum = 1;
      this.keyword = val;
      this.getCrmList();
    },
    handleLoadMore() {
      this.pageNum++;
      this.listLoading = true;
      this.getCrmList();
    },
    handleRefresh() {
      this.listRefreshLoading = true;
      this.pageNum = 1;
      this.getCrmList();
    },
    async getCrmList() {
      this.checkedIds = [];
      const data = {
        page: this.pageNum,
        keyword: this.keyword,
        ...this.searchData,
      };
      const apiMap = {
        1: getCrmList,
        2: getDpAppletList,
        3: getOrgAppletList,
      };
      const res = await apiMap[this.listType](data);
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
    &-actions {
      text-align: center;
      color: @primary;
    }
  }
}
</style>