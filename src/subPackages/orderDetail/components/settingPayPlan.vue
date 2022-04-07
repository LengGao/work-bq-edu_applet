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
            v-if="item.type !== 1"
            is-link
            required
            title="所属项目"
            title-class="label-class"
            title-width="140rpx"
            value-class="input-class-project"
            :value="item.project_name || '请选择所属项目'"
            @click="() => openPicker('project', index, item)"
          />
          <van-cell
            is-link
            required
            title="所属年份"
            title-class="label-class"
            value-class="input-class"
            :value="item.year || '请选择年份'"
            @click="() => openPicker('year', index, item)"
          />
          <van-cell
            is-link
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

    <Select
      :show="projectShow"
      @close="projectShow = false"
      @confirm="handleSelectChange"
      :options="projectOption"
      multiple
    />
  </view>
</template>

<script>
import Title from "@/components/title/index2";
import Select from "@/components/select/index.vue";
import DatePicker from "@/components/datePicker/index.vue";
import { createOrderPayPlan } from '@/api/order'
import { getPlanYearOptions, currentYear } from "@/utils/date"
import { accAdd } from "@/utils/index";
import { mapGetters } from 'vuex'

export default {
  components: {
    Title,
    Select,
    DatePicker,
  },
  props: {
    orderId: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: [String, Number],
      default: ''
    },
    projectOption: {
      type: Array,
      default: []
    },
    totalMoney: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      projectShow: false,
      datePickerShow: false, 
      yearPickerShow: false,
      currentDate: new Date().getTime(),
      currentCheckeds: [], // 学杂费选中列表
      planYearOptions: [],  // 年份
      projectId: '',                       // 缓存已选所属项目
      projectName: '',                      // 缓存已选所属项目
      payList: [], // 回款计划
      currentItem: {
        year: '',
        day: '',
        type: '',
        money: '',
      }, // 正在输入的回款计划
      currentIndex: 0, // 正在输入的回款计划索引
    };
  },
  computed: {
    ...mapGetters(['expenseType'])    // 学杂费
  },
  mounted() {
    this.getPlanYearOptions()
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
      } else if (key == 'project') {
        this.projectShow = true
        this.currentItem = item
        this.currentIndex = index
      }
    },
    handleSelectChange(detail) {
      // console.log('detail', detail);
      let index = this.currentIndex, 
          currentItem = this.currentItem,
          projectId = '',
          projectName = ''

      detail.map(item => {
        if (item) {
          projectId = projectId + item.value + ','
          projectName = projectName + item.name + ','
        }
      })

      projectId = projectId.substring(0, projectId.lastIndexOf(','))
      projectName = projectName.substring(0, projectName.lastIndexOf(','))

      currentItem.project_ids = projectId
      currentItem.project_name = projectName

      this.projectId = projectId 
      this.projectName = projectName
      this.currentItem = currentItem
      this.payList[index] = currentItem
      this.projectShow = false
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
      // console.log("val", detail);
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
      // console.log("handleDelete",item, index, this.payList);
      let modalOption = { title: "", content: "确定要删除此计划吗?", showCancel: true, cancelColor: "#199fff", confirmColor: "#199fff" };
      let payList = JSON.parse(JSON.stringify(this.payList))
      let _index = payList.findIndex(i => i.id == item.id)
      payList.splice(_index, 1)
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

      if (type == 1 || type == '1') {
        return  { id: startId, type, name: typs[type], year: _currentYear, day: '',  money: '' }
      } else {
        return  { id: startId, type, name: typs[type], year: _currentYear, day: '',  money: '', project_name: '', project_ids: '' } 
      }
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
    reset() {
      this.payList = []
      this.currentDate = new Date().getTime()
      this.currentCheckeds = []
      this.planYearOptions = []
      this.projectId = ''
      this.projectName = ''
      this.currentIndex = 0 
      this.currentItem = {year: '', day: '', type: '', money: '' }
      },
    // 取消
    toPrev() {
        this.$emit("close")
    },
    //二确定
    toNext() {
      let payList = this.payList
      let planParam = payList.map(item => {
        if (item.type == 1 || item.type == '1') {
          return { type: item.type, day: item.day, year: item.year, money: item.money }
        } else if (`${this.type}` == '1') {
          return { type: item.type, day: item.day, year: item.year, money: item.money, project_ids: item.project_ids, project_name: item.project_name || '' } 
        } else if (`${this.type}` == '0') {
          return { type: item.type, day: item.day, year: item.year, money: item.money, project_ids: item.project_ids, project_name: item.project_name || '' } 
        } else {
          return ''
        }
      }).filter(i => (!!i))

      let data = { order_id: this.orderId, data: JSON.stringify(planParam) }

      let validator = [
        { fileld: "year", message: '请选择年份' },
        { fileld: "day", message: '请选择日期' },
        { fileld: "money", message: '请输入回款金额' },
        { fileld: "project_name", message: '请输入所属项目' }
      ]

      const callback = async () => {
        const res = await createOrderPayPlan(data).catch(() => {})
        if (res.code == 0) {
          uni.showToast({ icon: 'none', title: '创建成功' })
          this.reset()
          this.$emit("close")
        }
      }

      this.validate(validator, callback)
    },
    // 校验
    validate(options, callback) {
      let payList = this.payList, 
          len = payList.length,
          order_money = this.totalMoney,
          errList = [],
          cache = 0

      // 校验必填参数
      if (len <= 0) {
        errList.push({ icon: "none", title: '请配置回款计划' })
      } else {
        for(let i = len - 1; i>= 0; i--) {
          let item = payList[i]
          options.forEach(err => {
            let key = err.fileld, message = err.message
            if (`${item[key]}`.length <= 0) {
              if (key == 'project_name' && item.type != 1 )
                errList.push({ icon: "none", title: `${message}` })
              }
          })
          if (item.type == 1) {
            cache = accAdd(cache, item.money)
          }
        }
      }
      
      // 校验总学费
      if (parseFloat(cache) > parseInt(order_money || 0)) {
        errList.push({ icon: "none", title: `回款计划中的学费金额总和不能大于报名项目实收金额总和` })
      }

      if (errList.length > 0) {
        uni.showToast(errList[0])
      } else {
        callback()
      }
    },
    // 获取年份
    getPlanYearOptions() {
      let planYearOptions = getPlanYearOptions().map(item => ({ name: item }))
      this.planYearOptions = planYearOptions
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
    min-height: 42vh;
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
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
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

/deep/.input-class-project {
  width: 70;
  font-size: @font-size-md;
}

.hr {
  width: 100%;;
  height: 30rpx;
  background-color: @background-color;
}
</style>