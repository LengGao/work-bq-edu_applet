<template>
  <view class="gauge-chart">
    <uni-ec-canvas
      class="gauge-chart-canvas"
      canvas-id="gauge-chart-canvas"
      :ec="ec"
    ></uni-ec-canvas>
    <view class="gauge-chart-data">
      <view class="gauge-chart-data-item">
        <view class="gauge-chart-data-item-title">业绩目标</view>
        <view class="gauge-chart-data-item-value">
          {{ priceFormat(data.totalPerformance)
          }}<text class="unit">{{
            unitFormat(data.totalPerformance)
          }}</text></view
        >
      </view>
      <view class="gauge-chart-data-item">
        <view class="gauge-chart-data-item-title">订单总金额</view>
        <view class="gauge-chart-data-item-value">
          {{ priceFormat(data.orderMoney)
          }}<text class="unit">{{ unitFormat(data.orderMoney) }}</text></view
        >
      </view>
      <view class="gauge-chart-data-item">
        <view class="gauge-chart-data-item-title">回款总金额</view>
        <view class="gauge-chart-data-item-value">
          {{ priceFormat(data.payMoney)
          }}<text class="unit">{{ unitFormat(data.payMoney) }}</text></view
        >
      </view>
      <!-- <view class="gauge-chart-data-item">
        <view class="gauge-chart-data-item-title">退款金额</view>
        <view class="gauge-chart-data-item-value"
          >{{ priceFormat(data.refundMoney)
          }}<text class="unit">{{ unitFormat(data.refundMoney) }}</text></view
        >
      </view> -->
    </view>
  </view>
</template>

<script>
import uniEcCanvas from "@/components/uni-ec-canvas/uni-ec-canvas.vue";
export default {
  name: "GaugeChart",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    uniEcCanvas,
  },
  data() {
    return {
      ec: {
        option: {
          series: [
            {
              type: "gauge",
              max: 120,
              splitNumber: 12,
              axisLine: {
                lineStyle: {
                  width: 10,
                  color: [
                    [0.16666, "#FD6500"],
                    [0.66666, "#FDC400"],
                    [0.83333, "#199FFF"],
                    [1, "#43D100"],
                  ],
                },
              },
              pointer: {
                itemStyle: {
                  color: "auto",
                },
              },
              axisTick: {
                distance: 0,
                length: 15,
                lineStyle: {
                  color: "auto",
                  width: 1,
                },
              },
              splitLine: {
                distance: 0,
                length: 20,
                lineStyle: {
                  color: "auto",
                  width: 2,
                },
              },
              axisLabel: {
                color: "auto",
                distance: 5,
                fontSize: 14,
              },
              detail: {
                fontSize: 24,
                valueAnimation: true,
                formatter: "{value}",
                color: "auto",
              },
              title: {
                offsetCenter: [0, 85],
                fontSize: 14,
              },
              data: [
                {
                  value: 0,
                  name: "完成率(%)",
                },
              ],
            },
          ],
        },
      },
    };
  },
  watch: {
    "data.completion"(val) {
      this.ec.option.series[0].data[0].value = val;
    },
  },
  methods: {
    unitFormat(val) {
      return val >= 10000 ? "万元" : "元";
    },
    priceFormat(val) {
      if (!val) {
        return `0.00`;
      }
      if (Math.abs(val / 10000) >= 1) {
        return (val / 10000).toFixed(3).slice(0, -1);
      }
      return (+val).toFixed(2);
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.gauge-chart {
  &-canvas {
    width: 100%;
    height: 600rpx;
    display: block;
  }
  &-data {
    .flex-c-b();
    &-item {
      &-title {
        color: #999;
        margin-bottom: 8rpx;
      }
      &-value {
        text-align: center;
        color: @primary;
        font-size: 36rpx;
        .unit {
          font-size: @font-size-xs;
        }
      }
    }
  }
}
</style>