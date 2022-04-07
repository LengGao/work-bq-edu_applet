<template>
<!-- 工作台，数据看板专用 -->
  <view class="nav-bar">
    <view class="nav-bar-safe-area"></view>
    <view class="nav-bar-header">
      <view class="nav-bar-header-avatars" @click="selectUserShow = true"> 
           <template v-if="checkedStaffData.length">
            <view class="avatar" v-for="item in showUsers" :key="item.id">
                    <text v-if="item.type === 'group'">{{item.title.substring(0,2)}}</text>
                    <text v-else>{{item.title.substr(-2)}}</text>
            </view>
            <view class="avatar" v-if="checkedStaffData.length>3">
                <van-icon color="#199fff" name="ellipsis" />
            </view>
            </template>
            <template v-else>
            <view class="avatar" v-if="userInfo.staff_name">
                <template v-if="userInfo.head_photo">
                <image :src="userInfo.head_photo" >
                </template>
                <text v-else>{{userInfo.staff_name.substr(-2)}}</text>
            </view>
            </template>
      </view>
      <view class="nav-bar-header-title">{{title}}</view>
    </view>
    <Select
      :value="checkedStaffData"
      :show="selectUserShow"
      @close="selectUserShow = false"
      @confirm="handleSelectTagChange"
      :options="rangeOptions"
      option-name="title"
      option-value="id"
      multiple
      outer
    />
  </view>
</template>

<script>
import Select from "@/components/select/index.vue";
import { getGroupWithUser } from "@/api/dataBoard";
import { mapGetters } from "vuex";
export default {
  name: "navBar",
  components: {
    Select,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      rangeOptions: [],
      selectUserShow: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "checkedStaffData"]),
    showUsers() {
      return this.checkedStaffData.filter((item, index) => index < 3);
    },
  },
  watch: {
    "userInfo.token"() {
      this.getGroupWithUser();
    },
  },
  created() {
    this.getGroupWithUser();
  },
  methods: {
    // 选择数据权限范围
    handleSelectTagChange(checkedData) {
      // console.log(checkedData);
      const arr_group = [];
      const arr_uid = [];
      checkedData.forEach((item) => {
        if (item.type === "group") {
          arr_group.push(item.id);
        } else {
          arr_uid.push(item.id);
        }
      });
      this.$store.dispatch("getUserId", { arr_uid, arr_group, checkedData });
      this.selectUserShow = false;
    },

    // 数据权限选项
    async getGroupWithUser() {
      const res = await getGroupWithUser();
      this.rangeOptions = [
        {
          title: "全部数据",
          id: 0,
          type: "group",
          group_tree: "-",
        },
      ].concat(res.data || []);
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";
.nav-bar {
  &-safe-area {
    box-sizing: content-box;
    background-color: @primary;
    padding-top: calc(constant(safe-area-inset-top) - 18px);
    padding-top: calc(env(safe-area-inset-top) - 18px);
  }
  &-header {
    height: 44px;
    box-sizing: content-box;
    position: relative;
    padding-top: 18px;
    background-color: @primary;
    flex-shrink: 0;
    .flex-c();
    &-avatars {
      position: absolute;
      left: 20rpx;
      bottom: 14rpx;
      .flex-c();
      .avatar {
        width: 60rpx;
        height: 60rpx;
        line-height: 60rpx;
        margin-right: 10rpx;
        .radius(50%);
        background-color: #fff;
        text-align: center;
        image {
          width: 100%;
          height: 100%;
          .radius(50%);
        }
        text {
          font-size: @font-size-xs;
          color: @primary;
        }
      }
    }
    &-title {
      margin: 0 auto;
      font-weight: bold;
      font-size: @font-size-md;
      color: #fff;
    }
  }
}
</style>