<template>
  <view class="class-detail">
    <view class="header">
      <view class="header-title"> 
        {{ info.classroom_name || '--' }}
      </view>
      <van-cell-group>
        <van-cell title="所属分类" 
          :value="info.category_name || '--'" 
          title-class="cell-title" 
          value-class="cell-value"
          title-width="140rpx"
        />
        <van-cell title="所属项目" 
          :value="info.project_name || '--'" 
          title-class="cell-title" 
          value-class="cell-value" 
          title-width="140rpx" 
        />
        <van-cell title="课程名称" 
          :value="info.course_name || '--'" 
          title-class="cell-title" 
          value-class="cell-value" 
          title-width="140rpx"  
        />
        <van-cell title="班主任" 
          :value="info.teacher_name || '--'" 
          title-class="cell-title" 
          value-class="cell-value" 
          title-width="140rpx" 
        />
        <van-cell title="学生人数" 
          :value="info.total_student || '--'" 
          title-class="cell-title" 
          value-class="cell-value" 
          title-width="140rpx"
        />
      </van-cell-group>
    </view>

    <view class="hr"></view>

    <view class="student-list">
      <view class="student-list-header">
        <SearchBar
          searchWidth="750rpx"
          placeholder="请输入学生姓名/手机号码"
          @search="handleSearch"
        >
          <template slot="title">
            <Title custom-class="header-search-title" title="班级学生"></Title>
          </template>
        </SearchBar>
      </view>

      <LoadMore
        v-if="listLength > 0"
        class="load-more"
        :data="list"
        :total="total"
        :load-loading="listLoading"
        :refresherEnabled="false"
        :skeleton-loading="skeletonLoading"
        :refresh-loading="listRefreshLoading"
        @load-more="handleLoadMore"
        @refresh="handleRefresh"
        >
        
        <view class="item-card" v-for="item in list" :key="item.student_id">
          <view class="item-card-hader">
            <view class="header-title"  @click="toCustomDetail(item.uid)">
              <text class="col-title">学生姓名</text>
              <text class="col-value">{{ item.user_realname || '--' }}</text>
            </view>
            <view class="header-btns">
                <van-button custom-class="btn edit-btn" icon="edit" size="small" plain  @click="handleEdit(item)">转班</van-button>
                <van-button custom-class="btn del-btn" icon="delete-o" size="small" plain  @click="handleDelete(item)">移除</van-button>
            </view>
          </view>
          <view class="item-card-item">
            <view class="card-item-row">
              <view class="row-left" style="width: 100%;">
                <text class="col-title">手机号码</text>
                <text class="col-value ellipsis">{{ item.telphone | phoneFormat }}</text>
                <van-icon 
                  name="newspaper-o" 
                  size="32rpx"
                  color="#199fff"
                  custom-style="margin-left: 20rpx;" 
                  @click="onCopy(item.telphone)"
                />

                <van-icon 
                  name="phone-o" 
                  size="32rpx"
                  color="#199fff" 
                  custom-style="margin-left: 20rpx"
                  @click="onPhoneCall(item.telphone)"
                />
              </view>
            </view>
            <view class="card-item-row">
              <view class="row-left">
                <text class="col-title">所属老师</text>
                <text class="col-value ellipsis">{{ item.staff_name || '--' }}</text>
              </view>
              <view class="row-right">
                <text class="col-title">所属部门</text>
                <text class="col-value ellipsis">{{ item.department_name || '--' }}</text>
              </view>
            </view>
            <view class="card-item-row">
              <view class="row-left full-width">
                <text class="col-title">报读项目</text>
                <text class="col-value">{{ item.project_str || '--' }}</text>
              </view>
            </view>
            <view class="card-item-row">
              <view class="row-left">
                <text class="col-title">所属机构</text>
                <text class="col-value ellipsis">{{ item.institution_name || '--' }}</text>
              </view>
              <view class="row-right" style="text-align: right;">
                <van-button type="primary" size="small" plain @click="edtiInstitution(item)">更换所属机构</van-button>
              </view>
            </view>
          </view>
        </view>
       </LoadMore>

        <NoData v-else />
    </view>

    <Select
      placeholder="请输入机构名称"
      :show="showInstitution"
      @close="showInstitution = false"
      @confirm="handleSelectOrgChange"
      :options="institutionOptions"
    />

    <Select
      placeholder="请输入班级名称"
      :show="showClass"
      @close="showClass = false"
      @confirm="handleSelectClassChange"
      :options="clasnOptions"
    />
  </view>
