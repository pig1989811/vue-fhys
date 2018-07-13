<template>
	<div>
		<header-top title="所有栏目"></header-top>
		<main class="scroll-content-2">
			<section class="container" v-for="(item,index) in info" :key="index">
				<div class="flex align-center title">
					<img :src="item.icon" alt="">
					<span>{{item.label}}</span>
				</div>
				<ul v-if="item.sub" class="flex" style="margin-top:.2rem;">
					<router-link :to="{name:'Products',params:{update:true},query:{type:1,id:sub.id}}" v-for="(sub,subIndex) in item.sub" :key="subIndex" class="item flex align-center just-between" tag="li">
						<span>{{sub.names}}</span>
            <span class="iconfont self-right" style="color:#00ceff"></span>
					</router-link>
				</ul>
			</section>
		</main>
	</div>
</template>
<script>
import HeaderTop from "components/header/index";
import { allColumn } from "../../api/index";
export default {
  name: "AllColumn",
  data() {
    return {
      info: null
    };
  },
  components: { HeaderTop },
  created() {
    this.getColumn();
  },
  activated() {},
  methods: {
    getColumn() {
      let vm = this;
      mui.ajax({
        url: allColumn,
        type: "post",
        headers: { "app-version": "v1.0" },
        data: {
          token: md5(`gjfengallColumn`)
        },
        success(res) {
          let _result = res.result;
          let menu = [];
          Object.entries(_result).forEach((value, index) => {
            var item = {};
            var parent = value[0],
              children = value[1];
            item.icon = parent.split(/~/)[0];
            item.label = parent.split(/~/)[1];
            children.length && (item.sub = children);
            menu.push(item);
          });
          vm.info = menu;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../style/mixin.less";
.container {
  .pd;
  background-color: @white;
  margin-bottom: @pd;
  font-size: .28rem;
  .title {
    font-size: 0.32rem;
  }
  img {
    .wh(0.7rem,0.7rem);
    margin-right: @pd;
  }
  .item {
    width: 25%;
    border: 1px solid #fff7f5;
    padding: .2rem .1rem;
  }
}
</style>	