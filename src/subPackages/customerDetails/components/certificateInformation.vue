<template>
  <view class="certificate-information">
    <view class="certificate">
      <view class="certificate-info" v-for="(item, index) in informationImages" :key="index">
        <image class="certificate-info-img" mode="aspectFit" :src="item.iamge || defaultImage" />
        <text class="certificate-info-text">{{item.text}}</text>
      </view>
    </view>

    <view class="information">
        <view class="information-header">
            <Title title="资料信息"></Title>
            <van-button plain type="primary" size="small" @click="handleUpload">上传资料</van-button>
        </view>

        <view class="information-card" v-for="item in informations" :key="item.id">
            <view class="card-title">{{ item.file_name }}</view>
            <view class="card-item">
                <image class="card-item-img" mode="aspectFit" :src="item.oss_url || defaultImage">
                <view class="card-item-info">
                    <view class="format">文件格式<text class="value">{{ item.suffix }}</text></view>
                    <view class="size">文件大小<text class="value">{{ item.size }}</text></view>
                </view>
                <view class="card-item-btns">
                    <van-button size="small" @click="handleEdit(item)">编辑</van-button>
                    <van-button size="small" @click="handleDelete(item)">删除</van-button>
                </view>
            </view>
        </view>

    </view>
    
  </view>
</template>

<script>
import Title from "@/components/title/index2.vue";
import { getCertificateInfo, getUserFileList, uploadImage, createFile, updateFile, deleteFile } from "@/api/customer"

export default {
  components: { Title },
  props: {
      value: {
        type: String,
        default: ''  
      },
      uid: {
          type: String,
          default: ''
      }
  },
  data() {
    return {
      certificate: {
        graduation_certificate: "",
        mobile: "17456241531",
        photo_commitment: "../../../static/Presetation.png",
        photo_health: "",
        photo_id_card: "",
        photo_id_card_emblem: "",
        photo_residence_permit: "",
        portrait: "",
        uid: 102517,
        uploads: [],
      },
      informations: [{
        create_time: "2022-03-15 14:30:02",
        file_name: "111",
        id: 13,
        oss_url: "../../../static/Presetation.png",
        size: "120.62KB",
        suffix: "png",
        uid: 102517,
        update_time: "2022-03-15 14:30:02",
      }],
      defaultImage: '../../../static/Presetation.png',
      informationImages: [
        { type: "portrait", iamge: "", text: "免冠正面照" },
        { type: "photo_id_card_emblem", iamge: "", text: "身份证国徽面" },
        { type: "photo_id_card", iamge: "", text: "身份证人像面" },
        { type: "photo_residence_permit", iamge: "", text: "社保卡/居住证" },
        { type: "graduation_certificate", iamge: "", text: "毕业证扫描件" },
        { type: "photo_commitment", iamge: "", text: "工作年限承诺书" },
        { type: "photo_health", iamge: "", text: "个人健康承诺书" },
      ],
    };
  },
  created() {
    
    this.transfromData(this.certificate);
  },
  methods: {
    handleDelete() {

    },
    handleEdit() {

    },
    handleUpload() {
        this.$emit('upload')
    },
    // 转换请求数据为目标结构
    transfromData(data = {}) {
        const list = this.informationImages;
        for (let i = list.length - 1; i >= 0; i--) {
            const item = list[i], key = item.type;
            item.iamge = data[key];
        }
        this.informationImages = list;
    }
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";

.certificate-information {
    border-top: 20rpx solid #f2f6fc;
    padding-bottom: 40rpx;

    .certificate {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        padding: 40rpx 30rpx;
    }

    .certificate-info {
        display: inherit;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 290rpx;
        margin-bottom: 20rpx;

        &-img {
            width: 320rpx;
            height: 240rpx;
            border: @border;
        }

        &-text {
            color: @text-color-grey;
        }
    }

    .information {
        padding: 0 30rpx;
        border: @border;
    }

    .information-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;   
        margin: 20rpx 0;
        font-size: @font-size-md;
        color: @text-color;
    }

    .information-card {
        padding: 0 20rpx;
        border: @border;
    }
    
    .card-title {
        height: 72rpx;
        line-height: 72rpx;
        font-size: @font-size-lg;
        color: @text-color;
        border-bottom: @border;
    }

    .card-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        padding: 20rpx 0;
        overflow: hidden;

        &-img {
            width: 160rpx;
            height: 120rpx;
        }

        &-info {
            width: 360rpx;
            margin-left: 20rpx;
            overflow: hidden;
            font-size: @font-size-sm;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        &-btns {
            width: 60rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        & .format {
            color: @text-color-grey;
        }

        & .size {
            color: @text-color-grey;
        }

        & .value {
            margin-left: 8rpx;
            color: @text-color;
        }
    }
}


</style>