<template>
  <view class="index">
    <view class="safe-area"></view>
    <view class="index-header">
      <view class="index-header-avatar" v-if="userInfo.staff_name">
        <template v-if="userInfo.head_photo">
          <image :src="userInfo.head_photo" >
        </template>
        <text v-else>{{userInfo.staff_name.substr(-2)}}</text>
      </view>
      <view class="index-header-title">工作台</view>
    </view>
    <view class="index-grid">
      <van-grid column-num="4">
        <van-grid-item
          :icon="item.icon"
          :text="item.title"
          v-for="(item, index) in items"
          :key="index"
          link-type="navigateTo"
          :url="item.path"
        />
      </van-grid>
    </view>

    <van-tabs
      animated
      color="#199fff"
      title-active-color="#199fff"
      @click="handleTabsChange"
    >
      <van-tab title="工作通知">
        <NoticeList
          :loading="workNoticeLoading"
          :data="workNoticeData"
          @more="handleNoticeMore"
           @item-click="handleWorkNoticeClick"
          :total="workNoticeTotal"
          @refresherrefresh="onNoticeRefresh"
          :refresh-loading="workNoticeRefreshLoading"
          :load-more-loading="workNoticeLoadMoreLoading"
        />
      </van-tab>
      <van-tab title="回款提醒">
        <view class="btn-popup" @click="onSheetOpen(1)">
          {{ collectionTypeName }}
          <van-icon
            :custom-class="sheetShow ? 'arrow-up' : 'arrow'"
            name="arrow-down"
          />
        </view>
        <CollectionList
          :loading="collectionLoading"
          :data="collectionData"
          @more="handleCollectionMore"
          :total="collectionTotal"
          @refresherrefresh="onCollectionRefresh"
          :refresh-loading="collectionRefreshLoading"
          :load-more-loading="collectionLoadMoreLoading"
        />
      </van-tab>
      <van-tab title="跟进客户">
        <view class="btn-popup" @click="onSheetOpen(2)">
          {{ staffFollowTypeName }}
          <van-icon
            :custom-class="sheetShow ? 'arrow-up' : 'arrow'"
            name="arrow-down"
          />
        </view>
        <CustomerList
          :loading="staffFollowLoading"
          :data="staffFollowData"
          @more="loadMoreStaffFollow"
          :total="staffFollowTotal"
          @refresherrefresh="onStaffFollowRefresh"
          :refresh-loading="staffFollowRefreshLoading"
          :load-more-loading="staffFollowLoadMoreLoading"
        />
      </van-tab>
      <van-tab title="系统通知">
        <SystemNoticeList
          :loading="msgLoading"
          :data="msgData"
          @more="handleMsgMore"
          :total="msgTotal"
          @item-click="handleNoticeClick"
          @refresherrefresh="onMsgRefresh"
          :refresh-loading="msgRefreshLoading"
          :load-more-loading="msgLoadMoreLoading"
        />
      </van-tab>
    </van-tabs>
    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="onSheetClose"
      @select="onSheetSelect"
    />
  </view>
</template>

