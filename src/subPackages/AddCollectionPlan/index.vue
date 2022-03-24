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
            shape="square"
            :key="index"
            :name="index"
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
            <van-button 
              plain  
              icon="newspaper-o" 
              size="small" 
              custom-class="header-btn" 
              @click="handleCopy(item.type, index)">
              复制
            </van-button>
            <van-button 
              plain  
              size="small"
              icon="delete-o" 
              custom-class="header-btn" 
              @click="handleDelete(index)">
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
            @input="(e) => handleInputMoney(e, index, item)"
          />
        </view>  

      </view>
    </view>

    <view class="footer">
      <view class="footer-submit">
        <van-button round @click="toPrev">取消</van-button>
        <van-button round type="primary" :loading="saveLoading" @click="toNext">确定</van-button>
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
  data() {
    return {
      saveLoading: false,
      datePickerShow: false,
      yearPickerShow: false,
      currentDate: new Date().getTime(),
      sheetActions: [],
      expenseType: {},
      // 提交表单
      formData: {
        type: [],
        payList: [],
      },
      order_id: '',
      // 年份
      planYearOptions: [],
      // 多项列表
      currentCheckeds: [],
      prevCheckeds: [],
      payList: [],
      currentItem: {},
      currentIndex: 0,
      eventChannel: ''
    };
  },
  onLoad(query) {
    this.order_id = query.orderId
    const eventChannel = this.getOpenerEventChannel()
    this.eventChannel = eventChannel
    console.log("paymentPlan", query, eventChannel);
    this.getPlanTypeList()
    this.getPlanYearOptions()
  },
  methods: {
    // 上一步
    toPrev() {
        uni.navigateBack()
    },
   toNext() {
      let payList = this.payList.map(item => {
        return {
          type: item.type,
          day: item.day,
          year: item.year,
          money: item.money
        }
      })
      let data = {
          data: JSON.stringify(payList),
          order_id: this.order_id
        }
      let _this = this
      
        this.validator(
          [
            {
              fileld: "year",
              message: '请选择年份'
            },
            {
              fileld: "day",
              message: '请选择日期'
            },
            {
              fileld: "money",
              message: '请输入回款金额'
            }
          ],
          async () => {
            const res = await createOrderPayPlan(data).catch(() => {})
            if (res.code == 0) {
              uni.showToast({ icon: 'none', title: '创建成功' })
              uni.navigateBack({
                success() {
                  _this.eventChannel.emit('updateData', {})
                }
              })
            }
          }
        )
    },
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
      let payList = this.payList, index = this.currentIndex
      this.currentItem.year = detail.name
      this.yearPickerShow = false
      payList[index] = this.currentItem
      this.payList = payList
    },
    // 回款日期选择
    handleDateChange(val) {
      // console.log("currentDate", val, this.currentDate);
      let payList = this.payList, index = this.currentIndex
      this.currentItem.day = val
      this.datePickerShow = false
      payList[index] = this.currentItem
      this.payList = payList
    },
    // 实收金额输入
    handleInputMoney(e, index, item) {
      // console.log('handleInputMone',e, index, item);
      let val = e.detail
      item.money = val
      this.payList[index] = item
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
    // 从后找，目的要插在后面
    handleFindLast(arr, callback) {
      for(let i = arr.length - 1; i >= 0; i--) {
        if (callback(arr[i], i, arr)) {
          return i;
        }
      }
      return -1
    },
    // 检查选中状态
    checkPayList() {
      let curr = this.currentCheckeds,
          payList = this.payList,
          filter = payList.filter(item => curr.includes(item.type)).map(item => item.type)
      this.currentCheckeds = Array.from(new Set(filter))
    },
    // 多选
    handleChecked({ detail }) {
      // console.log("detail", detail);
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
    // 复制
    handleCopy(type, index) {
      let item = this.creataItem(type, index)
      this.payList.splice(index + 1, 0, item)
    },
    // 删除
    handleDelete(index) {
      this.payList.splice(index, 1)
      this.checkPayList()
    },
    // 构造插入对象
    creataItem(type, index) {
      let typs = this.expenseType, _currentYear = currentYear
      let payList = this.payList, len = payList.length
      let startId = ''
      if (index == -1) {
        startId = `${type}-${len + 100}`
      } else {
        let lastindex = this.handleFindLast(payList, (item) => item.type = type)
        let ids = payList[lastindex].id.split('-')     
        startId = `${ids[0]}-${Number(ids[1]) + 1}`
      }

      return  {
        id: startId, 
        type, 
        name: typs[type],
        year: _currentYear,
        day: '', 
        money: '',
      }
    },
    // 冒泡
    bubbling(arr) {
        return arr.sort((a, b) => a.id - b.id)
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

    validator(err, callback) {
      let payList = this.payList, flag = true
      if (payList.length > 0) {
        payList.forEach(item => {
          err.forEach(eitem => {
            if (!item[eitem.fileld] && item[eitem.fileld].length == 0) {
              uni.showToast({
                icon: 'none',
                title: eitem.message
              })
              flag = false
            }
          })
        })
      } else {
        uni.showToast({
          icon: "none",
          title: '请配置回款计划',
        })
        flag = false
      }

      if (flag && callback) {
        callback()
      }

    },
  }
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
page {
  height: 100%;
  overflow: hidden;
}

/deep/.label-class {
  font-size: @font-size-md;
}

/deep/.input-class {
  font-size: @font-size-md;
}

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
      padding: 20rpx 0rpx;
    }

    /deep/.van-checkbox {
      width: 200rpx;
      margin: 15rpx;
    }
  }

  .pay-list {
    min-height: 50vh;
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
    position: static;
    margin-top: 100rpx;

    &-submit {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 60rpx 60rpx;
      background-color: #fff;
    }

    /deep/.van-button {
      width: 300rpx;
    }
  }
}

.hr {
  width: 100%;;
  height: 30rpx;
  background-color: @background-color;
}
</style>