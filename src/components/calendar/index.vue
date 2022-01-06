<template>
  <van-calendar
    :show="show"
    type="range"
    @close="$emit('close')"
    @confirm="onConfirm"
  />
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 日期格式
    formatDate(dateTime) {
      const date = new Date(dateTime);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`;
    },
    onConfirm({ detail }) {
      let date = null;
      if (Array.isArray(detail)) {
        date = detail.map(this.formatDate);
      } else {
        date = this.formatDate(detail);
      }
      this.$emit("confirm", date);
    },
  },
};
</script>

<style>
</style>