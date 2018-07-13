<template>
  <div>
    <header-top title="订单管理"></header-top>
     <tab :line-width="2" active-color='#ff5350' v-model="index" custom-bar-width="60px">
      <tab-item  v-for="(item, index) in menu" :key="index" @on-item-click="toggleItem(index)">{{item.value}}</tab-item>
    </tab>
    <main class='scroll-content-1'>
      <!-- <section> -->
        <div v-show="index==0">
          <yd-infinitescroll :callback="getMyOrder" ref="orderlist7">
            <ul slot="list">
              <order-item v-for="item in list7" :key="item.orderSn" :name="item.storeName" :sn="item.orderSn" :goods="item.goods" :total="item.goodsTotalAmount" :status="item.orderStatus"></order-item>
            </ul>
          </yd-infinitescroll>
        </div>
         <div v-show="index==1">
          <yd-infinitescroll :callback="getMyOrder" ref="orderlist0">
            <ul slot="list">
              <order-item v-for="item in list0" :key="item.orderSn" :name="item.storeName" :sn="item.orderSn" :goods="item.goods" :total="item.goodsTotalAmount" :status="item.orderStatus"></order-item>
            </ul>
          </yd-infinitescroll>
        </div>
         <div v-show="index==2">
          <yd-infinitescroll :callback="getMyOrder" ref="orderlist3">
            <ul slot="list">
              <order-item v-for="item in list2" :key="item.orderSn" :name="item.storeName" :sn="item.orderSn" :goods="item.goods" :total="item.goodsTotalAmount" :status="item.orderStatus"></order-item>
            </ul>
          </yd-infinitescroll>
        </div>
      <!-- </section> -->
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import OrderItem from 'components/common/OrderItem';
import { Tab, TabItem } from "vux";
import { findO2oOrderByPage } from "../../api/index";
export default {
  name: "OrderManage",
  data() {
    return {
      menu: [
        { key: "7", value: "全部订单" },
        { key: "0", value: "待支付" },
        { key: "3", value: "交易成功" }
      ],
      index: 0, //控制tab
      orderType: '7', //控制订单类型
      noData0: false,
      noData3: false,
      noData7: false,
      list0: [],
      list3: [],
      list7: [],
      pageNo0: 1,
      pageNo3: 1,
      pageNo7: 1
    };
  },
  components: { HeaderTop, Tab, TabItem ,OrderItem},
  computed: {
    ...mapState(["storeInfo"])
  },
  created() {},
  activated() {
    this.reset();
    this.toggleItem(this.index);
  },
  methods: {
    reset(){
      this.orderType= '7';
      this.noData0= false;
      this.noData3= false;
      this.noData7= false;
      this.list0= [];
      this.list3= [];
      this.list7= [];
      this.pageNo0= 1;
      this.pageNo3= 1;
      this.pageNo7= 1;
      this.index= 0; 
    },
    toggleItem(index) {
      this.orderType = this.menu[index].key;
      if (!this[`noData${this.orderType}`]) {
        this.getMyOrder();
      }
    },
    getMyOrder() {
      let vm = this;
      mui.ajax({
        url: findO2oOrderByPage,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          status: this.orderType,
          storeId: this.storeInfo.id,
          pageNo: this[`pageNo${this.orderType}`],
          pageSize: 10,
          beginTime: "",
          endTime: "",
          token: md5(`gjfengfindO2oOrderByPage${this.storeInfo.id}`)
        },
        success(res) {
           if (res.code == 200) {
            let _list = res.result.resultVo;
            vm[`list${vm.orderType}`] = [...vm[`list${vm.orderType}`],..._list];
            if (_list.length < 10) {
              vm[`noData${vm.orderType}`] = true;
              vm.$refs[`orderlist${vm.orderType}`].$emit("ydui.infinitescroll.loadedDone");
              return;
            }
            vm.$refs[`orderlist${vm.orderType}`].$emit("ydui.infinitescroll.finishLoad");
            vm[`pageNo${vm.orderType}`]++;
          } else {
            vm.$dialog.toast({
              mes: res.msg || "网络异常,请重试"
            });
            return;
          }
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.order-item{
  margin-top: @pd;
  .pd;
  background-color: @white;
  h2,.order-id{
    .pd-v;
  }
  .good-list{
   .good-item{
     padding-bottom: .1rem;
     margin-bottom: .1rem;
     img{
       .wh(1.5rem,1.5rem);
     }
     .good-info{
       flex: 1;
       display: flex;
       flex-direction: column;
       justify-content: space-between;
       margin-left: @pd * 2;
       .good-title{
         .ellipsis-2;
         font-weight: normal;
       }
       .good-price{
         display: flex;
         justify-content: space-between;
         span:last-child{
           color: @red;
           font-size: 14px;
         }
       }
     }
   } 
  }
}
</style>