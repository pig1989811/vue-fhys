<template>
  <div>
    <main class='scroll-content' style="top:0;background-color: #000000;">
      <div id="bcid">
        <p class="tip">...载入中...</p>
      </div>
    </main>
    <footer>
      <div class="fbt fbt-cancel" @click="goBack">取 消</div>
      <div class="fbt fbt-flash" @click="flash">{{!flashTag?'开启':'关闭'}}闪光灯</div>
      <!-- <div class="fbt fbt-gallery" @click="scanPicture">从相册选择</div> -->
      <div class="fbt fbt-gallery" @click="restart">重新开始</div>
    </footer>
  </div>
</template>
<script>
export default {
  name: "Scan",
  data() {
    return {
      oldBack: mui.back,
      flashTag: false,
      scan: null
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      mui.back = vm.goBack;
    });
  },
  beforeRouteLeave(to, from, next) {
    mui.back = this.oldBack;
    next();
  },
  activated () {
    this.initScan();
  },
  methods: {
    initScan() {
      let vm = this;
      this.scan = new plus.barcode.Barcode(
        "bcid",
        [plus.barcode.QR, plus.barcode.EAN8, plus.barcode.EAN13],
        { frameColor: "#00FF00", scanbarColor: "#00FF00" }
      );
      this.scan.onmarked = function(type, code, file) {
        code = code.replace(/\n/g, "");
        plus.runtime.openURL(code);
      };
      this.scan.start();
    },
    goBack() {
      this.scan.cancel();
      this.scan.close();
      this.$router.go(-1);
    },
    flash() {
      if (!this.flashTag) {
        this.flashTag = true;
        this.scan.setFlash(true);
      }
      else{
        this.flashTag = false;
        this.scan.setFlash(false);
      }
    },
    scanPicture() {
      let vm = this;
      plus.gallery.pick(
        function(path) {
          plus.barcode.scan(
            path,
            function(type, code, file) {
              code = code.replace(/\n/g, "");
              // vm.scan.cancel();
              // vm.scan.close();
              plus.runtime.openURL(code);
            },
            function(error) {
              plus.nativeUI.alert("无法识别此图片");
            }
          );
        },
        function(err) {
          plus.nativeUI.alert("获取失败: " + err.message);
        }
      );
    },
    restart(){
      this.scan ? this.scan.start() : this.initScan();
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
#bcid {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  text-align: center;
  .tip {
    .hv-cen;
    color: @white;
    font-weight: bold;
    text-shadow: 0px -1px #103e5c;
    font-size: 0.32rem;
  }
}

footer {
  position: absolute;
  .wh(100%,1rem);
  bottom: 0px;
  line-height: 1rem;
  text-align: center;
  color: @white;
  font-size: 0.32rem;
  display: flex;
  flex-wrap: nowrap;
  .fbt {
    flex: 1;
    height: 100%;
    &.fbt-cancel {
      background-color: @red;
    }
    &.fbt-flash {
      background-color: #ffcc33;
    }
    &.fbt-gallery {
      background-color: @blue;
    }
    &:active{
      box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>