<script>
import {
  getStaffNotice,
  getReceivablePlan,
  getSystemMsgList,
  staffFollow,
  readStaffNotice,
} from "@/api/index";
import NoticeList from "./components/NoticeList.vue";
import SystemNoticeList from "./components/SystemNoticeList.vue";
import CollectionList from "./components/CollectionList.vue";
import CustomerList from "./components/CustomerList.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    NoticeList,
    SystemNoticeList,
    CollectionList,
    CustomerList,
  },
  data() {
    return {
      items: [
        {
          title: "客户管理",
          path: "/pages/customerList/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/9.png",
        },
        {
          title: "公海客户",
          path: "/pages/highSeasCustomers/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/10.png",
        },
        {
          title: "订单管理",
          path: "/pages/orderList/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/13.png",
        },
        {
          title: "教务开课",
          path: "/pages/eduOpenClass/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/11.png",
        },
        {
          title: "订单审批",
          path: "/pages/orderApprove/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/2.png",
        },
      ],
      // 工作通知
      workNoticeData: [],
      workNoticePage: 1,
      workNoticeTotal: 0,
      workNoticeLoading: true,
      workNoticeRefreshLoading: false,
      workNoticeLoadMoreLoading: false,
      //回款计划提醒
      collectionTotal: 0,
      collectionPage: 1,
      collectionType: 0,
      collectionLoading: true,
      collectionRefreshLoading: true,
      collectionLoadMoreLoading: true,
      collectionData: [],
      collectionTypeName: "已逾期",
      collectionTypeData: [
        {
          name: "已逾期",
          type: 0,
        },
        {
          name: "未来7天",
          type: 1,
        },
        {
          name: "未来15天",
          type: 2,
        },
        {
          name: "未来30天",
          type: 3,
        },
      ],
      // 系统通知
      msgData: [],
      msgTotal: 0,
      msgPage: 1,
      msgLoading: false,
      msgLoadMoreLoading: false,
      msgRefreshLoading: false,
      // 选择器
      sheetActionsType: 1,
      sheetShow: false,
      sheetActions: [],
      //待跟进客户
      staffFollowData: [],
      staffFollowTotal: 0,
      staffFollowPage: 1,
      staffFollowType: 1,
      staffFollowLoading: true,
      staffFollowLoadMoreLoading: false,
      staffFollowRefreshLoading: false,
      staffFollowTypeName: "最近7天",
      staffFollowTypeData: [
        {
          name: "最近7天",
          type: 1,
        },
        {
          name: "最近15天",
          type: 2,
        },
        {
          name: "最近30天",
          type: 3,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  onShow() {
    this.getStaffNotice();
  },
  methods: {
    onSheetSelect({ detail }) {
      if (this.sheetActionsType === 1) {
        this.collectionTypeName = detail.name;
        this.getReceivablePlan(detail.type);
      } else {
        this.staffFollowTypeName = detail.name;
        this.staffFollow(detail.type);
      }
    },
    onSheetOpen(type) {
      this.sheetActionsType = type;
      this.sheetActions =
        type === 1 ? this.collectionTypeData : this.staffFollowTypeData;
      this.sheetShow = true;
    },
    onSheetClose() {
      this.sheetShow = false;
    },
    //待跟进客户
    onStaffFollowRefresh() {
      this.staffFollowRefreshLoading = true;
      this.staffFollowPage = 1;
      this.staffFollow();
    },
    loadMoreStaffFollow() {
      this.staffFollowLoadMoreLoading = true;
      this.staffFollowPage++;
      this.staffFollow();
    },
    async staffFollow(type) {
      if (type) {
        this.staffFollowType = type;
        this.staffFollowPage = 1;
      }
      const data = {
        state: this.staffFollowType,
        page: this.staffFollowPage,
      };
      const res = await staffFollow(data).catch(() => {});
      this.staffFollowLoading = false;
      setTimeout(() => {
        this.staffFollowLoadMoreLoading = false;
        this.staffFollowRefreshLoading = false;
      }, 300);
      if (res.code === 0) {
        if (this.staffFollowPage > 1) {
          this.staffFollowData.push(...res.data.list);
        } else {
          this.staffFollowData = res.data.list;
        }
        this.staffFollowTotal = res.data.total;
      }
    },

    //  系统消息
    onMsgRefresh() {
      this.msgRefreshLoading = true;
      this.msgFollowPage = 1;
      this.getSystemMsgList();
    },
    handleNoticeClick(index) {
      this.msgData[index].read = 2;
      uni.navigateTo({
        url: `/pages/index/systemNoticeDetail?id=${this.msgData[index].id}`,
      });
    },
    handleMsgMore() {
      this.msgLoadMoreLoading = true;
      this.msgPage++;
      this.getSystemMsgList();
    },
    async getSystemMsgList() {
      const data = {
        page: this.msgPage,
      };
      const res = await getSystemMsgList(data).catch(() => {});
      this.msgLoading = false;
      setTimeout(() => {
        this.msgLoadMoreLoading = false;
        this.msgRefreshLoading = false;
      }, 300);
      if (res.code === 0) {
        if (this.msgPage > 1) {
          this.msgData.push(...res.data.list);
        } else {
          this.msgData = res.data.list;
        }
        this.msgTotal = res.data.total;
      }
    },
    // 回款提醒
    onCollectionRefresh() {
      this.collectionRefreshLoading = true;
      this.collectionPage = 1;
      this.getReceivablePlan();
    },
    handleCollectionMore() {
      this.collectionPage++;
      this.collectionLoadMoreLoading = true;
      this.getReceivablePlan();
    },
    async getReceivablePlan(type) {
      if (type || type === 0) {
        this.collectionType = type;
        this.collectionPage = 1;
      }
      const data = {
        type: this.collectionType,
        page: this.collectionPage,
      };
      const res = await getReceivablePlan(data).catch(() => {});
      this.collectionLoading = false;
      setTimeout(() => {
        this.collectionLoadMoreLoading = false;
        this.collectionRefreshLoading = false;
      }, 300);
      if (res.code === 0) {
        if (this.collectionPage > 1) {
          this.collectionData.push(...res.data.list);
        } else {
          this.collectionData = res.data.list;
        }
        this.collectionTotal = res.data.total;
      }
    },
    // 工作通知
    handleWorkNoticeClick(row) {
      console.log(row);
      this.readStaffNotice(row.id);
      row.is_read = 1;
      if (row.type === 1) {
        uni.navigateTo({
          url: `/pages/orderDetail/index?orderId=${row.order_id}&approve=1`,
        });
      }
    },
    async readStaffNotice(id) {
      const data = { id };
      await readStaffNotice(data);
    },
    onNoticeRefresh() {
      this.workNoticeRefreshLoading = true;
      this.workNoticePage = 1;
      this.getStaffNotice();
    },
    handleNoticeMore() {
      this.workNoticePage++;
      this.workNoticeLoadMoreLoading = true;
      this.getStaffNotice();
    },
    async getStaffNotice() {
      const data = {
        page: this.workNoticePage,
      };
      const res = await getStaffNotice(data).catch(() => {});
      this.workNoticeLoading = false;
      setTimeout(() => {
        this.workNoticeLoadMoreLoading = false;
        this.workNoticeRefreshLoading = false;
      }, 300);
      if (this.workNoticePage === 1) {
        this.workNoticeData = res.data.data;
      } else {
        this.workNoticeData.push(...res.data.data);
      }
      this.workNoticeTotal = res.data.total;
    },
    // tabs 切换
    handleTabsChange({ detail }) {
      const index = detail.index;
      switch (index) {
        case 0:
          !this.workNoticeData.length && this.getStaffNotice();
          break;
        case 1:
          !this.collectionData.length && this.getReceivablePlan();
          break;
        case 2:
          !this.staffFollowData.length && this.staffFollow();
          break;
        case 3:
          !this.msgData.length && this.getSystemMsgList();
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.index {
  height: 100%;
  .safe-area {
    box-sizing: content-box;
    background-color: @primary;
    padding-top: calc(constant(safe-area-inset-top) - 18px);
    padding-top: calc(env(safe-area-inset-top) - 18px);
  }
  &-header {
    height: 44px;
    box-sizing: content-box;
    position: relative;
    padding-top: 18px;
    background-color: @primary;

    .flex-c();
    &-avatar {
      width: 60rpx;
      height: 60rpx;
      line-height: 60rpx;
      .radius(50%);
      background-color: #fff;
      position: absolute;
      left: 20rpx;
      bottom: 14rpx;
      text-align: center;
      image {
        width: 100%;
        height: 100%;
        .radius(50%);
      }
      text {
        font-size: 24rpx;
        color: @primary;
      }
    }
    &-title {
      margin: 0 auto;
      font-weight: bold;
      font-size: 32rpx;
      color: #fff;
    }
  }
  &-grid {
    padding: 20rpx;
    border-bottom: 20rpx solid #f2f6fc;
  }
  .btn-popup {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
  }
}
/deep/.arrow {
  transition: transform 0.3s;
}
/deep/.arrow-up {
  transition: transform 0.3s;
  transform: rotate(180deg);
}
</style>
