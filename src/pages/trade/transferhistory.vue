<template>
  <div>
    <header-top :title="$route.query.type==0?'转移记录':'合并记录'"></header-top>
    <main class='scroll-content-2'>
      <section v-if="$route.query.type==0">
        <yd-infinitescroll :callback="getInfo" ref="historyList">
          <ul slot="list">
            <li class="item" v-for="(item,index) in info" :key="index">
              <div class="flex just-between">
                <span>{{formatTime(item.addTime)}}</span>
                <span>{{tranferType(item.transferType)}}</span>
              </div>
              <div class="flex just-between">
                <span>转移对象</span>
                <p>
                  <span>{{item.transferMemberName}}</span>
                  <span>{{item.transferMemberMobile}}</span>
                </p>
              </div>
              <div class="flex just-between">
                <span>转移数额</span>
                <span>{{item.transferData}}</span>
              </div>
              <div class="flex just-between">
                <span>实际转额</span>
                <span>{{item.actualTransferMoney}}</span>
              </div>
              <div class="flex just-between">
                <span>转移前</span>
                <span>{{item.memberDataBf}}</span>
              </div>
              <div class="flex just-between">
                <span>转移后</span>
                <span class="danger-color">{{item.memberDataAf}}</span>
              </div>
            </li>
          </ul>
        </yd-infinitescroll>
      </section>
      <section v-else>
        <yd-infinitescroll :callback="getInfo" ref="historyList">
          <ul slot="list">
            <li class="item" v-for="(item,index) in info" :key="index">
              <div>
                {{formatTime(item.addTime)}}
              </div>
              <div class="flex just-between">
                <span>合并对象</span>
                <p>
                  <span>{{item.mergeMemberName}}</span>
                  <span>{{item.mergeMemberMobile}}</span>
                </p>
              </div>
              <div class="flex just-between">
                <span>余额</span>
                <span>{{item.memberBalanceBF}}</span>
              </div>
              <div class="flex just-between">
                <span>积分</span>
                <span>{{item.memberIntegralBf}}</span>
              </div>
              <div class="flex just-between">
                <span>消费总额</span>
                <span>{{item.memberCousumptionBf}}</span>
              </div>
              <div class="flex just-between">
                <span>销售总额</span>
                <span>{{item.merchantSaleBf}}</span>
              </div>
            </li>
          </ul>
        </yd-infinitescroll>
      </section>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { findTransferHistory } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "TransferHistory",
  data() {
    return {
      noData:false,
      pageNo: 1,
      info: []
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account"])
  },
  created() {
      this.getInfo();
  },
  mixins: [mixin],
  methods: {
    tranferType(type) {
      switch (type) {
        case "0":
          return "分红权";
          break;
        case "1":
          return "余额";
          break;
        case "2":
          return "积分";
          break;
      }
    },
    getInfo() {
      if(!this.noData){
         let vm = this;
      mui.ajax({
        url: findTransferHistory,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          type: this.$route.query.type,
          pageNo: this.pageNo,
          pageSize: 10,
          token: md5(`gjfengfindTransferHistory${this.$route.query.type}${this.account}`)
        },
        success(res) {
          let _result = res.result;
          vm.info = [...vm.info, ..._result];
          if (_result.length < 10) {
            vm.noData = true;
            vm.$refs.historyList.$emit("ydui.infinitescroll.loadedDone");
            return;
          }
          vm.$refs.historyList.$emit("ydui.infinitescroll.finishLoad");
          vm.pageNo++;
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
  background-color: @white;
  .pd;
  margin-bottom: @pd;
  font-size: 0.28rem;
}
</style>