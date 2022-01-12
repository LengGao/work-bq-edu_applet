<template>
  <view class="rank-chart">
    <view class="rank-chart-actions">
      <van-button
        @click="handleTypeClick(1)"
        :type="value === 1 ? 'warning' : 'default'"
        size="small"
        round
        custom-style="padding:4rpx 0;width:200rpx;"
        >回款金额</van-button
      >
      <van-button
        @click="handleTypeClick(2)"
        :type="value === 2 ? 'warning' : 'default'"
        size="small"
        round
        custom-style="padding:4rpx 0;width:200rpx;"
        >订单金额</van-button
      >
      <van-button
        @click="handleTypeClick(3)"
        :type="value === 3 ? 'warning' : 'default'"
        size="small"
        round
        custom-style="padding:4rpx 0;width:200rpx;"
        >退款金额</van-button
      >
    </view>
    <uni-ec-canvas
      class="rank-chart-canvas"
      canvas-id="rank-chart-canvas"
      :ec="ec"
      :style="{
        height: (data.length < 5 ? 300 : data.length * 35) + 'px',
      }"
      ref="echats"
    ></uni-ec-canvas>
  </view>
</template>

<script>
import uniEcCanvas from "@/components/uni-ec-canvas/uni-ec-canvas.vue";
export default {
  name: "RankBar",
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
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
            position: ["50%", "20%"],
          },
          grid: {
            left: "0%",
            right: "10%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.01],
            axisTick: {
              //刻度线
              show: false,
            },
            axisLine: {
              show: false,
            },
          },
          yAxis: {
            type: "category",
            data: [],
            axisTick: {
              //刻度线
              show: false,
            },
          },
          series: [
            {
              name: "回款",
              type: "bar",
              color: "#FF6C59",
              barWidth: 20,
              data: [],
              label: {
                show: true,
                precision: 1,
                position: "right",
                valueAnimation: true,
                fontFamily: "monospace",
              },
            },
          ],
        },
      },
    };
  },
  watch: {
    data: {
      handler() {
        setTimeout(() => {
          this.updateChartData();
        }, 200);
      },
      deep: true,
    },
    "data.length"() {
      this.$refs.echats.init();
    },
  },
  methods: {
    handleTypeClick(type) {
      this.$emit("input", type);
      type !== this.value && this.$emit("change", type);
    },
    updateChartData() {
      let seriesData = [];
      let yAxisData = [];
      // 销售龙虎榜
      seriesData = this.data.map(({ num }) => +num).reverse();
      yAxisData = this.data
        .map(({ name }, index) => index + 1 + ". " + name)
        .reverse();
      const typeNameMap = {
        1: "回款",
        2: "订单",
        3: "退款",
      };
      this.ec.option.series[0].data = seriesData;
      this.ec.option.series[0].name = typeNameMap[this.value];
      this.ec.option.yAxis.data = yAxisData;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.rank-chart {
  &-actions {
    .flex-c-a();
  }
  &-canvas {
    width: 100%;
    height: 600rpx;
    display: block;
  }
}
</style>