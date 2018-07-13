<template>
  <div>
    <header-top title="帮助与反馈"></header-top>
    <button-tab v-model="selected" style="margin: .2rem .5rem;">
      <button-tab-item>常见问题</button-tab-item>
      <button-tab-item>使用反馈</button-tab-item>
    </button-tab>
    <main class='scroll-content-1'>
      <yd-accordion accordion v-show="!selected">
        <yd-accordion-item :title="item.q" :open="true" v-for="(item,index) in qas" :key="index">
          <div style="padding: .24rem;color:#777;">
            {{item.a}}
          </div>
        </yd-accordion-item>
      </yd-accordion>
      <section v-show="selected">
        <yd-cell-group>
          <yd-cell-item>
            <yd-textarea slot="right" v-model="suggestion" placeholder="请输入您在使用APP过程中遇到的问题，或者您希望可以改善的功能，非常感谢您的宝贵意见和建议。" maxlength="500"></yd-textarea>
          </yd-cell-item>
        </yd-cell-group>
        <div style="padding: .24rem;">
          注意：订单相关问题或紧急问题，请拨打客服热线电话或微信联系，反馈仅处理在APP使用过程中的相关问题
        </div>
        <div style="padding:0 .2rem;">
          <yd-button size="large" @click.native="submit">提交</yd-button>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import {} from "../../api/index";
import { ButtonTab, ButtonTabItem } from "vux";
export default {
  name: "Help",
  data() {
    return {
      selected: 0,
      suggestion: "",
      qas: [
        {
          q: "如何成为凤凰云商的会员？",
          a: "直接扫码关注凤凰云商，并用手机号码注册即可成为凤凰云商的会员。"
        },
        {
          q: "注册成为凤凰云商的会员收费吗？",
          a: "不收费。"
        },
        {
          q: "怎样推荐身边的朋友加入到平台？",
          a: "在账户中生成自己的推荐二维码，让朋友扫码关注即可。"
        },
        {
          q: "成为联盟商家需要那些条件？",
          a: "要有营业执照、法人身份证、法人银行卡账号，免费注册成为商家会员，以及产品成交的12%让利（可以“分红”拿回来）。"
        },
        {
          q: "注册成为凤凰云商的商家收费吗？",
          a: "不收费。"
        },
        {
          q: "成为凤凰云商的联盟商家之后，商家不会操作，不懂上图片，不知道里面功能怎么使用，有专门的服务人员来教吗？",
          a: "有专门的人员进行教授或者直接上传商品，商家也可以通过公众号或者订阅号的视频教程学习上传产品，以及营销、定位等内容。"
        },
        {
          q: "商家上传产品图片需要审核吗？审核时间多少？",
          a: "需要1-3个工作日。"
        },
        {
          q: "提现一般多长时间到账？",
          a: "当您申请提现时，相关工作人员会在后台进行审核，确认信息无误后，会进行发放。根据银行不同，到账时间为1到5个工作日，请您耐心等候。"
        }
      ]
    };
  },
  components: { HeaderTop, ButtonTab, ButtonTabItem },
  computed: {},
  created() {},
  activated() {},
  methods: {
    submit() {
      if (!this.suggestion) {
        this.$dialog.alert({
          mes: "请填写意见和建议之后再提交！"
        });
        return;
      }
      this.$dialog.toast({
        mes: "提交成功！"
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
</style>