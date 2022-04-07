<template>
  <view class="pie-chart">
    <uni-ec-canvas
      class="pie-chart-canvas"
      canvas-id="pie-chart-canvas"
      :ec="ec"
      ref="echats"
    ></uni-ec-canvas>
  </view>
</template>

<script>
import uniEcCanvas from "@/components/uni-ec-canvas/uni-ec-canvas.vue";
export default {
  name: "Pie",
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
            trigger: "item",
          },
          series: [
            {
              name: "客户来源",
              type: "pie",
              radius: "60%",
              data: [],
              label: {
                formatter: "{b}: {d}%",
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
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
      this.ec.option.series[0].data = this.data.slice();
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.pie-chart {
  &-canvas {
    width: 100%;
    height: 760rpx;
    display: block;
  }
}
</style>