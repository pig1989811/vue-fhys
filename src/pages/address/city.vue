<template>
  <div>
    <header-top title="切换城市"></header-top>
    <main class="scroll-content-2">
      <section class="current-city flex just-between">
        <div class="">
          当前城市：<span class="danger-color">{{city}}</span> 
        </div>
        <div class="position" v-show="false">定位</div>
      </section>
      <section class="title-container hot-city">
        <h3>热门城市</h3>
        <ul>
          <li v-for="(item,index) in hotCity" :key="index" @click="selectCity(item)">
            {{item.city}}
          </li>
        </ul>
      </section>
      <section class="title-container letter-container">
        <h3>全部城市</h3>
        <ul>
          <li v-for="item in letters" :key="item" @click="scroll(item)" :class="{'active':item==selectLetter}">
            {{item}}
          </li>
        </ul>
      </section>
      <section class="title-container title-outline" :id="item.letter" v-for="(item,index) in sortCity" :key="index">
        <h3>{{item.letter}}</h3>
        <ul>
          <li v-for="city in item.result" :key="city.cityId" @click="selectCity(city)">
            {{city.city}}
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import HeaderTop from 'components/header/index';
import { getProvinceByLetter } from '../../api/index'
export default {
  name: 'City',
  data() {
    return {
      hotCity: [{
        cityId: '110100',
        city: '北京市'
      }, {
        cityId: '310100',
        city: '上海市'
      }, {
        cityId: '440100',
        city: '广州市'
      }, {
        cityId: '440300',
        city: '深圳市'
      }, {
        cityId: '330100',
        city: '杭州市'
      }, {
        cityId: '320100',
        city: '南京市'
      }, {
        cityId: '320500',
        city: '苏州市'
      }, {
        cityId: '420100',
        city: '武汉市'
      }],
      letters: [],
      area: [],
      selectLetter:''
    }
  },
  components: {
    HeaderTop
  },
  computed: {
    ...mapState(['latitude', 'longitude', 'city']),
    sortCity() {
      let sortArray = [];
      for (let j = 65; j < 91; j++) {
        for (let i = 0; i < this.area.length; i++) {
          if (this.area[i].letter == String.fromCharCode(j)) {
            let item = {};
            item.letter = this.area[i].letter;
            item.result = this.area[i].result;
            sortArray.push(item)
          }
        }
      }
      return sortArray
    }
  },
  created() {
    this.getCities()
  },
  methods: {
    getCities() {
      this.$dialog.loading.open();
      const letters = [];
      for (let i = 65; i < 91; i++) {
        if (i == 73 || i == 79 || i == 85 || i == 86) continue
        letters.push(String.fromCharCode(i))
      }
      this.letters = letters;
      let vm = this, area = [];
      for (let i = 0, len = letters.length; i < len; i++) {
        let item = {};
        item.letter = letters[i];
        mui.ajax({
          url: getProvinceByLetter,
          type: 'post',
          data: {
            letter: letters[i],
            type: 2,
            token: md5('gjfenggetProvinceByLetter')
          },
          headers: { "app-version": "v1.0" },
          success(res) {
            item.result = res.result;
            area.push(item);
            if (i == len - 1) {
              vm.$dialog.loading.close();
            }
          },
          error(res){
              vm.$dialog.loading.close();
          }
        })
      }
      this.area = area;
    },
    selectCity(e){
      let city = e.city;
      axios.get(`http://api.map.baidu.com/geocoder/v2/?address=${city}&output=json&ak=xVyOYxDsYKpFBx8zdICSlWxsqltd8QoC&city=${city}`).then(res => {
              let longitude = res.data.result.location.lng;
              let latitude = res.data.result.location.lat;
              this.$store.commit('RECORD_ADDRESS', { latitude, longitude });
              this.$store.commit('RECORD_CITY', city);
              this.$router.push({path:'/index',params:{cityId:e.cityId}})  
            })
    },
    scroll(e) {
      this.selectLetter=e;
      setTimeout(()=>{
        document.getElementById(e).scrollIntoView();
      },300)
    }
  }
}
</script>
<style lang='less' scoped>
@import '../../style/mixin.less';
.current-city {
  background-color: @white;
  line-height: 1rem;
  margin-top: @pd;
  .pd-h;
  font-size: 16px;
  .position {
    font-size: 14px;
    color: @red;
  }
}

.title-container {
  .pd;
  ul {
    background-color: @white;
    .pd-v;
    font-size: 13px;
    li {
      display: inline-block;
      width: 20%;
      margin: .15rem;
      border: 1px solid #ccc;
      border-radius: 3px;
      .pd-v;
      .text-center;
      .ellipsis;
      a {
        display: block;
      }
    }
  }
  h3 {
    font-size: 14px;
    color: @lightgray;
    padding: 0 0 @pd 0;
  }
  &.title-outline {
    li {
      border: none;
    }
  }
  &.letter-container {
    li {
      width: 15%;
      &.active{
        transition: all .2s;
        background-color: red;
        color: @white;
        border: 1px solid currentColor;
        box-shadow: 0 0 15px @white inset;
        font-size: .28rem;
      }
    }
  }
  &.hot-city {
    li {
      color: rgb(23, 140, 236);
    }
  }
}
</style>