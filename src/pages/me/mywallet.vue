<template>
  <div>
    <header-top title="我的钱包"></header-top>
    <main class='scroll-content-2'>
      <yd-pullrefresh :callback="refreshInfo" ref="wallet">
      <section class="wallet-top text-center" :style="{'background-image':formatBg('banner-wallet.png')}">
        <nav class="tab-list">
          <div class="tab-item" :class="{'tab-active':!type}" @click="changeTab(0)">个人福利</div>
          <div class="tab-item" :class="{'tab-active':type}" @click="changeTab(1)">商户福利</div>
        </nav>
        <div class="wallet-today">
          今日福利
          <p v-if="!type">+{{info0.benefitYesterdayMoney}}</p>
          <p v-else>+{{info1.benefitYesterdayMoney}}</p>
        </div>
      </section>
      <!-- 个人福利 -->
      <section class="wallet-tab" v-show="!type">
        <ul class="flex text-center">
          <li v-for="(item,m) in tabs0" :key="'m'+m" class="tab-item">
            <a :href="item.link" :class="{'danger-bg':m<3}">
              <p>{{item.text}}</p>
              <p :class="{'danger-color':m>2}">{{info0[item.param]}}</p>
            </a>
          </li>
          <li v-for="(item,n) in tabs3" :key="'n'+n" class="tab-item">
            <a :href="item.link">
              <p>{{item.text}}</p>
              <p class="danger-color" v-if="item.param=='diviTotalMoney'">{{info[item.param] *100 ||0}}
                <span>%</span>
              </p>
              <p v-else class="danger-color">{{info[item.param] || 0}}</p>
            </a>
          </li>
        </ul>
      </section>
      <!-- 商户福利 -->
      <section class="wallet-tab" v-show="type">
        <ul class="flex text-center">
          <li v-for="(item,p) in tabs1" :key="'p'+p" class="tab-item" :class="{'tab-item2':p<2}">
            <a :href="item.link" :class="{'danger-bg':p<2}">
              <p>{{item.text}}</p>
              <p :class="{'danger-color':p>1}" v-if="item.param=='canMoney'">{{info1[item.param] *100 ||0}}<span>%</span>
              </p>
              <p v-else :class="{'danger-color':p>1}">{{info1[item.param]}}</p>
            </a>
          </li>
          <li v-for="(item,q) in tabs4" :key="'q'+q" class="tab-item">
            <a :href="item.link">
              <p>{{item.text}}</p>
              <p class="danger-color">{{info[item.param] || 0}}
              </p>
            </a>
          </li>
        </ul>
      </section>
    </yd-pullrefresh>
      <yd-grids-group :rows="3" v-if="member.type=='0'">
        <yd-grids-item v-for="(item,i) in menu0" :key="'i'+i" :link="item.link">
          <span slot="icon" :class="['iconfont-large',item.icon]" :style="{color:item.color}"></span>
          <span slot="text">{{item.text}}</span>
        </yd-grids-item>
      </yd-grids-group>
      <yd-grids-group :rows="3" v-if="member.type=='1'">
        <yd-grids-item link="/treasure/index">
          <span slot="icon" class="iconfont-large self-wallet" style="color: #e7d489;"></span>
          <span slot="text">凤凰宝</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/cashhistory">
          <span slot="icon" class="iconfont-large self-tiqulishi" style="color: #663355;"></span>
          <span slot="text">提取历史</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/bankcard">
          <span slot="icon" class="iconfont-large self-yinhangka" style="color: #e7d489;"></span>
          <span slot="text">银行卡</span>
        </yd-grids-item>
        <yd-grids-item link="/merchant/give">
          <span slot="icon" class="iconfont-large self-shenghuofuwu" style="color: #e7d489;"></span>
          <span slot="text">升级赠送</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/salerecord">
          <span slot="icon" class="iconfont-large self-hongbao" style="color: #ee3355;"></span>
          <span slot="text">销售录入</span>
        </yd-grids-item>
        <yd-grids-item v-if="+member.merchantType>0" link="/merchant/coupon">
          <span slot="icon" class="iconfont-large self-tiqufuli" style="color: #e7d489;"></span>
          <span slot="text">赠送代金券</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/welfrecord">
          <span slot="icon" class="iconfont-large self-fulijilu" style="color: #ee3355;"></span>
          <span slot="text">福利记录</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/interest?type=0">
          <span slot="icon" class="iconfont-large self-xiaofeijilu" style="color: #663355;"></span>
          <span slot="text">消费记录</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/consumerule">
          <span slot="icon" class="iconfont-large self-xiaofeiguize" style="color: #663355;"></span>
          <span slot="text">消费规则</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/shouxin">
          <span slot="icon" class="iconfont-large self-edu" style="color: #e7d489;"></span>
          <span slot="text">授信额度</span>
        </yd-grids-item>
        <yd-grids-item link="/trade/download">
          <span slot="icon" class="iconfont-large self-download" style="color: #663355;"></span>
          <span slot="text">协议下载</span>
        </yd-grids-item>
      </yd-grids-group>
    </main>
    <cert-modal></cert-modal>
    <yd-popup v-model="showPopup" position="center" width="90%">
      <div class="ruzhu-container">
        <h3 class="ruzhu-title">您还未入驻凤凰云商O2O</h3>
        <div class="ruzhu-content">
          <div>
            <input type="radio" name="settle-way" id="1" value="1" v-model="settleWay">
            <label class="ruzhu-item" for="1">
              <span class="iconfont self-qiye"></span>
              <p>企业入驻</p>
            </label>
          </div>
          <div>
            <input type="radio" name="settle-way" id="0" value="0" v-model="settleWay">
            <label class="ruzhu-item" for="0">
              <span class="iconfont self-geti"></span>
              <p>个体入驻</p>
            </label>
          </div>
        </div>
        <yd-button type="danger" size="large" @click.native="settle">确认</yd-button>
        <span class="close iconfont-large self-guanbi" @click="showPopup=false;"></span>
      </div>
    </yd-popup>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import CertModal from "components/common/CertModal";
