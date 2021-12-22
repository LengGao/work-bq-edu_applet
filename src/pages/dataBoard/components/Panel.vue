<template>
  <view class="panel">
    <view class="panel-header" @click="openSheet">
      <view class="panel-header-title">{{ title }}</view>
      <view class="panel-header-btn"
        >{{ getButtonName }}
        <van-icon
          :custom-style="`transition:transform 0.3s;${
            sheetShow ? 'transform:rotate(90deg)' : ''
          }`"
          name="arrow"
      /></view>
    </view>
    <view class="panel-body">
      <slot></slot>
    </view>
    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="onSheetClose"
      @select="onSheetSelect"
    />
  </view>
</template>

<script>
export default {
  name: "Panel",
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    sheetActions: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      sheetShow: false,
    };
  },
  computed: {
    getButtonName() {
      if (!this.sheetActions.length) {
        return "";
      }
      const target = this.sheetActions.filter(
        (item) => item.value == this.value
      );
      if (!target.length) {
        return "";
      }
      return target[0].name || "";
    },
  },
  methods: {
    openSheet() {
      this.sheetShow = true;
    },
    onSheetSelect({ detail }) {
      this.$emit("input", detail.value);
      this.$emit("sheet-change", { ...detail });
    },
    onSheetClose() {
      this.sheetShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.panel {
  &-header {
    .flex-c-b();
    background-color: #fff;
    padding: 24rpx;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    border-bottom: 1rpx solid #efefef;
    &:active {
      background-color: #f2f3f5;
    }
    &-title {
      color: @font-color;
    }
    &-btn {
      color: #999;
    }
  }
  &-body {
    background-color: #fff;
    padding: 20rpx;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
  }
}
</style>