<template>
  <div>
    <header-top title="快捷支付申请"></header-top>
    <main class='scroll-content-2'>
      <section style="margin-top:.4rem;">
        <router-link :to="{path: '/trade/bankcard?type=choose'}" class="bank-card flex align-center" v-if="defaultBankCard">
        <div class="icon" :style="{'background-image':formatBg(defaultBankCard.bankPic)}"></div>
        <div class="bank-name flex-1">
          <p>{{defaultBankCard.bankName}}</p>
          <p>卡号：{{defaultBankCard.bankCard}}</p>
        </div>
        <span class="iconfont self-right"></span>
      </router-link>
      <yd-cell-group v-else>
        <yd-cell-item arrow href="/trade/newbank" type="link">
          <span slot="icon" class="iconfont self-yinhangka"></span>
          <span slot="left">银行卡</span>
          <span slot="right">去添加</span>
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">身份证号码：</span>
          <!-- <span slot="right" class="fs-14">{{payInfo.idCard}}</span> -->
          <yd-input slot="right" v-model="payInfo.idCard" type="tel"></yd-input>
        </yd-cell-item>
          <yd-cell-item>
          <span slot="left">&emsp;支付金额：</span>
          <!-- <span slot="right" class="fs-14">{{payInfo.payMoney}}</span> -->
          <yd-input slot="right" v-model="payInfo.payMoney" type="tel" :disabled="true"></yd-input>          
        </yd-cell-item>
          <yd-cell-item>
          <span slot="left">&emsp;电话号码：</span>
          <!-- <span slot="right" class="fs-14">{{payInfo.mobile}}</span> -->
          <yd-input slot="right" :value="account" type="tel" :disabled="true"></yd-input>          
        </yd-cell-item>
      </yd-cell-group>
      <div style="padding:0 .2rem;">
        <p class="danger-color">*支付说明：请确认支付信息正确，否则无法进行支付</p>
        <yd-button type="warning" size="large" @click.native="sureInfo">确认信息</yd-button>
      </div>
      </section>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { yinLPay} from "../../api/index";
import { mixin } from "components/common/mixin";

export default {
  name: "YinLian",
  data() {
    return {
      info:null,
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account", "defaultBankCard", "payInfo"])
  },
  created() {},
  activated() {
    if (!this.defaultBankCard) {
      this.$store.dispatch("getBankList");
    }
  },
  mixins: [mixin],
  methods: {
    sureInfo() {
      if(!this.defaultBankCard && !this.defaultBankCard.bankCard){
        this.$dialog.alert({
          mes:"请先添加银行卡信息"
        })
        return;
      }
      if(!this.payInfo.idCard){
        this.$dialog.alert({
          mes:"请先输入身份证信息"
        })
        return;
      }

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
          token: md5(`gjfengyinLPay`)
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res.code == 200) {
            vm.info=res.result;
            vm.$dialog.alert({
              mes:res.msg,
              callback:()=>{
                vm.$router.replace({name:"YinLianConfirm"})
              }
            })
          }
          //订单号存在，重新交易||获取动态秘钥失败
          else {
            vm.$dialog.alert({
              mes:res.msg
            })
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