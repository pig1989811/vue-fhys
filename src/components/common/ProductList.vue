<template>
  <section class="nav-list">
    <ul class="nav-tab flex just-around text-center block" v-if="tabType=='block'" :class="{'stick-nav':stickTag}">
      <li class="nav-item" :class="{'nav-active':index+1==filterIndex}" @click="filter(item)" v-for="(item,index) in orderType" :key="index">{{item.name}}</li>
    </ul>
    <ul class="nav-tab flex just-around text-center" v-else>
      <li class="nav-item" :class="{'nav-active':index+1==filterIndex}" @click="filter(item)" v-for="(item,index) in orderType2" :key="index">{{item.name}}</li>
    </ul>
    <yd-infinitescroll :callback="getProduct" ref="pdlist">
      <div slot="list">
        <product-item v-for="item in productList" :key="item.id" :id="item.id" :img-url="item.imgUrl" :title="item.storeName" :score="item.score" :distance="item.distance" :content="item.name" :price1="item.price" :sale-num="item.saleNum" :show-type="showType" :description="item.description"></product-item>
      </div>
      <p slot="doneTip">
        <span class="iconfont self-nodata danger-color" style="margin-right:5px;"></span>没有更多数据</p>
    </yd-infinitescroll>
  </section>
</template>
<script>
import ProductItem from "./ProductItem";
import { mapState } from "vuex";
import { products } from "../../api/index";

export default {
  name: "ProductList",
  data() {
    return {
      noData: false,
      productList: [],
      filterIndex: 1,
      pageNo: 1,
      orderType: [
        { type: "1", name: "距离近" },
        { type: "2", name: "人气高" },
        { type: "3", name: "价格低" },
        { type: "4", name: "最  新" }
      ],
      orderType2: [
        { type: "1", name: "距离最近" },
        { type: "2", name: "人气优先" },
        { type: "3", name: "价格最低" },
        { type: "4", name: "最新发布" }
      ]
    };
  },
  props: {
    tabType: {
      type: String,
      default: "block" //tab类型，默认【block】块状，还有【line】下划线状
    },
    likeValue: {
      // 模糊查询-商品或店铺值
      type: String,
      default: ""
    },
    columnId: {
      type: String,
      default: ""
    },
    columnType: {
      type: String,
      default: "1"
    },
    stickTag: false,
    showType:{
      type:Boolean,
      default:true
    }
  },
  components: { ProductItem },
  computed: {
    ...mapState(["longitude", "latitude"])
  },
  created() {},
  activated() {
    this.filterIndex = 1;
    this.reset();
  },
  methods: {
    reset() {
      this.noData = false;
      this.productList = [];
      this.pageNo = 1;
      this.getProduct();
    },
    filter(e) {
      this.filterIndex = +e.type;
      this.reset();
    },
    getProduct() {
      let vm = this;
      if (!this.noData) {
        if (this.tabType == "line") {
          this.$dialog.loading.open();
        }
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
            columnType: this.columnType,
            orderType: this.filterIndex,
            likeValue: this.likeValue,
            token: md5(`gjfengproducts${this.longitude}${this.latitude}`)
          },
          success(res) {
            if (vm.tabType == "line") {
              vm.$dialog.loading.close();
            }
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
.nav-list {
  background-color: @white;
  .pd-v;
  ul {
    padding-bottom: 0;
    border-bottom: 1px solid #ddd;
    .nav-item {
      flex: 1;
      margin: 0 3%;
      padding: 0.15rem 0;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      font-size: 0.28rem;
      &.nav-active {
        color: @red;
        border-bottom: 2px solid currentColor;
      }
    }
    &.block {
      padding-bottom: @pd;
      .nav-item {
        border-radius: 3px;
        border: 1px solid #ddd;
        &.nav-active {
          color: @red;
          border-color: currentColor;
        }
      }
    }
  }
}
.stick-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 1rem;

  background-color: @white;
  padding-top: @pd;
  z-index: 500;
  margin-top: -1px;
}
</style>