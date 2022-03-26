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
            <block v-if="optionsLevel === 0">
              <van-cell
                :title="item.type_name"
                is-link
                @click="handleNextLevel({ type_id: item.type_id })"
              />
            </block>
            <block v-else-if="optionsLevel === 1">
              <van-cell
                :title="item.school_name"
                is-link
                @click="
                  handleNextLevel({
                    type_id: item.type_id,
                    school_id: item.school_id,
                  })
                "
              />
            </block>
            <block v-else-if="optionsLevel === 2">
              <van-cell
                :title="item.level_name"
                is-link
                @click="
                  handleNextLevel({
                    type_id: item.type_id,
                    school_id: item.school_id,
                    level_id: item.level_id,
                  })
                "
              />
            </block>
            <block v-else>
              <van-checkbox
                icon-size="28rpx"
                custom-class="checkbox"
                label-class="title"
                :name="JSON.stringify(item)"
                >{{ item.major_name }}</van-checkbox
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
import { getUniversityMajorDetailList } from "@/api/customer";
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
    this.getUniversityMajorDetailList();
  },
  methods: {
    resset() {
      this.checkedValue = [];
      this.prevCheckedValue = [];
    },
    handleBackLevel() {
      this.projectOptions = this.cacheListMap[--this.optionsLevel];
    },
    handleNextLevel(data) {
      this.cacheListMap[this.optionsLevel] = [...this.projectOptions];
      this.getUniversityMajorDetailList(data);
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
        this.checkedValue.map((item) => JSON.parse(item))
      );
      this.prevCheckedValue = [...this.checkedValue];
      return;
    },
    onCancel() {
      this.$emit("close");
      if (this.prevCheckedValue.length) {
        this.checkedValue = [...this.prevCheckedValue];
      }
    },
    // 学历报名的级联选项
    async getUniversityMajorDetailList({
      type_id = 0,
      school_id = 0,
      level_id = 0,
    } = {}) {
      const data = {
        limit: 99,
        status: 1,
        type_id,
        school_id,
        level_id,
      };
      const res = await getUniversityMajorDetailList(data);
      this.projectOptions = res.data.list;
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