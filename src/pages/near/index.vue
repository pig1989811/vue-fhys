<template>
  <div>
    <header-top title="附近" :back="false"></header-top>
      <section class="search-container">
        <router-link to="/home/search" class="search-input">
          <span class="iconfont-large self-search"></span>
          <span>搜索商家或商品</span>
        </router-link>
      </section>
      <div class="sub-list" ref="swipeList">
        <div class="sub-item" v-for="(sub,i) in column" :key="sub.id" :data-id="sub.id" :class="{'sub-active':columnId==sub.id}" 
          @click="changeSubColumn(sub)">{{sub.names}}</div>
      </div>
    <main class='scroll-content-3' style="background-color:#fff;">
      <section class="pd-list">
        <yd-infinitescroll :callback="getProduct" ref="pdlist">
          <div slot="list">
            <product-item v-for="item in productList" :key="item.id" :id="item.id" :img-url="item.imgUrl" :title="item.storeName" :score="item.score" :distance="item.distance" :content="item.name" :price1="item.price" :price2="item.marketPrice"></product-item>
          </div>
          <p slot="doneTip">
            <span class="iconfont self-nodata danger-color" style="margin-right:5px;"></span>没有数据啦</p>
        </yd-infinitescroll>
      </section>
    </main>
    <footer-bar></footer-bar>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import FooterBar from "components/footer/index";
import ProductItem from "components/common/ProductItem";
import { findNearColum, products } from "../../api/index";
import { mixin } from "components/common/mixin";

export default {
  name: "Near",
  data() {
    return {
      oldBack: mui.back,
      noData: false,
      column: [],
      subColumn: [],
      pageNo: 1,
      columnId: "",
      productList: [],
      scrollLeft:0//记录tab滚动值
    };
  },
  components: { HeaderTop, FooterBar, ProductItem },
  computed: {
    ...mapState(["longitude", "latitude"])
  },
  mixins: [mixin],
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.plusReady();
    });
  },
  beforeRouteLeave(to, from, next) {
    this.scrollLeft = this.$refs.swipeList.scrollLeft;
    mui.back = this.oldBack;
    next();
  },
  created() {
    this.getNear();
  },
  activated() {
    this.$nextTick(()=>{
      this.$refs.swipeList.scrollLeft=this.scrollLeft;
    })
  },
  methods: {
    getNear() {
      let vm = this;
      mui.ajax({
        url: findNearColum,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          token: md5("gjfengfindNearColum")
        },
        success(res) {
          vm.column = res.result;
          vm.columnId = vm.column[0].id;
          vm.getProduct();
        }
      });
    },
    reset() {
      this.noData = false;
      this.productList = [];
      this.pageNo = 1;
      this.$refs.pdlist.$emit("ydui.infinitescroll.reInit");
      this.getProduct();
    },
    changeSubColumn(item) {
      this.columnId = item.id;
      this.reset();
    },
    getProduct() {
      let vm = this;
      if (!this.noData) {
        mui.ajax({
          url: products,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            pageNo: this.pageNo,
            pageSize: 10,
            longitude: this.longitude,
            latitude: this.latitude,
            columnId: this.columnId,
            orderType: 1,
            columnType: 1,
            token: md5(`gjfengproducts${this.longitude}${this.latitude}`)
          },
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
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.sub-list {
  padding: 0 2%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  background-color: @white;
  .sub-item {
    display: inline-block;
    width: 20%;
    height: 30px;
    line-height: 30px;
    margin: 2%;
    border-radius: 3px;
    border: 1px solid #ddd;
    text-align: center;
    transition: all 0.2s;
    font-size: 0.28rem;
    &.sub-active {
      color: @red;
      border-color: currentColor;
      box-shadow: 0 0 5px currentColor;
    }
  }
}

.pd-list {
  background-color: @white;
}
</style>