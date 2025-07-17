<template>
  <t-menu theme="light" v-model="val" :collapsed="collapsed" class="menu-with-scrollbar"  v-model:expanded="expand">
    <!-- 折叠按钮 -->
    <template #operations>
      <t-button class="t-demo-collapse-btn" variant="text" shape="square" @click="changeCollapsed">
        <template #icon><t-icon name="view-list" /></template>
      </t-button>
    </template>
    <!-- 动态生成菜单内容 -->
    <template v-for="(item, index) in catalog" :key="index">
      <!-- 父级菜单 -->
      <t-submenu :value="'item-' + item.id" mode="popup" >
        <template #icon>
          <svg v-if="item.name === '线性表'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="8" width="6" height="8" fill="lightblue" stroke="black" stroke-width="0.5"/>
            <rect x="10" y="8" width="6" height="8" fill="lightgreen" stroke="black" stroke-width="0.5"/>
            <rect x="18" y="8" width="6" height="8" fill="lightyellow" stroke="black" stroke-width="0.5"/>
            <line x1="8" y1="12" x2="9.5" y2="12" stroke="black" stroke-width="0.5"/>
            <line x1="16" y1="12" x2="17.5" y2="12" stroke="black" stroke-width="0.5"/>
          </svg>
          <svg v-if="item.name === '字符串'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="3" width="22" height="16" rx="2" fill="lightblue" stroke="black" stroke-width="0.5"/>
            <text x="12" y="14" font-size="9" text-anchor="middle" fill="black">abc</text>
          </svg>
          <svg v-if="item.name === '查找'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C12.1217 18 14.0665 17.1571 15.5156 15.7578L20.7071 20.9492L22.1213 19.535L16.9497 14.3634C18.2165 12.8324 19 10.9926 19 10C19 5.58172 15.4183 2 10 2ZM10 4C14.4183 4 18 7.58172 18 12C18 16.4183 14.4183 20 10 20C5.58172 20 2 16.4183 2 12C2 7.58172 5.58172 4 10 4Z" fill="lightblue" />
          </svg>
          <svg v-if="item.name === '排序'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 第一个矩形 -->
            <path d="M4 16H8V8H4V16Z" fill="lightblue" />
            <!-- 第二个矩形 -->
            <path d="M10 16H14V12H10V16Z" fill="lightgreen" />
            <!-- 第三个矩形 -->
            <path d="M16 16H20V4H16V16Z" fill="	#7CCD7C" />
          </svg>
          <svg v-if="item.name === '栈和队列'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 栈结构（垂直叠加） -->
            <rect x="6" y="4" width="12" height="3" rx="1" fill="#87CEFA"/>
            <rect x="6" y="9" width="12" height="3" rx="1" fill="#87CEFA"/>
            <rect x="6" y="14" width="12" height="3" rx="1" fill="#87CEFA"/>
            <!-- 队列箭头（水平流动） -->
            <path d="M4 18L8 18M10 18L14 18M16 18L20 18" stroke="#4CAF50" stroke-width="2"/>
            <path d="M20 16L22 18L20 20" stroke="#4CAF50" fill="none"/>
          </svg>
          <svg v-if="item.name === '树和二叉树'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C10.8954 3 10 3.89543 10 5C10 6.10457 10.8954 7 12 7C13.1046 7 14 6.10457 14 5C14 3.89543 13.1046 3 12 3ZM11 8.87398C9.27477 8.42994 8 6.86384 8 5C8 2.79086 9.79086 1 12 1C14.2091 1 16 2.79086 16 5C16 6.86384 14.7252 8.42994 13 8.87398V11H17C18.6569 11 20 12.3431 20 14V15.126C21.7252 15.5701 23 17.1362 23 19C23 21.2091 21.2091 23 19 23C16.7909 23 15 21.2091 15 19C15 17.1362 16.2748 15.5701 18 15.126V14C18 13.4477 17.5523 13 17 13H7C6.44772 13 6 13.4477 6 14V15.126C7.72523 15.5701 9 17.1362 9 19C9 21.2091 7.20914 23 5 23C2.79086 23 1 21.2091 1 19C1 17.1362 2.27477 15.5701 4 15.126L4 14C4 12.3431 5.34315 11 7 11H11V8.87398ZM19.0028 17H18.9972C17.8939 17.0015 17 17.8964 17 19C17 20.1046 17.8954 21 19 21C20.1046 21 21 20.1046 21 19C21 17.8964 20.1061 17.0015 19.0028 17ZM5 17C3.89543 17 3 17.8954 3 19C3 20.1046 3.89543 21 5 21C6.10457 21 7 20.1046 7 19C7 17.8954 6.10457 17 5 17Z" fill="	#7CCD7C" />
          </svg>
          <svg  v-if="item.name === '图'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- 连接线 1-5 -->
            <line x1="6" y1="6" x2="12" y2="12" stroke="black" stroke-width="0.5" style="z-index: -1;"/>

            <!-- 连接线 2-5 -->
            <line x1="18" y1="6" x2="12" y2="12" stroke="black" stroke-width="0.5" style="z-index: -1;"/>

            <!-- 连接线 3-5 -->
            <line x1="6" y1="18" x2="12" y2="12" stroke="black" stroke-width="0.5" style="z-index: -1;"/>

            <!-- 连接线 4-5 -->
            <line x1="18" y1="18" x2="12" y2="12" stroke="black" stroke-width="0.5" style="z-index: -1;"/>

            <!-- 节点1 (蓝色) -->
            <circle cx="6" cy="6" r="2" fill="lightblue" stroke="black" stroke-width="0.5"/>

            <!-- 节点2 (绿色) -->
            <circle cx="18" cy="6" r="2" fill="lightgreen" stroke="black" stroke-width="0.5"/>

            <!-- 节点3 (黄色) -->
            <circle cx="6" cy="18" r="2" fill="lightyellow" stroke="black" stroke-width="0.5"/>

            <!-- 节点4 (粉色) -->
            <circle cx="18" cy="18" r="2" fill="#FFB6C1" stroke="black" stroke-width="0.5"/>

            <!-- 节点5 (中间, 紫色, 更大) -->
            <circle cx="12" cy="12" r="4" fill="#E6E6FA" stroke="black" stroke-width="0.5"/>          </svg>
        </template>
        <template #title>
          <span style="font-size:20px; margin-left:4px;font-weight: 600;">{{ item.name }}</span>
        </template>
        <!-- 子菜单 -->
        <t-menu-item
            v-for="(algo, j) in item.algorithms"
            :key="j"
            :value="'item-' + item.id + '-' + j"
            class="menu-linkk"
            @click="emitAlgorithm(algo.id)"
        >
          <router-link
              :to="'/logicalContent/' + algo.id"
              class="menu-link"
          >
            {{ algo.name }}
          </router-link>

