<template>
  <div>
    <header-top title="我的收藏"></header-top>
    <tab :line-width="2" active-color='#ff5350' v-model="tabIndex" custom-bar-width="70px">
      <tab-item  v-for="(item, index) in menu" :key="index" @on-item-click="toggleItem(index)">{{item.value}}</tab-item>
    </tab>
     <main class="scroll-content-1">
      <div v-show="tabIndex==0">
        <yd-infinitescroll :callback="getCollect" ref="ctlist1">
          <ul slot="list">
            <li v-for="(m,n) in info1" :key="m.colId" class="collect-item item-1 flex align-center px-1">
              <img :src="getImgPath(m.img)" alt="">
              <div class="collect-info flex-1">
                <h3>{{m.storeName}}</h3>
                <p>收藏时间：{{formatTime(m.addTime)}}</p>
              </div>
              <span class="iconfont self-delete danger-color" @click="deleteCollect(m.colId,n)"></span>
            </li>
          </ul>
        </yd-infinitescroll>
      </div>
      <div v-show="tabIndex==1">
        <yd-infinitescroll :callback="getCollect" ref="ctlist2">
          <ul slot="list">
            <li v-for="(p,q) in info2" :key="p.colId" class="collect-item flex align-center px-1">
              <img :src="getImgPath(p.img)" alt="">
              <div class="collect-info flex-1">
                <h3>{{p.goodName}}</h3>
                <p>收藏时间：{{formatTime(p.addTime)}}</p>
              </div>
              <span class="iconfont self-delete danger-color" @click="deleteCollect(p.colId,q)"></span>
            </li>
          </ul>
        </yd-infinitescroll>
      </div>
     </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import { Tab, TabItem } from "vux";
import { myCollect, delectMyCollect } from "../../api/index";
import { mixin } from "components/common/mixin";
export default {
  name: "MyCollect",
  data() {
    return {
      noData2: false,
      noData1: false,
      info2: [],
      info1: [],
      pageNo2: 1,
      pageNo1: 1,
      collectType: "1",
      tabIndex: 0,
      menu: [
        {
          key: "1",
          value: "收藏的店铺"
        },
        {
          key: "2",
          value: "收藏的商品"
        }
      ]
    };
  },
  components: { HeaderTop, Tab, TabItem },
  computed: {
    ...mapState(["account"])
  },
  mixins: [mixin],
  created() {
    this.toggleItem(this.tabIndex);
  },
  activated() {

  },
  methods: {
    toggleItem(index) {
      this.collectType = this.menu[index].key;
      if (!this[`noData${this.collectType}`]) {
        this.getCollect();
      }
    },
    getCollect() {
      let vm = this;
      mui.ajax({
        url: myCollect,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          pageNo: this[`pageNo${this.collectType}`],
          pageSize: 10,
          collectType: this.collectType,
          account: this.account,
          token: md5(`gjfengmyCollect`)
        },
        success(res) {
          if (res.code == 200) {
            let _list = res.result;
            vm[`info${vm.collectType}`] = [...vm[`info${vm.collectType}`],..._list];
            if (_list.length < 10) {
              vm[`noData${vm.collectType}`] = true;
              vm.$refs[`ctlist${vm.collectType}`].$emit("ydui.infinitescroll.loadedDone");
              return;
            }
            vm.$refs[`ctlist${vm.collectType}`].$emit("ydui.infinitescroll.finishLoad");
            vm[`pageNo${vm.collectType}`]++;
          } else {
            vm.$dialog.toast({
              mes: res.msg || "网络异常,请重试"
            });
            return;
          }
        }
      });
      // axios.get('/static/json/collect.json').then(res=>{
      //   this.info1 = res.data.result;
      //   this.info2 = res.data.result;
      // })
    },
    deleteCollect(id, index) {
      let vm = this;
      mui.ajax({
        url: delectMyCollect,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          colId: id,
          token: md5(`gjfengdelectMyCollect${id}`)
        },
        success(res) {
          if (res.code == 200) {
            vm[`info${vm.collectType}`].splice(index, 1);
            vm.$dialog.toast({
              mes: res.msg
            });
          }
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";
.collect-item {
  .pd;
  background-color: @white;
  img {
    .wh(1.2rem,1.2rem);
    border-radius: 50%;
  }
  .collect-info {
    margin: 0 @pd /1;
    font-size: 14px;
    p:first-of-type {
      color: @lightgray;
      font-size: 12px;
    }
  }
  &.item-1 {
    h3 {
      margin-bottom: @pd;
    }
  }
}
</style>