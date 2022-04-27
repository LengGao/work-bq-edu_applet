<template>
  <view class="customer-list">
    <PureSearch
      :sheetActions="listTypes"
      v-model="listType"
      :onlySearch="onlySearch"
      @search="handleSearch"
      @sheet-change="handleListTypeChange"
      :placeholder="placeholderOption[listType]"
      @filter-click="drawerShow = true"
    />
    <!-- 开课数据 -->
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
      <template v-if="listType === 1">
        <view
          class="item"
          v-for="item in listData"
          :key="item.classroom_id"
          @click="toClassDetail(item.classroom_id, item.course_id)"
        >
          <view class="item-info">
            <view class="item-info-status flex-temp">
              <view class="user-name">{{ item.classroom_name || '--'}}</view>
              <text class="user-name-count">{{ item.student_number || 0}}人</text>
            </view>
            <view class="item-info-time flex-temp">
              <view>
                <van-icon name="graphic" color="#ddd" size="32rpx" custom-style="margin-right: 10rpx;" />
                <text class="item-info-project-name"> {{ item.project_name || '--'}} </text>
              </view>
              <text class="item-info-staff-name"> 班主任：{{ item.staff_name || "--" }} </text>
            </view>
          </view>
        </view>
      </template>

      <template v-else>
        <view class="item" v-for="item in listData" :key="item.live_class_id">
          <view
            class="item-header"
            @click.native="toClassLiveDetail(item.live_class_id, item.live_class_name, item.class_name)"
          >
            <view class="item-info">
              <view class="item-info-status">
                <view class="user-name">
                  <text class="noWrap">{{ item.live_class_name || '--' }} </text>
                </view>
              </view>
              <view class="item-info-time flex-row">
                <van-icon name="manager-o" size="32rpx" color="#ddd" />
                <text>
                  任课老师：{{ item.teacher_name || "--" }}
                </text>
                <view class="livestate-state">
                  <template v-if="item.live_status">
                    <van-icon 
                      name="circle" size="16rpx" color="#59D234" 
                      custom-style="margin-left: 20rpx; line-height: 16rpx; background-color: #59D234; border-radius: 50%;" 
                    />
                    <text class="item-info-livestate info-livestate-active" >
                      {{ live_statusText[item.live_status] || '--'}}
                    </text>
                  </template>
                  <template v-else>
                    <van-icon 
                      name="circle" size="16rpx" color="#ddd" 
                      custom-style="height: 20rpx; margin-left: 20rpx; line-height: 16rpx; background-color: #ddd; border-radius: 50%;"
                    />
                    <text class="item-info-livestate" >
                      {{ live_statusText[item.live_status] }}
                    </text>
                  </template>
                </view>
              </view>
            </view>
          </view>
          <view class="item-actions">
            <van-tag v-if="item.live_status" plain size="large" type="warning">
              <text @click="handleCloseLive(item.live_class_id)">关闭</text>
            </van-tag>
            <van-tag v-else plain size="large" type="primary">
              <text @click="handleStartLive(item.live_class_id)">开始</text>
            </van-tag>
          </view>
        </view>
      </template>
    </LoadMore>

    <SearchDrawer
      :show="drawerShow"
      @close="drawerShow = false"
      @search="handleDrawerSearch"
    />

    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
import LoadMore from "@/components/loadMore/index.vue";
import SearchBar from "@/components/searchBar/index.vue";
import PureSearch from "@/components/pureSearch/index.vue";
import SearchDrawer from "./components/searchDrawer.vue";
import { getClassList, classLiveList, livestart, closelive } from "@/api/class";

