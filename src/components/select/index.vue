<template>
  <view class="select">
    <van-popup
      :show="show"
      position="right"
      custom-style="width: 80%;height:100%;overflow: hidden;display: flex;flex-direction: column;"
      @close="onCancel"
      safe-area-inset-bottom
      z-index="1000"
    >
      <van-search
        :value="searchValue"
        placeholder="请输入搜索关键词"
        shape="round"
        clearable
        @change="({ detail }) => filterOptions(detail)"
      />
      <view class="select-checked">
        <van-tag
          plain
          custom-class="tag"
          type="primary"
          v-for="(item, index) in checkedArr"
          closeable
          :key="item.value"
          size="medium"
          @close="handleTagDel(index)"
          >{{ item.name }}</van-tag
        >
      </view>
      <view class="select-container">
        <van-checkbox-group
          v-if="multiple"
          :value="checkedValue"
          @change="onChange"
        >
          <van-checkbox
            icon-size="28rpx"
            custom-class="checkbox"
            label-class="title"
            :name="item.value"
            v-for="item in list"
            :key="item.value"
            >{{ item.name }}</van-checkbox
          >
        </van-checkbox-group>
        <van-radio-group v-else :value="checkedValue" @change="onChange">
          <van-radio
            icon-size="28rpx"
            custom-class="checkbox"
            label-class="title"
            :name="item.value"
            v-for="item in list"
            :key="item.value"
            >{{ item.name }}
          </van-radio>
          <van-divider
            v-if="!list.length"
            custom-style="padding:0 100rpx"
            contentPosition="center"
            >无匹配选项</van-divider
          >
        </van-radio-group>
      </view>
      <view class="select-footer">
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
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchValue: "",
      list: [],
      checkedValue: null,
      prevCheckedValue: null,
      checkedArr: [],
    };
  },
  watch: {
    options() {
      this.filterOptions();
    },
    checkedValue(value) {
      if (this.multiple) {
        this.checkedArr = this.list.filter(
          (item) => value && value.includes(item.value + "")
        );
        return;
      }
      this.checkedArr = this.list.filter((item) => item.value == value);
    },
  },
  methods: {
    handleTagDel(index) {
      if (this.multiple) {
        this.checkedValue.splice(index, 1);
      } else {
        this.checkedValue = "";
      }
    },
    filterOptions(val) {
      this.list = this.options.filter((item) => {
        if (val) {
          return item.name.includes(val);
        }
        return true;
      });
    },
    onChange({ detail }) {
      this.checkedValue = detail;
    },
    handleConfirm() {
      if (this.multiple) {
        this.$emit("confirm", [...this.checkedArr]);
        this.prevCheckedValue = [...this.checkedValue];
        return;
      }

      this.prevCheckedValue = this.checkedValue;
      this.$emit("confirm", this.checkedArr[0]);
    },
    onCancel() {
      this.$emit("close");
      if (this.multiple) {
        this.checkedValue = this.prevCheckedValue
          ? [...this.prevCheckedValue]
          : [];
      } else {
        this.checkedValue = this.prevCheckedValue;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.select {
  &-checked {
    padding: 0 20rpx;
    /deep/.tag {
      margin: 0 16rpx 16rpx 0;
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