<template>
    <view class="customer-details">
        <view class="header">
            <view class="header-info">
                <view class="header-info-avator">
                    <image class="info-avator-img" :src="userInfo.user_img" ></image>
                </view>
                <view class="header-info-text">
                    <text class="infor-text__name">{{userInfo.surname}}</text>
                    <text class="info-text__phone">{{user.mobile || 156763646846498}}</text>
                </view>
            </view>
            <view class="header-btn">
                <button @click="handleSignUp">保存</button>
            </view>
        </view>
        <view class="main">
            <van-tabs
                type="line" 
                title-active-color="#199fff" 
                color="#199fff"
                animated
                :active="active"
                @click="handleTabClick">
                <van-tab title="基本信息">
                    <UserInfo :data="userInfo"></UserInfo>
                </van-tab>
                <van-tab title="订单记录">
                    <template v-for="(item) in orderRecond.list">
                        <UserOrderRecond :key="item.aid" :data="item"></UserOrderRecond>
                    </template>
                </van-tab>
                <van-tab title="项目班级">
                    <StudentClass :dataClass="studentClass" :dataProject="userProject"></StudentClass>
                </van-tab>
                <van-tab title="学习进度">
                    <template v-for="(item) in studyProgress.list">
                        <StudyProgress :key="item.id" :data="item"></StudyProgress>
                    </template>
                </van-tab>
            </van-tabs>
        </view>
    </view>
</template>
<script>

import { UserInfo } from './components/userInfo.vue';
import { UserOrderRecond } from './components/userOrderRecond.vue';
import { StudentClass } from './components/studentClass.vue';
import { StudyProgress } from './components/studyProgress.vue';

import { getUserInfo, getOrderRecond, getStudendclass, getUserProject, getStudyProgress } from "@/api/customer";
export default {
    components: { UserInfo, UserOrderRecond, StudentClass, StudyProgress },
    data() {
        return {
            userInfo: {},
            orderRecond: {},
            studentClass: [],
            userProject: [],
            studyProgress: {},
            active: 0,
        }
    },
    methods: {
        handleTabClick(event) {
            console.log("event",event);
        },
        handleSignUp() {
            const {uid,surname,mobile,id_card_number} = this.userInfo
            const url = `?userId=${uid}&userName=${surname}&userMobile=${mobile}&userIdCard=${id_card_number}`
            uni.navigateTo({url})
        },
        async getData(data) {
            const reqs = [
                getUserInfo(data),
                getOrderRecond(data),
                getStudendclass(data),
                getUserProject(data),
                getStudyProgress(data)
            ]
            const res = await Promise.all(reqs).catch(() => {})
            const files = ['userInfo', 'orderRecond', 'studentClass', 'userProject', 'studyProgress']
            files.forEach((item,index) => this[item] = res[index].data)
            console.log("res",res, this.$data);
        }
    },
    onLoad(query) {
        const uid = 110705 // query.userId
        this.getData({uid})
    }

}
</script>
<style lang="less" scoped>
@import "@/styles/var";
@avator-width: 100rpx;
@avator-height: 100rpx;

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 40rpx;
    .header-info {
        display: flex;
        flex-direction: row;
        .header-info-avator {
            width: @avator-width;
            height: @avator-height;
            .info-avator-img {
                width: @avator-width;
                height: @avator-height;
                border-radius: 50%;
            }
        }
        .header-info-text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 10rpx;
            height: @avator-height;
            .infor-text__name {
                display: inline-block;
                height: 54rpx;
                font-size: @font-size-lg;
                color: @text-color;
            }
            .infor-text__phone {
                display: inline-block;
                font-size: @font-size-sm;
                color: @text-color-grey;
            }
        }
    }
    .header-btn {
        width: 212rpx;
        height: 68rpx;
        button {
            font-size: @font-size-sm;
            color: #FFFFFF;
            border-radius: 30rpx;
            background-color: @primary;
        }
    }
}
</style>