export default {
  components: {
    LoadMore,
    SearchBar,
    PureSearch,
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
      checkedIndex: null,
      inputShow: false,
      listType: 1,
      listTypes: [
        { name: "班级管理", value: 1 },
        { name: "多媒体班级", value: 2 },
      ],
      checkedState: [false, true, false],
      statusText: { 1: "启用", 2: "禁用" },
      live_statusText: { 0: "未开课", 1: "开课中" },
      onlySearch: false,
      defaultAvator: "../../static/avator.png",
      placeholderOption: [ '', '请输入班级名或班主任', '请输入课程名称' ],
    };
  },
  onLoad() {
    this.skeletonLoading = true;
    this.getList();
  },
  methods: {
  // 开始直播
  async handleStartLive(id) {
    let params = { live_class_id: id },
        modalOption = {
          title: "提示",
          content: "你确定要开启课程吗？",
          showCancel: true,
          cancelColor: "#199fff",
          confirmColor: "#199fff",
        };
      let modal = await uni.showModal(modalOption);
      if (modal[1].confirm) {
        let res = await livestart(params).catch(() => {});
        if (res.code === 0) {
          this.getList();
          let data = res.data.data
          uni.navigateTo({
            url: '/subPackages/livePublish/index?info=' + encodeURIComponent(JSON.stringify(data))
          })
        }
      }
    },
    // 关闭直播
    async handleCloseLive(id) {
      let params = { live_class_id: id },
          modalOption = {
            title: "提示",
            content: "你确定要关闭课程吗？",
            showCancel: true,
            cancelColor: "#199fff",
            confirmColor: "#199fff",
          };
      let modal = await uni.showModal(modalOption);
      if (modal[1].confirm) {
        let res = await closelive(params).catch(() => {});
        if (res.code === 0) {
          this.getList();
        }
      }
    },
    handleListTypeChange(val) {
      this.listType = val;
      this.pageNum = 1;
      this.keyword = "";
      this.skeletonLoading = true;
      this.onlySearch = val === 2 ? true : false;
      this.getList();
    },
    toClassDetail(crid, cid) {
      uni.navigateTo({
        url: `/subPackages/classDetail/index?crid=${crid}&cid=${cid}`,
      });
    },
    toClassLiveDetail(id, live_name, class_name) {
      uni.navigateTo({
        url: `/subPackages/classLive/index?lid=${id}&liveName=${live_name}&className=${class_name}`,
      });
    },
    handleDrawerSearch(data) {
      this.searchData = data;
      this.pageNum = 1;
      this.drawerShow = false;
      this.getList();
    },
    handleSearch(value) {
      this.pageNum = 1;
      this.keyword = value;
      this.getList();
    },
    handleLoadMore() {
      this.pageNum++;
      this.listLoading = true;
      this.getList();
    },
    handleRefresh() {
      this.listLoading = true
      this.listRefreshLoading = true;
      this.pageNum = 1;
      this.getList();
    },

    async getList() {
      let api = undefined, data = {};

      if (this.listType === 1) {
        data = {
          page: this.pageNum,
          keyword: this.keyword,
          category_id: this.searchData.category_id,
          project_id: this.searchData.project_id,
        };
        api = getClassList;
      } else {
        data = { page: this.pageNum, live_class_name: this.keyword };
        api = classLiveList;
      }

      const res = await api(data).catch(() => {});
      this.listLoading = false;
      this.listRefreshLoading = false;
      this.skeletonLoading = false;

      if (res.code == 0) {
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

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    border-bottom: 2rpx solid #efefef;
    &:active {
      background-color: #f2f6fc;
    }
    .item-header {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    &-avator {
      width: 60rpx;
      height: 60rpx;
      margin-right: 16rpx;
      border-radius: 50%;
    }
    &-info {
      &-status {
        display: flex;
        margin-bottom: 10rpx;
        
        .user-name {
          flex: 1;
          margin-right: 10rpx;
          font-size: @font-size-md;
        }

        .noWrap {
          width: 280rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-name-count {
          font-size: @font-size-md;
          color: @primary;
        }

        .user-phone {
          margin-left: 8rpx;
          color: @text-color-grey;
        }
      }

      &-time {
        margin-top: 16rpx;
        color: @text-color-grey;
      }

      .flex-temp {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 710rpx;
      }
      
      
      .item-info-project-name {
          display: inline-block;
          width: 450rrpx;
      }

      .item-info-staff-name {
          display: inline-block;
          display: 260rpx;
      }

      .livestate-state {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 160rpx;
        margin-left: 20rpx;
        white-space: nowrap;
      }

      .item-info-livestate {
        margin-left: 10rpx;
        color: @text-color-grey;
      }
      
      .info-livestate-active {
        color: @success;
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