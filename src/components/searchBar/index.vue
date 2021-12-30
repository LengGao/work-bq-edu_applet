<template>
  <view class="search-bar">
    <van-search
      custom-class="search-bar-input"
      v-if="inputShow"
      :value="searchValue"
      placeholder="请输入搜索关键词"
      show-action
      focus
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
          custom-style="margin-right:30rpx"
          color="#333"
          size="44rpx"
          @click="inputShow = true"
        />
        <van-icon
          name="filter-o"
          @click="handleFilter"
          color="#333"
          size="44rpx"
        />
      </view>
    </view>
    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="onSheetClose"
      @select="onSheetSelect"
    />
    <SearchPopup v-model="filterShow" />
  </view>
</template>

<script>
import SearchPopup from "@/components/searchPopup/index.vue";
export default {
  name: "searchBar",
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    sheetActions: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    SearchPopup,
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
      this.filterShow = true;
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
    color: @font-color;
  }
  &-actions {
  }
}
</style>