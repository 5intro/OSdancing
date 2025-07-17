<template>
  <t-menu theme="light" v-model="val" :collapsed="collapsed" class="menu-with-scrollbar" v-model:expanded="expand">
    <!-- 折叠按钮 -->
    <template #operations>
      <t-button class="t-demo-collapse-btn" variant="text" shape="square" @click="changeCollapsed">
        <template #icon><t-icon name="view-list" /></template>
      </t-button>
    </template>
    <!-- 词法分析父级菜单 -->
    <t-submenu value="item-1" mode="popup">
      <template #icon>
        <!-- 这里可以添加词法分析对应的图标 SVG -->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 示例图标，可根据需求修改 -->
          <!--            <rect x="2" y="2" width="20" height="20" fill="lightblue" stroke="black" stroke-width="0.5"/>-->
          <image href="@/assets/img/cplogo7.png" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"/>

        </svg>
      </template>
      <template #title>
        <span style="font-size:20px; margin-left:4px;font-weight: 600;">词法分析</span>
      </template>
      <!-- 词法子菜单 -->
      <t-menu-item value="RegexToNfa" class="menu-linkk">
        <router-link :to="'/cp/RegexToNfa'" class="menu-link">正则表达式转NFA</router-link>
      </t-menu-item>
      <t-menu-item value="NfaToDfa" class="menu-linkk">
        <router-link :to="'/cp/NfaToDfa'" class="menu-link">NFA转DFA</router-link>
      </t-menu-item>
      <t-menu-item value="FSA" class="menu-linkk">
        <router-link :to="'/cp/FSA'" class="menu-link">词法分析器自动生成</router-link>
      </t-menu-item>
    </t-submenu>
    <!-- 语法分析父级菜单 -->
    <t-submenu value="item-2" mode="popup">
      <template #icon>
        <!-- 这里可以添加语法分析对应的图标 SVG -->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 示例图标，可根据需求修改 -->
          <!--            <rect x="2" y="2" width="20" height="20" fill="lightgreen" stroke="black" stroke-width="0.5"/>-->
          <image href="@/assets/img/cplogo2.png" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"/>

        </svg>
      </template>
      <template #title>
        <span style="font-size:20px; margin-left:4px;font-weight: 600;">语法分析</span>
      </template>
      <!-- 语法分析子菜单 -->
      <t-menu-item value="RecursiveAnalysis" class="menu-linkk">
        <router-link :to="'/cp/RecursiveAnalysis'" class="menu-link">递归下降语法分析</router-link>
      </t-menu-item>
      <t-menu-item value="LL" class="menu-linkk">
        <router-link :to="'/cp/LL'" class="menu-link">LL(1)语法分析</router-link>
      </t-menu-item>
      <t-menu-item value="LR" class="menu-linkk">
        <router-link :to="'/cp/SLR'" class="menu-link">SLR(1)语法分析</router-link>
      </t-menu-item>
    </t-submenu>
  </t-menu>
</template>

<script setup>
import { useCatalogStore } from '@/stores/catalog'
import {computed, onMounted, defineEmits, ref} from 'vue'
import { useRoute } from 'vue-router';
const catalogStore = useCatalogStore()
const emit = defineEmits(['algorithm-selected']);  // Define the event to emit
const val = ref('item-0-0'); // 使用 ref 使 val 响应式
const expand = ref(['item-0']);

// 使用计算属性保持响应式
const catalog = computed(() => catalogStore.catalog)
const collapsed = computed(() => catalogStore.collapsed)

// 初始化时加载数据（只会执行一次）
onMounted(() => {
  catalogStore.fetchData()
  const route = useRoute();
  try {
    const path = route.path;
    const parts = path.split('/');
    const last =  parts[parts.length - 1];
    console.log(last)
    let ex = 'item-0'
    if (last == 'RegexToNfa' || last == 'NfaToDfa' || last == 'FSA') ex = "item-1"
    else ex = 'item-2'
    val.value = last;
    // const result = val.value.split('-').slice(0, -1).join('-');
    expand.value = [ex]
  } catch (e) {

  }
})

// 切换折叠状态时调用 Store 的 Action
const changeCollapsed = () => {
  catalogStore.toggleCollapsed()
}

// Emit the event when an algorithm is selected
const emitAlgorithm = (algoId) => {
  emit('algorithm-selected', algoId);
};
</script>

<style scoped>
.menu-with-scrollbar {
  max-height: 1500px; /* 设置最大高度为视口高度 */
  overflow-y: auto; /* 增加垂直滚动条 */
}

.menu-link {
  text-decoration: none;
  color: inherit;
  font-size: 17px;
  display: block; /* Make the button fill the t-menu-item */
  width: 100%;
  text-align: left;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.menu-linkk:hover {
  text-decoration: underline;
}

/* 可以根据需要进一步调整样式，例如菜单项的字体大小等 */
.t-menu-item {
  font-size: 1.2em; /* 进一步放大菜单项的字体 */
}
.menu-with-scrollbar::-webkit-scrollbar {
  width: 6px; /* 设置纵向滚动条的宽度为 8px */
}

.menu-with-scrollbar {
  border-radius: 10px; /* 圆角 */
}

.menu-with-scrollbar::-webkit-scrollbar-thumb {
  background: #888; /* 滑块颜色为灰色 */
  border-radius: 10px; /* 圆角滑块 */
}

.menu-with-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555; /* 悬停时滑块颜色变深 */
}

/* 如果需要设置滚动条的轨道样式 */
.menu-with-scrollbar::-webkit-scrollbar-track {
  background: #f0f0f0; /* 滚动条轨道的背景色 */
  border-radius: 10px; /* 圆角轨道 */
}

</style>
