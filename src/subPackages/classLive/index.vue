<template>
  <view class="class-live">
    <view class="header">
      <SearchBar
        search-width="750rpx"
        @search="handleSearch"
        placeholder="请输入直播场次"
      >
        <template #title>
          <view class="header-title">{{ liveTitle }}</view>
        </template>
      </SearchBar>
    </view>

    <view class="header-class">
      <!-- <text class="col-title">班级名称</text> -->
      <text class="col-value">{{ className }}</text>
    </view>

    <view class="hr"></view>

    <view class="live-list">
      <LoadMore
        v-if="listLength > 0"
        class="load-more"
        :data="list"
        :total="total"
        :load-loading="listLoading"
        :refresherEnabled="false"
        :skeleton-loading="skeletonLoading"
        :refresh-loading="listRefreshLoading"
        @load-more="handleLoadMore"
        @refresh="handleRefresh"
      > 
        <view class="item-card" v-for="item in list" :key="item.live_id">
          <view class="item-card-hader">
            <view class="header-title">
              <text class="col-value">{{ item.live_name || "--" }}</text>
            </view>
          </view>
          <view class="item-card-item">
            <view class="card-item-row">
              <view class="row-left full-width">
                <text class="col-title">最早推流时间</text>
                <text class="col-value"
                  >{{ item.start_push_time || "--" }}
                </text>
              </view>
            </view>
            <view class="card-item-row">
              <view class="row-left full-width">
                <text class="col-title">最晚断流时间</text>
                <text class="col-value">{{ item.end_push_time || "--" }}</text>
              </view>
            </view>
            <view class="card-item-row">
              <view class="row-left full-width">
                <text class="col-title">实时在线人数</text>
                <text class="col-value">{{ item.total_pople || 0 }}</text>
              </view>
            </view>
          </view>
        </view>
      </LoadMore>
      <NoData v-else />
    </view>
  </view>
</template>

<script>
import SearchBar from "@/components/searchBar/index2.vue";
import LoadMore from "@/components/loadMore/index";
import NoData from "@/components/noData/index";
import { liveSessionList } from "@/api/class";
export default {
  components: {
    SearchBar,
    LoadMore,
    NoData
  },
  data() {
    return {
      liveTitle: '',                // 直播标题
      className: '',                // 班级名称
      lid: '',                      // 直播 id
      list: [],
      listLength: 0,
      page: 1,
      total: 0,
      listLoading: false,           // 加载状态
      skeletonLoading: false,       // 骨架屏状态
      listRefreshLoading: false,    // 下拉状态
      searchData: { search_box: '' },
    };
  },
  // 班级课程名德国
  onLoad(query) {
    this.lid = query.lid
    this.liveTitle = query.liveName
    this.className = query.className
    this.skeletonLoading = true
    this.getData()
  },
  onReachBottom() {
    if (!this.listLoading && this.list.length < this.total) {
      this.handleLoadMore()
    }
  },
  methods: {
    // 搜索放出
    handleSearch(data) {
      this.searchData.search_box = data;
      this.page = 1;
      this.listLoading = true;
      this.getData()
    },
    // 上拉到底/右 加载事件
    handleLoadMore() {
      this.page++;
      this.listLoading = true;
      this.getData()
    },
    // scroll-view下拉事件
    handleRefresh() {
      this.listRefreshLoading = true;
      this.page = 1;
      this.getData()
    },
    // 获取列表
    async getData() {
      let data = { id: this.lid, search_box: this.searchData.search_box, page: this.page }
      this.listLoading = false;
      this.listRefreshLoading = false;
      let res = await liveSessionList(data).catch(() => {});
      this.skeletonLoading = false;

      if (res.code == 0) {
        if (this.page === 1) {
          this.list = res.data.list;
        } else {
          this.list.push(...res.data.list);
        }
        this.total = res.data.total;
      }
      this.listLength = this.list.length
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";

.class-live {
  width: 100%;
  overflow: hidden;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 750rpx;
    height: 100rpx;
    border-bottom: @border;

    &-title {
      width: 680rpx;
      height: 84prx;
      padding-left: 20rpx;
      overflow: hidden;
      line-height: 84rpx;
      font-size: 42rpx;
      font-weight: 800;
      color: @text-color;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .header-class {
    display: flex;
    flex-direction: column;
    padding: 10rpx 20rpx;

    .col-title {
      height: 52rpx;
      line-height: 52rpx;
      font-size: @font-size-sm;
      color: @text-color-grey;
    }

    .col-value {
      height: 52rpx;
      width: 700rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 52rpx;
      font-size: @font-size-sm;
      color: @text-color;
    }
  }

  .live-list {
    width: 100%;
    padding: 20rpx;

    .item-card {
      display: flex;
      flex-direction: column;
      margin-top: 40rpx;
      border: @border;

      .item-card-hader {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 84rpx;
        border-bottom: @border;

        .header-title {
          .col-title {
            font-size: @font-size-sm;
            color: @text-color-grey;
          }

          .col-value {
            font-size: @font-size-sm;
            color: @text-color;
          }
        }
      }

      .item-card-item {
        padding: 20rpx 30rpx;
        .card-item-row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          height: 54rpx;
          line-height: 54rpx;
        }

        .row-left {
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .row-right {
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .col-title {
          font-size: @font-size-sm;
          color: @text-color-grey;
        }

        .col-value {
          margin-left: 10rpx;
          font-size: @font-size-sm;
          color: @text-color;
        }

        .ellipsis {
          width: 200rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .full-width {
          width: 100%;
        }
      }
    }
  }

  .hr {
    width: 100%;
    height: 20rpx;
    background-color: @background-color;
  }
}
</style>