<template>
    <view class="customer-details">
        <view class="header">
            <view class="header-info">
                <view class="header-info-avator">
                    <image class="info-avator-img" :src="userInfo.user_img" ></image>
                </view>
                <view class="header-info-text">
                    <text class="infor-text__name">{{userInfo.surname}}</text>
                    <text class="info-text__phone">{{userInfo.mobile || 156763646846498}}</text>
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
                    <UserInfo :datas="userInfo"></UserInfo>
                </van-tab>
                <van-tab title="订单记录">
                    <UserOrderRecond :uid="UserInfo.uid"></UserOrderRecond>
                </van-tab>
                <van-tab title="项目班级">
                    <StudentClass :uid="userInfo.uid"></StudentClass>
                </van-tab>
                <van-tab title="学习进度">
                    <StudyProgress :uid="userInfo.uid"></StudyProgress>
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

import { getUserInfo } from "@/api/customer";
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
        getData(data) {
            getUserInfo(data).then(res => {
                this.userInfo = res.data
            })
        }
    },
    onLoad(query) {
        const uid = query.userId || 110705
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
