<template>
  <div>
    <header-top></header-top>
    <main class='scroll-content-2'>
      <iframe :src="videoUrl" frameborder="0" style="width:100%;"></iframe>
    </main>
  </div>
</template>
<script>
import HeaderTop from 'components/header/index'
import {aboutGjf} from '../../api/index'
export default {
  name: 'About',
  data() {
    return {
      videoUrl:''
    }
  },
  components: { HeaderTop },
  computed: {

  },
  created() {
    this.getVideo();
  },
  activated() {
    //this.getVideo();
  },
  methods: {
    getVideo(){
      let vm = this;
      mui.ajax({
        url: aboutGjf,
        type: 'post',
        headers: {'app-version': 'v1.0'},
        data: {
          token:md5('gjfengaboutGjf')
        },
        success(res){
          if(res.code==200){
            vm.videoUrl = res.result;
          }
          else {
            vm.videoUrl = "https://v.qq.com/iframe/player.html?vid=y0317vaal6b&tiny=0&auto=0";
          }
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
iframe{
  width: 100%;
  height: 100%;
}
</style>