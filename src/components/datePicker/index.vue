<template>
  <view class="date-picker">
    <van-cell
      :title="title"
      title-class="title"
      :value="date"
      @click="show = true"
    />
    <van-calendar
      :type="type"
      :show="show"
      allow-same-day
      @close="show = false"
      color="#199fff"
      @confirm="onConfirm"
    />
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: [Date, String, Array],
      default: "",
    },
    type: {
      type: String,
      default: "single",
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      date: "",
      show: false,
    };
  },
  methods: {
    onConfirm({ detail }) {
      console.log(detail);
      if (this.type === "range") {
        const [start, end] = detail;
        this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`;
      } else {
        this.date = this.formatDate(detail);
      }
      this.$emit("input", this.date);
      this.show = false;
    },
    formatDate(date) {
      date = new Date(date);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
  },
};
</script>

<style lang="less" scoped>
.date-picker {
  /deep/.title {
    flex: inherit;
    flex-shrink: 0;
  }
}
</style>