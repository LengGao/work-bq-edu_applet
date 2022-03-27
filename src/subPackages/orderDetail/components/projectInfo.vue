<template>
  <view class="pay-record">
    <template v-if="data.type === 1">
      <van-cell-group
        :border="false"
        custom-class="cell-group"
        v-for="(item, index) in getCellData"
        :key="index"
      >
        <van-cell>
          <template #title>
            <Title :title="`报名学历${index + 1}`" custom-style="padding:0">
            </Title>
          </template>
        </van-cell>
        <van-cell
          title="学历形式"
          title-class="title"
          value-class="value"
          :value="item.type.value"
        >
        </van-cell>
        <van-cell
          title="院校名称"
          title-class="title"
          value-class="value"
          :value="item.university.value"
        >
        </van-cell>
        <van-cell
          title="层次名称"
          title-class="title"
          value-class="value"
          :value="item.level.value"
        >
        </van-cell>
        <van-cell
          title="专业名称"
          title-class="title"
          value-class="value"
          :value="item.major.value"
        >
        </van-cell>
        <van-cell
          title="关联项目"
          title-class="title"
          value-class="value"
          :value="item.project_name"
        >
        </van-cell>
        <van-cell
          title="总学费"
          title-class="title"
          value-class="value"
          :value="item.total_money | moneyFormat"
        >
        </van-cell>
        <van-cell
          title="实收金额"
          title-class="title"
          value-class="value"
          :value="item.must_money | moneyFormat"
        >
        </van-cell>
      </van-cell-group>
    </template>
    <template v-else>
      <van-cell-group
        custom-class="cell-group"
        v-for="(item, index) in getCellData"
        :key="index"
        :border="false"
      >
        <van-cell>
          <template #title>
            <Title :title="`报名项目${index + 1}`" custom-style="padding:0">
            </Title>
          </template>
        </van-cell>
        <van-cell
          title="项目名称"
          title-class="title"
          value-class="value"
          :value="item.project_name"
        >
        </van-cell>
        <!-- <van-cell
          title="所属分类"
          title-class="title"
          value-class="value"
          :value="item.category_name"
        >
        </van-cell> -->
        <van-cell
          title="项目价格"
          title-class="title"
          value-class="value"
          :value="item.project_price | moneyFormat"
        >
        </van-cell>
        <van-cell
          title="实收金额"
          title-class="title"
          value-class="value"
          :value="item.must_money | moneyFormat"
        >
        </van-cell>
        <!-- <van-cell
          title="其他金额"
          title-class="title"
          value-class="value"
          :value="item.other_money | moneyFormat"
        >
        </van-cell> -->
      </van-cell-group>
    </template>
  </view>
</template>

<script>

import Title from "@/components/title/index.vue";
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    Title,
  },
  data() {
    return {};
  },
  computed: {
    getCellData() {
      const cellData = JSON.parse(this.data.project) || [];
      return cellData;
    },
  },
};
</script>


<style lang="less" scoped>
@import "@/styles/var";
.pay-record {
  min-height: 65vh;
  border-top: 20rpx solid #f2f6fc;
  /deep/.cell-group {
    margin-bottom: 20rpx;
  }
  /deep/.title {
    flex: inherit;
    flex-shrink: 0;
    color: #969799;
    margin-right: 20rpx;
  }
  /deep/.value {
    color: @text-color;
  }
}
</style>