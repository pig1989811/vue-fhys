<template>
  <div>
    <header-top title="余额转入"></header-top>
    <main class='scroll-content-2'>
      <div class="tips" style="padding:.2rem;">当前余额：
        <span class="danger-color">{{balanceMoney}}</span>（转入收取10%手续费,另将10%转入会员义务消费，用于商城购物）
      </div>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">转入金额：</span>
          <yd-input slot="right" v-model="money" placeholder="请输入转入金额(200~50000)"></yd-input>
        </yd-cell-item>
      </yd-cell-group>
      <div style="padding:0 .2rem;">
        <yd-button :type="valid?'warning':'disabled'" size="large" @click.native="transfer">确认转入</yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import {
  toBalanceTransferPage,
  transderBalanceToTreasure
} from "../../api/index";
export default {
  name: "TreasureIn",
  data() {
    return {
      money: ""
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["balanceMoney", "account"]),
    valid() {
      return !isNaN(this.money) && this.money >= 200 && this.money <= 50000;
    }
  },
  created() {},
  activated() {},
  methods: {
    transfer() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: transderBalanceToTreasure,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          money: this.money,
          token: md5(
            `gjfengtransderBalanceToTreasure${this.account}${this.money}`
          )
        },
        success(res) {
          vm.$dialog.loading.close();
          vm.$dialog.alert({
            mes:res.msg,
            callback:()=>{
              res.code==200&&vm.$store.dispatch('getInfo');
            }
          })
        }
      });
    }
  }
};
</script>