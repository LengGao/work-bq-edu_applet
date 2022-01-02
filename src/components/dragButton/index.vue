<template>
  <view
    class="drag-button"
    @touchmove.stop="onTouchMove"
    @click.stop="handleClick"
    @tap="handleTap"
    :style="style"
  >
    <van-icon :name="icon" :size="`${iconSize}rpx`" color="#fff" />
  </view>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: "plus",
    },
    iconSize: {
      type: [String, Number],
      default: "42",
    },
    position: {
      type: Array,
      default: () => [90, 90],
    },
  },
  data() {
    return {
      style: "",
      btnWidth: 0,
      btnHeight: 0,
      windowWidth: 0,
      windowHeight: 0,
    };
  },
  created() {
    this.initPosition();
  },
  methods: {
    handleTap(e) {
      this.$emit("tap", e);
    },
    handleClick(e) {
      this.$emit("click", e);
    },
    initPosition() {
      //初始化按钮位置
      const { windowWidth, windowHeight } = uni.getSystemInfoSync();
      this.windowWidth = windowWidth;
      this.windowHeight = windowHeight;
      this.style = `transform: translate3d(${
        windowWidth - this.position[0]
      }px,${windowHeight - this.position[1]}px,0);`;
      // 获取按钮实际宽高
      uni
        .createSelectorQuery()
        .in(this)
        .select(".drag-button")
        .boundingClientRect((res) => {
          this.btnWidth = res.width;
          this.btnHeight = res.height;
        })
        .exec();
    },
    onTouchMove({ touches }) {
      const { pageX, pageY } = touches[0];
      let x = pageX - this.btnWidth / 2;
      let y = pageY - this.btnHeight / 2;
      // 边界处理
      if (x <= 0) {
        x = 0;
      }
      if (x >= this.windowWidth - this.btnWidth) {
        x = this.windowWidth - this.btnWidth;
      }
      if (y <= 0) {
        y = 0;
      }
      if (y >= this.windowHeight - this.btnHeight) {
        y = this.windowHeight - this.btnHeight;
      }
      this.style = `transform: translate(${x}px,${y}px);`;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.drag-button {
  width: 120rpx;
  height: 120rpx;
  .flex-c-c();
  background-color: @primary;
  .radius(50%);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.5);
}
</style>