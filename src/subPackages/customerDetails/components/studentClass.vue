<template>
  <view class="student-class">
    <Title title="报名项目"></Title>
    <template v-if="dataProject.length > 0">
      <view v-for="item in dataProject" :key="item.class_id" class="van-cell-group">
      <van-cell :border="false">
          <text class="value left strong">{{item.project_name}} </text>
      </van-cell>
      <van-cell :border="false" :title-width="titleWidth">
        <template #title>
            <text class="title ">项目价格</text>
            <text class="value value__title">{{item.price}}</text>
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
          <text class="value value__title">{{item.staff_name}} </text>
        </template>
        <view class="value-right">
          <text class="title">加入时间</text>
          <text class="value">{{item.add_time}} </text>
        </view>
      </van-cell>
      </view>
    </template>
  </view>
</template>

<script>
import Title from "@/components/title/index.vue";
import { getStudendclass, getUserProject } from "@/api/customer";

export default {
  components: { Title },
  props: {
    uid: {
      type: Number
    }
  },
  data() {
    return {
      dataClass: [],
      dataProject: [],
      titleWidth: '300rpx'
    }
  },
  mounted() {
    const params = {uid: this.uid}
    Promise.all([getStudendclass(params), getUserProject(params)]).then(res => {
      this.dataClass = res[0].data
      this.dataProject = res[1].data
    })
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
    padding: 0 0 10rpx;
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
  .value__title {
    width: 100rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .left {
    float: left;
  }
  .value-right {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
  }
  .strong {
    font-weight: 700;
    color: #323333;
  }
}

.van-cell-group {
  padding-bottom: 20rpx;
  border: 1rpx solid @border-color;
}

/deep/.custom-class {
  padding: 0rpx 32rpx;
}
</style>