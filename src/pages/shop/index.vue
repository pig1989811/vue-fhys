<template>
  <div>
    <header-top title="商品详情"></header-top>
    <main class="scroll-content-2">
      <section class="pd-container">
        <div class="pd-cover">
          <!-- <img :src="pdDetail.imgUrl1" alt=""> -->
          <img v-lazy="pdDetail.imgUrl1" alt="">
          <div class="pd-desc">{{pdDetail.name}}</div>
        </div>
        <div class="pd-price fs-12">
          <span class="pd-rmb danger-color">￥</span>
          <span class="pd-price1 danger-color fs-20">{{formatPrice(pdDetail.price)}}</span>
          <!-- <span class="pd-price2">门市价:￥{{formatPrice(pdDetail.marketPrice)}}</span> -->
        </div>
      </section>
      <section class="seller-container">
        <h2 class="fs-16">商家信息</h2>
        <div class="flex align-center">
          <div class="seller-info">
            <div class="seller-name fs-16">
              <span class="iconfont self-seller danger-color"></span>
              {{pdDetail.storeName}}
            </div>
            <div class="seller-address fs-13 flex" @click="navigate">
              <span class="iconfont self-daohang primary-color"></span>
              <div class="flex-1">
                <p class="fs-16 primary-color">{{pdDetail.storeAddress}}</p>
                <p class="fs-12">距离我最近{{formatDis(pdDetail.distance)}}</p>
              </div>
            </div>
          </div>
          <a class="seller-tel" :href="'tel:'+pdDetail.storeMobile">
            <span class="iconfont self-tel danger-color" style="font-size:.8rem;"></span>
          </a>
        </div>
        <div class="collect flex align-center just-between">
          <span class="iconfont self-heart danger-color" @click="collect(pdDetail.id,2)">收藏商品</span>
          <span class="iconfont self-star" style="color:#f90;" @click="collect(pdDetail.storeId,1)">关注店铺</span>
        </div>
      </section>
      <section class="tip-container">
        <h3 class="fs-16 danger-color">购买须知</h3>
        <ul>
          <li class="tip-item fs-15">有效期
            <div>{{pdDetail.indate||'暂无'}}</div>
          </li>
          <li class="tip-item fs-15">
            备注
            <div class="fs-13">{{pdDetail.notice||'暂无'}}</div>
          </li>
        </ul>
      </section>
      <yd-cell-group v-if="false">
        <yd-cell-item :arrow="comment.count>0">
          <span slot="left">
            <span>用户评价({{pdDetail.score||0}}分)</span>
            <crown :value="pdDetail.score"></crown>
          </span>
          <span slot="right">共{{comment.count||0}}条</span>
        </yd-cell-item>
      </yd-cell-group>
      <section class="hot-container">
        <div class="title-wrap text-center">
          <div class="like-title">
            <span class="iconfont self-crown fs-20"></span>
            <span class="fs-16">本店热销</span>
          </div>
        </div>
        <yd-infinitescroll :on-infinite="getHotProduct" ref="pdlist">
          <div slot="list">
            <product-item v-for="item in productList" :key="item.id" :id="item.id" :img-url="item.imgUrl" :title="item.name" :score="item.score" :price1="item.price" :sale-num="item.salesNum" :description="item.description" :show-type="true"></product-item>
          </div>
          <p slot="doneTip">
            <span class="iconfont self-nodata danger-color" style="margin-right:5px;"></span>本店暂时没有更多商品</p>
        </yd-infinitescroll>
      </section>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import Crown from "components/common/Crown";
import ProductItem from "components/common/ProductItem";
import { product, myStore, hotProduct, addMyCollect } from "../../api/index";
import { mixin } from "components/common/mixin";

