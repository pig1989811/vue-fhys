<template>
  <yd-tabbar active-color="#ff5350" :fixed="true">
    <yd-tabbar-item title="推荐" link="/home/index" :active="$route.path.indexOf('/home/index') !== -1">
      <span class="iconfont-large self-flower" slot="icon"></span>
    </yd-tabbar-item>
    <yd-tabbar-item title="附近" link="/near/index" :active="$route.path.indexOf('/near/index') !== -1">
      <span class="iconfont-large self-near" slot="icon"></span>
    </yd-tabbar-item>
    <yd-tabbar-item title="商城" link="/online/index" :active="$route.path.indexOf('/online/index') !== -1">
      <span class="iconfont-large self-shop" slot="icon"></span>
    </yd-tabbar-item>
    <yd-tabbar-item title="我的" link="/me/index" :active="$route.path.indexOf('/me/index') !== -1">
      <span class="iconfont-large self-me" slot="icon"></span>
    </yd-tabbar-item>
  </yd-tabbar>
</template>
<script>
export default {
  name: 'FooterBar',
}
</script>
<style lang='css' scoped>
.yd-tabbar{
  position: fixed!important;
  bottom: 0;
  height: 1rem;
}
</style>