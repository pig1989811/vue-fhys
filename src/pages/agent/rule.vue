<template>
  <div>
    <header-top title="代理规则"></header-top>
    <main class='scroll-content-2'>
      <iframe :src="url" frameborder="0" style="width: 100%;height: 100%;"></iframe>
    </main>
  </div>
</template>
<script>
import HeaderTop from "components/header/index";
import { agentRule } from "../../api/index";
export default {
  name: "AgentRule",
  data() {
    return {
      url: ""
    };
  },
  components: { HeaderTop },
  created() {
    let vm = this;
    mui.ajax({
      url: agentRule,
      type: "post",
      headers: { "app-version": "v1.0" },
      data: {
        token: md5("gjfengagent")
      },
      success(res) {
        vm.url = res.result;
      }
    });
  }
};
</script>