<!--          <template v-else>-->
<!--            <button class="menu-link">{{ algo.name }}</button>-->
<!--          </template>-->
        </t-menu-item>
      </t-submenu>
    </template>
  </t-menu>
</template>

<script setup>
import { useCatalogStore } from '@/stores/catalog'
import { computed, onMounted, defineEmits,defineProps,ref } from 'vue'
// 定义 props，接收父组件传递的 selectedId
const props = defineProps({
  selectedId: {
    type: Number, // 或者 Number，根据实际情况调整
    required: true
  }
})
// console.log(props.selectedId)

const catalogStore = useCatalogStore()
const emit = defineEmits(['algorithm-selected']);  // Define the event to emit

// 使用计算属性保持响应式
const catalog = computed(() => catalogStore.catalog)
const collapsed = computed(() => catalogStore.collapsed)
const val = ref('item-0-0'); // 使用 ref 使 val 响应式
const expand = ref(['item-0']);

// 初始化时加载数据（只会执行一次）
onMounted(async () => {
  await catalogStore.fetchData()
  try {
    val.value = catalogStore.getItemId(props.selectedId);
    const result = val.value.split('-').slice(0, -1).join('-');
    expand.value = [result]
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
  max-height: 980px; /* 设置最大高度为视口高度 */
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
