<template>
  <view class="notice-detail">
    <view class="notice-detail-title"> {{ noticData.title }}</view>
    <view class="notice-detail-submit-info">
      <view>发布时间：{{ noticData.create_time }}</view>
      <view>发布人：{{ noticData.staff_name }}</view>
    </view>
    <u-parse :content="noticData.content || '--'" />
    <view></view>
  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import { getAnnouncementInfo } from "@/api/index";
export default {
  components: {
    uParse,
  },
  data() {
    return {
      noticData: {},
    };
  },
  onLoad({ id }) {
    this.getAnnouncementInfo(id);
  },
  methods: {
    async getAnnouncementInfo(id) {
      const data = {
        id,
      };
      const res = await getAnnouncementInfo(data);
      if (res.code === 0) {
        this.noticData = res.data;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.notice-detail {
  padding: 20rpx;
  &-title {
    font-size: @font-size-md;
    font-weight: bold;
  }
  &-submit-info {
    margin-bottom: 40rpx;
    view {
      font-size: @font-size-sm;
    }
  }
}
</style>