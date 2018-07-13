<template>
  <div>
    <header-top title="授信额度"></header-top>
    <main class='scroll-content-2'>
      <section class="container">
        <p>我的授信额度</p>
        <div>{{member.lineOfCrade}}</div>
      </section>
      <yd-cell-group>
        <yd-cell-item arrow  v-for="(item,index) in menu" :key="index" type="label" @click.native="navigate(item.link)">
          <span slot="icon" :class="['iconfont-large',item.icon]" :style="{'color':item.color}"></span>
          <span slot="left">{{item.text}}</span>
        </yd-cell-item>
      </yd-cell-group>
    </main>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import HeaderTop from 'components/header/index'
export default {
  name: 'Shouxin',
  data() {
    return {
      menu: [
        {
          icon: 'self-edu',
          text: '在线充值授信额度',
          link: '/trade/buyshouxin',
          color: '#f47874'
        },
         {
          icon: 'self-rmb1',
          text: '转账充值授信额度',
          link: '/trade/buyshouxin2',
          color: '#ffd700'
        },
        {
          icon: 'self-xiaofeijilu',
          text: '查询授信记录',
          link: '/trade/shouxinlist',
          color: '#0f8ee9'
        },
        {
          icon: 'self-shoukuan',
          text: '销售录入',
          link: '/trade/salerecord',
          color: '#f9a340'
        },
        
      ]
    }
  },
  components: { HeaderTop },
  computed: {
    ...mapState(['member'])
  },
  created() {

  },
  activated() {
    this.$store.dispatch("getInfo");
  },
  methods: {
    navigate(link){
      this.$router.push(link)
    }
  }
}
</script>
<style lang='less' scoped>
@import '../../style/mixin.less';
.container {
  padding: .8rem .3rem;
  margin-bottom: @pd *2;
  background-color: @red;
  color: @white;
  p {
    font-size: .32rem;
  }
  div {
    margin-top: @pd * 3;
    font-size: 1rem;
    font-weight: bold;
  }
}
</style>