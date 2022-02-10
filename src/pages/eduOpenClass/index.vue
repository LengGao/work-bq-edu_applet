<template>
  <view class="customer-list">
    <SearchBar
      @search="handleSearch"
      placeholder="请输入客户姓名"
      @filter-click="drawerShow = true"
    />
    <LoadMore
      :data="listData"
      :total="listTotal"
      :load-loading="listLoading"
      :skeleton-loading="skeletonLoading"
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
            <van-tag plain type="success" v-if="item.open_course"
              >已开课</van-tag
            >
            <van-tag plain type="warning" v-else>未开课</van-tag>
          </view>
          <view class="item-info-time"
            >{{ item.create_time }} | {{ item.customer_type || "--" }}
          </view>
        </view>
        <view
          class="item-actions"
          v-if="!item.open_course"
          @click="openCourseConfirm(item.id)"
        >
          <van-icon name="add" size="40rpx" />
          <view class="btn-name">开课</view>
        </view>
      </view>
    </LoadMore>
    <SearchDrawer
      :show="drawerShow"
      @close="drawerShow = false"
      @search="handleDrawerSearch"
    />
    <DragButton @tap="toAdd" />
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
import Dialog from "@/wxcomponents/vant/dialog/dialog";
import LoadMore from "@/components/loadMore/index.vue";
import DragButton from "@/components/dragButton/index.vue";
import SearchBar from "@/components/searchBar/index.vue";
import SearchDrawer from "./components/searchDrawer.vue";
import { projectUser, eduOpenCourse } from "@/api/customer";
export default {
  components: {
    LoadMore,
    DragButton,
    SearchBar,
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
      keyword: "",
      searchData: {},
      drawerShow: false,
    };
  },
  onLoad() {
    this.skeletonLoading = true;
    this.projectUser();
  },
  methods: {
    toAdd() {
      uni.navigateTo({
        url: "/pages/addStudent/index",
      });
    },
    openCourseConfirm(id) {
      Dialog.confirm({
        message: "是否确定一键开通课程和题库？",
      })
        .then(() => {
          this.eduOpenCourse(id);
        })
        .catch(() => {
          // on cancel
        });
    },
    async eduOpenCourse(id) {
      const data = { id };
      const res = await eduOpenCourse(data);
      if (res.code === 0) {
        this.projectUser();
      }
    },
    handleDrawerSearch(data) {
      this.searchData = data;
      this.pageNum = 1;
      this.projectUser();
      this.drawerShow = false;
    },
    handleSearch(value) {
      this.pageNum = 1;
      this.keyword = value;
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
        keyword: this.keyword,
        ...this.searchData,
      };
      const res = await projectUser(data).catch(() => {});
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
      &-status {
        margin-bottom: 10rpx;
        .flex();
        .user-name {
          margin-right: 10rpx;
          font-size: @font-size-md;
          flex: 1;
        }
      }
      &-time {
        color: @text-color-grey;
      }
    }
    &-actions {
      flex-shrink: 0;
      margin-left: 20rpx;
      text-align: center;
      color: @primary;
      .btn-name {
        font-size: @font-size-xs;
      }
    }
  }
}
</style>