<template>
  <div>
    <header-top title="购买授信额度"></header-top>
    <main class='scroll-content-2'>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">现有授信额度</span>
          <span slot="right" class="danger-color fs-16">{{member.lineOfCrade}}</span>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">充值额度：</span>
          <input slot="right" v-model="money" type="tel" placeholder="请输入您要充值的授信额度"  @input="checkMoney" />
          <!-- <yd-input slot="right" v-model="money" placeholder="请输入您要充值的授信额度"  @input.native="checkMoney"></yd-input> -->
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">应付金额</span>
          <input slot="right" v-model="payMoney" type="text" readonly style="text-align:right;color:#ff5350;">
        </yd-cell-item>
        <!-- <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-wallet danger-color"></span>
          <span slot="left">会员余额 </span>
          <input slot="right" type="radio" value="0" v-model="payType" />
        </yd-cell-item> -->
        <!-- <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-weixinzhifu" style="color:#25d025;"></span>
          <span slot="left">微信支付</span>
          <input slot="right" type="radio" value="1" v-model="payType" @change="setPayMoney" />
        </yd-cell-item> -->
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-zhifubao" style="color:#00a0ea;"></span>
          <span slot="left">支付宝支付</span>
          <input slot="right" type="radio" value="2" v-model="payType" @change="setPayMoney" />
        </yd-cell-item>
        <!-- <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-yinlianzhifu1" style="color:#077d8d;"></span>
          <span slot="left">银联在线支付</span>
          <input slot="right" type="radio" value="3" v-model="payType" @change="setPayMoney" />
        </yd-cell-item> -->
      </yd-cell-group>
      <div style="padding:0 .4rem;">
        <yd-button :type="valid?'primary':'disabled'" size="large" @click.native="buy">确认购买</yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { addShouXin } from "../../api/index";
import { payMixin } from "components/common/mixin";
export default {
  name: "BuyShouxin",
  data() {
    return {
      money: "",
      payMoney: "",
      payType: "",
      pays: {}
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["member", "account"]),
    valid() {
      return /^\+?[1-9][0-9]*$/.test(this.money) && !!this.payType;
    }
  },
  mixins: [payMixin],
  // created() {
  //   this.getChannel();
  // },
  activated() {},
  methods: {
    checkMoney() {
      this.money = this.money.replace(/\D/g, "");
      this.setPayMoney();
    },
    setPayMoney() {
      this.payMoney = (+this.money * 0.12).toFixed(2);
    },
    buy() {
      let vm = this;
      mui.ajax({
        url: addShouXin,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          tradeMoney: this.money,
          type: this.payType,
          shouType:0,
          fileImage:"",
          account: this.account,
          token: md5(`gjfengaddShouXin${this.account}`)
        },
        success(res) {
          //银联
          if (vm.payType == "3") {
            vm.$store.commit("RECORD_PAY_INFO", res.result);
            vm.$router.push({ name: "YinLian" });
          } else if (vm.payType == "2") {
            // 支付宝
            vm.checkService(vm.pays["alipay"], function() {
              plus.payment.request(
                vm.pays["alipay"],
                res.result.alyString,
                function(result) {
                  // plus.nativeUI.alert(
                  //   "支付成功",
                  //   function() {
                  //     vm.$store.dispatch("getInfo");
                  //     vm.$router.go(-1);
                  //   },
                  //   "支付"
                  // );
                  vm.$dialog.alert({
                    mes:"支付成功！",
                    callback:()=>{
                      vm.$store.dispatch("getInfo");
                      vm.$router.go(-1);
                    }
                  })
                },
                function(e) {
                  //plus.nativeUI.alert("支付失败:" + e.message, null, "支付");
                  vm.$dialog.alert({
                    mes:"支付失败:" + e.message
                  })
                }
              );
            });
          } else if (vm.payType == "1") {
            // 微信
          } else {
            // 余额
            vm.$dialog.toast({
              mes: res.msg
            });
            vm.$store.dispatch("getInfo");
          }
        }
      });
    }
  }
};
</script>
