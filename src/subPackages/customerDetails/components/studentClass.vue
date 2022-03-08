<template>
  <view class="student-class">
      <Title title="报名项目"></Title>
      <template v-if="dataProject.length > 0">
        <view v-for="item in dataProject" :key="item.id" class="van-cell-group">
        <van-cell :border="false">
            <text class="value left strong">{{item.project_name}} </text>
        </van-cell>
        <van-cell :border="false" :title-width="titleWidth">
          <template #title>
              <text class="title ">项目价格</text>
              <text class="value">{{item.price}}</text>
          </template>
          <template>
              <text class="title left">报名时间</text>
              <text class="value">{{item.create_time}}</text>
          </template>
        </van-cell>
        </view>
      </template>

      <Title v-if="dataClass.length > 0" title="归属班级"></Title>
      <template v-if="dataClass.length > 0">
        <view v-for="item in dataClass" :key="item.class_id" class="van-cell-group"> 
        <van-cell :border="false">
          <template>
            <text class="value left strong">{{item.classroom_name}} </text>
          </template>
        </van-cell>
        <van-cell id="asd" :border="false" :title-width="titleWidth" custom-class="custom-class">
          <template #title>
            <text class="title" >项目名称</text>
            <text class="value">{{item.project_name}} </text>
          </template>
        </van-cell>
        <van-cell :title-width="titleWidth" custom-class="custom-class">
          <template #title>
            <text class="title">班主任</text>
            <text class="value">{{item.staff_name}} </text>
          </template>
          <template>
            <text class="title left">加入时间</text>
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
  data() {
    return {
      titleWidth: '300rpx'
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
  padding: 20rpx 0;
  &-title {
    display: flex;
    align-items: center;
    // padding: 0 20rpx;
  }
  .title {
    color: #969799;
    font-size: @font-size-sm;
    text-align: left;
    margin-right: 20rpx;
  }
  .value {
    display: inline-block;
    text-align: left;
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

.van-cell-group {
  border: 1rpx solid @border-color;
}

/deep/.custom-class {
  padding: 0rpx 32rpx;
}
</style>