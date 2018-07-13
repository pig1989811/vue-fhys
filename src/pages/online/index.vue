<template>
  <div>
    <header-top title="网上商城" :back="false"></header-top>
    <main class='scroll-content'>
      <section>
        <yd-slider>
          <yd-slider-item v-for="item in info.indexAds" :key="item.id">
            <router-link :to="'/online/product?id='+item.address.substring(item.address.lastIndexOf('/')+1)">
              <img :src="item.photo" :alt="item.names">
            </router-link>
          </yd-slider-item>
        </yd-slider>
      </section>
      <section class="column-list flex text-center align-center" v-show="info.indexColumns">
        <router-link :to="{name:'Products',params:{update:true},query:{type:0,id:item.id}}" class="column-item" v-for="item in info.indexColumns.slice(0,7)" :key="item.id">
          <img :src="getImgPath(item.pic2)" alt="" class="column-img">
          <p>{{item.names}}</p>
        </router-link>
        <router-link class="column-item" to="/online/allcolumn">
          <div :style="{'background-image':formatBg('column.png')}" class="column-img column-all"></div>
          <p>全部分类</p>
        </router-link>
      </section>
      <section class="platform-container flex">
        <div v-for="(item,index) in platform" :key="index" class="platform-item" :style="{'background-image':formatBg(item.img)}" @click="navigate(item.link)">
        </div>
      </section>
      <section class="merchant-container" @click="goMerchant">
        <img :src="getLocalImg('merchant.jpg')" alt="商品供应链采购端">
      </section>
      <section class="pd-list" v-for="(item,index) in pds" :key="index">
        <yd-cell-group>
          <yd-cell-item arrow type="label" @click.native="goProducts(item.id)">
            <span slot="icon" class="iconfont self-libao" style="color:#f98e25;font-size:20px;"></span>
            <span slot="left">{{item.label}}</span>
            <span slot="right">更多</span>
          </yd-cell-item>
        </yd-cell-group>
        <ul class="flex just-between">
          <router-link :to="{path:'/online/product',query:{id:pd.id}}" v-for="pd in item.list" :key="pd.id" tag="li" class="pd-item">
            <div class="img-cover">
              <img :src="pd.imgUrl" :alt="pd.name">
            </div>
            <div class="title flex align-center">
              <h3>{{pd.name}}</h3>
            </div>
            <div class="price" v-if="pd.isCanUserCou=='1'">
              <span>￥{{formatPrice(pd.pointNicePrice)}}</span>+
              <span>{{pd.price-pd.pointNicePrice}}积分</span>
            </div>
            <div class="price" v-else-if="pd.isCanUserCou=='2'">
              <span>￥{{formatPrice(pd.pointNicePrice)}}</span>+
              <span>{{pd.price}}责任金额</span>
            </div>
            <div class="price" v-else-if="pd.isCanUserCou=='3'">
              <span>{{pd.price}}代金券</span>
            </div>
            <div class="price" v-else>
              <span>￥{{formatPrice(pd.price)}}</span>
            </div>
          </router-link>
        </ul>
      </section>
    </main>
    <footer-bar></footer-bar>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import FooterBar from "components/footer/index";
import { mixin, localImg } from "components/common/mixin";
import { onlineInH5 } from "../../api/index";
export default {
  name: "Online",
  data() {
    return {
      oldBack: mui.back,
      info: {},
      pds: [],
      platform: [
        { img: "taobao.jpg", link: "/online/tmindex" },
        { img: "tianmao.jpg", link: "/online/tmindex" },
        { img: "yihaodian.jpg", link: "" },
        { img: "jingdong.png", link: "/online/jdindex" }
      ]
    };
  },
  components: { HeaderTop, FooterBar },
  computed: { ...mapState(["account", "member"]) },
  mixins: [mixin, localImg],
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.plusReady();
    });
  },
  beforeRouteLeave(to, from, next) {
    mui.back = this.oldBack;
    next();
  },
  created() {
    this.getInfo();
  },
  activated() {
    if (this.$store.state.positions[this.$route.path]) {
      document.querySelector("main").scrollTop = this.$store.state.positions[
        this.$route.path
      ];
    }
  },
  methods: {
    getInfo() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: onlineInH5,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          token: md5(`gjfengonlineInH5`)
        },
        success(res) {
          vm.$dialog.loading.close();
          let _pds = [];
          Object.entries(res.result.indexProducts).forEach((value, index) => {
            var item = {};
            var desc = value[0].split(/[;|~]/);
            item.label = desc[0];
            item.icon = desc[1];
            item.id = desc[2];
            item.list = value[1];
            _pds.push(item);
          });
          vm.info = res.result;
          vm.pds = _pds;
        },
        error(e) {
          vm.$dialog.loading.close();
          vm.$dialog.toast({
            mes: "网络异常，请稍后重试！"
          });
        }
      });
    },
    goProducts(id) {
      this.$router.push({
        name: "Products",
        params: { update: true },
        query: { type: 1, id }
      });
    },
    navigate(link) {
      if (!link) {
        this.$dialog.toast({
          mes: "数据对接中，敬请期待！"
        });
        return;
      }
      this.$router.push({ path: link });
    },
    goMerchant() {
      if (!this.account) {
        this.$dialog.alert({
          mes: "请先登录！",
          callback: () => {
            this.$router.push({ name: "Login" });
          }
        });
        return;
      }
      if (this.member.type != "1") {
        this.$dialog.alert({
          mes:
            "你不是商家,请在个人中心-我是商家里面进行商家申请后再进行相应的操作！"
        });
        return;
      }
      if (this.member.merchantType == "0") {
        this.$dialog.confirm({
          title: "提示",
          mes: "你不是联盟商家，去升级?",
          opts: () => {
            this.$router.push({ name: "Upgrade" });
          }
        });
      } else {
        this.$router.push({ name: "MerchantIndex", params: { update: true } });
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
section {
  margin-bottom: @pd;
  background-color: @white;
}

.column-list {
  padding-bottom: @pd;
  .column-item {
    margin-top: @pd;
    width: 25%;
    .column-img {
      .wh(1rem, 1rem);
      margin: 0 auto;
    }
    .column-all {
      background-size: contain;
    }
    p {
      margin-top: @pd / 2;
      font-size: 0.28rem;
    }
  }
}
.platform-container {
  .pd-h;
  .platform-item {
    display: block;
    margin: 0.1rem;
    height: 1.5rem;
    width: 47%;
    background-size: contain;
    background-repeat: no-repeat;
  }
}
.merchant-container {
  padding: 0.2rem 0 0 0;
  img {
    width: 100%;
  }
}
.pd-list {
  ul {
    .pd-h;
  }
  .pd-item {
    width: 48%;
    padding: 0.1rem;
    margin-bottom: @pd;
    border: 1px solid #dfdfdf;
    .img-cover {
      position: relative;
      width: 100%;
      overflow: hidden;
      padding: 50% 0;
      img {
        width: 100%;
        .hv-cen;
      }
    }
    .title {
      height: 40px;
      line-height: 20px;
      h3 {
        .multi-ellipsis(2);
        font-size: 0.3rem;
        font-weight: normal;
        word-wrap: break-word;
        word-break: break-all;
        color: #333;
      }
    }
    .price {
      margin-top: 0.1rem;
      font-size: 14px;
      span:first-of-type {
        color: @red;
      }
      span:nth-of-type(2) {
        font-size: 12px;
        color: @lightgray;
      }
    }
  }
}
</style>