<template>
  <view class="payment-plan">
    <view class="hr"></view>
    <view class="payment-check"> 
      <view class="header">
        <Title title="回款计划" customStyle="padding-left: 10rpx;" ></Title>
      </view>
      <van-checkbox-group :value="currentCheckeds" @change="handleChecked">
        <view class="check-group">
          <van-checkbox 
            v-for="(item, index) in expenseType" 
            :key="index" 
            shape="square" 
            :name="index" 
            class="van-checkbox"
          >
            {{ item }}
          </van-checkbox>
        </view>
      </van-checkbox-group>
    </view>

    <view class="hr"></view>

    <view class="pay-list">
      <view class="list-item" v-for="(item, index) in payList" :key="item.id">
        <view class="list-item-header">
          <view class="header-title">
              <Title :title="item.name" customStyle="padding-left: 10rpx;"></Title>
          </view>
          <view class="header-btns">
            <van-button plain icon="newspaper-o" size="small" custom-class="header-btn" @click="handleCopy(item.type, index)">
              复制
            </van-button>
            <van-button plain size="small" icon="delete-o" custom-class="header-btn" @click="handleDelete(item, index)">
              删除
            </van-button>
          </view>
        </view>

        <view class="list-item-slot">
          <van-cell
            required
            title="所属年份"
            title-class="label-class"
            value-class="input-class"
            :value="item.year || '请选择年份'"
            @click="() => openPicker('year', index, item)"
          />
          <van-cell
            required
            title="计划回款日期"
            title-class="label-class"
            value-class="input-class"
            :value="item.day || '请选择回款日期'"
            @click="() => openPicker('date', index, item)"
          />
          <van-field
            required
            type="number"
            label="计划回款金额"
            input-align="right"
            placeholder="请输入回款金额"
            label-class="label-class"
            input-class="input-class"
            :value="item.money"
            @blur="({ detail }) => 
              detail.value !== item.money && 
              handleInputMoney(detail, item, index)
            "
          />
        </view>  

      </view>
    </view>

    <view style="display: block; height: 320rpx;"></view>
    <view class="footer">
      <view class="footer-submit">
        <van-button custom-style="width: 300rpx;" round @click="toPrev">取消</van-button>
        <van-button custom-style="width: 300rpx;" round type="primary" @click="toNext">确定</van-button>
      </view>
    </view>

    <van-action-sheet
      :show="yearPickerShow"
      :actions="planYearOptions"
      @close="yearPickerShow = false"
      @select="handleYearChange"
    />

    <DatePicker
      :show="datePickerShow"
      @close="datePickerShow = false"
      @cancel="datePickerShow = false"
      @confirm="handleDateChange"
      :value="currentDate"
    />
  </view>
</template>

<script>
import Title from "@/components/title/index2";
import DatePicker from "@/components/datePicker/index.vue";
import { getPlanTypeList, createOrderPayPlan } from '@/api/order'
import { getPlanYearOptions, currentYear } from "@/utils/date"

