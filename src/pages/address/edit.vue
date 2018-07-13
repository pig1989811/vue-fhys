<template>
  <div>
    <header-top title="地址修改"></header-top>
    <main class='scroll-content-2'>
      <group>
        <x-input title="收货人" v-model="info.consigneeName" placeholder="请输入收货人姓名" required></x-input>
        <x-input title="手机号码" v-model="info.mobile" placeholder="请输入收货人手机号码" type="tel" required is-type="china-mobile"></x-input>
        <!-- <x-switch title="性别" :value-map="['男', '女']" :inline-desc="sex?'男':'女'" v-model="sex"></x-switch> -->
        <cell title="性别">
          <div slot="default">
            <label for="male" class="self-radio">
              <input type="radio" value="1" id="male" v-model="info.consigneeSex">
              <span>男</span>
            </label>
            <label for="female" class="self-radio">
              <input type="radio" value="2" id="female" v-model="info.consigneeSex">
              <span>女</span>
            </label>
          </div>
        </cell>
        <x-address title="省市区" v-model="address" :list="addressData" placeholder="请选择地址" :show.sync="showAddress"></x-address>
        <x-textarea title="详细地址：" v-model="info.addressDetail" placeholder="街道、楼牌号码等"></x-textarea>
      </group>
      <div style="padding:0 .2rem;">
        <yd-button :type="valid?'warning':'disabled'" @click.native="editAddress" size="large">保存</yd-button>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { updateAddressInIos } from "../../api/index";
import {
  Group,
  Cell,
  XInput,
  XTextarea,
  XSwitch,
  XAddress,
  ChinaAddressV4Data
} from "vux";
export default {
  name: "AddressEdit",
  data() {
    return {
      oldBack: mui.back,
      showAddress: false,
      info:{},
      addressData: ChinaAddressV4Data,
      address: [],
    };
  },
  components: {
    HeaderTop,
    Group,
    Cell,
    XInput,
    XTextarea,
    XSwitch,
    XAddress
  },
  computed: {
    ...mapState(["account"]),
    valid() {
      return (
        !!this.info.consigneeName &&
        /^[1][3578][0-9]{9}$/.test(this.info.mobile) &&
        this.address.length &&
        !!this.info.addressDetail
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

  created() {
      this.info = this.$route.params.item;
      let area = this.info.areaId?this.info.areaId.areaId+"":'--';
      this.address = [this.info.proviceId.provinceId+"",this.info.cityId.cityId+"",area]
  },
  methods: {
    goBack() {
      if (this.showAddress) {
        this.showAddress = false;
      } else {
        this.$router.go(-1);
      }
    },
    editAddress() {
      let vm = this;
      mui.ajax({
        url: updateAddressInIos,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          id: this.info.id,
          account: this.account,
          consigneeName: this.info.consigneeName,
          consigneeSex: this.info.consigneeSex,
          mobile: this.info.mobile,
          proviceId: this.address[0],
          cityId: this.address[1],
          areaId: this.address[2]=='--'?'0':this.address[2],
          addressDetail: this.info.addressDetail,
          token: md5(
            `gjfengupdateAddressInIos${this.info.id}${this.account}`
          )
        },
        success(res) {
          if (res.code == 200) {
            vm.$dialog.toast({
              mes: "修改成功",
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