<template>
  <div>
    <header-top title="商品管理"></header-top>
    <section v-show="pdlist.length">
      <main class='scroll-content'>
        <yd-checklist v-model="checkList" ref="pdlist" :label="true" :callback="change">
          <yd-checklist-item :val="item.id" v-for="item in pdlist" :key="item.id">
            <div class="pd-item flex align-center">
              <div class="pd-cover">
                <img :src="item.imgUrl" :alt="item.name">
                <span class="pd-status status-0" v-if="item.aduitStatus=='0'">未通过</span>
                <span class="pd-status status-1" v-if="item.aduitStatus=='1'">已上架</span>
                <span class="pd-status status-2" v-if="item.aduitStatus=='2'">待审核</span>
              </div>
              <div class="pd-info">
                <h3 class="pd-title">{{item.name}}</h3>
                <div class="pd-score flex just-between align-center">
                  <crown :value="item.score"></crown>
                  <div class="pd-sale">
                    已售{{item.salesNum}}份
                  </div>
                </div>
                <div class="pd-price">
                  <span class="price">￥{{formatPrice(item.price)}}</span>
                  <span class="market-price">门市价：￥{{formatPrice(item.marketPrice)}}</span>
                </div>
              </div>
              <!-- <div class="pd-edit" @click="editpd(item)">
                <span class="iconfont self-bianji"></span>
              </div> -->
            </div>
          </yd-checklist-item>
        </yd-checklist>
      </main>
      <footer class="fix-footer">
        <div style="padding:0 .1rem;font-size:14px;" v-show="pdlist.length">
          <!-- <yd-checkbox v-model="isCheckAll" shape="circle" :change="checkAll">{{isCheckAll?'取消':'全选'}}</yd-checkbox> -->
          <check-icon :value.sync="isCheckAll">全选</check-icon>
        </div>
        <button class="flex-1 delete-btn" @click="delpd" v-show="checkList.length">下架选中商品</button>
        <button class="flex-1 save-btn" @click="editpd" v-show="checkList.length==1">编辑选中商品</button>
      </footer>
    </section>
    <section v-show="!pdlist.length" class="hv-cen text-center">
      <span class="iconfont self-noorder" style="font-size:40px;"></span>
      <p>暂无商品</p>
    </section>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import Crown from "components/common/Crown";
import { CheckIcon } from "vux";
import { myStorePro, delStorePro, updatePro } from "../../api/index";
import { getStore, mixin } from "components/common/mixin";
export default {
  name: "ProductManage",
  data() {
    return {
      pdlist: [],
      checkList: [],
      isCheckAll: false
    };
  },
  components: { HeaderTop, Crown, CheckIcon },
  computed: {},
  mixins: [mixin],
  created() {},
  activated() {
    this.getpd();
  },
  methods: {
    change(value, isCheckAll) {
      this.isCheckAll = isCheckAll;
    },
    checkAll() {
      this.isCheckAll = !this.isCheckAll;
      this.$refs.pdlist.$emit("ydui.checklist.checkall", this.isCheckAll);
    },
    getpd() {
      let vm = this;
      // this.$dialog.loading.open();
      mui.ajax({
        url: myStorePro,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          account: getStore("account"),
          token: md5(`gjfengmyStorePro${getStore("account")}`)
        },
        success(res) {
          // vm.$dialog.loading.close();
          if (res.code != 200) {
            vm.$dialog.toast({
              mes: res.msg
            });
            return;
          }
          let _list = res.result;
          vm.pdlist = _list;
          if (!_list.length) vm.checkList = [];
        }
      });
    },
    delpd() {
      let vm = this;
      this.$dialog.confirm({
        title: "下架商品",
        mes: "请确认是否下架所选商品",
        opts: () => {
          this.$dialog.loading.open("下架中...");
          mui.ajax({
            url: delStorePro,
            type: "post",
            headers: { "app-version": "v1.0" },
            data: {
              id: this.checkList.join(","),
              account: getStore("account"),
              token: md5(`gjfengdelStorePro${getStore("account")}`)
            },
            success(res) {
              vm.$dialog.loading.close();
              if (res.code == 200) {
                vm.$dialog.toast({
                  mes: "下架成功",
                  timeout: 1000,
                  callback: () => {
                    vm.getpd();
                  }
                });
              } else {
                vm.$dialog.toast({
                  mes: res.msg
                });
              }
            }
          });
        }
      });
    },
    editpd() {
      let id = this.checkList[0];
      let pd = null;
      this.pdlist.forEach(item => {
        if (id == item.id) {
          pd = item;
        }
      });
      this.$router.push({ name: "UpdateProduct", params: { pd } });
    }
  },
  watch: {
    isCheckAll(newVal) {
      //this.isCheckAll = newVal;
      this.$refs.pdlist.$emit("ydui.checklist.checkall", newVal);
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";

.pd-item {
  position: relative;
  .pd-v;
  .pd-cover {
    position: relative;
    overflow: hidden;
    .wh(2rem, 2rem);
    border: 1px solid #dfdfdf;
    img {
      .wh(100%, 100%);
    }
    .pd-status {
      position: absolute;
      left: -0.3rem;
      top: 0.15rem;
      width: 1.2rem;
      padding: 1px 2px 0;
      color: #fff;
      font-size: 10px;
      transform: rotate(-45deg);
      text-align: center;
      &.status-0 {
        background-color: @lightgray;
      }
      &.status-1 {
        background-color: @red;
      }
      &.status-2 {
        background-color: @blue;
      }
    }
  }
  .pd-info {
    flex: 1;
    width: 1%;
    margin-left: @pd;
    .pd-title {
      .ellipsis;
      color: #333333;
      font-size: 14px;
    }
    .pd-score {
      margin: 0.1rem 0;
      width: 100%;
      .pd-sale {
        color: @lightgray;
      }
    }
    .pd-price {
      display: flex;
      flex-direction: column;
      .price {
        font-size: 18px;
        font-weight: bold;
        color: @red;
        width: 100%;
      }
      .market-price {
        font-size: 12px;
      }
    }
  }
  .pd-edit {
    // position: absolute;
    // right: 0;
    // top: 0;
    // bottom: 0;
    // .wh(100%, 100%);
    span {
      position: absolute;
      right: 0;
      bottom: @pd;
    }
  }
}
</style>