<template>
  <view class="customer-list">
    <van-search
      :value="keyword"
      @change="handleSearch"
      shape="round"
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
        <view
          class="item-actions"
          v-if="!row.open_course"
          @click="openCourseConfirm(item.id)"
        >
          <van-icon name="orders-o" size="40rpx" />
          <view class="btn-name">开课</view>
        </view>
      </view>
    </LoadMore>
    <DragButton @tap="toAdd" />
    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
import Dialog from "@/wxcomponents/vant/dialog/dialog";
import LoadMore from "@/components/loadMore/index.vue";
import DragButton from "@/components/dragButton/index.vue";
import { projectUser, eduOpenCourse } from "@/api/customer";
import { mapGetters } from "vuex";
export default {
  components: {
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
      keyword: "",
    };
  },
  computed: {
    ...mapGetters(["staffId"]),
  },
  onShow() {
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
    handleResetSearch() {
      this.keyword && this.handleSearch({ detail: "" });
    },
    handleSearch({ detail }) {
      this.pageNum = 1;
      this.keyword = detail;
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
        staff_id: this.staffId,
        keyword: this.keyword,
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
        color: @f-c-999;
      }
    }
    &-actions {
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