<template>
  <view class="study-progress">
    <view class=""> </view>
    <van-cell
      title="项目名称"
      title-class="title"
      value-class="value"
      :value="data.course_name"
    />
    <van-cell
      title="总课时"
      title-class="title"
      value-class="value"
      :value="data.total_lesson_count"
    />
    <van-cell
      title="学习时长"
      title-class="title"
      value-class="value"
      :value="data.finish_lesson_count"
    />
    <van-cell
      title="课程进度"
      title-class="title"
      value-class="value"
      :value="data.progress + '%'"
    />
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    console.log("props",this.data);
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/var";
.study-progress {
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
}
</style>