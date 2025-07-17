import { createApp } from 'vue'
import App from './App.vue'
import global from "./global.vue"
import "./assets/css/global.css"
// 引入jq
import $ from 'jquery';
window.$=$; // 确保在 Vue 实例化之前引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './components/custom/custom-table.ts'
import './components/custom/custom-element.ts'; // 引入自定义的 Web Component 文件
import './components/custom/custom-LinerList.ts'
import './components/custom/custom-LinerList2.ts'
import './components/custom/custom-LinerListDepth.ts'
import './components/custom/custom-Stack.ts'
import './components/custom/common.ts';
import './components/custom/custom-component.ts';
import './components/custom/custom-binaryTree.ts';
import './components/custom/custom-binaryTreeDepth.ts';
import './components/custom/custom-ThreadbinaryTree.ts';
import './components/custom/custom-ThreadbinaryTree2.ts';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min'
import { createPinia } from 'pinia' // 导入 Pinia

// 引入 vue-router
import router from './router';
import * as Vue from "marked";
const app = createApp(App)


import TDesign from 'tdesign-vue-next';

// 引入组件库的少量全局样式变量
// import 'tdesign-vue-next/es/style/index.css';
app.use(createPinia()) // 注册 Pinia
app.use(TDesign);
app.use(router) // router 组件
app.use(ElementPlus)
// 在 Vue 3 中，全局属性应该通过 config.globalProperties 设置
app.config.globalProperties.GLOBAL = global
app.mount('#app')