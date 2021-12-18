<template>
  <view class="index">
    <view class="index-grid">
      <van-grid column-num="4">
        <van-grid-item
          icon="photo-o"
          :text="item.title"
          v-for="(item, index) in items"
          :key="index"
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
          :total="workNoticeTotal"
        />
      </van-tab>
      <van-tab title="回款提醒">
        <view class="btn-popup" @click="sheetShow = true">
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
        />
      </van-tab>
      <van-tab title="跟进客户">内容 3</van-tab>
      <van-tab title="系统通知">
        <SystemNoticeList
          :loading="msgLoading"
          :data="msgData"
          @more="handleMsgMore"
          :total="msgTotal"
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
import { mapGetters } from "vuex";
import {
  getStaffNotice,
  getReceivablePlan,
  getSystemMsgList,
} from "@/api/index";
import NoticeList from "./components/NoticeList.vue";
import SystemNoticeList from "./components/SystemNoticeList.vue";
import CollectionList from "./components/CollectionList.vue";
export default {
  components: {
    NoticeList,
    SystemNoticeList,
    CollectionList,
  },
  data() {
    return {
      items: [
        {
          title: "客户管理",
          path: "",
          icon: "",
        },
        {
          title: "公海客户",
          path: "",
          icon: "",
        },
        {
          title: "订单管理",
          path: "",
          icon: "",
        },
        {
          title: "教务开课",
          path: "",
          icon: "",
        },
        {
          title: "订单审批",
          path: "",
          icon: "",
        },
        {
          title: "回款入账",
          path: "",
          icon: "",
        },
      ],
      // 工作通知
      workNoticeData: [],
      workNoticePage: 1,
      workNoticeTotal: 0,
      workNoticeLoading: true,
      //回款计划提醒
      collectionTotal: 0,
      collectionPage: 1,
      collectionType: 0,
      collectionLoading: true,
      collectionData: [],
      collectionTypeName: "已逾期",
      // 系统通知
      msgData: [],
      msgTotal: 0,
      msgPage: 1,
      msgLoading: false,
      // 选择器
      sheetShow: false,
      sheetActions: [
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
    };
  },
  onLoad() {
    this.getStaffNotice();
  },
  methods: {
    onSheetSelect({ detail }) {
      this.collectionTypeName = detail.name;
      this.getReceivablePlan(detail.type);
    },
    onSheetClose() {
      this.sheetShow = false;
    },
    handleMsgMore() {
      this.msgPage++;
      this.getSystemMsgList();
    },
    async getSystemMsgList() {
      const data = {
        page: this.msgPage,
      };
      const res = await getSystemMsgList(data).catch(() => {});
      this.msgLoading = false;
      if (res.code === 0) {
        if (this.msgPage > 1) {
          this.msgData.push(...res.data.list);
        } else {
          this.msgData = res.data.list;
        }
        this.msgTotal = res.data.total;
      }
    },
    handleCollectionMore() {
      this.collectionPage++;
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
      if (res.code === 0) {
        if (this.collectionPage > 1) {
          this.collectionData.push(...res.data.list);
        } else {
          this.collectionData = res.data.list;
        }
        this.collectionTotal = res.data.total;
      }
    },
    handleNoticeMore() {
      this.workNoticePage++;
      this.getStaffNotice();
    },
    async getStaffNotice() {
      const data = {
        page: this.workNoticePage,
      };
      const res = await getStaffNotice(data);
      this.workNoticeLoading = false;
      if (this.workNoticePage === 1) {
        this.workNoticeData = res.data.data;
      } else {
        this.workNoticeData.push(...res.data.data);
      }
      this.workNoticeTotal = res.data.total;
    },
    handleTabsChange({ detail }) {
      const index = detail.index;
      switch (index) {
        case 1:
          !this.collectionData.length && this.getReceivablePlan();
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
