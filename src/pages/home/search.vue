<template>
  <div>
    <header-top title="搜索"></header-top>
    <div class="search-form" autocomplete="off">
      <div class="input-group  flex align-center">
        <span class="iconfont-large self-search"></span>
        <input type="text" name="search" class="search-input" placeholder="搜索商家或商品" v-model="searchValue" autofocus @keyup.enter="search(searchValue)">
        <button type="button" name="submit" class="search-submit" @click="search(searchValue)">搜索</button>
      </div>
    </div>
    <main class='scroll-content-1' style="background-color:#fff;">
      <section class="search-history hot-search">
        <div class="search-title fs-14">
          <h3>热门搜索</h3>
        </div>
        <ul class="search-list">
          <li class="search-item" v-for="(item,index) in hotSearch" :key="index" :style="{'background-color':bg[index%7]}">
            <span @click="searchValue=item">{{item}}</span>
          </li>
        </ul>
      </section>
      <section class="search-history" v-if="account&&searchHistory.length">
        <div class="search-title fs-14">
          <h3>搜索历史</h3>
          <span class="iconfont self-delete danger-color" @click="clearHistory">清空</span>
        </div>
        <ul class="search-list">
          <li class="search-item" v-for="(item,index) in searchHistory" :key="index" :style="{'background-color':bg[index%7]}">
            <span @click="searchValue=item">{{item}}</span>
            <i class="iconfont self-x icon-delete" @click="deleteHistory(index)"></i>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import { setStore, getStore, removeStore } from "components/common/mixin";
export default {
  name: "Search",
  data() {
    return {
      account: "",
      searchValue: "",
      hotSearch: ["保健","养生","美容","美食"],
      searchHistory: [],
      bg: [
        "#178CEC",
        "#E51417",
        "#34B34C",
        "#FDBA2D",
        "#FE5B24",
        "#829DAE",
        "#1FBFCB"
      ]
    };
  },
  components: { HeaderTop },
  computed: {},
  created() {
    if (getStore("account") && getStore("account").length > 0) {
      this.account = getStore("account");
    }
    if (getStore(`${this.account}_search`)) {
      this.searchHistory = JSON.parse(getStore(`${this.account}_search`));
    }
  },
  methods: {
    search(v) {
      if (!v) return;
      this.searchValue = v;
      this.$store.commit("RECORD_SEARCH_VALUE", this.searchValue);
      let history = getStore(`${this.account}_search`);
      if (history) {
        let repeat = false;
        this.searchHistory = JSON.parse(history);
        this.searchHistory.forEach(item => {
          if (item == this.searchValue) repeat = true;
        });
        if (!repeat) this.searchHistory.push(this.searchValue);
      } else {
        this.searchHistory.push(this.searchValue);
      }
      setStore(`${this.account}_search`, this.searchHistory);
      this.$router.push({
        name: "SearchResult",
        params: { searchValue: this.searchValue }
      });
    },
    clearHistory() {
      this.searchHistory = [];
      removeStore(`${this.account}_search`);
    },
    deleteHistory(i) {
      this.searchHistory.splice(i, 1);
      setStore(`${this.account}_search`, this.searchHistory);
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/mixin.less";

.search-history {
  .mg;
  .search-title {
    .flex;
    .just-cont(space-between);
    .mg-v;
    color: @lightgray;
  }
  .search-list {
    .search-item {
      display: inline-block;
      line-height: 24px;
      margin: 2px 0.15rem 2px 0;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 0.28rem;
      color: #fff;
      opacity: 1;
      overflow: hidden;
      .icon-delete {
        margin-left: 0.1rem;
        font-weight: normal;
      }
    }
  }
}
</style>