<template>
  <div>
    <header-top title="合并用户信息"></header-top>
    <main class='scroll-content-2'>
      <p class="danger-color fs-14" style="background-color:#fff;padding:.2rem;">
        {{tips}}
      </p>
      <yd-cell-group title="合并信息">
        <yd-cell-item>
          <span slot="left"> 合并到：</span>
          <!-- <yd-input slot="right" v-model="mobile" required placeholder="请输入会员手机号" type="tel" regex="mobile" @input.native="findMember"></yd-input> -->
          <input type="tel" slot="right" v-model="mobile" placeholder="请输入会员手机号" @input="findMember">
        </yd-cell-item>
        <yd-cell-item v-if="mobileName">
          <span slot="left">会员名称：</span>
          <yd-input slot="right" readonly v-model="mobileName" :show-clear-icon="false"></yd-input>
        </yd-cell-item>
      </yd-cell-group>
      <div class="btn-container flex just-around" style="padding:0 .2rem;">
        <yd-button type="warning" @click.native="goMergeHistory" style="font-size:15px;"> 更 多 记 录
          <span class="iconfont self-right"></span>
        </yd-button>
        <yd-button :type="valid?'primary':'disabled'" @click.native="showPassword=true" style="font-size:15px;"> 确 认 合 并
          <span class="iconfont self-dui"></span>
        </yd-button>
      </div>
    </main>
    <yd-keyboard v-model="showPassword" :callback="checkPayPwd" ref="keyboard" title="凤凰云商安全键盘" input-text="请输入支付密码"></yd-keyboard>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { transferPage,memberPointTransfer } from "../../api/index";
import { findMemberByMobile } from "components/common/mixin";
export default {
  name: "Merge",
  data() {
    return {
      tips:'',
      mobile: "",
      mobileName: "",
      showPassword: false
    };
  },
  components: { HeaderTop },
  computed: {
    ...mapState(["account"]),
    valid() {
      return /^1[3,4,5,7,8,9]\d{9}$/.test(this.mobile) && this.mobile != this.account;
    }
  },
  created() {
    this.getPos();
  },
  mixins: [findMemberByMobile],
  activated() {},
  methods: {
    getPos(){
      let vm = this;
      mui.ajax({
        url: transferPage,
        type: 'post',
        headers: {'app-version': 'v1.0'},
        data: {
          token: md5(`gjfengtransferPage`)
        },
        success(res){
          let pos = +res.result.value * 100;
          vm.tips = `合并过程中，积分、余额、累计消费、责任消费、分红权，系统扣除${pos}%作为服务费`
        }
      })
    },
    checkPayPwd(val) {
      this.$dialog.loading.open("验证支付密码");
      this.merge(val);
    },
    merge(val) {
      if (this.account == this.mobile) {
        this.$dialog.alert({
          mes: "消费会员不能是自己"
        });
        return;
      }
      let vm = this;
      mui.ajax({
        url: memberPointTransfer,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          transferMoney: "",
          transferMemberMobile: this.mobile,
          payPassword: val,
          type: 3,
          account: this.account,
          token: md5(`gjfengmemberPointTransfer3${this.account}`)
        },
        success(res) {
          vm.$dialog.loading.close();
          if (res.code == 200) {
            vm.$dialog.toast({
              mes: res.msg
            });
            vm.showPassword = false;
          } else if (res.code == 401) {
            vm.$dialog.confirm({
              title: "忘记密码？",
              mes: `${res.msg}，前往设置`,
              opts: () => {
                vm.$router.push({ name: "PwdManage" });
              }
            });
            vm.$refs.keyboard.$emit(
              "ydui.keyboard.error",
              "对不起，您的支付密码不正确，请重新输入。"
            );
          } else if (res.code == 402) {
            vm.$dialog.alert({
              mes: res.msg,
              callback: () => {
                vm.$router.push({ name: "PwdManage" });
              }
            });
          } else {
            vm.$dialog.alert({
              mes: res.msg
            });
          }
        }
      });
    },
    goMergeHistory() {
      this.$router.push({ name: "TransferHistory", query: { type: 1 } });
    }
  }
};
</script>
