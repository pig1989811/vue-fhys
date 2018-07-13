<template>
  <div>
    <header-top title="线下充值额度"></header-top>
    <main class='scroll-content-2'>
      <div class="fs-13 danger-color" style="padding:.2rem;">输入要充值的额度，系统计算实际需要支付的金额。然后识别下方二维码去付款，上传支付成功后的截图，即可购买授信额度。提交后24小时内处理</div>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">现有授信额度</span>
          <span slot="right" class="danger-color fs-16">{{member.lineOfCrade}}</span>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">充值额度</span>
          <input slot="right" v-model="money" style="text-align:right;" placeholder="请输入您要充值的授信额度" type="tel" @input="checkMoney" />
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">应付金额</span>
          <input slot="right" v-model="payMoney" type="text" readonly style="text-align:right;color:#ff5350;">
        </yd-cell-item>
      </yd-cell-group>
      <p class="tips">请确保截图清晰，文字可辨。</p>
      <div class="upload-container">
        <img :src="baseUrl" alt="" class="upload-preview">
        <div class="upload-icon">
          <span class="iconfont self-upload"></span>
          <input type="file" name="upload-box" id="" accept="image/*" @change="previewImg($event)">
        </div>
      </div>
      <div style="padding:.4rem;">
        <yd-button :type="valid?'primary':'disabled'" size="large" @click.native="buy">确认购买</yd-button>
      </div>
      <yd-cell-group>
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-zhifubao" style="color:#00a0ea;"></span>
          <span slot="left">支付宝</span>
          <input slot="right" type="radio" value="1" v-model="payType" />
        </yd-cell-item>
        <!-- <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-weixin" style="color:#25d025;"></span>
          <span slot="left">微信</span>
          <input slot="right" type="radio" value="2" v-model="payType" />
        </yd-cell-item> -->
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-wallet danger-color"></span>
          <span slot="left">其他方式</span>
          <input slot="right" type="radio" value="3" v-model="payType" />
        </yd-cell-item>
      </yd-cell-group>
      <div class="pay-box">
        <img :src="getLocalImg(qrUrl.src)" alt="" @click="getQrCode(qrUrl.url)">
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { addShouXin, imageUploadBStore } from "../../api/index";
import { localImg } from "components/common/mixin";
import "lrz/dist/lrz.bundle.js";
export default {
  name: "BuyShouxin2",
  data() {
    return {
      money: "",
      payMoney: "",
      baseUrl: "",
      payType: "1"
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["member", "account"]),
    valid() {
      return /^\+?[1-9][0-9]*$/.test(this.money) && !!this.baseUrl;
    },
    qrUrl() {
      switch (this.payType) {
        case "1":
          return {
            url: "https://qr.alipay.com/aex023507fntwoqeozvcg88",
            src: "ali_pay.png"
          };
          break;
        case "2":
          return "weixin_pay.jpg";
          break;
        default:
          return {
            url: "https://qr.alipay.com/aex023507fntwoqeozvcg88",
            src: "ali_pay.png"
          };
          break;
      }
    }
  },
  mixins: [localImg],
  created() {},
  activated() {},
  methods: {
    checkMoney() {
      this.money = this.money.replace(/\D/g, "");
      this.setPayMoney();
    },
    setPayMoney() {
      this.payMoney = (+this.money * 0.12).toFixed(2);
    },
    previewImg(event) {
      let headImg = document.querySelector(".upload-preview"),
        file = event.target.files[0];
      if (!/image\/\w+/.test(file.type)) {
        this.$dialog.toast({
          mes: "请上传图片",
          timeout: 1000,
          icon: "error"
        });
        return;
      }
      let vm = this;
      this.$dialog.loading.open("上传中...");
      lrz(file, { width: 800 }).then(rst => {
        mui.ajax({
          url: imageUploadBStore,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            fileName: "123.png",
            fileContent: rst.base64
          },
          success(res) {
            vm.$dialog.loading.close();
            vm.baseUrl = res.result;
          }
        });
      });
    },

    buy() {
      let vm = this;
      mui.ajax({
        url: addShouXin,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          tradeMoney: this.money,
          type: "6",
          shouType: 1,
          account: this.account,
          token: md5(`gjfengaddShouXin${this.account}`),
          fileImage: this.baseUrl
        },
        success(res) {
          if (res.code == 200) {
            vm.$dialog.alert({
              mes: "提交成功，等待审核！"
            });
          } else {
            vm.$dialog.alert({
              mes: "提交失败，请重试！"
            });
          }
        }
      });
    },
    getQrCode(r) {
      this.$dialog.confirm({
        title: "提示",
        mes: "打开相关应用去支付？",
        opts: () => {
          plus.runtime.openURL(r);
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.pay-box {
  .pd-v;
  img {
    display: block;
    margin: @pd auto;
    .wh(3rem,3rem);
  }
}
.tips {
  font-size: 12px;
  color: #999;
  margin: 0 0 @pd @pd;
}
.upload-container {
  position: relative;
  .pd-h;
  min-height: 1rem;
  .upload-preview {
    display: block;
    width: 4rem;
    max-height: 5rem;
    margin: 0 auto;
  }
  .upload-icon {
    .hv-cen;
    span {
      font-size: 40px;
    }
    input[type="file"] {
      position: absolute;
      left: 0;
      .wh(100%, 40px);
      top: 0;
      opacity: 0;
    }
  }
}
</style>