<template>
  <view class="trend-chart">
    <view class="trend-chart-actions">
      <van-button
        @click="handleTypeClick(1)"
        :type="value === 1 ? 'warning' : 'default'"
        size="small"
        round
        custom-style="padding:4rpx 0;width:200rpx;"
        >按月</van-button
      >
      <van-button
        @click="handleTypeClick(2)"
        :type="value === 2 ? 'warning' : 'default'"
        size="small"
        round
        custom-style="padding:4rpx 0;width:200rpx;"
        >按季度</van-button
      >
    </view>
    <uni-ec-canvas
      class="trend-chart-canvas"
      canvas-id="trend-chart-canvas"
      :ec="ec"
    ></uni-ec-canvas>
  </view>
</template>

<script>
import uniEcCanvas from "@/components/uni-ec-canvas/uni-ec-canvas.vue";
export default {
  name: "TrendBar",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Number,
      default: 1,
    },
  },
  components: {
    uniEcCanvas,
  },
  data() {
    return {
      ec: {
        option: {
          color: ["#FFE5c8", "#FFB76A", "#ff6c59"],
          tooltip: {
            trigger: "axis",
            position: ["40%", "20%"],
            axisPointer: {
              type: "none",
            },
          },
          grid: {
            left: "0%",
            right: "0%",
            bottom: "1%",
            containLabel: true,
          },
          legend: {},
          xAxis: {
            data: [],
            axisTick: {
              //刻度线
              show: false,
            },
          },
          yAxis: {
            splitArea: { show: false },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            axisLine: {
              //y轴
              show: false,
            },
          },

          series: [
            {
              barWidth: 20,
              data: [],
              name: "订单",
              type: "bar",
            },
            {
              barWidth: 20,
              barGap: "-100%",
              data: [],
              name: "回款",
              type: "bar",
            },
            {
              barWidth: 20,
              data: [],
              name: "退款",
              type: "bar",
            },
          ],
        },
      },
    };
  },
  watch: {
    data: {
      handler() {
        this.updateChartData();
      },
      deep: true,
    },
  },
  methods: {
    handleTypeClick(type) {
      this.$emit("input", type);
      type !== this.value && this.$emit("change", type);
    },
    updateChartData() {
      const totalData = [];
      const payData = [];
      const refundData = [];
      this.data.forEach(({ order_money, pay_money, refund_money }) => {
        totalData.push(order_money);
        payData.push(pay_money);
        refundData.push(refund_money);
      });
      this.ec.option.xAxis.data =
        this.value !== 1
          ? ["第一季度", "第二季度", "第三季度", "第四季度"]
          : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
      this.ec.option.series[0].data = totalData;
      this.ec.option.series[1].data = payData;
      this.ec.option.series[2].data = refundData;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.trend-chart {
  &-actions {
    padding: 0 40rpx 20rpx;
    .flex-c-a();
  }
  &-canvas {
    width: 100%;
    height: 600rpx;
    display: block;
  }
}
</style>