import { countMemberInfo, myWallet } from "../../api/index";
import { mixin, getStore } from "components/common/mixin";
export default {
  name: "MyWallet",
  data() {
    return {
      oldBack: mui.back,
      info0: {},
      info1: {},
      info: {},
      type: 0,
      showPopup: false,
      settleWay: "",
      tabs0: [
        {
          text: "可参与福利权益",
          param: "canParticipate",
          link: "#/trade/participate?type=0"
        },
        {
          text: "责任消费",
          param: "saleTotalMoney",
          link: "javascript:"
        },
        {
          text: "还可获得福利",
          param: "consumptionMoney",
          link: "javascript:"
        },
        {
          text: "销售福利",
          param: "dividendsTotalMoney",
          link: "#/trade/salewelfare"
        },
        {
          text: "累计消费",
          param: "cumulativeMoney",
          link: "#/trade/interest?type=0"
        },
        {
          text: "余额账户",
          param: "balanceMoney",
          link: "javascript:"
        }
      ],
      tabs1: [
        {
          text: "商户福利权益",
          param: "canParticipate",
          link: "#/trade/participate?type=1"
        },
        {
          text: "已领取",
          param: "canMoney",
          link: "javascript:"
        },
        {
          text: "总销售额",
          param: "saleTotalMoney",
          link: "javascript:"
        },
        {
          text: "累计贡献",
          param: "cumulativeMoney",
          link: "#/trade/interest?type=1"
        },
        {
          text: "还可获得福利",
          param: "consumptionMoney",
          link: "javascript:"
        }
      ],
      tabs3: [
        {
          text: "储备池",
          param: "dedecutDiviNum",
          link: "javascript:"
        },
        {
          text: "已领回",
          param: "diviTotalMoney",
          link: "javascript:"
        },
        {
          text: "线上消费笔数",
          param: "orCount",
          link: "javascript:"
        },
        {
          text: "线下消费笔数",
          param: "beCount",
          link: "javascript:"
        },
        {
          text: "商家联盟推荐奖励",
          param: "directMemberMoney",
          link: "#/merchant/recommendhistory"
        },
        {
          text: "代金券",
          param: "memberVoucherMoney",
          link: "javascript:"
        }
      ],
      tabs4: [
        {
          text: "储备池",
          param: "storeDedecut",
          link: "javascript:"
        }
      ],
      menu0: [
        {
          icon: "self-wallet",
          text: "凤凰宝",
          link: "/treasure/index",
          color: "#e7d489"
        },
        {
          icon: "self-tiqulishi",
          text: "提取历史",
          link: "/trade/cashhistory",
          color: "#663355"
        },
        {
          icon: "self-yinhangka",
          text: "银行卡",
          link: "/trade/bankcard",
          color: "#e7d489"
        },
        // {
        //   icon: "self-zhuanyi",
        //   text: "积分转移",
        //   link: "/trade/transfer",
        //   color: "#ee3355"
        // },
        // {
        //   icon: "self-hebing",
        //   text: "合并用户信息",
        //   link: "/trade/merge",
        //   color: "#e7d489"
        // },
        {
          icon: "self-fulijilu",
          text: "福利记录",
          link: "/trade/welfrecord",
          color: "#ee3355"
        },
        {
          icon: "self-xiaofeijilu",
          text: "消费记录",
          link: "/trade/interest?type=0",
          color: "#663355"
        },
        {
          icon: "self-xiaofeiguize",
          text: "消费规则",
          link: "/trade/consumerule",
          color: "#663355"
        },
        {
          icon: "self-download",
          text: "协议下载",
          link: "/trade/download",
          color: "#663355"
        }
      ]
    };
  },
  components: { HeaderTop, CertModal},
  computed: {
    ...mapState(["member", "certificateStatus", "showCertificate"])
  },
  mixins: [mixin],
  beforeRouteEnter(to, from, next) {
    next(vm => {
      mui.back = vm.goBack;
    });
  },
  beforeRouteLeave(to, from, next) {
    mui.back = this.oldBack;
    next();
  },
  created() {},
  activated() {
    if (this.$store.state.positions[this.$route.path]) {
      document.querySelector("main").scrollTop = this.$store.state.positions[
        this.$route.path
      ];
    }
    if(this.$route.params.update){
      this.type = 0;
      this.getInfo();
      setTimeout(()=>{
        this.getWallet();
      },200)
    }
    
  },
  methods: {
    goBack() {
      if (this.showPopup) {
        this.showPopup = false;
      } else if (this.showCertificate) {
        this.$store.commit("SHOW_CERTIFICATE", false);
      } else if (document.querySelector(".yd-dialog-white-mask")) {
        this.$dialog.loading.close();
      } else {
        this.$router.go(-1);
      }
    },
    changeTab(tag) {
      if (tag == 1 && !this.certificateStatus) {
        this.$store.commit("SHOW_CERTIFICATE", true);
        return;
      }
      if (tag == 1 && this.member.type == "0") {
        this.showPopup = true;
        return;
      }
      if (this.type == tag) {
        return;
      }
      this.type = tag;
      this.getInfo();
    },
    getWallet() {
      let vm = this;
      mui.ajax({
        url: myWallet,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: getStore("account"),
          token: md5(`gjfengmyWallet${getStore("account")}`)
        },
        success(res) {
          vm.info = res.result;
        }
      });
    },
    getInfo() {
      let vm = this;
      this.$dialog.loading.open("您的福利正在赶来...");
      mui.ajax({
        url: countMemberInfo,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: getStore("account"),
          type: this.type,
          token: md5(`gjfengcountMemberInfo${getStore("account")}${this.type}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          vm[`info${vm.type}`] = res.result;
        }
      });
    },
    refreshInfo(){
      this.getInfo();
       setTimeout(()=>{
        this.getWallet();
      },200)
      this.$refs.wallet.$emit("ydui.pullrefresh.finishLoad");
    },
    settle() {
      if (this.settleWay == "") {
        this.$dialog.toast({
          mes: "请选择一种入驻方式后再确认",
          timeout: 1500
        });
        return;
      }
      this.showPopup = false;
      if (this.settleWay == "0") {
        this.$router.push({ path: "/store/settle-2" });
      } else {
        this.$router.push({ path: "/store/settle-3" });
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.wallet-top {
  height: 4rem;
  background-size: cover;
  color: @white;
  font-size: 14px;
  .tab-list {
    .flex;
    .just-cont();
    font-size: 14px;
    padding-top: @pd * 2;
    margin-bottom: @pd * 3;
    .tab-item {
      border: 1px solid @white;
      padding: @pd 15px;
      &.tab-active {
        background-color: @white;
        color: @red;
      }
    }
    div:first-child {
      border-radius: 20px 0 0 20px;
    }
    div:last-child {
      border-radius: 0 20px 20px 0;
    }
  }
  .wallet-today {
    font-size: 16px;
    p {
      margin-top: @pd * 2;
      color: #f6ff00;
      font-size: 20px;
    }
  }
}

.wallet-tab {
  background-color: @white;
  margin-bottom: @pd;
  .tab-item {
    width: 33.3%;
    a {
      .pd-v;
      display: block;
      p:last-child {
        margin-top: 0.1rem;
        font-size: 16px;
        height: 16px;
      }
    }
    &.tab-item2 {
      width: 50%;
    }
  }
}

.operate-container {
  .pd;
  .mg-v;
  background-color: @white;
}
</style>