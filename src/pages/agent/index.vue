<template>
  <div>
    <header-top title="我是代理"></header-top>
    <main class='scroll-content-2'>
      <section class="agent-top flex text-center align-center" :style="{'background-image':formatBg('agent-bg.png')}">
        <div class="flex-1 bd-right">
          <p>代理总收入</p>
          <p>{{info.agentTotalMoney}}</p>
        </div>
        <div class="flex-1">
          <p>代派发收入</p>
          <p>{{info.agentMoney}}</p>
        </div>
      </section>
      <section class="agent-middle flex text-center">
        <div class="flex-1 bd-right-2">
          <p>今天商家让利</p>
          <p class="danger-color">{{info.noStoreTotalBenefit}}</p>
        </div>
        <div class="flex-1">
          <p>商家总让利</p>
          <p class="danger-color">{{info.storeTotalBenefit}}</p>
        </div>
      </section>
      <section class="agent-bottom">
        <yd-grids-group :rows="3">
        <yd-grids-item v-for="(item,index) in menu" :key="index" :link="item.link">
          <span slot="icon" :class="['iconfont-large',item.icon]" :style="{color:item.color}"></span>
          <span slot="text">{{item.text}}</span>
        </yd-grids-item>
      </yd-grids-group>
      </section>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { agent } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "Agent",
  data() {
    return {
      info: {},
      menu:[
        {
          icon: "self-seller",
          text: "商家列表",
          link: "/agent/shoplist",
          color: "#ff5350"
        },
        {
          icon: "self-xiaofeijilu",
          text: "收入历史",
          link: "/agent/history",
          color: "#663355"
        },
        {
          icon: "self-xiaofeiguize",
          text: "代理规则",
          link: "/agent/rule",
          color: "#e7d489"
        }
      ]
    };
  },
  components: { HeaderTop },
  computed: {...mapState(['account'])},
  mixins: [mixin],
  created() {
    this.getInfo();
  },
  activated() {},
  methods: {
    getInfo() {
      let vm = this;
      mui.ajax({
        url: agent,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          token: md5(`gjfengagent${this.account}`)
        },
        success(res) {
          vm.info = res.result;
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.agent-top {
  height: 4rem;
  background-size: contain;
  color: @white;
  font-size: .32rem;
  p:last-of-type{
    margin-top: @pd;
    font-size: .4rem;
    color: #f6ff00;
  }
}
.agent-middle{
  background-color: @white;
  .pd-v;
  margin-bottom: @pd;
  p:last-of-type{
    margin-top: @pd;
    font-size: .28rem;
  }
}
.bd-right{
  border-right: 1px solid #f7f5f5;
}
.bd-right-2{
  border-right: 1px solid #ccc;
}
</style>