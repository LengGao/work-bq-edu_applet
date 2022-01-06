<template>
  <view class="order-list">
    <SearchBar @search="handleSearch" @filter-click="openDrawer" />
    <LoadMore
      :data="listData"
      :total="listTotal"
      :load-loading="listLoading"
      :refresh-loading="listRefreshLoading"
      @load-more="handleLoadMore"
      @refresh="handleRefresh"
      class="load-more"
    >
      <view
        class="item"
        v-for="item in listData"
        :key="item.order_id"
        @click="toDetail(item.order_id)"
      >
        <view class="item-info">
          <view class="item-info-user">
            {{ item.surname || "" }}-{{ item.project_name }}
          </view>
          <view class="item-info-money"
            >应收 {{ item.order_money | moneyFormat }} / 已收
            {{ item.pay_money | moneyFormat }}
          </view>
        </view>
        <view class="item-status">
          <van-tag plain :color="item.verify_status | orderApplyStatus">{{
            item.verify_status | orderApplyStatus(true)
          }}</van-tag>
        </view>
      </view>
    </LoadMore>
    <van-popup
      :show="drawerShow"
      position="right"
      custom-style="height: 100%;width:80%"
      @close="drawerShow = false"
    >
      <!-- :border="false" -->
      <van-cell-group>
        <van-cell
          title="所属分类"
          is-link
          :value="checkedCategorytName || '请选择'"
          @click="selectCategoryShow = true"
        />
        <van-cell
          title="所属项目"
          title-width="70px"
          is-link
          :value="checkedProjectName || '请选择'"
          @click="selectProjectShow = true"
        />
        <van-cell
          title="业绩归属"
          is-link
          :value="checkedStaffName || '请选择'"
          @click="selectStaffShow = true"
        />
        <van-cell title="支付状态" is-link value="请选择" />
        <van-cell title="审核状态" is-link value="请选择" />
        <van-cell
          title="创建时间"
          is-link
          value="请选择"
          @click="calendarShow = true"
        />
        <van-field
          type="number"
          value="username"
          input-align="right"
          clearable
          label="订单金额-起"
          placeholder="请输入"
        />
        <van-field
          type="number"
          value="username"
          input-align="right"
          clearable
          label="订单金额-止"
          placeholder="请输入"
        />
        <van-field
          type="number"
          value="username"
          input-align="right"
          clearable
          label="回款金额-起"
          placeholder="请输入"
        />
        <van-field
          type="number"
          value="username"
          input-align="right"
          clearable
          label="回款金额-止"
          placeholder="请输入"
        />
      </van-cell-group>
    </van-popup>
    <Calendar
      :show="calendarShow"
      @close="calendarShow = false"
      @confirm="onCalendarConfirm"
    />
    <Select
      :show="selectProjectShow"
      @close="selectProjectShow = false"
      @confirm="handleSelectProjectChange"
      :options="projectOptions"
      option-name="project_name"
      option-value="project_id"
      multiple
    />
    <Select
      :show="selectCategoryShow"
      @close="selectCategoryShow = false"
      @confirm="handleSelectCategoryChange"
      :options="categoryOptions"
      option-name="category_name"
      option-value="category_id"
      multiple
    />
    <Select
      :show="selectStaffShow"
      @close="selectStaffShow = false"
      @confirm="handleSelectStaffChange"
      :options="staffOptions"
      option-name="staff_name"
      option-value="staff_id"
      multiple
    />
  </view>
</template>

<script>
import Select from "@/components/select/index.vue";
import SearchBar from "@/components/searchBar/index.vue";
import LoadMore from "@/components/loadMore/index.vue";
import Calendar from "@/components/calendar/index.vue";
import { getCrmOrderList } from "@/api/order";
import { mapGetters } from "vuex";
export default {
  components: {
    SearchBar,
    LoadMore,
    Calendar,
    Select,
  },
  data() {
    return {
      listData: [],
      listRefreshLoading: false,
      listLoading: false,
      pageNum: 1,
      listTotal: 0,
      searchData: {
        keyword: "",
        category_id: "",
        project_id: "",
        staff_id: "",
      },
      drawerShow: true,
      calendarShow: false,
      selectProjectShow: false,
      checkedProjectName: "",
      selectCategoryShow: false,
      checkedCategorytName: "",
      selectStaffShow: false,
      checkedStaffName: "",
    };
  },
  computed: {
    ...mapGetters(["projectOptions", "categoryOptions", "staffOptions"]),
  },
  onShow() {
    this.getCrmOrderList();
  },
  methods: {
    // 选择业绩归属人
    handleSelectStaffChange(checked) {
      this.selectStaffShow = false;
      this.checkedStaffName = checked.map((item) => item.staff_name).join(",");
      this.searchData.staff_id = checked.map((item) => item.staff_id).join(",");
    },
    // 选择分类
    handleSelectCategoryChange(checked) {
      this.selectCategoryShow = false;
      this.searchData.category_id = checked
        .map((item) => item.category_id)
        .join(",");
      this.checkedCategorytName = checked
        .map((item) => item.category_name)
        .join("，");
    },
    // 选择项目
    handleSelectProjectChange(checked) {
      this.selectProjectShow = false;
      this.searchData.project_id = checked
        .map((item) => item.project_id)
        .join(",");
      this.checkedProjectName = checked
        .map((item) => item.project_name)
        .join("，");
    },
    onCalendarConfirm(date) {
      console.log(date);
      this.calendarShow = false;
    },
    openDrawer() {
      this.drawerShow = true;
    },
    toDetail(orderId) {
      uni.navigateTo({
        url: `/pages/orderDetail/index?orderId=${orderId}`,
      });
    },
    handleSearch(val) {
      this.pageNum = 1;
      this.searchData.keyword = val;
      this.getCrmOrderList();
    },
    handleLoadMore() {
      this.pageNum++;
      this.listLoading = true;
      this.getCrmOrderList();
    },
    handleRefresh() {
      this.listRefreshLoading = true;
      this.pageNum = 1;
      this.getCrmOrderList();
    },
    async getCrmOrderList() {
      this.checkedIds = [];
      const data = {
        page: this.pageNum,
        ...this.searchData,
      };
      const res = await getCrmOrderList(data);
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
.order-list {
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
      &-user {
        margin-bottom: 10rpx;
        min-width: 100rpx;
        margin-right: 10rpx;
        font-size: 32rpx;
      }
      &-money {
        color: @f-c-999;
      }
    }
    &-status {
      flex-shrink: 0;
    }
  }
}
</style>