<template>
  <view class="study-progress">
    <Title class="study-progress-title" title="学习进度"></Title>
    <template v-if="studyProgress.list.length > 0">
      <view v-for="(item) in studyProgress.list" :key="item.id" class="study-progress-block">
        <van-cell
          title="课程名称"
          title-class="title"
          value-class="value"
          :value="item.course_name || '--'"
        />
        <van-cell
          title="总课时"
          title-class="title"
          value-class="value"
          :value="item.total_lesson_count || 0"
        />
        <van-cell
          title="学习时长"
          title-class="title"
          value-class="value"
          :value="item.finish_lesson_count || 0"
        />
        <van-cell
          title="课程进度"
          title-class="title"
          value-class="value"
          :value="(item.progress || 0) + '%'"
        />
      </view>
    </template>
    <template v-else>
      <view class="mo-data">暂无数据</view>
    </template>

    <Title class="study-progress-title" title="题库进度" style="margin-top: 20px;"></Title>
    <template v-if="questionBank.list.length > 0">
      <view v-for="(item) in questionBank.list" :key="item.id" class="study-progress-block">
        <van-cell
          title="题库名称"
          title-class="title"
          value-class="value"
          :value="item.question_bank_name || '--'"
        />
        <van-cell
          title="打卡天数"
          title-class="title"
          value-class="value"
          :value="item.punch_in_days || 0"
        />
        <van-cell
          title="章节练习进度"
          title-class="title"
          value-class="value"
          :value="item.practice_progress || 0"
        />
        <van-cell
          title="课程进度"
          title-class="title"
          value-class="value"
          :value="(item.progress || 0)+ '%'"
        />
      </view>
    </template>
    <template v-else>
      <view class="mo-data">暂无数据</view>
    </template>
  </view>
</template>

<script>
import Title from "@/components/title/index2.vue";
import { getStudyProgress, getBuyQuestionBank } from "@/api/customer";
export default {
  components: { Title },
  props: {
    uid: { type: Number }
  },
  data() {
    return {
      studyProgress: {},
      questionBank: {},
      page: 1,
    }
  },
  mounted() {
    const params = {uid: this.uid}, params2 = {uid: this.uid}
    Promise.all([getStudyProgress(params), getBuyQuestionBank(params2)]).then(res => {
      this.studyProgress = res[0].data
      this.questionBank = res[1].data
    }) 
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/var";
.study-progress {
    display: flex;
    flex-direction: column;
    border-top: 20rpx solid #f2f6fc;
    .study-progress-block {
      padding: 0;
      border-top: 1rpx solid @border-color;
      background-color: #FFFFFF;
    }
    .study-progress-title {
      padding: 20rpx 0 20rpx 10rpx;
      background-color: #FFFFFF;
    }
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

.mo-data {
  height: 54rpx;
  text-align: center;
  font-size: @font-size-md;
  color: @text-color-grey;
}
</style>