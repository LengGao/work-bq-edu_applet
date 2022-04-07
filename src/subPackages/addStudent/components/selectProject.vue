<template>
  <view class="select-project">
    <van-popup
      :show="show"
      position="right"
      custom-style="width: 80%;height:100%;overflow: hidden;display: flex;flex-direction: column;"
      @close="onCancel"
      safe-area-inset-bottom
      z-index="1000"
    >
      <view class="select-project-header">
        <view>已选项目数：{{ checkedCount }}</view>
        <view class="back-level" v-if="optionsLevel" @click="handleBackLevel">
          返回上一级</view
        >
      </view>
      <view class="select-project-container">
        <block v-for="item in projectOptions" :key="item.value">
          <block v-if="item.label">
            <van-cell-group>
              <van-cell
                :title="item.label"
                is-link
                @click="handleNextLevel(item)"
              />
            </van-cell-group>
          </block>
          <block v-else>
            <van-checkbox-group
              :max="1"
              :value="checkedValue[item.id] || []"
              @change="({ detail }) => onChange(detail, item.id)"
            >
              <van-checkbox
                icon-size="28rpx"
                custom-class="checkbox"
                label-class="title"
                :name="`${JSON.stringify(item)}`"
                >{{ item.class_type_name }} ￥{{
                  item.class_type_price
                }}</van-checkbox
              >
            </van-checkbox-group>
          </block>
        </block>
      </view>
      <view class="select-project-footer">
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
import { getCateProjectOption } from "@/api/customer";
import { getInstitutionClassType } from "@/api/order";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    from_organization_id: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      projectOptions: [],
      checkedValue: {},
      prevCheckedValue: {},
      optionsLevel: 0,
      cacheListMap: {},
    };
  },
  created() {
    this.getCateProjectOption();
  },
  computed: {
    checkedCount() {
      let count = 0;
      for (const i in this.checkedValue) {
        count += this.checkedValue[i].length;
      }
      return count;
    },
  },
  methods: {
    resset() {
      this.checkedValue = {};
      this.prevCheckedValue = {};
      this.optionsLevel = 0;
      this.cacheListMap = {};
      this.getCateProjectOption();
    },
    handleBackLevel() {
      this.projectOptions = this.cacheListMap[--this.optionsLevel];
    },
    handleNextLevel(row) {
      this.cacheListMap[this.optionsLevel] = [...this.projectOptions];
      if (row.children) {
        this.projectOptions = [...row.children];
        this.optionsLevel++;
      } else {
        this.getInstitutionClassType(row.value);
      }
    },
    onChange(detail, id) {
      if (this.checkedValue[id]) {
        this.checkedValue[id] = detail;
      } else {
        this.$set(this.checkedValue, id, detail);
      }
      // console.log(this.checkedValue);s
    },
    handleConfirm() {
      if (!this.checkedCount) {
        uni.showToast({
          icon: "none",
          title: "请选择",
        });
        return;
      }
      let result = [];
      for (const i in this.checkedValue) {
        this.checkedValue[i].forEach((item) => {
          result.push(JSON.parse(item));
        });
      }
      this.$emit("confirm", result);
      this.prevCheckedValue = { ...this.checkedValue };
      return;
    },
    onCancel() {
      this.$emit("close");
      if (this.prevCheckedValue) {
        this.checkedValue = { ...this.prevCheckedValue };
      }
    },
    // 获取项目选项
    async getCateProjectOption() {
      const data = {
        no_edu: 1,
        level: 1,
      };
      const res = await getCateProjectOption(data);
      if (res.code === 0) {
        this.projectOptions = res.data || [];
      }
    },
    // 获取班型
    async getInstitutionClassType(project_id) {
      const data = {
        from_organization_id: this.from_organization_id,
        project_id,
      };
      const res = await getInstitutionClassType(data);
      if (res.code === 0) {
        const { org_class_type = "[]", ...rest } = res.data[0] || {};
        let classType = JSON.parse(org_class_type || "[]");
        let arr = classType;
        if (!Array.isArray(classType)) {
          arr = [];
          for (const k in classType) {
            arr.push(classType[k]);
          }
        }
        this.projectOptions = arr.map((item) => {
          return {
            class_type_id: item.id,
            class_type_price: item.price,
            class_type_name: item.title,
            ...rest,
          };
        });
        this.optionsLevel++;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.select-project {
  &-checked {
    padding: 20rpx 20rpx 0;
    /deep/.tag {
      margin: 0 16rpx 16rpx 0;
    }
  }
  &-header {
    padding: 20rpx;
    .flex-c-b();
    color: @primary;
    .back-level {
      color: @text-color-grey;
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