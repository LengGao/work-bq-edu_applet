<template>
  <view class="customer-list">
    <PureSearch
      :sheetActions="listTypes"
      v-model="listType"
      :onlySearch="onlySearch"
      @search="handleSearch"
      @sheet-change="handleListTypeChange"  
      placeholder="请输入客户姓名/手机号码"
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
      <view class="item" v-for="(item, index) in listData" :key="item.id">
        <view class="item-info">  
          <view class="item-info-status" style="display: flex; flex-direction: row; align-items: baseline;">
            <view class="user-name" style="max-width: 500rpx; margin-right: 20rpx;">
              {{ item.surname }}-{{ item.project_name }}
            </view>
            <van-tag plain type="success" v-if="item.open_course">已开课</van-tag>
            <van-tag plain type="warning" v-else>未开课</van-tag>
          </view>
          
          <view class="item-info-time" style="margin: 20rpx 0 0;">
            所属部门：{{ item.group_name || "--" }}
          </view>

          <view class="item-info-time" style="margin: 20rpx 0 0;">
            {{ item.create_time }} | {{ item.customer_type || "--" }}
          </view>
        </view>
        <view
          class="item-actions"
          v-if="!item.open_course"
          @click="openCourseConfirm(item.id, index)"
        >
          <van-icon name="add" size="40rpx" />
          <view class="btn-name">开课</view>
        </view>
      </view>
    </template>

    <template v-else>
      <view class="item" v-for="(item) in listData" :key="item.uid">
        <view class="item-header"  @click.native="toUserDetail(item)">
          <image class="item-avator" :src="item.user_img || defaultAvator"></image>
          <view class="item-info" >
            <view class="item-info-status">
              <view class="user-name">
                <text class="noWrap">{{ item.user_nicename }} </text>
                <text class="user-phone">{{ item.telphone | phoneFormat }} </text>
              </view>
            </view>
            <view class="item-info-time">
              {{ item.staff_name || '--' }}
            </view>
          </view>
        </view>
        <view class="item-actions">
          <view class="btn-switch">
            <van-switch
              size="32rpx" 
              inactive-color="#D7D7D7"
              :checked="checkedState[item.state]"
              @change.native.self="handleSwitch(item)" />
            <view class="btn-switch-text" :style="item.state === 1 ? '' : 'color: #D7D7D7;' ">
              {{statusText[item.state]}}
            </view>
          </view>
        </view>
      </view>
    </template>
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
import PureSearch from "@/components/pureSearch/index.vue";
import SearchDrawer from "./components/searchDrawer.vue";
import { projectUser, eduOpenCourse, studentUsers, studentUsersClear } from "@/api/customer";
export default {
  components: {
    LoadMore,
    DragButton,
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
      listTypes: [{ name: '教务开课', value: 1 }, { name: '用户中心', value: 2 }],
      checkedState: [false, true, false],
      statusText: { 1: '启用', 2: '禁用' },
      onlySearch: false,
      defaultAvator: "../../static/avator.png"
    };
  },
  onLoad() {
    this.skeletonLoading = true;
    this.getList();
  },
  methods: {
    async handleSwitch(item) {
      const status = { 1: 'close', 2: 'open' },
            data = { type: status[item.state], uid: item.uid }

      const res = await studentUsersClear(data).catch(() => {})
      if (res.code === 0) {
        item.state = item.state === 1 ? 2 : 1
      }
    },
    handleListTypeChange(val) {
      this.listType = val
      this.pageNum = 1;
      this.keyword = ''
      this.skeletonLoading = true;
      this.onlySearch = (val === 2 ? true : false);
      this.getList();
    },
    toUserDetail(data) {
      let info = Object.create(null)
      Object.keys(data).forEach(key => info[key] = data[key])
      uni.navigateTo({
        url: `/subPackages/userDetail/index?info=${JSON.stringify(info)}`
      })
    },
    toAdd() {
      uni.navigateTo({
        url: "/subPackages/addStudent/index",
      });
    },
    openCourseConfirm(id, index) {
      Dialog.confirm({
        message: "是否确定一键开通课程和题库？",
      })
        .then(() => {
          this.checkedIndex = index;
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
        this.listData[this.checkedIndex].open_course = 1;
      }
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
      this.listRefreshLoading = true;
      this.pageNum = 1;
      this.getList();
    },
    async getList() {
      let api = undefined, data = {}
      // 初始化状态
      this.checkedIds = []


      if (this.listType === 1) {
        data = { page: this.pageNum, keyword: this.keyword, ...this.searchData }
        api = projectUser
      } else {
        data = { page: this.pageNum, keyword: this.keyword }
        api = studentUsers
      }

      const res = await api(data).catch(() => {})
      this.listRefreshLoading = false
      this.listLoading = false
      this.skeletonLoading = false
      
      if (res.code == 0) {
        if (this.pageNum === 1) {
          this.listData = res.data.list
        } else {
          this.listData.push(...res.data.list)
        }
        this.listTotal = res.data.total
      }
    }
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
        margin-bottom: 10rpx;
        .flex();
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
        .user-phone {
          margin-left: 8rpx;
          color: @text-color-grey;
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
      .btn-switch {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}

</style>