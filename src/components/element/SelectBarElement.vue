<template>
  <ul class="nav nav-pills justify-content-evenly">
    <li class="nav-item">
      <router-link
          class="nav-link"
          :to="getAlgorithmDemoRoute()"
          :class="{
            active: activeNav === '算法演示',
            disabled: activeNav === '算法演示' // 新增 disabled 类
          }"
          @click="setActiveNav('算法演示')"
          id="a-1"
      >算法演示</router-link>
    </li>
    <li class="nav-item">
      <router-link
          class="nav-link"
          :to="getMultipleChoice()"
          :class="{
            active: activeNav === '选择题练习',
            disabled: activeNav === '选择题练习' // 新增 disabled 类
          }"
          @click="setActiveNav('选择题练习')"
          id="a-3"
      >选择题练习</router-link>
    </li>
  </ul>
</template>


<script>
import http from "@/api/http";
import axios from "axios";

export default {
  name: "DataStructureContentBarElement",
  props: ['id', 'active'],
  data() {
    return {
      activeNav: '算法演示',
      previousRoute: null,
      topicId: null,//当前算法的ID
      firstChoiceId: null,//当前算法第一道选择题的ID
    };
  },
  methods: {
    setActiveNav(navItem) {
      if (navItem === '选择题练习' && this.activeNav === '算法演示') {
        this.previousRoute = this.$route.fullPath;
      }
      this.activeNav = navItem;
    },
    getAlgorithmDemoRoute() {
      this.previousRoute= ''
      switch (this.$route.query.topicId) {
        case '1':
          this.previousRoute='/cp/RegexToNfa'
          break;
        case '2':
          this.previousRoute='/cp/NfaToDfa'
          break;
        case '3':
          this.previousRoute='/cp/FSA'
          break;
        case '4':
          this.previousRoute='/cp/RecursiveAnalysis'
          break;
        case '5':
          this.previousRoute='/cp/LL'
          break;
        case '6':
          this.previousRoute='/cp/SLR'
          break;
        default:
          break;
      }
      return this.previousRoute || '/' + this.$route.name;
    },
    getMultipleChoice() {
      // const response = await http.get(`/api/compiler/myapp/get_compiler_ai_data/${this.$route.name}/`);
      // const response = await axios.get(`http://127.0.0.1:8000/api/myapp/get_compiler_ai_data/${this.$route.name}/`);
      // console.log(response.data.data[0].algorithm_id);
      // this.topicId = response.data.data[0].algorithm_id;
      // console.log(this.$route.name);
      return `/multipleChoice/detail/${this.firstChoiceId}?topicId=${this.topicId}&algoRoute=${this.$route.name}`;
      // this.$router.push({
      //   path: `/multipleChoice/detail/1}`,
      //   query: {algoRoute: this.$route.name }
      // });
    },
    changeActive() {
      const currentPath = this.$route.path;
      if (currentPath.includes('/multipleChoice/detail')) {
        this.activeNav = '选择题练习';
      } else {
        this.activeNav = '算法演示';
      }
    }
  },
  async created() {
    this.changeActive();
    const response = await http.get(`myapp/get_compiler_ai_data/${this.$route.name}/`);
    let id=this.$route.name;
    console.log("id1111",id);
    // const response = await axios.get(`http://127.0.0.1:8000/api/myapp/get_compiler_ai_data/${id}/`);
    console.log("api_myapp",response);
    if (Array.isArray(response.data.data) && response.data.data.length > 0) {
      console.log(response.data.data[0].algorithm_id);
      console.log("api",response);
      this.topicId = response.data.data[0].algorithm_id;
    } else {
      console.log('数据格式不符合预期，无法获取 algorithm_id');
    }
    this.firstChoiceId=this.topicId-1+'1';
  },
  watch: {
    '$route.path': function(newPath) {
      this.changeActive();
    }
  }
};
</script>

<style scoped>
.active {
  background-color: #007bff;
  color: white;
}

.disabled {
  pointer-events: none; /* 禁用点击事件 */
  cursor: default;     /* 鼠标悬停时显示默认光标 */
}
</style>
