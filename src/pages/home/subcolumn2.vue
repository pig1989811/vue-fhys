<template>
  <div>
    <header-top title="栏目商品"></header-top>
    <main class='scroll-content-2'>
      <section class="search-container">
        <router-link to="/home/search" class="search-input">
          <span class="iconfont-large self-search"></span>
          <span>搜索商家或商品</span>
        </router-link>
      </section>
      <product-list tab-type="line" :column-id="$route.params.id" column-type="2"></product-list>
    </main>
  </div>
</template>
<script>
import HeaderTop from 'components/header/index'
import ProductList from 'components/common/ProductList'
export default {
  name: 'SubColumn2',
  data() {
    return {

    }
  },
  components: { HeaderTop, ProductList },
  computed: {

  },
  created() {

  },
  activated() {

  },
  methods: {

  }
}
</script>
<style lang='less' scoped>
@import '../../style/mixin.less';
</style>