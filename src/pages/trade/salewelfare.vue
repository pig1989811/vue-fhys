<template>
  <div>
    <header-top title="销售福利"></header-top>
    <main class='scroll-content-2'>
      <section v-if="info.length">
        <ul>
          <li class="item" v-for="(item,index) in info" :key="index">
            <div class="item-top flex just-between align-center">
              <p>
                <span class="iconfont-large self-mairu" style="color:#f9a340;" v-if="item.tradeType=='0'"></span>
                <span class="iconfont-large self-maichu  danger-color" v-if="item.tradeType=='1'"></span>
                <span class="time">{{formatTime(item.addTime)}}</span>
              </p>
              <span class="money">{{item.tradeMoney}}
                <span class="fs-14">元</span>
              </span>
            </div>
            <div class="item-bottom flex just-between align-center">
              <span class="status status-0" v-if="item.tradeType=='0'">{{member.name}}</span>
              <span class="status status-1" v-if="item.tradeType=='1'">{{storeInfo.storeName}}</span>
            </div>
          </li>
        </ul>
      </section>
      <section class="hv-cen text-center" v-else>
        <span class="iconfont self-noorder" style="font-size:40px;"></span>
        <p>没有数据</p>
      </section>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { getSalesWelfare, myStore } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "SaleWelfare",
  data() {
    return {
      info: []
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["member", "storeInfo"])
  },
  mixins: [mixin],
  created() {
    this.getInfo();
    this.getMyStore();
  },
  methods: {
    getMyStore() {
      let vm = this;
      mui.ajax({
        url: myStore,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.member.mobile,
          token: md5(`gjfengmyStore${this.member.mobile}`)
        },
        success(res) {
          vm.$store.commit("RECORD_STORE_INFO", res.result);
        }
      });
    },
    getInfo() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: getSalesWelfare,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.member.mobile,
          token: md5(`gjfenggetSalesWelfare${this.member.mobile}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          vm.info = res.result;
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.item {
  background-color: @white;
  margin-top: @pd;
  .pd;
  .time {
    font-size: 15px;
    margin-left: @pd;
    vertical-align: 2px;
  }
  .money {
    color: @red;
    font-size: 20px;
    vertical-align: top;
  }
  .status {
    font-size: 0.28rem;
    &.status-0 {
      color: @blue;
    }
    &.status-1 {
      color: @green;
    }
  }
}
</style>