<template>
  <div>
    <yd-navbar title="确认订单" :fixed="true">
      <section slot="left" @click="goBack" style="line-height:1rem;">
        <yd-navbar-back-icon>返回</yd-navbar-back-icon>
      </section>
    </yd-navbar>
    <main class='scroll-content-2'>
      <section class="address-container">
        <yd-cell-group v-if="!addressList.length">
          <yd-cell-item arrow type="link" href="/address/new">
            <yd-icon slot="icon" name="location"></yd-icon>
            <span slot="left">收货人</span>
            <span slot="right">去添加</span>
          </yd-cell-item>
        </yd-cell-group>
        <router-link v-else to="/address/index?type=choose" class="flex align-center">
          <div v-if="defaultAddress" class="fs-14 flex-1">
            <p>收货人：
              <span style="margin-right:.2rem;font-weight:bold;">{{defaultAddress.consigneeName}}</span>
              <span>{{defaultAddress.mobile}}</span>
            </p>
            <p>收货地址：{{defaultAddress.proviceId.province}}{{defaultAddress.cityId.city}}
              <span v-if="defaultAddress.areaId">{{defaultAddress.areaId.area}}</span>{{defaultAddress.addressDetail}}</p>
          </div>
          <div v-else-if="addressList[0]" class="fs-14 flex-1">
            <p>收货人：
              <span style="margin-right:.2rem;font-weight:bold;">{{addressList[0].consigneeName}}</span>
              <span>{{addressList[0].mobile}}</span>
            </p>
            <p>收货地址：{{addressList[0].proviceId.province}}{{addressList[0].cityId.city}}
              <span v-if="addressList[0].areaId">{{addressList[0].areaId.area}}</span>{{addressList[0].addressDetail}}</p>
          </div>
          <span class="iconfont self-right"></span>
        </router-link>
      </section>
      <section class="order-list">
        <h2>订单信息</h2>
        <ul>
          <li v-for="(item,index) in settleList.goodsVos" :key="index" class="order-item flex">
            <img :src="item.goodsImg" :alt="item.goodsName" class="pd-img">
            <div class="order-info flex-1">
              <h3 class="pd-name">{{item.goodsName}}</h3>
              <p>{{item.goodsAttr}}</p>
              <div class="flex just-between">
                <span class="danger-color fs-16" v-if="settleList.isCanUseCou==1">{{item.goodsAmount}}积分</span>
                <span class="danger-color fs-16" v-else-if="settleList.isCanUseCou==2">{{item.goodsAmount}}责任金</span>
                <span class="danger-color fs-16" v-else-if="settleList.isCanUseCou==3">{{item.goodsAmount}}代金券</span>
                <!-- <span class="danger-color fs-16" v-else>￥{{item.goodsAmount}}</span> -->
                <template v-else>
                  <template v-if="+member.merchantType==1">
                    <span class="danger-color fs-16" v-if="item.standardPrice">￥{{item.standardPrice}}</span>
                    <span class="danger-color fs-16" v-else>￥{{item.goodsAmount}}</span>
                  </template>
                  <template v-else>
                    <span class="danger-color fs-16" v-if="item.honourPrice">￥{{item.honourPrice}}</span>
                    <span class="danger-color fs-16" v-else>￥{{item.goodsAmount}}</span>
                  </template>
                </template>
                <span class="fs-14">x{{item.goodsNum}}</span>
              </div>
            </div>
          </li>
        </ul>
      </section>
      <yd-cell-group>
        <yd-cell-item>
          <span slot="left">配送方式</span>
          <span slot="right" class="fs-14" v-if="settleList.logist=='0'">快递：￥{{formatPrice(settleList.pos)}}</span>
          <span slot="right" class="fs-14" v-if="settleList.logist=='1'">物流到付</span>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">支付明细</span>
          <span slot="right" class="fs-14" v-if="settleList.isCanUseCou==1">{{settleList.totalAmount}}积分+￥{{formatPrice(settleList.pointNiceAmount||settleList.pos)}}</span>
          <span slot="right" class="fs-14" v-else-if="settleList.isCanUseCou==2">{{settleList.totalAmount}}责任金+￥{{formatPrice(settleList.pointNiceAmount||settleList.pos)}}</span>
          <span slot="right" class="fs-14" v-else-if="settleList.isCanUseCou==3">{{settleList.totalAmount}}代金券+￥{{formatPrice(settleList.pointNiceAmount||settleList.pos)}}</span>
          <!-- <span slot="right" class="fs-14" v-else>￥{{settleList.totalAmount}}</span> -->
          <template slot="right" v-else>
            <span class="danger-color fs-16" v-if="settleList.goodsVos[0].honourPrice&&settleList.logist=='0'">￥{{formatPrice(total2)}}+￥{{settleList.pos}}</span>
            <span class="danger-color fs-16" v-else-if="settleList.goodsVos[0].honourPrice&&settleList.logist=='1'">￥{{formatPrice(total2)}}</span>
            <span class="danger-color fs-16" v-else>￥{{settleList.totalAmount}}</span>
          </template>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">买家留言：</span>
          <yd-input slot="right" v-model="remark" placeholder="选填-可告诉卖家您的特殊要求"></yd-input>
        </yd-cell-item>
        <yd-cell-item v-if="orderType=='1'">
          <span slot="left">当前积分:{{member.consumptionMoney}}</span>
          <span slot="right">
            <span class="iconfont self-dui fs-12 primary-color" v-if="member.consumptionMoney>settleList.totalAmount">支付:{{settleList.totalAmount}}</span>
            <span class="iconfont self-x fs-12 danger-color" v-else>积分不足</span>
          </span>
        </yd-cell-item>
        <yd-cell-item v-if="orderType=='2'">
          <span slot="left">当前责任金:{{member.insuranceMoney}}</span>
          <span slot="right">
            <span class="iconfont self-dui fs-12 primary-color" v-if="member.insuranceMoney>settleList.totalAmount">支付:{{settleList.totalAmount}}</span>
            <span class="iconfont self-x fs-12 danger-color" v-else>责任金不足</span>
          </span>
        </yd-cell-item>
        <yd-cell-item v-if="orderType=='3'">
          <span slot="left">当前代金券:{{member.memberVoucherMoney}}</span>
          <span slot="right">
            <span class="iconfont self-dui fs-12 primary-color" v-if="member.memberVoucherMoney>settleList.totalAmount">支付:{{settleList.totalAmount}}</span>
            <span class="iconfont self-x fs-12 danger-color" v-else>代金券不足</span>
          </span>
        </yd-cell-item>
        <yd-cell-item>
          <p slot="right" class="fs-16">
            支付：
            <span class="danger-color" v-if="orderType=='1'&&!$route.query.buynow">￥{{formatPrice(settleList.pointNiceAmount)}}</span>
            <span class="danger-color" v-else-if="orderType=='1'&&$route.query.buynow">￥{{formatPrice(settleList.pointNiceAmount)}}</span>
            <span class="danger-color" v-else-if="orderType=='2'">￥{{formatPrice(settleList.pointNiceAmount||settleList.pos)}}</span>
            <span class="danger-color" v-else-if="orderType=='3'">￥{{formatPrice(settleList.pointNiceAmount||settleList.pos)}}</span>
            <!-- <span class="danger-color" v-else>￥{{formatPrice(total)}}</span> -->
            <template v-else>
              <span class="danger-color fs-16" v-if="settleList.goodsVos[0].honourPrice&&settleList.logist=='0'">￥{{formatPrice(total2+settleList.pos)}}</span>
              <span class="danger-color fs-16" v-else-if="settleList.goodsVos[0].honourPrice&&settleList.logist=='1'">￥{{formatPrice(total2)}}</span>
              <span class="danger-color" v-else>￥{{formatPrice(total)}}</span>
            </template>
          </p>
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group v-if="orderType=='1'">
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-zhifubao" style="color:#00a0ea"></span>
          <span slot="left">支付宝</span>
          <input slot="right" type="radio" value="7" v-model="payType" />
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group v-else-if="orderType=='2'">
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-zhifubao" style="color:#00a0ea"></span>
          <span slot="left">支付宝</span>
          <input slot="right" type="radio" value="8" v-model="payType" />
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group v-else-if="orderType=='3'">
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-tiqufuli" style="color:#e7d489"></span>
          <span slot="left">代金券</span>
          <input slot="right" type="radio" value="10" v-model="payType" />
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group title="选择支付方式" v-else>
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-wallet danger-color"></span>
          <div slot="left">
            <p>会员余额
            </p>
            <span class="danger-color fs-12">(余额支付需要额外支付10%税费)</span>
          </div>
          <input slot="right" type="radio" value="0" v-model="payType" />
        </yd-cell-item>
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-yuanbao" style="color:#f9a340;"></span>
          <span slot="left">凤凰宝</span>
          <input slot="right" type="radio" value="9" v-model="payType" />
        </yd-cell-item>
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-zhifubao" style="color:#00a0ea"></span>
          <span slot="left">支付宝支付</span>
          <input slot="right" type="radio" value="2" v-model="payType" />
        </yd-cell-item>
      </yd-cell-group>
      <div style="padding:0 .2rem .2rem;">
        <yd-button size="large" :type="valid ?'danger':'disabled'" @click.native="pay">确认支付</yd-button>
      </div>
    </main>
    <div v-show="showPassword" class="text-center pay-box">
      <h3 class="fs-18 pay-title" style="background-color:#9ED97C">待支付金额</h3>
      <div v-if="orderType=='0'&&payType=='0'">
        <template v-if="settleList.goodsVos[0].honourPrice">
          <p class="pay-price fs-14">
            {{total2 + settleList.pos}}×(1+10%)=
            <span class="fs-20 danger-color">￥{{formatPrice((total2+settleList.pos) * 1.1)}}</span>
          </p>
        </template>
        <template v-else>
          <p class="pay-price fs-14">
            {{total}}×(1+10%)=
            <span class="fs-20 danger-color">￥{{formatPrice(total * 1.1)}}</span>
          </p>
        </template>
        <P class="balance-price">
          <span class="iconfont self-rmb1" style="color:#9ED97C"></span>
          余额：
          <span>{{member.balanceMoney}}</span>元
        </P>
      </div>
      <div v-if="orderType=='0'&&payType=='9'">
        <template v-if="settleList.goodsVos[0].honourPrice">
          <p class="pay-price fs-14">
            <span class="fs-20 danger-color">￥{{formatPrice(total2+settleList.pos)}}</span>
          </p>
        </template>
        <template v-else>
          <p class="pay-price fs-14">
            <span class="fs-20 danger-color">{{formatPrice(settleList.totalAmount)}}</span>
          </p>
        </template>
        <P class="balance-price">
          <span class="iconfont self-rmb1" style="color:#9ED97C"></span>
          当前凤凰宝余额：
          <span>{{fhbMoney}}</span>
        </P>
      </div>
      <div v-if="orderType=='2'">
        <p class="pay-price fs-14">
          <span class="fs-20 danger-color">{{formatPrice(settleList.totalAmount)}}</span>
        </p>
        <P class="balance-price">
          <span class="iconfont self-rmb1" style="color:#9ED97C"></span>
          当前责任金：
          <span>{{member.insuranceMoney}}</span>
        </P>
      </div>
      <div v-if="payType=='10'">
        <p class="pay-price fs-14">
          <span class="fs-20 danger-color">{{formatPrice(settleList.totalAmount)}}</span>
        </p>
        <P class="balance-price">
          <span class="iconfont self-rmb1" style="color:#9ED97C"></span>
          当前代金券：
          <span>{{member.memberVoucherMoney}}</span>
        </P>
      </div>
    </div>
    <yd-keyboard v-model="showPassword" :callback="checkPayPwd" ref="keyboard" title="凤凰云商安全键盘" input-text="请输入支付密码"></yd-keyboard>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { addOrder, toAdd } from "../../api/index";
