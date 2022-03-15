<template>
  <view class="certificate-information">
    <view class="certificate">
      <view class="certificate-info" v-for="(item, index) in informationImages" :key="index" @click="upCertificate">
        <image class="certificate-info-img" mode="aspectFit" :src="item.iamge || defaultImage" />
        <text class="certificate-info-text">{{item.text}}</text>
      </view>
    </view>

    <view class="information">
        <view class="information-header">
            <Title title="资料信息"></Title>
                    <van-uploader
                        name="editInformation"
                        accept="all"
                        :show-upload="true"
                        :preview-image="false"
                        :preview-full-image="false"
                        :file-list="editFiles"
                        @after-read="handleAfterRead"
                        @delete="handleImageDelete"
                    >
                       <van-button icon="photo" plain type="primary" size="small" @click="handleUpload">上传资料</van-button>
                    </van-uploader>
        </view>

        <view class="information-card" v-for="item in informations" :key="item.id">
            <view class="card-header">
                <view class="card-header-title">{{ item.file_name }}</view>
                <view class="card-header-btns">
                    <van-button icon="edit" size="small" plain  @click="handleEdit(item)">编辑</van-button>
                    <van-button icon="delete-o"  size="small" plain  @click="handleDelete(item.id)">删除</van-button>
                </view>
            </view>
            <view class="card-item">
                <image class="card-item-img" mode="aspectFit" :src="item.oss_url || defaultImage">
                <view class="card-item-info">
                    <view class="format">文件格式<text class="value">{{ item.suffix }}</text></view>
                    <view class="size">文件大小<text class="value">{{ item.size }}</text></view>
                </view>
            </view>
        </view>
    </view>

    <van-dialog
        use-slot
        title="编辑资料"
        :show="showDialog"
        show-cancel-button
        @close="handleClose"
        @confirm="handleConfirm" 
        >
        <van-cell-group>
            <van-field
                label="资料名称"
                :value="editData.file_name"
                placeholder="请输入资料名称"
                :border="false"
            />
            <van-cell>
                <template #title>
                    <text style="margin-right: 50rpx;">上传资料</text>
                    <van-uploader
                        name="edit"
                        accept="all"
                        :show-upload="true"
                        :preview-image="false"
                        :preview-full-image="false"
                        :file-list="editFiles"
                        @after-read="handleAfterRead"
                        @delete="handleImageDelete"
                    >
                        <van-button size="small" type="primary">上传文件</van-button>
                    </van-uploader>
                </template>
            </van-cell>
            <van-cell>
                <view v-for="(file, index) in editFiles" :key="index" class="edit-files">
                    <van-icon name="notes-o" size="32rpx" color="#999999" />
                    <text class="edit-files-name">{{file.name}}</text>
                    <van-icon name="cross" size="32rpx" color="#999999" @click="handleCancel(file, index)" />
                </view>
            </van-cell>
        </van-cell-group>        
    </van-dialog>

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
        photo_commitment: "",
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
        oss_url: "",
        size: "120.62KB",
        suffix: "png",
        uid: 102517,
        update_time: "2022-03-15 14:30:02",
      }],
      defaultImage: '../../../static/upload.png',
      informationImages: [
        { type: "portrait", iamge: "", text: "免冠正面照" },
        { type: "photo_id_card_emblem", iamge: "", text: "身份证国徽面" },
        { type: "photo_id_card", iamge: "", text: "身份证人像面" },
        { type: "photo_residence_permit", iamge: "", text: "社保卡/居住证" },
        { type: "graduation_certificate", iamge: "", text: "毕业证扫描件" },
        { type: "photo_commitment", iamge: "", text: "工作年限承诺书" },
        { type: "photo_health", iamge: "", text: "个人健康承诺书" },
      ],
      showDialog: false,
      editData: {},
      fileList: [],
      editFiles: [],
      currentEditId: ''
    };
  },
  created() {
    this.transfromData(this.certificate);
  },
  methods: {
    upCertificate() {
        wx.chooseImage({
            count: 1,
            sizeType: 'original',
            sourceType: ['album', 'camera'],
            success(files) {
                let tempFilePaths = files.tempFilePaths, tempFiles = files.tempFiles,
                src = tempFiles[0].path
                console.log(tempFilePaths, tempFiles, src);
                wx.compressImage({
                    src: src,
                    quality: 80,
                    success(compress) {
                        console.log("compress",compress);
                        const param = {url: src}
                        uploadImage(param).then(res => {
                            console.log(res);
                        }).catch(err => {
                            console.log(err);
                        })
                    },
                    fail(cerr) {
                        console.log(cerr);
                    }
                })

            },
            fail(fail) {
                console.log(fail);
            }
        })
    },
    // 上传前置狗子
    handleBeforeRead({ detail }) {
        console.log("handleBeforeRead",detail);
        const { file, callback } = detail;
        callback(true);
    },
    // 上传后置狗子
    async handleAfterRead({ detail }) {
    console.log("handleAfterRead", detail);
      const { file } = detail
      this.editFiles.push({ name: file.name, url: file.url, index: file.index, file: file})
    },
    handleCancel(data, index) {
        console.log(data);
        this.editFiles.splice(index, 1)
    },
    handleImageDelete({ detail }) {
        this.editFiles.splice(detail.index, 1``)
    },
    handleDelete(data) {
        uni.showModal({ title: '标题', content: '确定要删除此资料吗?' })
        .then((res) => {
            if (res.confirm) {
            }
        })
        .catch(() => {})
    },
    handleEdit(data) {
        this.showDialog = true
        this.currentEditId = data.id
    },
    handleClose() {
        this.showDialog = false
    },
    async handleConfirm() {
        const data = this.editFiles[0]
        const parse = {
            file_name: data.name,
            id: this.currentEditId,
            file: data.file
        }
        const res = await uploadImage(data,file ,parse);
        if (res.code == 0) {
            this.editFiles = []
            this.showDialog = false
        }
    },
    // 资料上传
    handleUpload() {
        
    },
    previewImage(urls, index) {
      uni.previewImage({ urls, current: urls[index] });
    },
    // 获取证件资料
    async getCertificateInfo() {

    },
    // 获取相关资料
    async getUserFileList() {

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
    width: 100%;
    padding-bottom: 40rpx;
    overflow: hidden;
    border-top: 20rpx solid #f2f6fc;

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
        height: 240rpx;
        margin-bottom: 20rpx;

        &-img {
            width: 300rpx;
            height: 200rpx;
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
    
    .card-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-top: 20rpx;

        .card-title {
            font-size: @font-size-lg;
            color: @text-color;
            border-bottom: @border;
        }

        &-btns {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
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

.edit-files {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

.edit-files-name {
    width: 600rpx;
    margin-left: 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
}

.upload-btn {
    padding: 10rpx 20rpx;
    color: #ffffff;
    font-size: @font-size-sm;
    background-color: @primary;
}

/deep/.van-uploader__upload input {
    margin: 0;
    padding: 0;
    width: 750rpx;
}
</style>