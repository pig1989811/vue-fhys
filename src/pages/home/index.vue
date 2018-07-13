<template>
  <div>
    <header-top :back="false" :login="!loginAccount" :show-scan="loginAccount">注册|登录</header-top>
    <main class="scroll-content">
      <yd-pullrefresh :callback="refreshList" ref="refreshcontainer">
        <section class="city-search flex text-center align-center danger-bg">
          <router-link to="/address/city" class="current-city">
            <span>{{city}}</span>
            <span class="iconfont self-down"></span>
          </router-link>
          <router-link to="/home/search" class="search-box flex align-center just-center">
            <span class="iconfont-large self-search"></span>
            <span>搜索商家或商品</span>
          </router-link>
        </section>
        <section class="type-list">
          <swiper dots-position="center">
            <swiper-item v-for="(item,index) in slideTypes" :key="index">
              <ul class="flex">
                <li v-for="e in item" :key="e.id" class="type-item text-center">
                  <router-link :to="{path:'/home/subcolumn/'+e.id}">
                    <img :src="e.pic2" :alt="e.names">
                    <p>{{e.names}}</p>
                  </router-link>
                </li>
              </ul>
            </swiper-item>
          </swiper>
        </section>
        <section class="banner-list">
          <yd-slider>
            <yd-slider-item v-for="(item,index) in banner" :key="item.id">
              <router-link :to="'/shop/index/'+item.address.substring(item.address.lastIndexOf('/')+1)">
                <img :src="item.photo" :alt="item.names">
              </router-link>
            </yd-slider-item>
          </yd-slider>
        </section>
        <section class="product-list">
          <div class="title-wrap text-center">
            <div class="like-title">
              <span class="iconfont self-crown fs-20"></span>
              <span class="fs-16">猜你喜欢</span>
            </div>
          </div>
          <yd-infinitescroll :callback="getYourlike" ref="pdlist">
            <div slot="list">
              <product-item v-for="item in productList" :key="item.id" :id="item.id" :img-url="item.imgUrl" :title="item.storeName" :score="item.score" :distance="item.distance" :content="item.name" :price1="item.price" :description="item.description" :show-type="true"></product-item>
            </div>
            <p slot="doneTip">
              <span class="iconfont self-nodata danger-color" style="margin-right:5px;"></span>没有数据啦
            </p>
          </yd-infinitescroll>
        </section>

      </yd-pullrefresh>
    </main>
    <footer-bar></footer-bar>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { Swiper, SwiperItem } from "vux";
