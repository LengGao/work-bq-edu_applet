<template>
  <view class="add-curtomer">
    <view class="hr"></view>    
    <van-cell-group custom-class="group-cell">
      <van-cell
        required
        title="客户姓名"
        input-align="right"
        label-class="label"
        input-class="input"
        title-width="200rpx"
        :value="data.surname"
      />
      <van-cell
        required
        title="手机号码"
        input-align="right"
        label-class="label"
        input-class="input"
        title-width="200rpx"
        :value="data.mobile | phoneFormat"
      >
        <template #right-icon>
          <van-icon
            custom-style="margin-left: 20rpx;"
            name="phone-o" 
            size="38rpx"
            color="#199fff" 
            @click="onPhoneCall(data.mobile)"
          />
        </template>
      </van-cell>
      <van-cell
        required
        is-link
        title="订单来源"
        title-width="200rpx"
        :value="data.source || '请选择'"
        @click="handlerOpenSheet('fromOptions')"
      />
      <van-cell
        is-link
        title="共享业绩"
        title-width="200rpx"
        :value="data.staff_name || '请选择'"
        @click="handlerOpenSelect('staff')"
      />
      <van-cell title="开通网课" title-class="label" required>
        <template #right-icon>
          <van-radio-group
            direction="horizontal"
            :value="data.online_course" 
            @change="({ detail }) => handlerFormInput(detail, 'online_course')"
          >
            <van-radio :name="1">是</van-radio>
            <van-radio :name="0">否</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
    </van-cell-group>

    <view class="hr"></view>
    <van-cell-group custom-class="group-cell">
      <van-cell title="报名类型" title-class="label" value-class="input">
        <text v-if="data.type == 0">职业教育</text>
        <text v-else>学历教育</text>
      </van-cell>
      
      <template v-if="data.type == 0">
        <van-cell
          is-link
          required
          title="报名项目"
          title-class="label"
          value-class="input"
          title-width="200rpx"
          :value="checkedProjectName || '请选择'"
          @click="handlerOpenSelect('occProject')"
        />
        <van-cell
          is-link
          title="届别名称"
          title-width="200rpx"
          :value="data.jiebie_name || '请选择'"
          @click="handlerOpenSheet('gradeOptions')"
        />

        <view v-for="(item, index) in projectData" :key="item.id">
          <van-cell
            required
            title="项目价格"
            title-class="label"
            value-class="input"
            title-width="200rpx"
            :value="item.price"
          />

          <van-field
            required
            type="number"
            input-class="input"
            input-align="right"
            label-class="label"
            title-width="400rpx"
            placeholder="请输入实收金额"
            confirm-type=“确定”
            :value="item.must_money"
            :label="`${item.project_name}-实收金额`"            
            @blur="({ detail }) => 
              detail.value !== item.must_money && 
              handlerFormInput(detail.value, 'projectData', index, item)
            "
          />
        </view>
      </template>

      <template v-else>
        <van-cell
          is-link
          required
          title="报名专业"
          title-class="label"
          value-class="input"
          title-width="200rpx"
          :value="checkedProjectName || '请选择'"
          @click="handlerOpenSelect('eduProject')"
        />
        <van-cell
          is-link
          title="届别名称"
          title-width="200rpx"
          :value="data.jiebie_name || '请选择'"
          @click="handlerOpenSheet('gradeOptions')"
        />

        <view v-for="(item, index) in projectData" :key="item.id">
          <van-cell
            required
            title="总学费"
            title-width="200rpx"
            title-class="label"
            value-class="input"
            :value="item.price"
          />

          <van-field
            required
            type="number"
            label-class="label"
            input-class="input"
            placeholder="请输入实收金额"
            input-align="right"
            title-width="400rpx"
            confirm-type=“确定”
            :value="item.must_money"
            :label="`${item.major_name || item.major.value  }-实收金额`"
            @blur="({ detail }) => 
              detail.value !== item.must_money && 
              handlerFormInput(detail.value, 'projectData', index, item)
            "
          />
        </view>
      </template>

      <van-field
        autosize
        :border="false"
        input-align="right"
        label="备注信息"
        type="textarea"
        label-class="label"
        input-class="input"
        :value="data.tips"
        placeholder="请输入备注"
        @blur="
          ({ detail }) =>
            detail.value !== data.tips &&
            handlerFormInput(detail.value, 'tips')
        "
      >
      </van-field>
    </van-cell-group>
  </view>
</template>

<script>
import Title from "@/components/title/index";

export default {
  components: {
    Title,
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
    projectData: {
      type: Array,
      default: []
    },
    staffData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  // 当前报名职称项目/院校专业
  computed: {
    'staffName': function() {
      return this.staffData.map(staff => staff.staff_name).join(',')
    },
    'checkedProjectName': function() {
      return this.projectData.map(pro => ((pro.major && pro.major.value) || pro.major_name || pro.project_name || '' )).join(',')
    }
  },
  watch: {
    'projectData': function (newVal) {
        // console.log('projectData', newVal);
    }
  },
  methods: {
    // 动态输入
    handlerFormInput(detail, key, indes) {
      // console.log("handlerFormInput", detail, key, indes);
      let val = Object.create(null)
      if (key === 'projectData') {
        val.must_money = detail
        this.$emit('dynamic-input', key, val ,indes)
      } else {
        val[key] = detail
        this.$emit('dynamic-input', 'formData', val ,indes)
      }
    },
    // 打开选择器
    handlerOpenSelect(detail) {
      this.$emit('open-select', detail)
    },
    // 打开活动面板
    handlerOpenSheet(detail) {
      this.$emit('open-sheet', detail)
    },
    // 拨号
    onPhoneCall(phoneNumber) {
      uni.makePhoneCall({ phoneNumber})
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";

.add-curtomer {
  width: 100%;
  overflow: hidden;

  /deep/.title {
    font-size: @font-size-md;
  }

  /deep/.value {
    font-size: @font-size-md;
  }

  /deep/.label {
    font-size: @font-size-md;
  }

  /deep/.input {
    font-size: @font-size-md;
  }
}

.hr {
  width: 100%;;
  height: 30rpx;
  background-color: @background-color;
}
</style>