import { mixin, payMixin } from "components/common/mixin";
export default {
  name: "Settle",
  data() {
    return {
      oldBack: mui.back,
      orderType: "0", //0:普通商品 1：积分兑换 2责任消费 3代金券
      remark: "", //备注
      payType: "", //支付方式
      showPassword: false, //安全键盘
      pays: {}
    };
  },
  computed: {
    ...mapState([
      "account",
      "defaultAddress",
      "addressList",
      "settleList",
      "paypwd",
      "member",
      "fhbMoney"
    ]),
    total() {
      return this.settleList.totalAmount + this.settleList.pointNiceAmount;
    },
    total2() {
      let a = 0;
      this.settleList.goodsVos.forEach(item => {
        a +=
          +this.member.merchantType > 1
            ? item.honourPrice * item.goodsNum
            : item.standardPrice * item.goodsNum;
      });
      return a;
    },
    validAddress() {
      return this.defaultAddress || !!this.addressList.length;
    },
    valid() {
      switch (this.orderType) {
        case "1":
          return (
            this.validAddress &&
            this.member.consumptionMoney > this.settleList.totalAmount
          );
          break;
        case "2":
          return (
            this.validAddress &&
            this.member.insuranceMoney > this.settleList.totalAmount
          );
          break;
        case "3":
          return (
            this.validAddress &&
            this.member.memberVoucherMoney > this.settleList.totalAmount
          );
          break;
        default:
          return this.validAddress && true;
      }
    }
  },
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
    this.$store.dispatch("getInfo");
    this.$store.dispatch("getFHB");
    this.orderType = this.$route.query.orderType;
    if (!this.defaultAddress) {
      this.$store.dispatch("getAddressList");
    }
    switch (this.orderType) {
      case "1":
        this.payType = "7";
        break;
      case "2":
        this.payType = "8";
        break;
      case "3":
        this.payType = "10";
        break;
      default:
        this.payType = "0";
        break;
    }
  },
  mixins: [mixin, payMixin],
  methods: {
    goBack(b) {
      if (b == true) {
        this.$router.go(-1);
        return;
      }
      if (!this.$route.query.buynow) {
        this.$dialog.confirm({
          title: "确认离开吗？",
          mes: "购物车相关商品会被删除哦",
          opts: () => {
            this.$router.go(-1);
          }
        });
      } else {
        this.$router.go(-1);
      }
    },
    pay() {
      if (!this.payType) {
        this.$dialog.toast({
          mes: "请选择支付方式",
          timeout: 1000
        });
        return;
      }
      //判断是否设置过支付密码，没有就跳转密码设置
      if (
        (this.payType == "0" ||
          this.payType == "8" ||
          this.payType == "9" ||
          this.payType == "10") &&
        !this.paypwd
      ) {
        this.$router.push({ name: "PwdManage" });
        return;
      }
      //普通商品，余额支付&凤凰宝 || 责任商品，责任金额 ||代金券商品，代金券
      if (
        (this.orderType == 0 && this.payType == "0") ||
        (this.orderType == 0 && this.payType == "9") ||
        (this.orderType == 2 && this.payType == "8") ||
        (this.orderType == 3 && this.payType == "10")
      ) {
        this.showPassword = true;
      } else if (this.orderType == 1) {
        //积分换购
        this.placeAnOrder("");
      } else {
        this.placeAnOrder("");
      }
    },
    checkPayPwd(val) {
      this.$dialog.loading.open("验证支付密码");
      this.placeAnOrder(val);
    },
    placeAnOrder(pwd) {
      let vm = this;
      //购物车下单参数
      let cmParams = null;
      let a = [],
        b = [],
        c = [],
        d = [],
        e = [];
      this.settleList.orderAddVos.forEach(item => {
        if (/(,)$/.test(item.goodsAttrIds))
          item.goodsAttrIds = item.goodsAttrIds.slice(
            0,
            item.goodsAttrIds.length - 1
          );
        a.push(item.goodsId);
        b.push(item.goodsAttrStockId);
        c.push(item.goodsAttrIds);
        d.push(item.goodsAttr);
        e.push(item.goodsNum);
      });
      cmParams = {
        goodsId: a.join(","),
        goodsAttrStockId: b.join(","),
        goodsAttrIds: c.join(";"),
        goodsAttr: d.join(","),
        goodsNum: e.join(","),

        payType: this.payType,
        remark: this.remark,
        couponsId: "",
        orderAddressId:
          (this.defaultAddress && this.defaultAddress.id) ||
          this.addressList[0].id,
        payPassword: pwd,
        account: this.account,
        logist: this.settleList.logist,
        token: md5(`gjfengaddOrder${this.payType}`)
      };
      // this.$dialog.loading.open("下单中...");
      mui.ajax({
        url: addOrder,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: cmParams,
        success(res) {
          // vm.$dialog.loading.close();
          let _result = res.result;
          //品牌商城
          if (vm.orderType == 0) {
            // 余额支付
            if (vm.payType == "0" || vm.payType == "9") {
              vm.$dialog.loading.close();
              if (res.code == 200) {
                vm.showPassword = false;
                vm.confirmBox();
              } else if (res.code == 401) {
                vm.forgetpwd();
              } else {
                vm.$refs.keyboard.$emit("ydui.keyboard.error", res.msg);
              }
            } else if (vm.payType == "3") {
              //银联支付跳转
              vm.$store.commit("RECORD_PAY_INFO", _result);
              vm.$router.push({ name: "YinLian" });
            } else if (vm.payType == "2") {
              //支付宝
              vm.zfbPay(_result.payString);
            }
          } else if (vm.orderType == 1) {
            //积分换购，积分支付
            if (res.code == 200) {
              vm.payPos(_result.payString, res.msg);
            } else {
              vm.$dialog.alert({
                mes: res.msg
              });
            }
          } else if (vm.orderType == 2) {
            //责任消费
            vm.$dialog.loading.close();
            if (res.code == 200) {
              vm.showPassword = false;
              vm.payPos(_result.payString, res.msg);
            } else if (res.code == 401) {
              vm.forgetpwd();
            } else {
              vm.$refs.keyboard.$emit("ydui.keyboard.error", res.msg);
            }
          } else if (vm.orderType == 3) {
            //代金券
            vm.$dialog.loading.close();
            if (res.code == 200) {
              vm.showPassword = false;
              vm.payPos(_result.payString, res.msg);
            } else if (res.code == 401) {
              vm.forgetpwd();
            } else {
              vm.$refs.keyboard.$emit("ydui.keyboard.error", res.msg);
            }
          }
        },
        error(err) {
          vm.$dialog.loading.close();
          vm.$dialog.toast({
            mes: "超时，请稍后重试",
            callback: () => {
              if (vm.payType == "0" || vm.payType == "8") {
                vm.$refs.keyboard.$emit(
                  "ydui.keyboard.error",
                  "超时，请稍后重试"
                );
              }
            }
          });
        }
      });
    },
    confirmBox() {
      this.$dialog.confirm({
        mes: "下单成功！",
        opts: [
          {
            txt: "返回购物",
            color: false,
            stay: false,
            callback: () => {
              this.goBack(true);
            }
          },
          {
            txt: "查看订单",
            color: true,
            stay: false,
            callback: () => {
              this.$router.replace({
                name: "MyOrder",
                params: { update: true },
                query: { id: 0 }
              });
            }
          }
        ]
      });
    },
    forgetpwd() {
      this.$dialog.confirm({
        title: "忘记密码？",
        mes: `支付密码错误，前往设置`,
        opts: () => {
          this.$router.push({ name: "PwdManage" });
        }
      });
      this.$refs.keyboard.$emit(
        "ydui.keyboard.error",
        "对不起，您的支付密码不正确，请重新输入。"
      );
    },
    zfbPay(payParams) {
      let vm = this;
      this.checkService(this.pays["alipay"], function() {
        plus.payment.request(
          vm.pays["alipay"],
          payParams,
          function(result) {
            vm.$dialog.confirm({
              mes: "支付成功！",
              opts: [
                {
                  txt: "返回购物",
                  color: false,
                  stay: false,
                  callback: () => {
                    vm.goBack(true);
                  }
                },
                {
                  txt: "查看订单",
                  color: true,
                  stay: false,
                  callback: () => {
                    vm.$router.replace({
                      name: "MyOrder",
                      query: { id: 0 }
                    });
                  }
                }
              ]
            });
          },
          function(e) {
            vm.$dialog.alert({
              mes: "支付失败:" + e.message
            });
          }
        );
      });
    },
    payPos(payParams, successTips) {
      if (this.settleList.pointNiceAmount || this.settleList.pos) {
        this.$dialog.alert({
          mes: "下单成功，去支付现金部分",
          callback: () => {
            this.zfbPay(payParams);
          }
        });
      } else {
        this.$dialog.alert({
          mes: successTips,
          callback: () => {
            this.goBack(true);
          }
        });
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.address-container {
  background-color: @white;
  margin-bottom: @pd;
  .pd;
}
.order-list {
  .pd;
  background-color: @white;
  margin-bottom: @pd;
  h2 {
    font-size: 0.3rem;
    padding-bottom: @pd;
    font-weight: normal;
  }
  .order-item {
    .pd-v;
    border-top: 1px solid #f9f9f9;
    img {
      .wh(1.5rem,1.5rem);
      overflow: hidden;
    }
    .order-info {
      margin-left: @pd;
      .pd-name {
        .multi-ellipsis(2);
        margin-bottom: 0.12rem;
        color: #333;
        font-size: 0.28rem;
        word-break: break-all;
      }
      p {
        color: @lightgray;
      }
    }
  }
}
.pay-box {
  position: absolute;
  bottom: 9rem;
  left: 0;
  width: 6rem;
  left: 50%;
  margin-left: -3rem;
  background-color: @white;
  z-index: 1503;
  border-radius: 5px;
  .pay-title {
    color: @white;
    border-radius: 5px 5px 0 0;
    .pd-v;
  }
  .pay-price {
    .pd-v;
    border-bottom: 1px solid #f7f7f5;
  }
  .balance-price {
    text-align: left;
    .pd;
  }
}
</style>