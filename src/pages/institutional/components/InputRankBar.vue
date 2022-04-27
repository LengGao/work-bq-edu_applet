<template>
  <view class="input-rank-chart">
    <uni-ec-canvas
      :style="{
        height: (data.length < 5 ? 300 : data.length * 35) + 'px',
      }"
      class="input-rank-chart-canvas"
      canvas-id="input-rank-chart-canvas"
      :ec="ec"
      ref="echats"
    ></uni-ec-canvas>
  </view>
</template>

<script>
import uniEcCanvas from "@/components/uni-ec-canvas/uni-ec-canvas.vue";
export default {
  name: "InputRankBar",
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
            position: ["50%", "20%"],
            axisPointer: {
              type: "shadow",
            },
          },
          grid: {
            left: "0%",
            right: "8%",
            top: "5%",
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
              name: "客户数量",
              type: "bar",
              color: "#24A3FF",
              data: [],
              barWidth: 20,
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
  mounted() {
    this.updateChartData();
  },
  methods: {
    updateChartData() {
      let seriesData = [];
      let yAxisData = [];
      seriesData = this.data.map(({ num }) => +num).reverse();
      yAxisData = this.data
        .map(({ name }, index) => index + 1 + ". " + name)
        .reverse();
      this.ec.option.series[0].data = seriesData;
      this.ec.option.yAxis.data = yAxisData;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.input-rank-chart {
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