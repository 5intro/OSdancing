<template>
  <div>
    <div>
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>

import TopBarElement from '@/components/element/TopBarElement' // TopBar


export default {
  name: 'App',
  components: {
    TopBarElement,
  },

  mounted() {
    $('script[src="/test.js"]').remove();
  },
  computed: {
    commonComponent() {
      // 从路由元数据中获取共同组件
      return this.$route.meta.commonComponent;
    },
    selectBar() {
      // 从路由元数据中获取共同组件
      return this.$route.meta.selectBar;
    },
  },


}


</script>
<style>

</style>
