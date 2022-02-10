<template>
  <view class="select-project">
    <van-popup
      :show="show"
      position="right"
      custom-style="width: 80%;height:100%;overflow: hidden;display: flex;flex-direction: column;"
      @close="onCancel"
      safe-area-inset-bottom
      z-index="1000"
    >
      <view class="select-project-header">
        <view>已选项目数：{{ checkedValue.length }}</view>
        <view class="back-level" v-if="optionsLevel" @click="handleBackLevel">
          返回上一级</view
        >
      </view>
      <view class="select-project-container">
        <van-checkbox-group :value="checkedValue" @change="onChange">
          <block v-for="item in projectOptions" :key="item.value">
            <block v-if="item.children.length">
              <van-cell
                :title="item.label"
                is-link
                @click="handleNextLevel(item.children)"
              />
            </block>
            <block v-else>
              <van-checkbox
                icon-size="28rpx"
                custom-class="checkbox"
                label-class="title"
                :name="`${item.label},${item.value}`"
                >{{ item.label }}</van-checkbox
              >
            </block>
          </block>
        </van-checkbox-group>
      </view>
      <view class="select-project-footer">
        <van-button @click="onCancel" custom-class="btn" round
          >取 消</van-button
        >
        <van-button type="info" @click="handleConfirm" custom-class="btn" round
          >确 定</van-button
        >
      </view>
    </van-popup>
  </view>
</template>

<script>
import { getCateProjectOption } from "@/api/customer";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: [String, Number],
      default: 1,
    },
  },
  data() {
    return {
      projectOptions: [],
      checkedValue: [],
      prevCheckedValue: [],
      optionsLevel: 0,
      cacheListMap: {},
    };
  },
  created() {
    this.getCateProjectOption();
  },
  methods: {
    resset() {
      this.checkedValue = [];
      this.prevCheckedValue = [];
    },
    handleBackLevel() {
      this.projectOptions = this.cacheListMap[--this.optionsLevel];
    },
    handleNextLevel(projectOptions) {
      this.cacheListMap[this.optionsLevel] = [...this.projectOptions];
      this.projectOptions = [...projectOptions];
      this.optionsLevel++;
    },
    handleTagDel(index) {
      this.checkedValue.splice(index, 1);
    },
    onChange({ detail }) {
      this.checkedValue = detail;
    },
    handleConfirm() {
      if (!this.checkedValue.length) {
        uni.showToast({
          icon: "none",
          title: "请选择",
        });
        return;
      }
      this.$emit(
        "confirm",
        this.checkedValue.map((item) => {
          const arr = item.split(",");
          return {
            name: arr[0],
            value: arr[1],
          };
        })
      );
      this.prevCheckedValue = [...this.checkedValue];
      return;
    },
    onCancel() {
      this.$emit("close");
      if (this.prevCheckedValue) {
        this.checkedValue = [...this.prevCheckedValue];
      }
    },
    // 获取项目选项
    async getCateProjectOption() {
      const data = {
        no_edu: 1,
      };
      const res = await getCateProjectOption(data);
      if (res.code === 0) {
        this.projectOptions = res.data || [];
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.select-project {
  &-checked {
    padding: 20rpx 20rpx 0;
    /deep/.tag {
      margin: 0 16rpx 16rpx 0;
    }
  }
  &-header {
    padding: 20rpx;
    .flex-c-b();
    color: @primary;
    .back-level {
      color: @text-color-grey;
    }
  }
  &-container {
    flex: 1;
    overflow-y: auto;
  }
  &-footer {
    padding: 12px 12px 20px 12px;
    text-align: center;
    /deep/.btn {
      padding: 0 60rpx;
      margin-left: 10px;
      height: 40px;
    }
  }
  /deep/.checkbox {
    margin: 0 20rpx;
    border-bottom: 1px solid #efefef;
    &:active {
      background-color: #f2f6fc;
    }
    .title {
      width: 100%;
      padding: 32rpx 20rpx;
    }
  }
}
</style>