export default {
  components: {
    Title,
    DatePicker,
  },
  props: {
    list: {
      type: Array,
      default: []
    },
    orderId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      datePickerShow: false, 
      yearPickerShow: false,
      currentDate: new Date().getTime(),
      expenseType: {}, // 学杂费
      currentCheckeds: [], // 学杂费选中列表
      planYearOptions: [],  // 年份
      payList: [], // 回款计划
      currentItem: {
        year: '',
        day: '',
        type: '',
        money: '',
      }, // 正在输入的回款计划
      currentIndex: 0, // 正在输入的回款计划索引
      // 提交表单
      formData: {},
    };
  },
  mounted() {
    this.payList = this.list
    console.log("seting", this.list);
    this.getPlanTypeList()
    this.getPlanYearOptions()
    let cacheType = []
     this.list.filter(item => {
       if (cacheType.indexOf(item.type) == -1) {
         cacheType.push(item.type)
      }
    })

    this.currentCheckeds = cacheType.map(item => `${item}`)
    console.log("currentCheckeds", this.currentCheckeds);
  },
  methods: {
    openPicker(key, index, item) {
      if (key == 'date') {
        this.datePickerShow = true
        this.currentItem = item
        this.currentIndex = index
      } else if (key == 'year') {
        this.yearPickerShow = true
        this.currentItem = item
        this.currentIndex = index
      }
    },
    // 年份选择
    handleYearChange({ detail }) {
      let index = this.currentIndex, currentItem = this.currentItem
      currentItem.year = detail.name
      this.currentItem = currentItem
      this.payList[index] = currentItem
      this.yearPickerShow = false
    },
    // 回款日期选择
    handleDateChange(val) {
      let index = this.currentIndex, currentItem = this.currentItem
      currentItem.day = val
      this.currentItem = currentItem
      this.payList[index] = currentItem
      this.datePickerShow = false
    },
    // 实收金额输入
    handleInputMoney(detail, item, index) {      
      console.log("val", detail);
      item.money = +detail.value
      this.currentItem = item
      this.payList[index] = item
      
    },
    // 多选 新增 删除 更新 diff
    handleChecked({ detail }) {
      let prev = this.currentCheckeds,
          curr = detail,
          isAdd = prev.length < curr.length,
          isDel = prev.length > curr.length,
          list  = [];
          
      if (isAdd) {
        list = this.handleAdd(prev, curr)
      } else if (isDel) {
        list = this.handleDel(prev, curr)
      }
      this.payList = list
      this.currentCheckeds = curr
    },
    // 添加逻辑
    handleAdd(prev, curr) {
      let type = ''
      for (let i = curr.length - 1; i >= 0; i--) {
        if (prev[i] !== curr[i]) {
          type = curr[i]
        }
      }
      return this.handleReplace('add', type)
    },
    // 删除逻辑
    handleDel(prev, curr) {
      let type = ''
      for(let i = prev.length - 1; i >= 0; i--) {
        if (prev[i] != curr[i]) {
          type = prev[i]
        }
      }
      return this.handleReplace('del', type)
    },
    // 复制
    handleCopy(type, index) {
      let item = this.creataItem(type, index)
      this.payList.splice(index + 1, 0, item)
      uni.showToast({ icon: 'none', title: '复制成功' })
    },
    // 删除
    handleDelete(item, index) {
      console.log("handleDelete",item, index, this.payList);
      let modalOption = { title: "", content: "确定要删除此计划吗?", showCancel: true, cancelColor: "#199fff", confirmColor: "#199fff" };
      let payList = JSON.parse(JSON.stringify(this.payList))
      let _index = payList.findIndex(i => i.id == item.id)
      payList.splice(_index, 1)
      console.log("find indew", _index, payList);
      uni.showModal(modalOption).then(modal => {
        if (modal[1].confirm) {
          this.payList = payList
          this.checkPayList(payList)
          uni.showToast({ icon: 'none', title: '删除成功' })
        }
      })
    },
    // 更新列表
    handleReplace(action ,type) {
      let payList = this.payList
      if (action === 'add') {
        let index = this.handleFindLast(payList, (item) => item.type == type);
        let item = this.creataItem(type, index)
        if (index == -1) {
          payList.push(item)
        } else {
          payList.splice(index, 0, item)
        }
      } else if (action === 'del') {
        payList = payList.filter(item => item.type != type)
      }

      return payList;
    },
    // 构造插入对象
    creataItem(type, index) {
      let typs = this.expenseType, 
          _currentYear = currentYear,
          payList = this.payList, 
          len = payList.length, 
          lastItem = payList[len -1],
          startId = 0

      if (index == -1) {
        startId = lastItem ? ((lastItem.id / 100) + 1) * 100 : 100
      } else {
        let lastindex = this.handleFindLast(payList, (item) => item.type = type)
        startId = (+payList[lastindex].id) + 1
      }

      return  { id: startId, type, name: typs[type], year: _currentYear, day: '',  money: '' }
    },
    // 检查选中状态
    checkPayList(payList) {
      let curr = this.currentCheckeds,
          filter = payList.filter(item => curr.includes(`${item.type}`)).map(item => `${item.type}`)
      this.currentCheckeds = Array.from(new Set(filter))
    },
    // 从后找，目的要插在后面
    handleFindLast(arr, callback) {
      for(let i = arr.length - 1; i >= 0; i--) {
        if (callback(arr[i], i, arr)) {
          return i;
        }
      }
      return -1
    },
    // 上一步 下一步
    toPrev() {
        this.$emit("close")
    },
    toNext() {
      let payList = this.payList
      let planParam = payList.map(item => ({ type: item.type, day: item.day, year: item.year, money: item.money }))
      let data = {
        order_id: this.orderId,
        data: JSON.stringify(planParam)
      }

      let validator = [
        { fileld: "year", message: '请选择年份' },
        { fileld: "day", message: '请选择日期' },
        { fileld: "money", message: '请输入回款金额' }
      ]

      const callback = async () => {
        const res = await createOrderPayPlan(data).catch(() => {})
        if (res.code == 0) {
          uni.showToast({ icon: 'none', title: '创建成功' })
          this.$emit("close")
        }
      }

      this.validate(validator, callback)
    },
    // 校验
    validate(err, callback) {
      let payList = this.payList, flag = true
      if (payList.length > 0) {
        payList.forEach(item => {
          err.forEach(eitem => {
            if (!item[eitem.fileld] && item[eitem.fileld].length == 0) {
              uni.showToast({ icon: 'none', title: eitem.message })
              flag = false
            }
          })
        })
      } else {
        uni.showToast({ icon: "none", title: '请配置回款计划' })
        flag = false
      }

      if (flag && callback) callback();
    },
    // 获取年份
    getPlanYearOptions() {
      let planYearOptions = getPlanYearOptions().map(item => ({ name: item }))
      this.planYearOptions = planYearOptions
    },
    // 获取分类
    async getPlanTypeList() {
      let res = await getPlanTypeList().catch(() => {})
      this.expenseType = res.data
    },
  }
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.payment-plan {
  width: 100%;
  overflow: hidden;
  
  .payment-check {
    padding: 0rpx 20rpx;
    .header {
      height: 78rpx;
      line-height: 78rpx;
      color: @text-color;
      border-bottom: @border;
    }

    .check-group {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      -webkit-flex-wrap: wrap;
      padding: 20rpx 0rpx;
    }

    /deep/.van-checkbox {
      width: 200rpx;
      margin: 15rpx;
    }
  }

  .pay-list {
    padding: 20rpx;
  }

  .list-item {
    margin-bottom: 30rpx;
  }
  
  .list-item-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 84rpx;
    line-height: 84rpx;
    border-bottom: @border;

    .header-title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .header-btns {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 240rpx;
    }

    /deep/.header-btn {
      border: none;
    }
  }
  
  .footer {
    position: relative;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: 100%;

    &-submit {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 40rpx 20rpx;
      background-color: #fff;
    }

    /deep/.van-button {
      width: 300rpx;
    }
  }
}

/deep/.label-class {
  font-size: @font-size-md;
}

/deep/.input-class {
  font-size: @font-size-md;
}

.hr {
  width: 100%;;
  height: 30rpx;
  background-color: @background-color;
}
</style>