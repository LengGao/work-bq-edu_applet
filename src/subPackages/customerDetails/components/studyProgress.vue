<template>
  <view class="study-progress">
    <view v-for="(item) in studyProgress.list" :key="item.id" class="study-progress-block">
      <Title class="study-progress-title" title="学习进度"></Title>
      <van-cell
        title="课程名称"
        title-class="title"
        value-class="value"
        :value="item.course_name"
      />
      <van-cell
        title="总课时"
        title-class="title"
        value-class="value"
        :value="item.total_lesson_count"
      />
      <van-cell
        title="学习时长"
        title-class="title"
        value-class="value"
        :value="item.finish_lesson_count"
      />
      <van-cell
        title="课程进度"
        title-class="title"
        value-class="value"
        :value="item.progress + '%'"
      />
      </view>

  <view v-for="(item) in questionBank.list" :key="item.id" class="study-progress-block">
    <Title class="study-progress-title" title="题库进度"></Title>
    <van-cell
      title="题库名称"
      title-class="title"
      value-class="value"
      :value="item.question_bank_name"
    />
    <van-cell
      title="打卡天数"
      title-class="title"
      value-class="value"
      :value="item.punch_in_days"
    />
    <van-cell
      title="章节练习进度"
      title-class="title"
      value-class="value"
      :value="item.practice_progress"
    />
    <van-cell
      title="课程进度"
      title-class="title"
      value-class="value"
      :value="item.progress + '%'"
    />
    </view>
  </view>
</template>

<script>
import Title from "@/components/title/index.vue";
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
    const params = {uid: this.uid}, params2 = {uid: this.uid, page: this.page}
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
      padding: 20rpx 0;
    }
    .study-progress-title {
      margin: 20rpx 0 20rpx;
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
</style>