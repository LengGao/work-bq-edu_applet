<template>
  <view class="certificate-information">
    <view class="certificate">
      <view class="certificate-info" v-for="(item, index) in informationImages" :key="index" @click="item.iamge ? previewImageCertificate(item) : upCertificate(item)">
        <image class="certificate-info-img" mode="aspectFit" :src="item.iamge || defaultImage" />
        <text class="certificate-info-text">{{item.text}}</text>
        <van-icon v-if="item.iamge"  name="cross" class="btn-delete" @click.native.stop="handleImageDelete(item)" />
      </view>
    </view>

    <view class="information">
        <view class="information-header">
            <Title title="资料信息" customStyle="padding-left: 10rpx;"></Title>
        </view>
        <template v-if="informations.length > 0">
        <view class="information-card" v-for="item in informations" :key="item.id">
            <view class="card-header">
                <view class="card-header-title">{{ item.file_name }}</view>
                <view class="card-header-btns">
                    <van-button custom-class="card-header-btn" icon="edit" size="small" plain  @click="handleEdit(item)">编辑</van-button>
                    <van-button custom-class="card-header-btn" icon="delete-o"  size="small" plain  @click="handleDelete(item.id)">删除</van-button>
                </view>
            </view>
            <view class="card-item">
                <image class="card-item-img" mode="aspectFit" :src="getImg(item)" @click="previewImageInformation(item)">
                <view class="card-item-info">
                    <view class="format">文件格式<text class="value">{{ item.suffix }}</text></view>
                    <view class="size">文件大小<text class="value">{{ item.size }}</text></view>
                </view>
            </view>
        </view>
        </template>  
        <template v-else>
            <view class="no-data">
                <image class="img" src="../../../static/no-data.png"></image>
                <view class="text"><slot>暂无数据</slot></view>
            </view>
        </template>  
    </view>

    <van-dialog
        use-slot
        use-title-slot
        show-cancel-button
        confirm-button-text="确定"
        class-name=“edit-modal”
        :show="showDialog"
        @close="handleClose"
        @confirm="handleConfirm" 
        :before-close="handelBeforeClose"
        confirmButtonColor="#199fff"
        cancelButtonColor="#199fff"
    >
        <template slot="title" >
            <view class="edit-modal-title">编辑资料</view>
        </template>
        <view class="edit-modal-content">
            <van-field 
                customStyle="border: 1rpx solid #ebedf0;"
                :border="false"
                :error-message="errorMessage"
                placeholder="请输入资料名称"  
                input-class="edit-modal-input"
                :value="editData.file_name"
                @change="handleInput"
                />    
        </view>
    </van-dialog>
  </view>
</template>

<script>
import Title from "@/components/title/index2.vue";
import NoData from "@/components/noData/index.vue";

import {
  getCertificateInfo,
  getUserFileList,
  updateFileName,
  deleteFile,
  modifyCertificate,
} from "@/api/customer";
import { upLoadFile, chooseImage } from "@/utils/api";

