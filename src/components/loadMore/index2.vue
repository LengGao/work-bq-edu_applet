<template>
  <scroll-view
    class="load-more"
    scroll-y
    refresher-enabled
    @refresherrefresh="handleRefresh"
    :refresher-triggered="rLoading"
    refresher-background="#efefef"
    enable-back-to-top
    :lower-threshold="lowerThreshold"
    @scrolltolower="handleLoadMore"
  >
    <van-skeleton title row="3" :loading="skeletonLoading">
      <template v-if="data.length">
        <slot></slot>
        <view class="footer" v-if="loadLoading">
          <van-loading
            type="spinner"
            custom-class="loading"
            size="24rpx"
            >加载中...</van-loading
          >
        </view>
        <view class="footer" v-if="!loadLoading && data.length === total">
        <van-divider
            custom-style="padding:0 100rpx"
            contentPosition="center"
            >没有更多了</van-divider
          >
        </view>
      </template>
      <NoData v-else />
    </van-skeleton>
  </scroll-view>
</template>

<script>
import NoData from "@/components/noData/index.vue";

export default {
  components: {
    NoData,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    refreshLoading: {
      type: Boolean,
      default: false,
    },
    loadLoading: {
      type: Boolean,
      default: false,
    },
    skeletonLoading: {
      type: Boolean,
      default: false,
    },
    lowerThreshold: {
        type: [String, Number],
        default: '100'
    }
  },
  data() {
    return {
      rLoading: false,
    };
  },
  watch: {
    refreshLoading(val) {
      if (val) {
        this.rLoading = val;
      } else {
        setTimeout(() => {
          this.rLoading = val;
        }, 300);
      }
    },
  },
  methods: {
    handleRefresh(e) {
      this.$emit("refresh", e);
    },
    handleLoadMore(e) {
      if (!this.loadLoading && this.data.length < this.total) {
        this.$emit("load-more", e);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.footer {
  min-height: 80rpx;
  /deep/.loading {
    width: 100%;
    text-align: center;
    padding: 20rpx;
  }
}
</style>