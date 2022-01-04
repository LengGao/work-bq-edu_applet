<template>
  <van-popup :show="show" @close="$emit('close')" position="bottom">
    <van-datetime-picker
      @confirm="handleDateConfirm"
      @cancel="$emit('cancel')"
      :type="type"
      :value="value"
      :min-date="minDate"
      :max-date="maxDate"
    />
  </van-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
      default: new Date().getTime(),
    },
    type: {
      type: String,
      default: "date",
    },
    minDate: {
      type: Number,
      default: new Date("2015").getTime(),
    },
    maxDate: {
      type: Number,
      default: new Date("2035").getTime(),
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
    handleDateConfirm({ detail }) {
      this.$emit("confirm", this.formatDate(detail));
    },
  },
};
</script>
