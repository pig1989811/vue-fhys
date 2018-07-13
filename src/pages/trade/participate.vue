<template>
  <div>
    <header-top title="福利权益"></header-top>
    <main class='scroll-content-2'>
      <ul v-if="info.length">
        <li v-for="(item,index) in info" :key="index" class="item">
          <div class="item-top flex just-between">
            <p>增加权益</p>
            <p>{{item.diviNum}}</p>
          </div>
          <div class="item-bottom flex just-between">
            <p>{{formatTime(item.addTime,true)}}</p>
          </div>
        </li>
      </ul>
      <section class="hv-cen text-center" v-else>
        <span class="iconfont self-noorder" style="font-size:40px;"></span>
        <p>没有数据</p>
      </section>
    </main>
  </div>
</template>
<script>
import HeaderTop from 'components/header/index'
import { getParticipate } from '../../api/index'
import { getStore, mixin } from 'components/common/mixin'
export default {
  name: 'Participate',
  data() {
    return {
      info: []
    }
  },
  components: { HeaderTop },
  computed: {

  },
  mixins: [mixin],
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      let vm = this;
      this.$dialog.loading.open();
      mui.ajax({
        url: getParticipate,
        type: 'post',
        headers: { 'app-version': 'v1.0' },
        data: {
          account: getStore('account'),
          type: this.$route.query.type,
          token: md5('gjfenggetParticipate')
        },
        success(res) {
          vm.$dialog.loading.close();
          vm.info = res.result;
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
@import '../../style/mixin.less';
.item {
  margin-top: @pd;
  .pd;
  background-color: @white;
  >div {
    width: 100%;
  }
  .item-top {
    font-size: .3rem;
    margin-bottom: @pd;
    p:last-child {
      color: @red;
    }
  }
}
</style>