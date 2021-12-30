<template>
  <view class="select">
    <van-cell :title="title" is-link :value="checkedName" @click="onOpen" />
    <van-popup
      :show="popupShow"
      position="right"
      custom-style="width: 80%;height:100%"
      @close="onClose"
      safe-area-inset-bottom
      z-index="1000"
    >
      <van-search
        :value="searchValue"
        placeholder="请输入搜索关键词"
        shape="round"
        clearable
        @change="onInputChange"
      />
      <view class="select-container">
        <van-checkbox-group v-if="multiple" :value="value" @change="onChange">
          <van-checkbox
            icon-size="28rpx"
            custom-class="box"
            label-class="title"
            :name="item.value"
            v-for="item in list"
            :key="item.value"
            >{{ item.name }}</van-checkbox
          >
        </van-checkbox-group>
        <van-radio-group v-else :value="value" @change="onChange">
          <van-radio
            icon-size="28rpx"
            custom-class="box"
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
        <van-button type="info" @click="onClose" custom-class="btn" round
          >确 定</van-button
        >
      </view>
    </van-popup>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number, Array],
      default: "",
    },
    title: {
      type: String,
      default: "",
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
      popupShow: false,
      searchValue: "",
      list: [],
      cacheValue: "",
    };
  },
  computed: {
    checkedName() {
      if (!this.value) {
        return "";
      }
      if (this.multiple) {
        console.log(this.value);
        return this.options
          .filter((item) => this.value.includes(item.value + ""))
          .map((item) => item.name)
          .join("，");
      }
      return this.options.filter((item) => this.value == item.value)[0].name;
    },
  },
  created() {
    this.setOptions();
  },
  methods: {
    setOptions(val) {
      this.list = this.options.filter((item) => {
        if (val) {
          return item.name.includes(val);
        }
        return true;
      });
    },
    onChange({ detail }) {
      this.$emit("input", detail);
    },
    onInputChange({ detail }) {
      console.log(detail);
      this.setOptions(detail);
    },
    onClose() {
      this.popupShow = false;
    },
    onOpen() {
      if (this.multiple) {
        this.cacheValue = [...this.value];
      } else {
        this.cacheValue = this.value;
      }
      this.popupShow = true;
    },
    onCancel() {
      if (this.multiple) {
        this.$emit("input", [...this.cacheValue]);
      } else {
        this.$emit("input", this.cacheValue);
      }
      this.onClose();
    },
  },
};
</script>

<style lang="less" scoped>
.select {
  &-container {
    height: calc(100% - 54px - 72px);
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
  /deep/.box {
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