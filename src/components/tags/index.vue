<template>
  <view class="tags">
    <view class="tags-title">{{ title }}</view>
    <view class="tags-container">
      <template v-if="multiple">
        <view
          class="tag"
          :class="{ active: value.includes(item.value) }"
          v-for="(item, index) in tags"
          :key="index"
          @click="handleClick(item.value, index)"
          >{{ item.name }}</view
        >
      </template>
      <template v-else>
        <view
          class="tag"
          :class="{ active: value === item.value }"
          v-for="(item, index) in tags"
          :key="index"
          @click="$emit('input', value === item.value ? '' : item.value)"
          >{{ item.name }}</view
        >
      </template>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, Number, String],
      default: "",
    },
    tags: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleClick(val) {
      const vals = [...this.value];
      if (vals.includes(val)) {
        vals.splice(vals.indexOf(val), 1);
        this.$emit("input", vals);
      } else {
        vals.push(val);
        this.$emit("input", vals);
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.tags {
  padding: 20rpx 16px;
  &-title {
    margin-bottom: 20rpx;
    font-size: @font-size-sm;
    color: @text-color;
  }
  &-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .tag {
      padding: 16rpx 0;
      min-width: 160rpx;
      text-align: center;
      margin-right: 16rpx;
      margin-bottom: 16rpx;
      border-radius: 30rpx;
      background-color: #f7f8fa;
      color: @text-color;
      &.active {
        background-color: #ecf5ff;
        color: @primary;
      }
    }
  }
}
</style>