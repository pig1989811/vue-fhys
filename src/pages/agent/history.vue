<template>
  <div>
    <header-top title="代理分红记录"></header-top>
    <main class='scroll-content-2'>
      <yd-infinitescroll :callback="getList" ref="historylist">
        <ul slot="list">
          <li v-for="(item,index) in list" :key="index" class="item flex just-between align-center">
            <div>
              <p>代理收入</p>
              <p class="time">{{formatTime(item.addTime,true)}}</p>
            </div>
            <div class="danger-color">+{{formatPrice(item.tradeMoney)}}</div>
          </li>
        </ul>
      </yd-infinitescroll>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { agentHistory } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "AgentHistory",
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
   mixins: [mixin],
  created() {
    this.getList();
  },
  activated() {},
  methods: {
    getList() {
      if (!this.noData) {
        let vm = this;
        this.$dialog.loading.open();
        mui.ajax({
          url: agentHistory,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            account: this.account,
            pageNo: this.pageNo,
            pageSize: 10,
            token: md5(`gjfengagentHistory${this.account}`)
          },
          success(res) {
            vm.$dialog.loading.close();
            let _result = res.result.resultList;
            vm.list = [...vm.list, ..._result];
            if (_result.length < 10) {
              vm.noData = true;
              vm.$refs.historylist.$emit("ydui.infinitescroll.loadedDone");
              return;
            }
            vm.$refs.historylist.$emit("ydui.infinitescroll.finishLoad");
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
.item{
  .pd;
  margin-bottom: @pd;
  background-color: @white;
  font-size: .32rem;
  .time{
    color: @lightgray;
    font-size: .24rem;
    margin-top: .1rem;
  }
}
</style>