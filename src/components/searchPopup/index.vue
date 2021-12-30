<template>
  <van-popup
    :show="value"
    position="right"
    custom-style="width: 80%;height:100%"
    @close="onClose"
  >
    <view class="popup">
      <view class="popup-container">
        <Select v-model="selectValue" :options="options" title="客户来源" />
        <Select
          v-model="selectValue2"
          :options="options"
          multiple
          title="所属老师"
        />
        <DatePicker v-model="date" title="创建时间" />
        <DatePicker v-model="date" title="创建时间" type="range" />
        <Tags v-model="tagValue" title="客户属性" :tags="tags" />
        <Tags v-model="tagValue2" title="客户属性2" multiple :tags="tags" />
      </view>
      <view class="popup-footer">
        <van-button @click="onReset" custom-class="btn" round>重 置</van-button>
        <van-button type="info" @click="onOk" custom-class="btn" round
          >确 定</van-button
        >
      </view>
    </view>
  </van-popup>
</template>

<script>
import Select from "../select/index.vue";
import Tags from "../tags/index.vue";
import DatePicker from "../datePicker/index.vue";
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Select,
    Tags,
    DatePicker,
  },
  data() {
    return {
      date: "",
      selectValue: "",
      selectValue2: [],
      tagValue: "",
      tagValue2: [],
      tags: [
        {
          name: "节简介",
          value: 1,
        },
        {
          name: "哈哈哈",
          value: 2,
        },
        {
          name: "哈哈哈",
          value: 3,
        },
      ],

      options: [
        {
          name: "节简介",
          value: 1,
        },
        {
          name: "哈哈哈",
          value: 2,
        },
        {
          name: "哈哈哈",
          value: 3,
        },
        {
          name: "哈哈哈",
          value: 4,
        },
      ],
    };
  },
  methods: {
    onReset() {},
    onOk() {},
    onClose() {
      this.$emit("input", false);
    },
  },
};
</script>

<style lang="less" scoped>
.popup {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  &-container {
    flex: 1;
    flex-shrink: 0;
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
}
</style>