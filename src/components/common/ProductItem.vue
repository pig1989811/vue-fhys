<template>
  <div class="like-item">
    <router-link :to="{path:'/shop/index/' + id}" class="like-link">
      <div class="product-cover">
        <img v-lazy="imgUrl" :alt="title" />
      </div>
      <div class="product-info flex-1 flex align-center" v-if="showType">
        <div class="product-head">
          <h3>{{title}}</h3>
        </div>
        <div class="product-score flex align-center just-between">
          <crown :value="score" :disabled="true"></crown>
          <div class="product-address" v-if="distance">
            <span class="iconfont self-location danger-color"></span>
            <span class="product-distance">{{formatDis(distance)}}</span>
          </div>
          <div v-if="saleNum">
            已售{{saleNum}}份
          </div>
        </div>
        <div class="product-content">
          {{content}}
        </div>
        <div class="product-price flex align-center">
          <span class="price">￥{{formatPrice(price1)}}</span>
        </div>
      </div>
      <div class="product-info flex-1 flex align-center" v-else>
        <div class="product-head">
          <h3>{{title}}</h3>
        </div>
        <div class="product-score flex align-center just-between">
          <crown :value="score" :disabled="true"></crown>
          <div class="product-address" v-if="distance">
            <span class="iconfont self-location danger-color"></span>
            <span class="product-distance">{{formatDis(distance)}}</span>
          </div>
        </div>
        <div class="product-content">
          {{description ||"店主比较懒，没留下什么介绍"}}
        </div>
      </div>
    </router-link>
  </div>
</template>
<script>
import { mixin } from "components/common/mixin";
import Crown from "./Crown";
export default {
  name: "ProductItem",
  props: {
    id: [String, Number],
    imgUrl: String,
    title: String,
    score: Number,
    distance: Number,
    content: String,
    price1: Number,
    saleNum: Number,
    showType: Boolean, //简短展示
    description: String
  },
  components: { Crown },
  mixins: [mixin]
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.like-item {
  position: relative;
  border-bottom: 1px solid #f7f5f5;
  /*兼容部分机型分辨率*/
  .pd;
}

.like-link {
  display: flex;
  color: @lightgray;
  .product-cover {
    .wh(2rem, 2rem);
    img {
      .wh(100%, 100%);
    }
  }
  .product-info {
    width: 1%;
    margin-left: @pd;
    .product-head {
      font-size: 14px;
      width: 100%;
      h3 {
        .ellipsis;
        color: #333333;
        font-size: 14px;
      }
    }
    .product-score {
      margin: 0.1rem 0;
      width: 100%;
    }
    .product-address {
      font-size: 0;
      .product-distance {
        color: @red;
        border: 1px solid currentColor;
        border-left: none;
        padding: 2px 2px 2px 2px;
        border-radius: 0 5px 5px 0;
        font-size: 10px;
        vertical-align: 2px;
        position: relative;
        right: 3px;
      }
    }
    .product-content {
      .ellipsis;
      margin: 0 0 @pd 0;
      width: 100%;
    }
    .product-price {
      .price {
        font-size: 0.36rem;
        font-weight: bold;
        color: @red;
      }
      .market-price {
        font-size: 12px;
        margin-left: 0.2rem;
      }
    }
  }
}
</style>