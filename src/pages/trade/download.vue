<template>
  <div>
    <header-top title="资料下载"></header-top>
    <main class='scroll-content-2'>
      <div class="tips" v-if="ios">iOS系统如果下载失败，请自行复制链接，然后粘贴到safari浏览器地址栏打开</div>
      <yd-accordion accordion>
        <yd-accordion-item :title="item.title" v-for="(item,index) in info" :key="index" :open="true">
          <div class="download-item flex align-center just-center">
            <span class="iconfont self-download" @click="download(item.link)" v-if="ios">点击下载</span>
            <p v-if="ios">{{item.link}}</p>
            <a :href="item.link" class="iconfont self-download" :download="item.title" v-else>点击下载</a>
          </div>
        </yd-accordion-item>
      </yd-accordion>
    </main>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
export default {
  name: "Download",
  data() {
    return {
      info: [
        {
          title: "凤凰云商会员注册协议.docx",
          link:
            "http://jfh.jfeimao.com/gjfeng-web-client/upload/file/凤凰云商会员注册协议.docx"
        },
        {
          title: "广东凤凰网络科技股份有限公司商家入驻合同.doc",
          link:
            "http://jfh.jfeimao.com/gjfeng-web-client/upload/file/广东凤凰网络科技股份有限公司商家入驻合同.doc"
        }
      ],
      ios: true
    };
  },
  components: { HeaderTop },
  created() {
    let u = navigator.userAgent;
    this.ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  },
  methods: {
    download(url) {
      var codeUrl = url;
      // plus.nativeUI.showWaiting( "加载中..." );
      var dtask = plus.downloader.createDownload(codeUrl, {}, function(
        d,
        status
      ) {
        // plus.nativeUI.closeWaiting();
        // 下载完成
        if (status == 200) {
          alert(`下载成功：`+d.filename);
        } else {
          alert("下载失败: " + status);
        }
      });
      dtask.start();
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.download-item {
  padding-left: @pd;
  .mg-v;
  span,
  a {
    color: @blue;
  }
}
.tips {
  .pd;
  color: @red;
}
</style>