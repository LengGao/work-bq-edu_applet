<template>
  <view class="payment-plan" style="z-index: 999;">
    <view class="hr"></view>
    <view class="payment-check"> 
      <view class="header">
        <Title title="回款计划" customStyle="padding-left: 10rpx;" ></Title>
      </view>
      <van-checkbox-group :value="currentCheckeds" @change="handleChecked">
        <view class="check-group">
          <van-checkbox  v-for="(item, index) in expenseType"  :key="index" 
            class="van-checkbox" shape="square" :name="index">
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
            value-class="input-class"
            :value="item.major_name || item.project_name || '请选择所属项目'"
            @click="() => handlerOpenSelect('project', index, item)"
          />
          <van-cell
            is-link
            required
            title="所属年份"
            title-class="label-class"
            value-class="input-class"
            :value="item.year || '请选择年份'"
            @click="() => handlerOpenSheet('years', index, item)"
          />
          <van-cell
            is-link
            required
            title="计划回款日期"
            title-class="label-class"
            value-class="input-class"
            :value="item.day || '请选择回款日期'"
            @click="() => handlerOpenPicker('date', index, item)"
          />
          <van-field
            required
            type="number"
            label="计划回款金额"
            input-align="right"
            placeholder="请输入回款金额"
            label-class="label-class"
            input-class="input-class"
            :value="Number(item.money)"
            @blur="({ detail }) => 
              detail.value != item.money && 
              handlerFormInput(detail.value, 'configPlan', index, item)
            "
          />
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import Title from "@/components/title/index2";
import { currentYear } from "@/utils/date";
import { mapGetters } from 'vuex';

export default {
  components: {
    Title
  },
  props: {
    list: {
      type: Array,
      default: []
    },
    currentProjectIds: {
      type: String,
      default: ''
    }, // 第一步项目选择是已选报名项目id
    currentProjectName: {
      type: String,
      default: ''
    }, // 第一步项目选择时已选项目名称
    
  },
  computed: {
    ...mapGetters([ 'expenseType'])
  },
  data() {
    return {
      currentCheckeds: [], // 学杂费选中列表
      payList: [], // 回款计划
    };
  },
  mounted() {
    // console.log("2", this.list);
    this.payList = this.list
    this.generatorCurrentChecked(this.list)
  },
  watch: {
    'list': function (newVal) {
      // console.log("list", newVal);
      this.payList = newVal
      this.generatorCurrentChecked(newVal)
    },
    'currentProjectIds': function (newVal) {
      this.currentProjectIds = newVal
    },
    'currentProjectName': function (newVal) {
      this.currentProjectName = newVal
    }
  },
  methods: {
    // 实收金额输入
    handlerFormInput(detail, key, index, item) {
      this.$emit('dynamic-input', key, { money: detail }, index, item)
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
      this.$emit('open-picker', detail, 'plan', index, item)
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
      this.$emit("dynamic-input", 'configPlan', list)
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
      this.$emit("dynamic-input", 'configPlan', this.payList)
    },
    // 删除
    handleDelete(item, index) {
      // console.log("handleDelete",item, index, this.payList);
      let modalOption = { title: "", content: "确定要删除此计划吗?", showCancel: true, cancelColor: "#199fff", confirmColor: "#199fff" };
      let payList = JSON.parse(JSON.stringify(this.payList))
      let _index = payList.findIndex(i => i.id == item.id)
      payList.splice(_index, 1)
      // console.log("find indew", _index, payList);
      uni.showModal(modalOption).then(modal => {
        if (modal[1].confirm) {
          this.payList = payList
          this.checkPayList(payList)
          uni.showToast({ icon: 'none', title: '删除成功' })
          this.$emit("dynamic-input", 'configPlan', this.payList)
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

      if (type == 1) {
        return  { 
          type, 
          id: startId, 
          name: typs[type], 
          year: _currentYear, 
          day: '',  
          money: '' 
        }
      } else {
        return  { 
          type, 
          id: startId, 
          name: typs[type], 
          year: _currentYear, 
          day: '',  
          money: '', 
          project_name: this.currentProjectName,
          project_ids: this.currentProjectIds
        } 
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
    // 生成当前选项
    generatorCurrentChecked(list) {
      let cacheType = []    
      list.filter(item => {
        if (cacheType.indexOf(item.type) == -1) { cacheType.push(item.type) }
      })
      this.currentCheckeds = cacheType.map(item => `${item}`)
    }
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