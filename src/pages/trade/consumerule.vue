<template>
  <div>
    <header-top title="消费规则"></header-top>
    <main class='scroll-content-2' style="background-color:#fff;">
      <div v-html="info.contents"></div>
    </main>
  </div>
</template>
<script>
import HeaderTop from 'components/header/index'
import { consumptionInH5 } from '../../api/index'
export default {
  name: 'ConsumeRule',
  data() {
    return {
      info:{}
    }
  },
  components: { HeaderTop},
  created () {
    this.getInfo();
  },
  methods: {
    getInfo(){
      let vm = this;
      mui.ajax({
        url: consumptionInH5,
        type: 'post',
        headers: {'app-version': 'v1.0'},
        data: {
          token: md5(`gjfengconsumptionInH5`)
        },
        success(res){
          vm.info = res.result;
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>

</style>