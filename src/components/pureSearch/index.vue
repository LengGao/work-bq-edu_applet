<template>
  <view class="search-bar">
    <van-search
      custom-class="search-bar-input"
      v-if="inputShow"
      :value="searchValue"
      :placeholder="placeholder"
      show-action
      focus
      shape="round"
      clearable
      @search="onSearch"
      @cancel="onCancel"
    />
    <view class="search-bar-content" v-else>
      <view
        class="search-bar-sheet"
        v-if="sheetActions.length"
        @click="openSheet"
        >{{ getButtonName }}
        <van-icon
          color="#333"
          :custom-style="`transition:transform 0.3s;${
            sheetShow ? 'transform:rotate(-90deg)' : 'transform:rotate(90deg)'
          }`"
          name="play"
      /></view>
      <view></view>
      <view class="search-bar-actions">
        <van-icon
          name="search"
          color="#333"
          size="44rpx"
          @click="inputShow = true"
        />
        <van-icon
          v-if="!onlySearch"  
          name="filter-o"
          color="#333"
          size="44rpx"
          custom-style="margin-left: 30rpx"
          @click="handleFilter"
        />
        <view v-else class="search-bar-actions-text">{{searchText}}</view>
      </view>
    </view>
    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="onSheetClose"
      @select="onSheetSelect"
    />
  </view>
</template>

<script>
export default {
  name: "pureSearch",
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    placeholder: {
      type: String,
      default: "请输入搜索关键词",
    },
    sheetActions: {
      type: Array,
      default: () => [],
    },
    searchText: {
        type: String,
        default: ''
    },
    onlySearch: {
        type: Boolean,
        default: false
    }
  },
  data() {
    return {
      sheetShow: false,
      searchValue: "",
      inputShow: false,
      filterShow: false,
    };
  },
  computed: {
    getButtonName() {
      if (!this.sheetActions.length) {
        return "";
      }
      const target = this.sheetActions.filter(
        (item) => item.value == this.value
      );
      if (!target.length) {
        return "";
      }
      return target[0].name || "";
    },
  },
  methods: {
    handleFilter() {
      this.$emit("filter-click");
    },
    onSearch({ detail }) {
      this.searchValue = detail;
      this.$emit("search", detail);
    },
    onCancel() {
      this.inputShow = false;
      this.searchValue = "";
      this.$emit("search", "");
    },
    openSheet() {
      this.sheetShow = true;
    },
    onSheetSelect({ detail }) {
      this.$emit("input", detail.value);
      this.$emit("sheet-change", detail.value);
    },
    onSheetClose() {
      this.sheetShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.search-bar {
  padding: 0 20rpx;
  /deep/&-input {
    padding: 8px 0;
  }
  &-content {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-sheet {
    color: @text-color;
    font-size: @font-size-md;
  }
  .search-bar-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    &-text {
        margin-left: 10rpx;
        color: #333;
        font-size: 28xrpx;
    }
  }
}
</style>