<template>
  <div>
    <header-top title="我的二维码"></header-top>
    <main class='scroll-content-2'>
      <section class="qr-container">
        <!-- <div class="head-box" :style="{'background-image':'url('+getImgPath(member.imgHeadUrl)+')'}">
        </div> -->
        <img :src="getImgPath(member.imgHeadUrl)" alt="头像" class="head-img">
        <div class="qr-box">
          <img :src="info.imgAppQrUrl" alt="二维码">
        </div>
        <div class="qr-img img-1" :style="{'background-image':formatBg('qr-1.png')}"></div>
        <div class="qr-img img-2" :style="{'background-image':formatBg('qr-2.png')}"></div>
        <div class="qr-img img-3" :style="{'background-image':formatBg('qr-3.png')}"></div>
        <div class="qr-img img-4" :style="{'background-image':formatBg('qr-4.png')}"></div>
        <div class="qr-img img-5" :style="{'background-image':formatBg('qr-5.png')}"></div>
        <div class="qr-desc fs-16">购物有优惠，惊喜天天有</div>
      </section>
      <!-- <section class="share-container text-center">
        <h3 class="fs-16">分享到</h3>
        <ul class="flex just-around align-center">
          <li @click="shareAction('weixin','WXSceneSession')">
            <span :style="{'background-image':formatBg('weixin.png')}" class="share-icon"></span>
            <p class="fs-14">微信好友</p>
          </li>
          <li @click="shareAction('weixin','WXSceneTimeline')">
            <span :style="{'background-image':formatBg('pengyouquan.png')}" class="share-icon"></span>
            <p class="fs-14">朋友圈</p>
          </li>
          <li @click="shareAction('sinaweibo')">
            <span :style="{'background-image':formatBg('sina.png')}" class="share-icon"></span>
            <p class="fs-14">新浪微博</p>
          </li>
        </ul>
      </section> -->
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { mixin } from "components/common/mixin";
import { myQr } from "../../api/index";
export default {
  name: "QrCode",
  data() {
    return {
      shares: {},
      info: {}
    };
  },
  components: { HeaderTop },
  computed: { ...mapState(["member"]) },
  mixins: [mixin],
  created() {
    this.getInfo();
  },
  activated() {
    // this.updateServices();
  },
  methods: {
    getInfo() {
      let vm = this;
      // this.dialog.loading.open();
      mui.ajax({
        url: myQr,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.member.mobile,
          token: md5(`gjfengmyQr`)
        },
        success(res) {
          // vm.dialog.loading.close();
          vm.info = res.result;
        }
      });
    },
    updateServices() {
      plus.share.getServices(s => {
        for (var i in s) {
          var t = s[i];
          this.shares[t.id] = t;
        }
      });
    },
    shareAction(type, extraScene) {
      if (!this.shares || !this.shares[type]) {
        this.$dialog.toast({
          mes: "未找到相关分享服务!"
        });
        return;
      }
      var msg = {
        content: "扫一扫我的二维码",
        extra: {
          scene: extraScene
        },
        pictures: [this.info.imgAppQrUrl]
      };
      if (this.shares[type].authenticated) {
        this.shareMessage(msg, this.shares[type]);
      } else {
        this.shares[type].authorize(
          () => {
            this.shareMessage(msg, this.shares[type]);
          },
          e => {
            this.$dialog.alert({
              mes: `认证授权失败：${e.message}`
            });
          }
        );
      }
    },
    shareMessage(msg, s) {
      s.send(
        msg,
        () => {
          this.$dialog.toast({
            mes: "分享成功"
          });
        },
        e => {
          this.$dialog.alert({
            mes: `分享失败：${e.message}`
          });
        }
      );
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.qr-container {
  position: relative;
  top: 1.3rem;
  width: 6.5rem;
  background-color: @white;
  margin: 0 auto;
  padding: 1rem 0 1.8rem;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(232, 142, 44, 0.3);
  text-align: center;
  .head-box {
    .h-cen;
    top: -1rem;
    .wh(1.8rem,1.8rem);
    border: 5px solid rgba(232, 142, 44, 0.3);
    border-radius: 50%;
    z-index: 5;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .head-img {
    .h-cen;
    top: -1rem;
    .wh(1.8rem,1.8rem);
    border: 5px solid rgba(232, 142, 44, 0.3);
    border-radius: 50%;
  }
  .qr-box {
    .wh(4rem,4rem);
    margin: 0 auto;
    img {
      width: 100%;
    }
  }
  .qr-img {
    position: absolute;
    .wh(1rem,1rem);
    background-size: cover;
    opacity: 0.5;
    &.img-1 {
      top: 0.5rem;
      left: -0.2rem;
    }
    &.img-2 {
      opacity: 0.8;
      top: 0.3rem;
      right: 0.2rem;
    }
    &.img-3 {
      opacity: 1;
      bottom: 1.2rem;
      left: 0.4rem;
    }
    &.img-4 {
      right: -0.2rem;
      bottom: 0.2rem;
    }
    &.img-5 {
      right: 0.4rem;
      bottom: -0.2rem;
    }
  }
  .qr-desc {
    .h-cen;
    bottom: 0.8rem;
    width: 5rem;
  }
}
.share-container {
  background-color: @white;
  width: 6rem;
  margin: 2rem auto 0;
  padding: 0.3rem 0;
  color: #333;
  h3 {
    margin-bottom: @pd;
  }
  p {
    margin-top: @pd;
  }
  .share-icon {
    display: block;
    margin: 0 auto;
    .wh(30px,30px);
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>