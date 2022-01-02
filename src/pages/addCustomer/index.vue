<template>
  <view class="add-curtomer">
    <van-cell-group>
      <van-field
        required
        :value="formData.name"
        input-align="right"
        label="客户姓名"
        @input="({ detail }) => (formData.name = detail)"
        placeholder="请输入客户姓名"
      />
      <van-field
        :value="formData.mobile"
        required
        type="number"
        label="手机号码"
        placeholder="请输入手机号码"
        @input="({ detail }) => (formData.mobile = detail)"
        input-align="right"
      />
      <van-cell title="客户性别">
        <template #right-icon>
          <van-radio-group
            :value="formData.sex"
            direction="horizontal"
            @change="({ detail }) => (formData.sex = detail)"
          >
            <van-radio name="1">男</van-radio>
            <van-radio name="2">女</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-cell
        required
        title="客户来源"
        title-width="200rpx"
        is-link
        :value="formData.from || '请选择'"
        @click="openSheet('fromOptions')"
      />
      <van-cell
        title="客户地区"
        is-link
        title-width="200rpx"
        :value="area || '请选择'"
        @click="popupShow = true"
      />
      <van-cell
        title="文化程度"
        is-link
        :value="formData.education || '请选择'"
        @click="openSheet('eduOptions')"
      />
      <van-cell title="客户标签" use-label-slot>
        <template #label>
          <view class="tags-container">
            <view class="tag" v-for="(item, index) in tags" :key="index">{{
              item
            }}</view>
            <view class="tag tag-add" @click="tagDialogShow = true"
              >+新建标签</view
            >
          </view>
        </template>
      </van-cell>
      <van-field
        :value="from.tips"
        label="备注"
        type="textarea"
        placeholder="请输入备注"
        autosize
        @input="({ detail }) => (formData.tips = detail)"
        input-align="right"
        :border="false"
      />
    </van-cell-group>

    <view class="add-curtomer-submit">
      <van-button
        type="primary"
        custom-class="b-l"
        plain
        round
        @click="handleSave(1)"
        >保存</van-button
      >
      <van-button type="primary" custom-class="b-r" round @click="handleSave(2)"
        >保存并报名</van-button
      >
    </view>
    <van-popup :show="popupShow" position="bottom" @close="popupShow = false">
      <van-area
        :area-list="areaList"
        @cancel="popupShow = false"
        @confirm="handleAreaConfirm"
      />
    </van-popup>
    <van-action-sheet
      :show="sheetShow"
      :actions="sheetActions"
      @close="sheetShow = false"
      @select="onSheetSelect"
    />
    <van-dialog
      use-slot
      title="添加标签"
      :show="tagDialogShow"
      show-cancel-button
      @close="tagDialogShow = false"
      @confirm="handleAddTag"
    >
      <van-field
        :focus="tagDialogShow"
        :value="tagName"
        @input="({ detail }) => (tagName = detail)"
        placeholder="请输入标签名"
      />
    </van-dialog>
  </view>
</template>

<script>
import { getCustomfieldOptions, createCrmCustomer } from "@/api/customer";
import { areaList } from "@vant/area-data";
export default {
  data() {
    return {
      areaList,
      area: "",
      formData: {
        name: "",
        mobile: "",
        sex: "1",
        from: "",
        education: "",
        province: "",
        city: "",
        district: "",
        tips: "",
      },
      // 选择客户来源、学历
      sheetShow: false,
      fromOptions: [],
      sheetActions: [],
      sheetChecked: "",
      eduOptions: [
        {
          name: "初中及以下",
        },
        {
          name: "中专/中技",
        },
        {
          name: "高中",
        },
        {
          name: "高中",
        },
        {
          name: "大专",
        },
        {
          name: "本科",
        },
        {
          name: "研究生及以上",
        },
      ],
      // 省市区弹窗
      popupShow: false,
      // 添加标签
      tagDialogShow: false,
      tagName: "",
      tags: [],
    };
  },
  onLoad() {
    this.getCustomfieldOptions();
  },
  methods: {
    // 保存
    handleSave(type) {
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!this.formData.name) {
        uni.showToast({
          icon: "none",
          title: "客户姓名不能为空",
        });
        return;
      }

      if (!phoneReg.test(this.formData.mobile)) {
        uni.showToast({
          icon: "none",
          title: "请输入正确的手机号",
        });
        return;
      }
      if (!this.formData.from) {
        uni.showToast({
          icon: "none",
          title: "客户来源不能为空",
        });
        return;
      }
      this.createCrmCustomer(type);
    },
    // 添加标签
    handleAddTag() {
      if (this.tagName) {
        this.tags.push(this.tagName);
        this.tagName = "";
      } else {
        uni.showToast({
          icon: "none",
          title: "请输入",
        });
      }
    },
    // 选择省市区
    handleAreaConfirm({ detail }) {
      const { values } = detail;
      this.formData.province = values[0].code;
      this.formData.city = values[1].code;
      this.formData.district = values[2].code;
      this.area = `${values[0].name}-${values[1].name}-${values[2].name}`;
      this.popupShow = false;
    },
    // 选择客户来源、学历
    openSheet(key) {
      this.sheetChecked = key;
      this.sheetActions = this[key];
      this.sheetShow = true;
    },
    onSheetSelect({ detail }) {
      if (this.sheetChecked === "fromOptions") {
        this.formData.from = detail.name;
        return;
      }
      if (this.sheetChecked === "eduOptions") {
        this.formData.education = detail.name;
        return;
      }
    },
    // 添加客户
    async createCrmCustomer(type) {
      const data = {
        ...this.formData,
        tags: this.tags.length ? this.tags.join(",") : "",
      };
      this.addLoading = true;
      const res = await createCrmCustomer(data).catch(() => {
        this.addLoading = false;
      });
      if (res.code === 0) {
        //   if (type === 1) {
        setTimeout(() => {
          this.addLoading = false;
          uni.navigateBack();
        }, 800);
        //   }
      }
    },
    // 获取客户来源
    async getCustomfieldOptions() {
      const data = {
        field_name: "customer_source",
      };
      const res = await getCustomfieldOptions(data);
      if (res.code === 0) {
        this.fromOptions = res.data.field_content.map((item) => ({
          name: item,
        }));
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.add-curtomer {
  .tags-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .tag {
      padding: 12rpx 0;
      min-width: 150rpx;
      text-align: center;
      margin-right: 20rpx;
      margin-bottom: 16rpx;
      border-radius: 30rpx;
      background-color: #f7f8fa;
      color: @font-color;
      &.active {
        background-color: #ecf5ff;
        color: @primary;
      }
      &-add {
        border: 2rpx dashed #ddd;
        background-color: #fff;
      }
    }
  }
  &-submit {
    position: absolute;
    bottom: 100rpx;
    width: 100%;
    left: 0;
    text-align: center;
    /deep/.van-button {
      width: 40%;
    }
    /deep/.b-l {
      margin-right: 30rpx;
    }
  }
}
</style>