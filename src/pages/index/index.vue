<template>
  <view class="index">
    <NavBar title="工作台" />
    <view class="index-grid">
      <van-grid column-num="4" :border="false">
        <van-grid-item
          :icon="item.icon"
          :text="item.title"
          v-for="(item, index) in items"
          :key="index"
          :dot="item.dot"
          link-type="navigateTo"
          :url="item.path"
        />
      </van-grid>
    </view>
    <view class="index-content">
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
            @item-click="handleCollectClick"
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
    </view>

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
  getNoticeData,
} from "@/api/index";
import NoticeList from "./components/NoticeList.vue";
import SystemNoticeList from "./components/SystemNoticeList.vue";
import CollectionList from "./components/CollectionList.vue";
import CustomerList from "./components/CustomerList.vue";
import NavBar from "@/components/navBar/index.vue";
import { mapGetters } from "vuex";
import subscribeMessage from "@/mixins/subscribeMessage";
export default {
  mixins: [subscribeMessage],
  components: {
    NoticeList,
    SystemNoticeList,
    CollectionList,
    CustomerList,
    NavBar,
  },
  data() {
    return {
      items: [
        {
          id: 0,
          title: "客户管理",
          path: "/subPackages/customerList/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/9.png",
          dot: false
        },
        {
          id: 1,
          title: "公海客户",
          path: "/subPackages/highSeasCustomers/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/10.png",
          dot: false
        },
        {
          id: 2,
          title: "订单管理",
          path: "/subPackages/orderList/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/13.png",
          dot: false
        },
        {
          id: 3,
          title: "教务开课",
          path: "/subPackages/eduOpenClass/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/11.png",
          dot: false
        },
        {
          id: 4,
          title: "订单审批",
          path: "/subPackages/orderApprove/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/2.png",
          dot: false
        },
        {
          id: 5,
          title: "异动审批",
          path: "/subPackages/changeOrderApprove/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/3.png",
          dot: false
        },
        {
          id: 6,
          title: "回款审批",
          path: "/subPackages/collectionApproval/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/7.png",
          dot: false
        },
        {
          id: 7,
          title: "班级管理",
          path: "/subPackages/classManagement/index",
          icon: "https://oss-file.beiqujy.com/default/crm_applet/8.png",
          dot: false
        }
      ],
      tabIndex: 0,
      // 工作通知
      timerId: '',
      
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
    ...mapGetters(["userInfo", "checkedStaffIds"]),
  },
  watch: {
    checkedStaffIds() {
      if (this.tabIndex === 2) {
        this.staffFollowPage = 1;
        this.staffFollow();
        return;
      }
      if (this.tabIndex === 1) {
        this.collectionPage = 1;
        this.getReceivablePlan();
      }
    },
  },
  onLoad() {
  },
  onShow() {
    this.getStaffNotice();
    this.getNoticeData();
    this.timerId = setInterval(() => {
      this.getNoticeData();
    }, 1000 * 30);
  },
  onHide() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },
  onUnload() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
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
        arr_uid: this.checkedStaffIds,
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
    handleCollectClick(row) {
      uni.navigateTo({
        url: `/subPackages/orderDetail/index?orderId=${row.order_id}`,
      });
    },
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
        arr_uid: this.checkedStaffIds,
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
      this.readStaffNotice(row.id);
      row.is_read = 1;
      if (row.type === 1) {
        uni.navigateTo({
          url: `/subPackages/orderDetail/index?orderId=${row.order_id}&approve=1`,
        });
      }
      if (row.type === 3) {
        uni.navigateTo({
          url: `/subPackages/orderDetail/index?orderId=${row.order_id}&approve=1&change=1`,
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
    async getNoticeData() {
      const items = this.items
      const res = await getNoticeData().catch(() => {})
      if (res.code == 0) {
        items[3].dot = res.data.openCourse
        items[4].dot = res.data.orderAuth
        items[5].dot = res.data.orderAuth
        items[6].dot = res.data.orderPayAuth
        this.items = items
      }
    },
    // tabs 切换
    handleTabsChange({ detail }) {
      const index = detail.index;
      this.tabIndex = index;
      switch (index) {
        case 0:
          this.workNoticePage = 1;
          this.getStaffNotice();
          break;
        case 1:
          this.collectionPage = 1;
          this.getReceivablePlan();
          break;
        case 2:
          this.staffFollowPage = 1;
          this.staffFollow();
          break;
        case 3:
          this.msgPage = 1;
          this.getSystemMsgList();
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
  overflow: hidden;
  .flex();
  flex-direction: column;
  &-grid {
    padding: 20rpx;
    border-bottom: 20rpx solid #f2f6fc;
  }
  &-content {
    overflow: hidden;
    flex: 1;
    /deep/.van-tabs {
      height: 100%;
      &__content {
        height: calc(100% - 44px);
        .van-tab__pane {
          height: 100%;
        }
      }
    }
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
