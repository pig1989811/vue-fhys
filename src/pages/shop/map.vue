<template>
  <div>
    <header-top title="商家地址"></header-top>
    <main id="map-container">
    </main>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
export default {
  name: "Map",
  data() {
    return {
      address: "",
      city:"",
      map: null
    };
  },
  components: { HeaderTop },
  computed: {},
  created() {
    this.address = this.$route.params.address;
    this.city = this.$route.params.city;
  },
  mounted(){
    this.drawMap();
  },
  methods: {
    drawMap() {
      let vm = this;
      this.map = new BMap.Map("map-container");
      let geo = new BMap.Geocoder();
      geo.getPoint(this.address,function(point){
        if(point){
          vm.map.centerAndZoom(point,16);
          vm.map.addOverlay(new BMap.Marker(point))
        }
      },this.city)
    }
  }
};
</script>
<style lang='less' scoped>
#map-container {
  position: absolute;
  left: 0;
  width: 100%;
  top: 1rem;
  bottom: 0;
  background-color: #fff;
}
</style>