export default {
  components: { Title, NoData },
  props: {
    value: {
      type: String,
      default: "",
    },
    uid: {
      type: String,
      default: "120462",
    },
  },
  data() {
    return {
      total: 0,
      page: 1,
      certificate: {},
      informations: [],
      informationImages: [
        { type: "portrait", iamge: "", text: "免冠正面照" },
        { type: "photo_id_card_emblem", iamge: "", text: "身份证国徽面" },
        { type: "photo_id_card", iamge: "", text: "身份证人像面" },
        { type: "photo_residence_permit", iamge: "", text: "社保卡/居住证" },
        { type: "graduation_certificate", iamge: "", text: "毕业证扫描件" },
        { type: "photo_commitment", iamge: "", text: "工作年限承诺书" },
        { type: "photo_health", iamge: "", text: "个人健康承诺书" },
      ],
      defaultImage: "../../../static/upload.png",
      defaultFileIcon: "../../../static/file.png",
      showDialog: false,
      editData: {
        id: "",
        file_name: "",
      },
      errorMessage: "",
      suffixMap: ["png", "jpng", "jpg", "psd", "gif", "tiff", "tga", "eps"]
    };
  },
  mounted() {
    this.getCertificateInfo();
    this.getUserFileList();
  },
  methods: {
    // 图片过滤
    getImg(item) {
      return this.suffixMap.indexOf(item.suffix) !== -1
        ? item.oss_url
        : this.defaultFileIcon;
    },
    // 证件上传
    async upCertificate(item) {
      let upOptions = { url: "", filePath: "", name: "", formData: {} }
      let params = this.certificate
      let type = item.type
      let imgOptions = { count: 1, sizeType: ["original", "compressed"], sourceType: ["album", "camera"] }

      const image = await chooseImage(imgOptions).catch((err) => {});

      upOptions.filePath = image.tempFiles[0].path;
      upOptions.name = "image";
      upOptions.url = "/oss/uploadImage";

      let res = await upLoadFile(upOptions).catch((err) => {});
      let data = JSON.parse(res.data);

      if (data.code == 0) {
        params[type] = data.data.data.url;
        let modify = await modifyCertificate(params).catch(() => {});
        if (modify.code == 0) {
          this.certificate = params;
          uni.showToast({ icon: "none", title: "添加成功" });
          this.getCertificateInfo();
        }
      }
    },
    // 预览
    previewImageInformation(item) {
      if (this.suffixMap.includes(item.suffix)) {
        const urls = [item.oss_url], index = 0
        uni.previewImage({ urls, current: urls[index] });
      }
    },
    previewImageCertificate(item) {
      const urls = [item.iamge], index = 0
      uni.previewImage({ urls, current: urls[index] });
    },
    // 删除编辑文件
    async handleImageDelete(item) {
      let params = this.certificate
      let type = item.type
      let modalOption = { title: "", content: "确定要删除此资料吗?", showCancel: true, cancelColor: "#199fff", confirmColor: "#199fff" };
      let modal = await uni.showModal(modalOption);
      if (modal[1].confirm) {
        params[type] = "";
        let res = await modifyCertificate(params).catch(() => {});
        if (res.code == 0) {
          uni.showToast({ icon: "none", title: "修改成功" });
          this.getCertificateInfo();
        }
      }
    },
    // 阻止dialog 关闭事件冒泡
    handelBeforeClose(event) {
      if (event == 'cancel') return true;
      return false;
    },
    // 确认编辑
    async handleConfirm(event) {      
      const params = this.editData,
        errorMessage = this.errorMessage;
      if (errorMessage !== "") {
        return event.stopPropagation();
      } else {
        let res = await updateFileName(params).catch(() => {});
        if (res.code == 0) {
          uni.showToast({ icon: "none", title: "操作成功" });
          this.showDialog = false;
          this.getUserFileList();
        }
      }
    },
    // 删除
    async handleDelete(id) {
      let params = { id: id },
        modalOption = {
          title: "标题",
          content: "确定要删除此资料吗?",
          showCancel: true,
          cancelColor: "#199fff",
          confirmColor: "#199fff",
        };
      let modal = await uni.showModal(modalOption);
      if (modal[1].confirm) {
        let res = await deleteFile(params).catch(() => {});
        if (res.code === 0) {
          this.getUserFileList();
        }
      }
    },
    handleInput({ detail }) {
      if (detail === "") {
        this.errorMessage = "文件名不能为空";
      } else {
        this.errorMessage = "";
      }
      this.editData.file_name = detail;
    },
    // 打开编辑
    handleEdit(data) {
      this.showDialog = true;
      this.editData = { id: data.id, file_name: data.file_name };
    },
    // 取消编辑
    handleClose() {
      this.showDialog = false;
    },
    // 获取证件资料
    async getCertificateInfo() {
      let params = { uid: this.uid };
      let { data } = await getCertificateInfo(params).catch((err) => {});
      this.transfromData(data);
      this.certificate = data;
    },
    // 获取相关资料
    async getUserFileList() {
      const params = { uid: this.uid, page: 1, search_box: "" };
      const res = await getUserFileList(params).catch((err) => {});
      this.informations = res.data.list;
      this.total = res.data.total;
    },
    // 转换请求数据为目标结构
    transfromData(data = {}) {
      const list = this.informationImages;
      for (let i = list.length - 1; i >= 0; i--) {
        const item = list[i],
          key = item.type;
        item.iamge = data[key];
      }
      this.informationImages = list;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/var";

.certificate-information {
  width: 100%;
  padding-bottom: 80rpx;
  overflow: hidden;
  border-top: 20rpx solid #f2f6fc;

  .certificate {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 40rpx 40rpx;
  }

  .certificate-info {
    position: static;
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
      margin-top: 10rpx;
      font-size: @font-size-xs;
      color: @text-color-grey;
    }
  }

  .information {
    padding: 0 30rpx;
  }

  .information-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 64rpx;
    list-style: 64rpx;
    font-size: @font-size-md;
    color: @text-color;
  }

  .information-card {
    margin-top: 20rpx;
    padding: 0 20rpx;
    border: @border;
  }

  .card-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 94rpx;
    border-bottom: @border;

    .card-title {
      font-size: 42rpx;
      font-weight: 700;
      color: @text-color;
      border-bottom: @border;
    }

    &-btns {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
    }

    /deep/.card-header-btn {
      border: none;
      color: @text-color-grey;
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
      font-size: @font-size-xs;
      line-height: 48rpx;
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
      margin-left: 10rpx;
      color: @text-color;
    }
  }

  .edit-modal {
    &-title {
      margin-bottom: 20rpx;
      font-size: 42rpx;
      color: @text-color;
    }

    &-content {
      padding: 40rpx;
    }
  }
}

.btn-delete {
  position: relative;
  bottom: 210rpx;
  left: 135rpx;
  font-size: 32rpx;
  color: #ccc;
}

/deep/.edit-modal-input {
  font-size: @font-size-md;
}

.no-data {
  display: block;
  width: 100%;
  height: 300rpx;
  text-align: center;
  .img {
    width: 280rpx;
    height: 264rpx;
  }
  .text {
    color: #999;
  }
}
</style>