</template>

<script>
import Title from '@/components/title/index2';
import Select from "@/components/select/index.vue";
import SearchBar from "@/components/searchBar/index2.vue";
import LoadMore from '@/components/loadMore/index';
import NoData from '@/components/noData/index2';
import { mapGetters } from "vuex";
import { 
  getClassList, 
  editClassroom, 
  classroomUserList, 
  batchchangestudents,
  classstudentsBatchRemove,
  updateUserFromOrgId
} from '@/api/class'

export default {
  components: {
    Title,
    Select,
    SearchBar,
    LoadMore,
    NoData
  },
  computed: {
    ...mapGetters([
      'orgOptions'
    ]),
    institutionOptions() {
      return this.orgOptions.map((item) => ({
        name: item.institution_name,
        value: item.institution_id,
      }));
    },
  },
  data() {
    return {
      crid: '',                   // 班级id
      cid: '',                    // 课程id
      info: {},                   // 班级详情
      list: [],                   // 学生列表
      listLength: 0,
      page: 1,
      limit: 20,
      total: 0,
      listLoading: false,         // 加载状态
      skeletonLoading: false,     // 骨架屏状态
      listRefreshLoading: true,  // 下拉状态
      showInstitution: false,     // 更换所属机构
      showClass: false,           // 显示可转班级
      clasnOptions: [],           // 可转班级
      searchData: { search_box: '', from_organization_id: '' },
      waitClassStudent: {},       // 待转班学生
      waitInstitutionStudent: {},  // 待更改机构学生
    };
  },
  onLoad(query) {
    this.cid = query.cid
    this.crid = query.crid
    this.skeletonLoading = true
    this.getInfo()
    this.getList()
    this.getClassList()
  },
  onReachBottom() {
    if (!this.listLoading && this.list.length < this.total) {      
      this.handleLoadMore()
    }
  },
  methods: {
    // 复制
    onCopy(data) {
      uni.setClipboardData({ data })
    },
    // 拨号
    onPhoneCall(phoneNumber) {
      uni.makePhoneCall({ phoneNumber})
    },
    // 去往学生先详情
    toCustomDetail(uid) {
      uni.navigateTo({
        url: `/subPackages/customerDetails/index?uid=${uid}&cid=`,
      })
    },
    // 编辑学生
    handleEdit(row) {
      this.showClass = true
      this.waitStudent = row
    },
    // 移除学生
    async handleDelete(row) {
      let params = { uid: [row.uid], classroom_id: row.class_id },
          modalOption = {
            title: "移除提示",
            content: "确定要移除该学生吗？",
            showCancel: true,
            cancelColor: "#199fff",
            confirmColor: "#199fff",
          };
      let modal = await uni.showModal(modalOption);
      if (modal[1].confirm) {
        let res = await classstudentsBatchRemove(params).catch(() => {});
        if (res.code === 0) {
          this.getList();
        }
      }
    },
    // 转班
    async handleSelectClassChange(data) {
      let row = this.waitStudent
      let params = {
          uid: [row.uid],
          new_classroom_id: data.value,
          old_classroom_id: row.class_id,
          course_students_id: [row.student_id],
        },
        modalOption = {
          title: "转班提示",
          content: "确定要将该学生吗转至此班吗？",
          showCancel: true,
          cancelColor: "#199fff",
          confirmColor: "#199fff",
        };
      let modal = await uni.showModal(modalOption);
      if (modal[1].confirm) {
        let res = await batchchangestudents(params).catch(() => {});
        this.showClass = false
        this.page = 1
        if (res.code === 0) {
          this.getInfo()
          this.getList()
        }
      }
    },
    // 更改学生所属机构
    edtiInstitution(row) {
      this.showInstitution = true
      this.waitInstitutionStudent = row
    },
    // 跟换所属机构
    async handleSelectOrgChange(data) {
      const params = {
          institution_id: data.value,
          uid_arr: [this.waitInstitutionStudent.uid],
        },
        modalOption = {
          title: "转班提示",
          content: `确定更换该学生所属机构为${data.name}吗？`,
          showCancel: true,
          cancelColor: "#199fff",
          confirmColor: "#199fff",
        };
      let modal = await uni.showModal(modalOption);
      if (modal[1].confirm) {
        let res = await updateUserFromOrgId(params).catch(() => {});
        this.showInstitution = false
        this.page = 1
        if (res.code === 0) {
          this.getList()
        }
      }
    },
    // 上拉到底/右 加载事件
    handleLoadMore() {
      this.page++;
      this.listLoading = true;
      this.getList();
    },
    // scroll-view下拉事件
    handleRefresh() {
      this.page = 1;
      // this.listRefreshLoading = true;
      this.getList();
    },
    // 搜索放出
    handleSearch(val) {
      this.searchData.search_box = val
      this.page = 1
      this.getList()
    },
    // 获取学生列表
    async getList() {
      let param = { class_id: +this.crid, page: this.page, limit: this.limit, search_box: this.searchData.search_box }
      this.listLoading = false;
      this.listRefreshLoading = false;
      let res = await classroomUserList(param).catch(() => {})
      this.skeletonLoading = false;

      if (res.code == 0) {
        if (this.page == 1) {
          this.list = res.data.list
        } else {
          this.list.push(...res.data.list)
        }
        this.listLength = this.list.length
        this.total = res.data.total
      }
    },
    // 获取班级信息
    async getInfo() {
      let param = { classroom_id: this.crid }
      let res = await editClassroom(param).catch(() => {})
      if (res.code == 0) {
        this.info = res.data
      }
    },
    // 获取可赚班级
    async getClassList() {
      let param = { course_id: this.cid, page: this.page, keyword: '', limit: 10000 }
      let res = await getClassList(param).catch(() => {})
      if (res.code == 0) {
        this.clasnOptions = res.data.list.map(item => ({
          name: item.classroom_name,
          value: item.classroom_id
        }))
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/var";

.class-detail {
  width: 100%;
  overflow: hidden;
  
  .header {
    width: 100%;
    padding: 20rpx;

    &-title {
      width: 700rpx;
      overflow: hidden;
      padding-left:30rpx;
      height: 84prx;
      line-height: 84rpx;
      font-size: 42rpx;
      font-weight: 800;
      color: @text-color;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /deep/.cell-title {
      font-size: @font-size-sm;
      color: @text-color-grey;
    }

    /deep/.cell-value {
      font-size: @font-size-sm;
      color: @text-color;
    }
  }

  .student-list {
    width: 100%;
    padding: 20rpx 20rpx 0 20rpx;

    .student-list-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      margin-bottom: 10rpx;
      width: 100%;
      height: 84rpx;
      font-size: @font-size-md;

      .header-search-title {
        max-width: 600rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; 
      }
    }

    .item-card {
      display: flex;
      flex-direction: column;
      margin-bottom:  20rpx;
      border: @border;
      
      .item-card-hader {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 84rpx;
        
        border-bottom: @border;

        .header-title {
          .col-title {
            font-size: @font-size-sm;
            color: @text-color-grey;
          }

          .col-value {
            margin-left: 10rpx;
            font-size: @font-size-sm;
            color: @text-color;
          }
        }

        .header-btns {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 280rpx;
          
          /deep/.btn {
            border: none;
          }

          /deep/.edit-btn {
            color: @primary;
          }
        }
      }

      .item-card-item {
        padding: 20rpx;

        .card-item-row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          height: 60rpx;
          line-height: 54rpx;
        }

        .row-left {
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .row-right {
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .col-title {
          font-size: @font-size-sm;
          color: @text-color-grey;
        }

        .col-value {
          margin-left: 10rpx;
          font-size: @font-size-sm;
          color: @text-color;
        }

        .ellipsis {
          width: 200rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .full-width {
          width: 100%;
        }

        .phone-icons {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
        }
      }
    }
  }
    
  .hr {
    width: 100%;;
    height: 20rpx;
    background-color: @background-color;
  }

  .telephone-icon {
    font-size: 24rpx;
    color: #199fff;
    margin-left: 20rpx;
  }
}
</style>