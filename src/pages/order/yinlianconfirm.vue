<template>
  <div>
    <header-top title="快捷支付确认"></header-top>
    <main class='scroll-content-2'>
      <section style="padding:0 .2rem;margin-top: 1rem;">
        <yd-cell-group>
          <yd-cell-item>
            <span slot="left">验证码：</span>
            <yd-input slot="right" v-model="verifyCode" type="tel" placeholder="请输入手机验证码" required></yd-input>
          </yd-cell-item>
        </yd-cell-group>
        <yd-button :type="valid?'primary':'disabled'" size="large" @click.native="doPay">确认支付</yd-button>
      </section>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { yinLPayCofirom } from "../../api/index";

export default {
  name: "YinLianConfirm",
  data() {
    return {
      verifyCode: ""
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account", "defaultBankCard", "payInfo"]),
    valid() {
      return /^\d{6}$/.test(this.verifyCode);
    }
  },
  created() {},
  activated() {
    if (!this.defaultBankCard) {
      this.$store.dispatch("getBankList");
    }
    this.verifyCode = "";
  },
  methods: {
    getCode() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: yinLPay,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          orderId: this.payInfo.orderId,
          payMoney: this.payInfo.payMoney,
          retUrl: this.payInfo.retUrl,
          accNo: this.defaultBankCard.bankCard,
          mobile: this.payInfo.mobile,
          account: this.account,
          token: md5(`yinLPay`)
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res.code == 200) {
            vm.info = res.result;
            vm.$dialog.toast({
              mes: res.msg
            });
          } else {
            vm.$dialog.toast({
              mes: res.msg
            });
          }
        }
      });
    },
    doPay() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: yinLPayCofirom,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          orderId: this.payInfo.orderId,
          payMoney: this.payInfo.payMoney,
          verifyCode: this.verifyCode,
          accNo: this.defaultBankCard.bankCard,
          mobile: this.payInfo.mobile,
          account: this.account,
          token: md5(`gjfengyinLPayCofirom`)
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res.code == 200) {
            vm.$dialog.toast({
              mes: res.msg,
              callback: () => {
                vm.$router.go(-2);
              }
            });
          } else {
            // else if(res.code==400){
            //   vm.$dialog.alert({
            //     mes:res.msg,
            //     callback:()=>{
            //       vm.getCode();
            //     }
            //   })
            // }
            vm.$dialog.alert({
              mes: res.msg
            });
          }
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.bank-card {
  .pd;
  background-color: @white;
  margin-bottom: @pd;
  .icon {
    .wh(0.8rem, 0.8rem);
    background-size: cover;
  }
  .bank-name {
    margin-left: @pd;
    color: @lightgray;
    text-align: left;
    p {
      margin-bottom: 0.1rem;
      &:first-of-type {
        font-size: 15px;
        color: #333;
      }
      &.selected {
        color: @red;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>