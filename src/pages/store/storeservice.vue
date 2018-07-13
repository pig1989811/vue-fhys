<template>
  <div>
    <header-top title="店铺入驻协议"></header-top>
    <main class='scroll-content-2'>
      <iframe :src="info" frameborder="0" style="width:100%;height:100%;"></iframe>
    </main>
  </div>
</template>
<script>
import HeaderTop from 'components/header/index'
import {toStoreServiceRules } from '../../api/index'
export default {
  name: 'StoreService',
  data() {
    return {
      info:null
    }
  },
  components: { HeaderTop },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo(){
      let vm = this;
      mui.ajax({
        url: toStoreServiceRules,
        type: 'post',
        headers: {'app-version': 'v1.0'},
        data: {
          token: md5(`gjfengtoStoreServiceRules`)
        },
        success(res){
          vm.info = res.result;
        }
      })
    }
  }
}
</script>