<template>
  <div>
    <header-top title="商家列表"></header-top>
    <yd-cell-group>
      <yd-cell-item>
        <span slot="left">商家总数</span>
        <span slot="right">{{list.length}}个</span>
      </yd-cell-item>
    </yd-cell-group>
    <main class='scroll-content-1'>
      <yd-infinitescroll :callback="getList" ref="shoplist">
        <ul slot="list">
          <li v-for="(item,index) in list" :key="index" class="item">
            <div class="top-box flex just-between align-center">
              <div class="title">
                <span class="iconfont-large self-renzheng danger-color"></span>
                {{format(item.storeName)}}
              </div>
              <div class="tel">{{format(item.sellerMobile,4)}}</div>
            </div>
            <div class="middle-box flex align-center text-center">
              <div class="flex-1 bd-right-2">
                <p>{{formatPrice(item.storeSaleTotalMoney)}}</p>
                <p>总营业额</p>
              </div>
              <div class="flex-1">
                <p class="danger-color">{{formatPrice(item.storeMonthSaleTotalMoney)}}</p>
                <p>当月营业额</p>
              </div>
            </div>
          </li>
        </ul>
      </yd-infinitescroll>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { findNextAgent } from "../../api/index";
export default {
  name: "ShopList",
  data() {
    return {
      noData: false,
      pageNo: 1,
      list: []
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account"])
  },
  created() {
    this.getList();
  },
  activated() {},
  methods: {
    format(o, d = 2) {
      if (!o) return "";
      return o.substr(0, d) + "****";
    },
    getList() {
      if (!this.noData) {
        let vm = this;
        mui.ajax({
          url: findNextAgent,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            account: this.account,
            pageNo: this.pageNo,
            pageSize: 10,
            token: md5(`gjfengfindNextAgent${this.account}`)
          },
          success(res) {
            if (res.code == 200) {
              let _result = res.result.agentList;
              vm.list = [...vm.list, ..._result];
              if (_result.length < 10) {
                vm.noData = true;
                vm.$refs.shoplist.$emit("ydui.infinitescroll.loadedDone");
                return;
              }
              vm.$refs.shoplist.$emit("ydui.infinitescroll.finishLoad");
              vm.pageNo++;
            } else {
              vm.$dialog.toast({
                mes: res.msg
              });
            }
          }
        });
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.item {
  width: 90%;
  margin: @pd auto;
  .pd;
  background-color: @white;
  border-radius: @pd;
  .top-box {
    padding-bottom: @pd;
    border-bottom: 1px solid #f7f5f5;
  }
  .title {
    font-size: 0.32rem;
  }
  .tel {
    font-size: 0.28rem;
  }
  p:first-of-type {
    font-size: 0.32rem;
    margin-bottom: 0.1rem;
  }
  p:last-of-type {
    color: @lightgray;
  }
  .bd-right-2 {
    border-right: 1px solid #ccc;
  }
  .middle-box {
    .pd-v;
  }
}
</style>