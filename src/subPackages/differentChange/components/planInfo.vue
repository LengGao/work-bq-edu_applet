<template>
  <view class="sign-submit" style="z-index: 999;">
    <view class="hr"></view>
    <Title customStyle="padding: 20rpx;" title="订单小结"></Title>
    <van-cell-group custom-class="group-cell">
      <van-cell 
        title="学费金额"
        title-class=“label“
        value-class="input"
        :value="totalMoney"
      />
      <van-cell 
        title="其他金额 "
        title-class=“label“
        value-class="input"
        :value="otherMoney"
      />
      <van-cell 
        title="订单总额"
        title-class=“label“
        value-class="input"
        :value="orderMoney"
      />
    </van-cell-group>

    <view class="hr" style="height: 40rpx;"></view>
    <Title customStyle="padding: 20rpx;" title="回款记录"></Title>
    <van-cell-group custom-class="group-cell" v-for="(item, index) in data" :key="item.id">
      <van-cell
        is-link
        required
        title="回款日期"
        title-class="label"
        value-class="input"
        :value="item.pay_date || '请选择'"
        @click="() => handlerOpenPicker('date', index, item)"
      />

      <van-cell
        is-link
        required
        title="回款计划"
        title-class="label"
        title-width="140rpx"
        value-class="input"
        :value="item.pay_plan_name || '请选择'"
        @click="handlerOpenSelect('plan', index, item)"
      />

      <van-field
        required
        type="number"
        label="回款金额"
        label-class="label"
        input-class="input"
        :value="item.pay_money"
        placeholder="请输入回款金额"
        input-align="right"
        @blur="({ detail }) => 
          detail.value !== item.pay_money && 
          handlerFormInput('planRecond', detail.value, index, item)
        "
      />

      <van-cell
        is-link
        required
        title="支付方式"
        title-class="label"
        value-class="input"
        title-width="200rpx"
        :value="item.pay_type || '请选择'"
        @click="handlerOpenSheet('payTypeOptions', index, item)"
      />

      <van-cell title="回款凭证" title-width="160rpx" :border="false">
        <van-uploader
          deletable
          :file-list="item.receipt_file"
          @after-read="({ detail }) => handleAfterRead(detail, index)"
          @delete="({ detail }) => handleDeleteFile(detail, index)"
        />
      </van-cell>
      <view class="hr" style="height: 4rpx;"></view>
    </van-cell-group>
  </view>
</template>

<script>
import Title from "@/components/title/index";
import { uploadImage } from "@/api/customer";

export default {
  components: {
    Title,
  },
  props: {
    logs: {
      type: Array,
      default: []
    },
    paylist: {
      type: Array,
      default: []
    },
    orderMoney: {
      type: [String, Number],
      default: '0.00'
    },
    totalMoney: {
      type: [String, Number],
      default: '0.00'
    },
    otherMoney: {
      type: [String, Number],
      default: '0.00'   
    }
  },
  data() {
    return {
      data: [],
    };
  },
  watch: {
    'logs': function (newVal) {
      this.data = newVal
    }
  },
  mounted() {
    this.data = this.logs
  },
  methods: {
    // 实收金额输入
    handlerFormInput(detail, key, index, item) {
      this.$emit('dynamic-input', key, { pay_money: detail }, index, item)
    },
    // 打开选择器
    handlerOpenSelect(key, index, item) {
      this.$emit('open-select', key, index, item)
    },
    // 活动面板
    handlerOpenSheet(key, index, item) {
      this.$emit('open-sheet', key, index, item )
    },
    // 回款日期选择
    handlerOpenPicker(detail, index, item) {
      this.$emit('open-picker', detail, 'log', index, item)
    },
    // 删除上传
    handleDeleteFile(detail, index) {
      let _data = this.data[index].receipt_file
      _data.splice(detail.index, 1)
      this.data[index].receipt_file = _data
      this.$emit('dynamic-input', 'planRecond', { receipt_file: _data }, index)
    },
    // 上传凭证
    async handleAfterRead(detail, index) {
      const { file } = detail;
      const { url } = await uploadImage(file);
      let _data = this.data[index].receipt_file
      _data.push({ url, isImage: true });
      this.data[index].receipt_file = _data
      this.$emit('dynamic-input', 'planRecond', { receipt_file: _data }, index)
    },
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/var";
.sign-submit {
  width: 100%;
  overflow: hidden;
}

/depp/.label {
  font-size: @font-size-md;
}

/deep/.input {
  font-size: @font-size-md;
}

.hr {
  width: 100%;;
  height: 30rpx;
  background-color: @background-color;
}
</style>