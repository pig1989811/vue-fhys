<template>
  <div>
    <header-top title="地址添加"></header-top>
    <main class='scroll-content-2'>
      <group>
        <x-input title="收货人" v-model="consigneeName" placeholder="请输入收货人姓名" required></x-input>
        <x-input title="手机号码" v-model="mobile" placeholder="请输入收货人手机号码" type="tel" is-type="china-mobile" required></x-input>
        <cell title="性别">
          <div slot="default">
            <label for="male" class="self-radio">
              <input type="radio" value="1" id="male" v-model="consigneeSex">
              <span>男</span>
            </label>
            <label for="female" class="self-radio">
              <input type="radio" value="2" id="female" v-model="consigneeSex">
              <span>女</span>
            </label>
          </div>
        </cell>
        <x-address title="省市区" v-model="address" :list="addressData" placeholder="请选择地址" :show.sync="showAddress"></x-address>
        <x-textarea title="详细地址：" v-model="addressDetail" placeholder="街道、楼牌号码等"></x-textarea>
      </group>
      <div style="padding:0 .2rem;">
        <yd-button :type="valid?'primary':'disabled'" @click.native="addAddress" size="large">保存</yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import {
  Group,
  Cell,
  XInput,
  XTextarea,
  XAddress,
  ChinaAddressV4Data
} from "vux";
import { newsAddressInIos } from "../../api/index";
export default {
  name: "AddressNew",
  data() {
    return {
      oldBack: mui.back,
      showAddress: false,
      addressData: ChinaAddressV4Data,
      address: [],
      consigneeName: "",
      consigneeSex: "1",
      mobile: "",
      addressDetail: ""
    };
  },
  components: { HeaderTop, Group, Cell, XInput, XAddress, XTextarea },
  computed: {
    ...mapState(["account"]),
    valid() {
      return (
        !!this.consigneeName &&
        /^1[3,4,5,7,8,9]\d{9}$/.test(this.mobile) &&
        !!this.address.length &&
        !!this.addressDetail
      );
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
  activated() {},
  methods: {
    goBack() {
      if (this.showAddress) {
        this.showAddress = false;
      } else {
        this.$router.go(-1);
      }
    },
    addAddress() {
      let vm = this;
      mui.ajax({
        url: newsAddressInIos,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: this.account,
          consigneeName: this.consigneeName,
          consigneeSex: this.consigneeSex,
          mobile: this.mobile,
          proviceId: this.address[0],
          cityId: this.address[1],
          areaId: this.address[2]=='--'?'0':this.address[2],
          addressDetail: this.addressDetail,
          token: md5(`gjfengnewsAddressInIos${this.account}`)
        },
        success(res) {
          if (res.code == 200) {
            vm.$dialog.toast({
              mes: "添加成功",
              callback: () => {
                vm.$router.go(-1);
              }
            });
          } else {
            vm.$dialog.toast({
              mes: res.msg
            });
          }
        }
      });
    }
  }
};
</script>