import HeaderTop from "components/header/index";
import FooterBar from "components/footer/index";
import ProductItem from "components/common/ProductItem";
import { o2o, like,getCityName, findAppUpgredeByType } from "../../api/index";
import { mixin, getStore, setStore } from "components/common/mixin";
export default {
  name: "Home",
  data() {
    return {
      oldBack: mui.back,
      noData: false,
      pageNo: 1,
      slideTypes: [],
      banner: [],
      productList: [],
      loginAccount: false,
      refreshTag: false,
      type: "",
      curVersion: "" //app版本
    };
  },
  components: { Swiper, SwiperItem, HeaderTop, FooterBar, ProductItem },
  computed: {
    ...mapState(["longitude", "latitude", "city", "member"])
  },
  mixins: [mixin],
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
    this.init();
  },
  mounted() {
    this.posAndVer();
    this.getColumns();
  },
  activated() {
    if (getStore("account") && getStore("account").length > 0) {
      this.loginAccount = true;
      this.$store.commit("SET_ACCOUNT", getStore("account"));
      if (!this.member) {
        this.$store.dispatch("getInfo");
      }
    } else {
      this.loginAccount = false;
    }
    if (!getStore("tips")) {
      this.$dialog.notify({
        mes: "点击标题可以回到顶部！",
        callback: () => {
          setStore("tips", "1");
        }
      });
    }
    if (this.$store.state.positions[this.$route.path]) {
      document.querySelector("main").scrollTop = this.$store.state.positions[
        this.$route.path
      ];
    }
  },
  methods: {
    init() {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf("Android") > -1; //android终端
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      this.type = isiOS ? "1" : "0";
    },
    posAndVer() {
      if (!this.city) {
        if (process.env.NODE_ENV == "development") {
          axios
            .get(
              "https://api.map.baidu.com/location/ip?ak=xVyOYxDsYKpFBx8zdICSlWxsqltd8QoC&coor=gcj02"
            )
            .then(res => {
              let data = res.data.content;
              let longitude = data.point.x,
                latitude = data.point.y;
              this.$store.commit("RECORD_ADDRESS", { latitude, longitude });
              let vm = this;
              mui.ajax({
                url: getCityName,
                type: 'post',
                headers: {'app-version': 'v1.0'},
                data: {
                  latitude,
                  longitude,
                  token: md5(`gjfenggetCityName`)
                },
                success(res){
                  let city = res.result;
                  vm.$store.commit("RECORD_CITY", city);
                }
              })
            });
        } else {
          document.addEventListener("plusready", this.onPlusReady, false);
        }
      } else this.getYourlike();
    },
    onPlusReady() {
      this.getPosition();
      this.getVersion();
    },
    getPosition() {
      let vm = this;
      plus.geolocation.getCurrentPosition(
        function(p) {
          let latitude = p.coords.latitude;
          let longitude = p.coords.longitude;
          let city = p.address.city;
          vm.$store.commit("RECORD_ADDRESS", { latitude, longitude });
          vm.$store.commit("RECORD_CITY", city);
        },
        function(e) {
          vm.$dialog.alert("定位失败：" + e.message);
        }
      );
    },
    getColumns() {
      let vm = this;
      mui.ajax({
        url: o2o,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          token: md5("gjfengo2o")
        },
        success(res) {
          let result = res.result;
          vm.slideTypes = [
            result.indexColumn.slice(0, 8),
            result.indexColumn.slice(8)
          ];
          vm.banner = result.indexAd;
        }
      });
    },
    getYourlike() {
      if (!this.noData) {
        let vm = this;
        let longitude = this.longitude;
        let latitude = this.latitude;
        mui.ajax({
          url: like,
          type: "post",
          data: {
            longitude,
            latitude,
            pageNo: this.pageNo,
            pageSize: 10,
            token: md5(`gjfenglike${longitude}${latitude}`)
          },
          headers: { "app-version": "v1.0" },
          success(res) {
            let _list = res.result;
            vm.productList = [...vm.productList, ..._list];
            if (_list.length < 10) {
              vm.noData = true;
              vm.$refs.pdlist.$emit("ydui.infinitescroll.loadedDone");
              return;
            }
            vm.$refs.pdlist.$emit("ydui.infinitescroll.finishLoad");
            vm.pageNo++;
          }
        });
      }
    },
    refreshList() {
      this.noData = false;
      this.productList = [];
      let vm = this;
      mui.ajax({
        url: like,
        type: "post",
        data: {
          longitude: this.longitude,
          latitude: this.latitude,
          pageNo: 1,
          pageSize: 10,
          token: md5(`gjfenglike${this.longitude}${this.latitude}`)
        },
        headers: { "app-version": "v1.0" },
        success(res) {
          let _list = res.result;
          vm.productList = _list;
          vm.$dialog.notify({
            mes: "已更新",
            timeout: 1500,
            callback: () => {
              vm.refreshTag = true;
              vm.pageNo = 2;
            }
          });
          vm.$refs.refreshcontainer.$emit("ydui.pullrefresh.finishLoad");
        }
      });
    },
    getVersion() {
      let vm = this;
      plus.runtime.getProperty(plus.runtime.appid, function(inf) {
        vm.curVersion = inf.version;
        if (vm.type == "0") {
          vm.getInfo();
        }
      });
    },
    getInfo() {
      let vm = this;
      mui.ajax({
        url: findAppUpgredeByType,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          type: this.type,
          token: md5("gjfengfindAppUpgredeByType")
        },
        success(res) {
          let _result = res.result;
          if (_result.version && vm.curVersion < +_result.version) {
            vm.$store.commit("RECORD_UPDATE", true);
            vm.$dialog.confirm({
              title: `检测到新版本：${_result.version}，是否升级？`,
              mes: `${_result.describe}`,
              opts: () => {
                let wgtUrl = _result.jumpUrl;
                vm.downloadWgt(wgtUrl);
              }
            });
          }
        }
      });
    },
    downloadWgt(url) {
      let vm = this;
      this.$dialog.loading.open("下载更新...");
      plus.downloader
        .createDownload(url, { filename: "_doc/update/" }, function(d, status) {
          if (status == 200) {
            vm.installWgt(d.filename); // 安装更新包
          } else {
            vm.$dialog.alert({
              mes: "下载更新失败！"
            });
          }
          vm.$dialog.loading.close();
        })
        .start();
    },
    installWgt(path) {
      let vm = this;
      this.$dialog.loading.open("安装更新...");
      plus.runtime.install(
        path,
        {},
        function() {
          vm.$dialog.loading.close();
          vm.$dialog.alert({
            mes: "应用资源更新完成！",
            callback: () => {
              plus.runtime.restart();
            }
          });
        },
        function(e) {
          vm.$dialog.loading.close();
          vm.$dialog.alert({
            mes: "安装更新失败[" + e.code + "]：" + e.message
          });
        }
      );
    }
  },
  watch: {
    latitude(val) {
      this.productList = [];
      this.pageNo = 1;
      this.noData = false;
      this.getYourlike();
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.city-search {
  height: 44px;
  .pd-h;
  .current-city {
    width: 2rem;
    font-size: 0.3rem;
  }
  .search-box {
    flex: 1;
    color: @lightgray;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 5px;
    &:last-child {
      font-size: 14px;
      height: 36px;
    }
  }
}

.type-list {
  padding: 0.2rem 0 0 0;
  margin-bottom: 0.1rem;
  background-color: @white;
  .type-item {
    width: 25%;
    a {
      display: block;
    }
    img {
      .wh(0.8rem, 0.8rem);
      display: block;
      margin: 0 auto 0.1rem auto;
    }
    p {
      color: #707070;
      font-size: 14px;
      margin-bottom: 0.4rem;
    }
  }
}

.product-list {
  margin-top: 10px;
  padding-bottom: 10px;
  background: @white;
}
</style>