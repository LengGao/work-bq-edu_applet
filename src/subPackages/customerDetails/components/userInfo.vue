<template>
  <view class="user-info">
    <van-cell-group>
      <van-field
        title-class="title"
        value-class="value"
        :value="userInfo.surname"
        input-align="right"
        label="客户姓名"
        right-icon="edit"
        @blur="
          ({ detail }) =>
            detail.value !== userInfo.surname &&
            $emit('input-blur', { surname: detail.value })
        "
      />
      <van-cell
        title-class="title"
        title="手机号码"
        title-width="200rpx"
        :value="userInfo.mobile | phoneFormat"
      />
      <van-cell
        title-class="title"
        title="身份证号"
        title-width="200rpx"
        :value="userInfo.id_card_number | idCardFormat"
      />
      <van-cell
        title="客户性别"
        title-class="title"
        is-link
        :value="sexMap[userInfo.sex] || '--'"
        @click="$emit('open-sheet', 'sexOptions')"
      >
      </van-cell>
      <van-cell
        title-class="title"
        title="客户来源"
        title-width="200rpx"
        is-link
        :value="userInfo.sources || '--'"
        @click="$emit('open-sheet', 'fromOptions')"
      />
      <van-cell
        title="客户地区"
        title-class="title"
        is-link
        title-width="200rpx"
        :value="
          userInfo.province
            ? `${areaList.province_list[userInfo.province]}- ${
                areaList.city_list[userInfo.city]
              }`
            : '--'
        "
        @click="$emit('open-popup')"
      />
      <van-cell
        title="文化程度"
        title-class="title"
        is-link
        :value="userInfo.culture || '--'"
        @click="$emit('open-sheet', 'eduOptions')"
      />
      <van-cell
        title-class="title"
        title="所属老师"
        is-link
        :value="userInfo.admin_name || '--'"
        @click="$emit('open-select', 'staff')"
      />
      <van-cell
        title-class="title"
        title="机构名称"
        is-link
        :value="userInfo.from_organization_name || '--'"
        @click="$emit('open-select', 'org')"
      />
      <van-cell
        title-class="title"
        title="客户性质"
        title-width="200rpx"
        :value="userInfo.customer_type || '--'"
      />
      <van-field
        right-icon="edit"
        title-class="title"
        value-class="value"
        :value="userInfo.tips"
        input-align="right"
        label="备注信息"
        autosize
        type="textarea"
        @blur="
          ({ detail }) =>
            detail.value !== userInfo.tips &&
            $emit('input-blur', { tips: detail.value })
        "
      />
    </van-cell-group>
  </view>
</template>

<script>
import { areaList } from "@vant/area-data";
export default {
  props: {
    userInfo: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      areaList,
      sexMap: {
        1: "男",
        2: "女",
      },
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
@lable-color: #969799;
.user-info {
  border-top: 20rpx solid #f2f6fc;
  --cell-value-color: @text-color;
  --field-label-color: @lable-color;
  /deep/.title {
    color: @lable-color;
  }
}
</style>