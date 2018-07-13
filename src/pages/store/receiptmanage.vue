<template>
  <div>
    <header-top title="付款"></header-top>
    <main class='scroll-content-2'>
      <yd-cell-group title="消费对象">
        <yd-cell-item>
          <span slot="left">消费金额：</span>
          <yd-input slot="right" v-model="payMoney" placeholder="输入金额（单位：元）" type="tel"></yd-input>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">消费会员：</span>
          <yd-input slot="right" v-model="mobile" placeholder="请输入会员手机号" type="tel" regex="mobile" @change.native="findMember"></yd-input>
        </yd-cell-item>
        <yd-cell-item v-if="mobileName">
          <span slot="left">会员名称：</span>
          <yd-input slot="right" readonly v-model="mobileName"></yd-input>
        </yd-cell-item>
      </yd-cell-group>
       <yd-cell-group v-if="payMoney">
        <yd-cell-item>
          <span slot="left">应付金额</span>
          <input slot="right" type="text" readonly style="text-align:right;color:#ff5350;" v-model="payMoney">
        </yd-cell-item>
      </yd-cell-group>
      <yd-cell-group title="支付方式">
        <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-zhifubao" style="color:#00a0ea"></span>
          <span slot="left">支付宝</span>
          <input slot="right" type="radio" value="2" v-model="payType" />
        </yd-cell-item>
        <!-- <yd-cell-item type="radio">
          <span slot="icon" class="iconfont-large self-weixinzhifu" style="color:#25d025;"></span>
          <span slot="left">微信支付</span>
          <input slot="right" type="radio" value="0" v-model="payType" />
        </yd-cell-item> -->
      </yd-cell-group>
      <div class="btn-container" style="padding:0 .2rem;">
        <yd-button size="large" :type="valid?'primary':'disabled'" @click.native="save">立即支付</yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import HeaderTop from "components/header/index";
import { findMemberByMoblie,goMoneyPage } from '../../api/index'
import { payMixin } from "components/common/mixin";

export default {
  name: "Receipt",
  data() {
    return {
      payMoney: '',
      mobile: '',
      mobileName: '',
      payType: '',
      pays:{}
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(['account','storeInfo']),
    valid(){
       return /^(([1-9]\d*)|([0-9]+\.[0-9]{1,2}))$/.test(this.payMoney) && /0?(13|14|15|18)[0-9]{9}/.test(this.mobile)
        && !!this.payType
    }
  },
  created() {},
  mixins: [payMixin],
  activated() {},
  methods: {
    findMember(){
      let vm = this;
      mui.ajax({
        url: findMemberByMoblie,
        type: 'post',
        headers: { 'app-version': 'v1.0' },
        data: {
          account: this.account,
          mobile: this.mobile,
          token: md5(`gjfengfindMemberByMoblie${this.mobile}`)
        },
        success(res) {
          vm.mobileName = res.result.name || res.result.nickName
        }
      })
    },
    save() {
      let vm = this;
      mui.ajax({
        url: goMoneyPage,
        type: 'post',
        headers: {'app-version': 'v1.0'},
        data: {
          storeId:this.storeInfo.id,
          token: md5(`gjfenggoMoneyPage${this.storeInfo.id}`)
        },
        success(res){
          
        }
      })
    }
  }
};
</script>
