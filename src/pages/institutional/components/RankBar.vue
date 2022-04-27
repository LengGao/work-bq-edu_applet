<template>
  <view class="rank-chart">
    <view class="rank-chart-actions">
      <template v-if="dataType === 'salesRank'">
        <van-button
          @click="handleTypeClick('pay_money')"
          :type="value === 'pay_money' ? 'warning' : 'default'"
          size="small"
          round
          custom-style="padding: 4rpx 0; width: 200rpx;"
          >回款金额</van-button>
        <van-button
          @click="handleTypeClick('overdue_money')"
          :type="value === 'overdue_money' ? 'warning' : 'default'"
          round
          size="small"
          custom-style="padding: 4rpx 0; width: 200rpx;"
          >欠缴金额</van-button>
        <van-button
          @click="handleTypeClick('total_money')"
          :type="value === 'total_money' ? 'warning' : 'default'"
          size="small"
          round
          custom-style="padding: 4rpx 0; width: 200rpx;"
          >订单金额</van-button>
        <van-button
          @click="handleTypeClick('refund_money')"
          :type="value === 'refund_money' ? 'warning' : 'default'"
          size="small"
          round
          custom-style="margin-top: 20rpx; padding: 4rpx 0; width: 200rpx;"
          >退款金额</van-button>
      </template>

      <template v-else-if="dataType === 'studentRank'">
        <van-button
          @click="handleTypeClick('user_total')"
          :type="value === 'user_total' ? 'warning' : 'default'"
          size="small"
          round
          custom-style="padding: 4rpx 0; width: 200rpx;"
          >用户总数</van-button>
        <van-button
          @click="handleTypeClick('archives_total')"
          :type="value === 'archives_total' ? 'warning' : 'default'"
          round
          size="small"
          custom-style="padding: 4rpx 0; width: 200rpx;"
          >学生档案数</van-button>
        <van-button
          @click="handleTypeClick('registered_total')"
          :type="value === 'registered_total' ? 'warning' : 'default'"
          size="small"
          round
          custom-style="padding: 4rpx 0; width: 200rpx;"
          >已报名</van-button>
        <van-button
          @click="handleTypeClick('not_registered_total')"
          :type="value === 'not_registered_total' ? 'warning' : 'default'"
          size="small"
          round
          custom-style="margin-top: 20rpx; padding: 4rpx 0; width: 200rpx;"
          >未报名</van-button>
      </template>

      <template v-else>
        <van-button
          @click="handleTypeClick('orderMoney')"
          :type="value === 'orderMoney' ? 'warning' : 'default'"
          size="small"
          round
          custom-style="padding: 4rpx 0; width: 200rpx;"
          >订单金额</van-button>
        <van-button
          @click="handleTypeClick('payMoney')"
          :type="value === 'payMoney' ? 'warning' : 'default'"
          round
          size="small"
          custom-style="padding: 4rpx 0; width: 200rpx;"
          >回款金额</van-button>
        <van-button
          @click="handleTypeClick('entryMoney')"
          :type="value === 'entryMoney' ? 'warning' : 'default'"
          round
          size="small"
          custom-style="padding: 4rpx 0; width: 200rpx;"
          >入账金额</van-button>
      </template>
    </view>
    
    <view class="canvas-box" :style="canvasHeight" >
      <uni-ec-canvas
        canvas-id="rank-chart-canvas"
        :ec="ec"
        ref="echats"
      ></uni-ec-canvas>
    </view>
    <!-- :style="canvasHeight" -->
    <!-- :height="canvasHeight" -->
    <!-- width="100%" -->
    <!-- class="rank-chart-canvas" -->
    <!-- :style="display: block; " -->
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
    buttons: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Number],
      default: 1,
    },
    dataType: {
      type: String,
      default: ''
    },
    seriesName: {
      type: String,
      default: ''
    },
    chartColor: {
      type: String,
      default: '#FF6C59'
    }
  },
  components: {
    uniEcCanvas,
  },
  computed: {
    canvasHeight: function() {
      let len = this.data.length, style = len <= 20  ? 1000 : 50 * len
      return `height: ${style}rpx;`
    },
  },
  data() {
    return {
      ec: {
        option: {
          // 提示框组件
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
            position: ["50%", "20%"],
          },
          // 坐标中网格
          grid: {
            top: '1rpx',
            right: '1rpx',
            bottom: '1rpx',
            left: "left",
            containLabel: true,
          },
          xAxis: {
            type: "value",
            align: 'center',
            boundaryGap: [0, 1],
            axisTick: {
              // 刻度线
              show: false,
              length: 5,
              alignWithLabel: true,
            },
            axisLine: {
              show: false,
            },
          },
          yAxis: {
            type: "category",
            align: 'left',
            data: [],
            axisTick: {
              //刻度线
              show: false,
              alignWithLabel: true,
            },
          },
          series: [
            {
              type: "bar",
              name: this.seriesName,
              color: this.chartColor,
              barWidth: 20,
              data: [],
              label: {
                show: true,
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
      handler(val) {
        setTimeout(() => {
          // console.log("鬼畜", val, this.dataType);
          this.updateChartData();
          this.$refs.echats.init();
        }, 300);
      },
      deep: true,
    },
  },
  methods: {
    handleTypeClick(type ) {
      this.$emit("change", type, this.dataType)
    },
    // 格式化金额数据
    unitFormat(val) {
      if (!val) {
        return `0${this.unit}`;
      }
      if (Math.abs(val / 10000) >= 1) {
        return `${(val / 10000).toFixed(3).slice(0, -1)}万${this.unit}`;
      }
      return `${val}${this.unit}`;
    },
    updateChartData() {
      let data = this.data
      // // 销售龙虎
      let seriesData = data.map(({ num  }) => num).reverse();
      let yAxisData = data.map(({ institution_name }, index) => index + 1 + ". " + institution_name).reverse();
      this.ec.option.series[0].data = seriesData;
      this.ec.option.series[0].name = this.seriesName;
      this.ec.option.yAxis.data = yAxisData;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.rank-chart {
  &-actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>