<template>
  <view class="student-class">
    <Title customStyle="padding: 0 20rpx 20rpx 10rpx;" title="报名项目"></Title>
    <template v-if="dataProject.length > 0">
      <view v-for="item in dataProject" :key="item.class_id" class="van-cell-group">
      <van-cell :border="false" custom-class="custom-class">
          <text class="value left strong">{{item.project_name || '--'}} </text>
      </van-cell>
      <van-cell :border="false" :title-width="titleWidth" custom-class="custom-class">
        <template #title>
            <text class="title">项目价格</text>
            <text class="value value__title">￥{{item.price || 0.0}}</text>
        </template>
        <template>
          <view class="value-right">
            <text class="title">报名时间</text>
            <text class="value-time">{{item.create_time || '--'}}</text>
          </view>
        </template>
      </van-cell>
      </view>
    </template>
    <template v-else>
      <view class="mo-data">暂无数据</view>
    </template>

    <Title customStyle="padding: 0 20rpx 20rpx 10rpx; margin-top: 50rpx;" title="归属班级"></Title>
    <template v-if="dataClass.length > 0">
      <view v-for="item in dataClass" :key="item.class_id" class="van-cell-group"> 
      <van-cell :border="false" custom-class="custom-class">
        <template>
          <text class="value left strong">{{item.classroom_name || '--'}} </text>
        </template>
      </van-cell>
      <van-cell id="asd" :border="false" :title-width="titleWidth" custom-class="custom-class">
        <template #title>
          <text class="title" >项目名称</text>
          <text class="value">{{item.project_nam || '--'}} </text>
        </template>
      </van-cell>
      <van-cell :border="false" :title-width="titleWidth" custom-class="custom-class">
        <template #title>
          <text class="title">班主任</text>
          <text class="value value__title">{{item.staff_name || '--'}} </text>
        </template>
        <view class="value-right">
          <text class="title">加入时间</text>
          <text class="value-time">{{item.add_time || '--'}} </text>
        </view>
      </van-cell>
      </view>
    </template>
    <template v-else>
      <view class="mo-data">暂无数据</view>
    </template>
  </view>
</template>

<script>
import Title from "@/components/title/index.vue";
import { getStudendclass, getUserProject } from "@/api/customer";

export default {
  components: { 
    Title
  },
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
  border-top: 20rpx solid #f2f6fc;
  padding: 20rpx;
  &-title {
    display: flex;
    align-items: center;
  }
  /deep/.title {
    color: #969799;
    font-size: @font-size-sm;
    text-align: left;
    margin-right: 8rpx;
  }
  /deep/.value {
    display: inline-block;
    text-align: left;
    font-size: @font-size-sm;
    color: @text-color;
  }
  .value__title {
    width: 100rpx;
    white-space: nowrap;
  }

  .value-time {
    display: inline-block;
    width: 260rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: @font-size-sm;
    color: @text-color;
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
  margin: 0 10rpx 20rpx;
  padding: 20rpx 0;
  border: 1rpx solid @border-color;
  background-color: #FFFFFF;
}
.study-progress-title {
  padding: 0 20rpx 20rpx 10rpx;
}

/deep/.custom-class {
  padding: 7rpx 20rpx;
}

.mo-data {
  height: 54rpx;
  text-align: center;
  font-size: @font-size-md;
  color: @text-color-grey;
}
</style>