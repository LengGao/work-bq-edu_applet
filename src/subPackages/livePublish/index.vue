<template>
  <view class="live-publish">
    <view class="grid">
      <view class="grid-row">网页开播链接</view>
      <view class="grid-row">
        <text class="link">{{ liveInfo.web }}</text>
        <van-icon 
          name="newspaper-o" 
          size="32rpx"
          color="#199fff"
          custom-style="margin-left: 20rpx;" 
          @click="onCopy(liveInfo.web)"
        />
      </view>
    </view>

    <view class="hr"></view>
    <view class="grid border">
      <view class="grid-row">启动客户端链接</view>
      <view class="grid-row border">
        <text class="link">{{ liveInfo.client }}</text>
        <van-icon 
          name="newspaper-o" 
          size="32rpx"
          color="#199fff"
          custom-style="margin-left: 20rpx;" 
          @click="onCopy(liveInfo.client)"
        />        
      </view>

      <view class="grid-row">
        <view class="grid-col">
          频道号：{{ liveInfo.channelId }}
        </view>
        <view class="grid-col">
          登录密码：{{ liveInfo.channelPasswd }}
        </view>
      </view>
    </view>
    <view class="hr"></view>
    
    <view class="grid">
      <view class="grid-row">教务后台链接</view>
      <view class="grid-row border start" style="margin-bottom: 20rpx;">
        <text class="link">{{ liveInfo.teacher }}</text>
        <van-icon 
          name="newspaper-o" 
          size="32rpx"
          color="#199fff"
          custom-style="margin-left: 20rpx;" 
          @click="onCopy(liveInfo.teacher)"
        />
      </view>

      <template v-for="(item, index) in liveInfo.channel_account" >
        <view class="grid-row" :key="index">
          <view class="grid-col">
            频道号：{{ item.account }}
          </view>
          <view class="grid-col">
            登录密码：{{ item.passwd }}
          </view>
        </view>
      </template>
    </view>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      liveInfo: {
        web: 'https://live.polyv.net/web-start/classroom?channelId=',
        client: 'https://live.polyv.net/start-client.html?channelId=',
        teacher: 'https://live.polyv.net/teacher.html'
      }  
    };
  },
  onLoad(query) {    
    // console.log(query);
    let info = JSON.parse(decodeURIComponent(query.info)) || {},
        _liveInfo = this.liveInfo,
        channelId = info.channel_id

    _liveInfo.web = _liveInfo.web + channelId;
    _liveInfo.client = _liveInfo.client + channelId;
    _liveInfo.teatcher = _liveInfo.teacher + channelId;
  
    this.liveInfo = Object.assign(info, _liveInfo)
  },
  methods: {
    // 复制
    onCopy(data) {
      uni.setClipboardData({ data })
    },
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/var";

.grid {
  display: flex;
  flex-direction: column;
  padding: 20rpx;
}

.grid-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 64rpx;
  line-height: 72rpx;
}

.grid-col {
  width: 50%;
  font-size: @font-size-sm;
  color: @text-color-grey;
}

.grid-col-space {
  margin-left: 60rpx;
}

.title {
  color: @text-color;
}

.link {
  max-width: 720rpx;
  overflow: hidden;
  font-size: @font-size-sm;
  color: @text-color-grey;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.start {
  justify-content: flex-start;
}

.border {
  border-bottom: @border;
}

.hr {
  width: 100%;;
  height: 20rpx;
  background-color: @background-color;
}
</style>