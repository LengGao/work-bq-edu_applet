<template>
  <view class="user-info">
    <van-cell
      title="客户姓名"
      title-class="title"
      value-class="value"
      :value="data.surname"
    />
    <van-cell
      title="手机号码"
      title-class="title"
      value-class="value"
      :value="data.mobile"
    />
    <van-cell
      title="身份证号"
      title-class="title"
      value-class="value"
      :value="data.id_card_number"
    />
    <van-cell
      title="性别"
      title-class="title"
      value-class="value"
      :value="gender"
    />
    <van-cell
      title="文化程度"
      title-class="title"
      value-class="value"
      :value="data.culture"
    />
    <van-cell
      title="客户来源"
      title-class="title"
      value-class="value"
      :value="data.sources"
    />
    <van-cell
      title="客户地区"
      title-class="title"
      value-class="value"
      :value="customRage"
    />
    <van-cell
      title="所属老师"
      title-class="title"
      value-class="value"
      :value="data.admin_name"
    />
    <van-cell
      title="客户性质"
      title-class="title"
      value-class="value"
      :value="data.customer_type"
    />
    <van-cell
      title="机构名称"
      title-class="title"
      value-class="value"
      :value="data.from_organization_name"
    />
    <van-cell
      title="备注信息"
      title-class="title"
      value-class="value"
      :value="data.tips"
    />
    <view v-if="showFooter" class="footer">
        <button class="cancel-btn" @click="handleCancel">取消</button>
        <button class="confrom-btn" @click="saveUserInfo">保存</button>
    </view>
    <button v-else class="user-info-edit" @click="handleEdit">编辑</button>
  </view>
</template>

<script>
import { postNodify } from "@/api/customer";
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showFooter: false,
      enableEdit: false
    }
  },
  computed: {
    customRage: {
      get() {
        return `${this.province || ''} ${this.city || ''}`
      }
    },
    gender: {
      get() {
        return this.sex == 0 ? '女' : '男'
      }
    }
  },
  methods: {
    handleEdit() {
      this.showFooter = true
      this.enableEdit = true
    },
    handleCancel() {
      this.showFooter = false
      this.enableEdit = false
    },
    saveUserInfo() {
      let data = this.data
      postNodify(data).then(res => {
        Notify({ type: 'success', message: '修改成功' })
      }).catch(e => {
        Notify({ type: 'error', message: '修改失败' })
      })
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.user-info {
  border-top: 20rpx solid #f2f6fc;
  padding-bottom: 200rpx;
  /deep/.title {
    flex: inherit;
    flex-shrink: 0;
    color: #969799;
    font-size: @font-size-sm;
  }
  /deep/.value {
    color: @text-color;
    font-size: @font-size-sm;
  }
}

.user-info-edit {
  float: right;
  width: 122rpx;
  margin: 20rpx 40rpx 0 0;
  font-size: @font-size-sm;
  color: @text-color;
  background-color: rgba(242, 246, 252, 1);
}

.footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 120rpx;
    button {
        width: 320rpx;
        height: 88rpx;
        border-radius: 5rpx;
        font-size: @font-size-lg;
    }
    .cancel-btn {
        color: @text-color-grey;
        background-color: rgba(242, 246, 252, 1);
    }
    .confrom-btn {
        color: #FFFFFF;
        background-color: @primary;
    }
}
</style>