export default {
  name: "ShopIndex",
  data() {
    return {
      id: "",
      noData: false,
      pageNo: 1,
      comment: {},
      pdDetail: {},
      productList: []
    };
  },
  components: { HeaderTop, Crown, ProductItem },
  computed: {
    ...mapState(["longitude", "latitude", "account"])
  },
  mixins: [mixin],
  created() {
    this.getDetail();
  },
  activated() {},
  mounted() {},
  methods: {
    init() {
      this.noData = false;
      this.pageNo = 1;
      this.$refs.pdlist.$emit("ydui.infinitescroll.reInit");
      this.productList = [];
      // this.getHotProduct();
    },
    getDetail() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: product + this.$route.params.id,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          longitude: this.longitude,
          latitude: this.latitude,
          id: this.$route.params.id,
          token: md5(`gjfengproductDetail${this.longitude}${this.latitude}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          let result = res.result;
          if (result.product) {
            vm.pdDetail = result.product;
            vm.comment = Object.assign(
              {},
              { count: result.comCount, cmt: result.comment }
            );
            vm.getHotProduct();
          } else {
            vm.$dialog.toast({
              mes: "暂无商品详情",
              timeout: 1500,
              callback: () => {
                vm.$router.go(-1);
              }
            });
            return;
          }
        }
      });
    },
    getHotProduct() {
      let vm = this;
      if (!this.noData) {
        mui.ajax({
          url: hotProduct,
          type: "post",
          headers: { "app-version": "v1.0" },
          data: {
            pageNo: this.pageNo,
            pageSize: 10,
            id: this.$route.params.id,
            token: md5(`gjfenghotProduct${this.$route.params.id}`)
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
    },
    collect(id, type) {
      let vm = this;
      mui.ajax({
        url: addMyCollect,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          collectType: type,
          id: id,
          token: md5(`gjfengaddMyCollect${this.account}${type}`)
        },
        success(res) {
          if (res.code == 200) {
            vm.$dialog.toast({
              mes: type == 2 ? res.msg : "关注成功"
            });
          }
        }
      });
    },
    navigate() {
      let vm = this;
      if (!/^((1[3-8][0-9])+\d{8})$/.test(this.pdDetail.storeMobile)) {
        this.$dialog.alert({
          mes: "手机格式不正确，无法查找店铺信息"
        });
        return;
      }
      this.$dialog.loading.open("开始导航...")
      mui.ajax({
        url: myStore,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.pdDetail.storeMobile,
          token: md5(`gjfengmyStore${this.pdDetail.storeMobile}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          let _result = res.result;
          if (!_result) {
            vm.$dialog.alert({
              mes: "未找到相关店铺信息"
            });
            return;
          }
          let address = _result.areaId
            ? `${_result.provinceId.province}${_result.cityId.city}${_result
                .areaId.area}${_result.addressDetail}`
            : `${_result.provinceId.province}${_result.cityId
                .city}${_result.addressDetail}`;
          vm.$router.push({
            name: "ShopMap",
            params: { address, city: _result.cityId.city }
          });
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      // if(!/\shop\/index/.test(from.path)){
      //   return;
      // }
      if (/\/shop\/index/.test(to.path)) {
        this.init();
        this.getDetail();
        this.$nextTick(() => {
          document.querySelector(".scroll-content-2").scrollTop = 0;
        });
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
section {
  padding: @pd;
  background-color: @white;
  margin-bottom: @pd;
}

.pd-container {
  .pd-cover {
    position: relative;
    img {
      width: 100%;
      max-height: 5rem;
    }
    .pd-desc {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.3),
        rgba(0, 0, 0, 0.8)
      );
      color: @white;
      font-size: 0.3rem;
      padding: @pd;
      box-shadow: 0 -5px 5px rgba(255, 255, 255, 0.3) inset;
    }
  }
  .pd-price {
    color: @lightgray;
    padding: @pd 0 0 0;
    .pd-price1 {
      margin: 0 @pd 0 -3px;
    }
  }
}

.seller-container {
  h2 {
    font-weight: normal;
    .text-center;
    padding: 0.1rem;
    border-bottom: 1px solid #dfdfdf;
  }
  .seller-info {
    flex: 1;
    > div {
      margin: @pd;
    }
    .iconfont {
      margin-right: 0.1rem;
    }
    .seller-address {
      p:last-of-type {
        color: @lightgray;
      }
    }
  }
  .seller-tel {
    display: block;
    .wh(0.8rem,1rem);
  }
  .collect {
    .pd;
  }
}

.tip-container {
  h3 {
    .flex;
    .align-items(center);
    font-weight: normal;
    padding: @pd 0;
  }
  .tip-item {
    margin-bottom: @pd;
  }
  div {
    color: @lightgray;
  }
}
</style>