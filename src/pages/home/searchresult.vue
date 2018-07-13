<template>
  <div>
    <header-top title="搜索结果"></header-top>
    <main class='scroll-content-2'>
      <product-list :like-value="searchValue" tab-type="line"></product-list>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "components/header/index";
import ProductList from "components/common/ProductList";
export default {
  name: "SearchResult",
  data() {
    return {};
  },
  components: { HeaderTop, ProductList },
  computed: {
    ...mapState(["searchValue"])
  }
};
</script>
