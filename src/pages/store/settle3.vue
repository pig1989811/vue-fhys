<template>
  <div>
    <header-top title="企业入驻"></header-top>
    <main class='scroll-content-2'>
      <yd-step :current="step1" current-color="#04be02">
        <yd-step-item>
          <span slot="bottom">基本信息</span>
        </yd-step-item>
        <yd-step-item>
          <span slot="bottom">店铺地址</span>
        </yd-step-item>
        <yd-step-item>
          <span slot="bottom">营业执照</span>
        </yd-step-item>
        <yd-step-item>
          <span slot="bottom">银行账户</span>
        </yd-step-item>
      </yd-step>
      <group v-show="step1==1">
        <x-textarea title="店铺名称：" v-model="storeName" placeholder="请填写店铺名称" :rows="2" inline-desc="(不可更改)"></x-textarea>
        <x-input title="联系人：" v-model="sellerName" placeholder="请填写企业联系人" :required="true"></x-input>
        <x-input title="联系电话：" v-model="sellerMobile" placeholder="请填写联系人的手机号码" type="tel" is-type="china-mobile" :required="true"></x-input>
        <x-input title="电子邮箱：" v-model="sellerEmail" placeholder="请填写联系人的邮箱" type="email" is-type="email" :required="true"></x-input>
        <x-input title="注册资金：" v-model="companyRegisteredCapital" placeholder="请填写金额" :required="true">
          <span class="danger-color" slot="right">(万元)</span>
        </x-input>
      </group>
      <group v-show="step1==2">
        <x-address title="省份城市：" v-model="storeCitys" :list="addressData" placeholder="请选择地址" :show.sync="show1"></x-address>
        <x-textarea title="详细地址：" v-model="addressDetail" placeholder="街道、楼牌号码等" :max="200"></x-textarea>
      </group>
      <group v-show="step1==3">
        <x-input title="组织机构代码：" v-model="organizationCode" placeholder="企业组织机构代码" :required="true"></x-input>
        <x-input title="税务登记：" v-model="taxRegistrationCertificate" placeholder="税务登记证号" :required="true"></x-input>
        <x-input title="营业执照号：" v-model="businessLicenceNumber" placeholder="请填写营业执照号" :required="true"></x-input>
        <x-address title="营业执照" inline-desc="所在地" v-model="businessLicenceAddress" :list="addressData" placeholder="营业执照所在地" :show.sync="show2"></x-address>
        <x-textarea title="经营范围：" inline-desc="(选填)" v-model="businessSphere" placeholder="填写您的经营范围" :max="400"></x-textarea>
        <div class="upload-container">
          <p class="tips">请确保营业执照图片清晰，文字可辨并有清晰的红色公章。</p>
          <img src="" alt="" class="licence-picture">
          <div class="upload-icon">
            <span class="iconfont self-upload"></span>
            <input type="file" accept="image/*" name="licence-upload" id="licence-upload" @change="choosePicture($event)">
          </div>
        </div>
      </group>
      <group v-show="step1==4">
        <x-switch title="同时设置为结算账号" v-model="isSettlementAccount"></x-switch>
        <x-input title="银行开户名：" v-model="bankAccountName" placeholder="请填写开户银行名" :required="true"></x-input>
        <x-input title="公司银行账号：" v-model="bankAccountNumber" placeholder="请填写开户银行账号" type="tel" :required="true"></x-input>
        <x-input title="开户银行支行名称：" v-model="bankName" placeholder="请填写开户银行支行名称" :required="true"></x-input>
        <x-address title="开户银行所在地：" v-model="bankAddress" :list="addressData" placeholder="请选择地址" :show.sync="show3"></x-address>
      </group>
      <group title="结算账号信息" v-if="step1==4&&!isSettlementAccount">
        <x-input title="银行开户名：" v-model="settlementBankAccountName" placeholder="请填写开户银行名" :required="true"></x-input>
        <x-input title="公司银行账号：" v-model="settlementBankAccountNumber" placeholder="请填写开户银行账号" type="tel" :required="true"></x-input>
        <x-input title="开户银行支行名称：" v-model="settlementBankName" placeholder="请填写开户银行支行名称" :required="true"></x-input>
        <x-address title="开户银行所在地：" v-model="settlementBankAddress" :list="addressData" placeholder="请选择地址" :show.sync="show4"></x-address>
      </group>
      <div style="padding:.2rem;" v-show="step1==4">
        <check-icon :value.sync="checkProtocol" type="plain">{{checkProtocol?'同意':'不同意'}}</check-icon>
        <router-link to="/store/service" class="protocol">《凤凰云商o2o店铺入驻协议》</router-link>
      </div>
      <div class="flex just-center btn-groups">
        <yd-button size="large" type="danger" @click.native="step1--" v-if="step1>1&&step1<=4" class="flex-1">上一步</yd-button>
        <yd-button size="large" v-if="step1>=1&&step1<4" class="flex-1" @click.native="nextStep">下一步</yd-button>
        <yd-button size="large" :type="valid?'warning':'disabled'" v-if="step1==4" class="flex-1" @click.native="applicate">提交申请</yd-button>
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
  XButton,
  XSwitch,
  CheckIcon,
  ChinaAddressV4Data
} from "vux";
import { addStore } from "../../api/index";
import { validateSettle } from "components/common/mixin";
import "lrz/dist/lrz.bundle.js";
export default {
  name: "EnterpriseSettle",
  data() {
    return {
      oldBack: mui.back,
      step1: 1,
      show1: false, //店铺地址判断标志
      show2: false, //营业执照所在地判断标志
      show3: false, //开户银行所在地判断标志
      show4: false, //结算银行所在地判断标志

      storeName: "", //店铺名称
      sellerName: "", //联系人
      sellerMobile: "", //联系电话
      sellerEmail: "", //联系邮箱
      companyRegisteredCapital: "", //注册资金

      storeCitys: [], //店铺地址id
      addressDetail: "", //街道

      businessLicenceNumber: "", //营业执照号
      businessLicenceAddress: [], //营业执照地id
      businessSphere: "", //经营范围
      organizationCode: "", //组织机构代码
      taxRegistrationCertificate: "", //税务登记

      isSettlementAccount: true, //开户账户是否结算账号
      bankAccountName: "", //银行开户名
      bankAccountNumber: "", //银行账号
      bankName: "", //银行名称
      bankAddress: [], //银行所在地id
      settlementBankAccountName: "", //结算开户名
      settlementBankAccountNumber: "", //结算账号
      settlementBankName: "", //结算银行名称
      settlementBankAddress: [], //结算银行地址id

      fileContent: "", //营业执照base64
      addressData: ChinaAddressV4Data, //省市县数据

      checkProtocol: true
    };
  },
  components: {
    HeaderTop,
    Group,
    Cell,
    XInput,
    XTextarea,
    XAddress,
    XButton,
    XSwitch,
    CheckIcon
  },
  computed: {
    ...mapState(["account"]),
    validCapital() {
      return /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(
        this.companyRegisteredCapital
      );
    },
    validBankAddress() {
      return !!this.bankAddress.length;
    },
    validBankAccountName() {
      return !!this.bankAccountName;
    },
    validSettleBankAccount() {
      return !this.isSettlementAccount
        ? !!this.settlementBankAccountName
        : true;
    },
    validSettleBankNumber() {
      return !this.isSettlementAccount
        ? /^\d{15,19}$/.test(this.settlementBankAccountNumber)
        : true;
    },
    validSettleBankName() {
      return !this.isSettlementAccount ? !!this.settlementBankName : true;
    },
    validSettleBankAddress() {
      return !this.isSettlementAccount
        ? !!this.settlementBankAddress.length
        : true;
    },
    validOrganization() {
      return !!this.organizationCode;
    },
    validTax() {
      return !!this.taxRegistrationCertificate;
    },
    valid() {
      return (
        this.validBankAccount &&
        this.validBankAddress &&
        this.validBankAccountName &&
        this.validSettleBankAccount &&
        this.validSettleBankNumber &&
        this.validSettleBankName &&
        this.validSettleBankAddress &&
        this.checkProtocol
      );
    }
  },
  mixins: [validateSettle],
  created() {},
  activated() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      mui.back = vm.goBack;
    });
  },
  beforeRouteLeave(to, from, next) {
    mui.back = this.oldBack;
    next();
  },
  methods: {
    goBack() {
      if (this.show1) {
        this.show1 = false;
      } else if (this.show2) {
        this.show2 = false;
      } else if (this.show3) {
        this.show3 = false;
      } else if (this.show4) {
        this.show4 = false;
      } else {
        this.$router.go(-1);
      }
    },
    nextStep() {
      switch (this.step1) {
        case 1:
          this.validStoreName &&
          this.validSellerName &&
          this.validSellerMobile &&
          this.validEmail &&
          this.validCapital
            ? this.step1++
            : this.$dialog.alert({ mes: "请完善基本信息" });
          break;
        case 2:
          this.validStoreCitys && this.validAddressDetail
            ? this.step1++
            : this.$dialog.alert({ mes: "请完善地址信息" });
          break;
        case 3:
          this.validOrganization &&
          this.validTax &&
          this.validLicenseNumber &&
          this.validLicenseAddress &&
          this.validFileContent
            ? this.step1++
            : this.$dialog.alert({ mes: "请完善营业执照信息" });
          break;
      }
      // this.step1 ++;
    },
    choosePicture(event) {
      let p = document.querySelector(".licence-picture"),
        file = event.target.files[0];
      if (!/image\/\w+/.test(file.type)) {
        this.$dialog.toast({
          mes: "请上传图片",
          timeout: 1000,
          icon: "error"
        });
        return;
      }
      this.$dialog.loading.open("上传中...");
      lrz(file, { width: 800 }).then(rst => {
        this.$dialog.loading.close();
        p.src = rst.base64;
        this.fileContent = rst.base64;
      });
    },
   applicate() {
      let vm = this;
      let a1 = this.storeCitys[2]=='--'?'0':this.storeCitys[2];
      let a2 = this.businessLicenceAddress[2]=='--'?'0':this.businessLicenceAddress[2];
      let a3 = this.bankAddress[2]=='--'?'0':this.bankAddress[2];
      let a4 = this.settlementBankAddress[2]=='--'?'0':this.settlementBankAddress[2];
      let params = {
        storeName: this.storeName,
        sellerName: this.sellerName,
        sellerMobile: this.sellerMobile,
        sellerEmail: this.sellerEmail,
        companyRegisteredCapital: this.companyRegisteredCapital,
        storeCitys: `${this.storeCitys[0]},${this.storeCitys[1]},${a1}`,
        addressDetail: this.addressDetail,
        organizationCode: this.organizationCode,
        taxRegistrationCertificate: this.taxRegistrationCertificate,
        businessLicenceNumber: this.businessLicenceNumber,
        businessLicenceAddress: `${this.businessLicenceAddress[0]},${this.businessLicenceAddress[1]},${a2}`,
        businessSphere: this.businessSphere,
        businessLicenceStart: "20160901",
        businessLicenceEnd: "20700901",
        isSettlementAccount: this.isSettlementAccount ? "1" : "0",
        bankAccountName: this.bankAccountName,
        bankAccountNumber: this.bankAccountNumber,
        bankName: this.bankName,
        bankAddress: `${this.bankAddress[0]},${this.bankAddress[1]},${a3}`,
        fileContent: this.fileContent,
        fileName: "123.png",
        account: this.account,
        token: md5("gjfengaddStore")
      };
      if (this.isSettlementAccount) {
        params.settlementBankAccountName = params.bankAccountName;
        params.settlementBankAccountNumber = params.bankAccountNumber;
        params.settlementBankName = params.bankName;
        params.settlementBankAddress = params.bankAddress;
      }
      else{
        params.settlementBankAccountName =this.settlementBankAccountName;
        params.settlementBankAccountNumber = this.settlementBankAccountNumber;
        params.settlementBankName = this.settlementBankName;
        params.settlementBankAddress = `${this.settlementBankAddress[0]},${this.settlementBankAddress[1]},${a43}`;
      }
      this.$dialog.loading.open("申请中...");
      mui.ajax({
        url: addStore,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: params,
        success(res) {
          vm.$dialog.loading.close();
          if (res.code != 200) {
            vm.$dialog.alert({
              mes: res.msg
            });
            return;
          }
          vm.$dialog.toast({
            mes: res.msg,
            timeout: 1500,
            callback: () => {
              vm.$router.go(-1);
            }
          });
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.upload-container {
  padding: @pd;
  .tips {
    font-size: 12px;
    color: #999;
    margin-bottom: 0.1rem;
  }
  .licence-picture {
    width: 100%;
  }
  .upload-icon {
    position: relative;
    text-align: center;
    span {
      font-size: 40px;
    }
    #licence-upload {
      position: absolute;
      left: 0;
      .wh(100%, 40px);
      top: 0;
      opacity: 0;
    }
  }
}
.btn-groups {
  margin-top: 1rem;
  margin-bottom: @pd;
  button {
    &:first-of-type {
      .mg-h;
    }
    &:last-of-type {
      .mg-h;
    }
  }
}
</style>