<template>
  <view class="student-class">
      <Title title="报名项目"></Title>
      <view v-for="item in dataProject" :key="item.id">
        <van-cell>
          <template #title>
              <text class="value strong">{{item.project_name}}</text>
          </template>
        </van-cell>
        <van-cell>
          <template #title>
              <text class="title">项目价格</text>
              <text class="value">{{item.price}}</text>
          </template>
          <template>
              <text class="title left">报名时间</text>
              <text class="value left">{{item.create_time}}</text>
          </template>
        </van-cell>
      </view>

      <template>
        <Title  title="归属班级"></Title>
        <view v-for="item in dataClass" :key="item.class_id">
          <van-cell>
            <template #title>
              <text class="title">项目名称</text>
              <text class="value">{{item.project_name}} </text>
            </template>
          </van-cell>
          <van-cell>
            <template #title>
              <text class="title">班主任</text>
              <text class="value">{{item.staff_name}} </text>
            </template>
            <template>
              <text class="title">加入时间</text>
              <text class="value">{{item.add_time}} </text>
            </template>
          </van-cell>
        </view>
      </template>
  </view>
</template>

<script>
import Title from "@/components/title/index.vue";

export default {
  components: { Title },
  props: {
    dataClass: {
      type: Array,
      default: () => ([])
    },
    dataProject: {
      type: Array,
      default: () => ([])
    }
  },
  created() {
    console.log("dataClass", this.dataClass, this.dataProject);
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/var";
.student-class {
  display: flex;
  flex-direction: column;
  border-top: 20rpx solid #f2f6fc;
  /deep/.title {
      flex: inherit;
      flex-shrink: 0;
      font-size: @font-size-sm;
      color: #969799;
  }
  /deep/.value {
      font-size: @font-size-sm;
      color: @text-color;
    }
  .left {
      float: left;
  }
  .strong {
      font-weight: 700;
      color: #323333;
  }
}
</style>