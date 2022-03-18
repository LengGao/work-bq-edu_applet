<template>
  <view class="search-bar">
    <template v-if="!inputShow">
      <view class="search-bar-content" :style="'width:' + searchWidth + ';'">
        <view class="search-bar-title"><slot name="title"></slot> </view>
        <view class="search-bar-actions">
          <van-icon
            name="search"
            size="44rpx"
            color="#333"
            @click="handleShowSearch"
          />
        </view>
      </view>
    </template>

    <template v-else>
      <van-search
        custom-class="search-bar-search"
        focus
        clearable
        shape="round"
        show-action
        :placeholder="placeholder"
        :value="searchValue"
        @search="onSearch"
        @cancel="onCancel"
      />
    </template>
  </view>
</template>

<script>
export default {
  name: "searchBar",
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    placeholder: {
      type: String,
      default: "请输入搜索关键词",
    },
    searchWidth: {
      type: String,
      default: "750rpx",
    },
  },
  data() {
    return {
      searchValue: "",
      inputShow: false,
    };
  },
  methods: {
    handleShowSearch() {
      this.inputShow = true;
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
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";

.search-bar {
  &-title {
    max-width: 700rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &-actions {
    margin-right: 40rpx;
  }

  /deep/.search-bar-search {
    width: 700rpx;
    padding: 8;
  }
}
</style>