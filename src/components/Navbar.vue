<template>
  <el-menu
            :default-active="$route.path"
            class="el-menu"
           @select="handleSelect"
            mode="horizontal"
            router
        >
          <el-menu-item index="/home">操作系统算法演示</el-menu-item>
  </el-menu>

</template>


<script>

export default {

  name: 'navbar',

  methods: {

    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
