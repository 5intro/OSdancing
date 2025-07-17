<template>
  <div>
    <!-- 返回按钮，根据导航栈长度决定是否显示 -->
    <a v-if="navigationStack.length > 0" @click="goBack" class="back-button">
      <i class="fas fa-undo" style="margin-right: 10px"></i>
      <span>返回</span>
    </a>

    <div class="tag-cloud" ref="tagCloud" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
         @mousemove="handleMouseMove">
      <!-- 循环渲染 tags 数组 -->
      <a v-for="(tag, index) in tags" :key="index" :href="tag.href" :style="{ color: getRandomColor() }"
         @click.prevent="handleTagClick(tag)">{{ tag.text }}</a>
    </div>
  </div>
</template>

<script>
import http from "@/api/http";

export default {
  data() {
    return {
      catalog: [],
      tags: [
        {
          id: 1, text: '线性表', href: '', children: [
            {text: '线性表LeetCode', href: '', children: []}
          ]
        },
        {
          id: 2, text: '栈和队列', href: '', children: [
            {text: '栈和队列LeetCode', href: '', children: []}
          ]
        },
        {
          id: 3, text: '字符串', href: '', children: [
            {text: '字符串LeetCode', href: '', children: []}
          ]
        },
        {
          id: 4, text: '树和二叉树', href: '', children: [
            {text: '树和二叉树LeetCode', href: '', children: []}
          ]
        },
        {
          id: 5, text: '图', href: '', children: [
            {text: '图LeetCode', href: '', children: []}
          ]
        },
        {
          id: 6, text: '查找', href: '', children: [
            {text: '查找LeetCode', href: '', children: []}
          ]
        },
        {
          id: 7, text: '排序', href: '', children: [
            {text: '排序LeetCode', href: '', children: []}
          ]
        },
      ],
      config: {
        radius: 200,
        baseSpeed: 0.3,
        dragSpeed: 1.0,
        fov: 800,
        maxFont: 36,
        minFont: 10,
        maxOpacity: 1,
        minOpacity: 0.1
      },
      state: {
        angleX: 0,
        angleY: 0,
        isHovered: false,
        mouseX: 0,
        mouseY: 0,
        targetSpeedX: 0,
        targetSpeedY: 0
      },
      tagElements: [],
      // 导航栈，用于记录标签列表历史
      navigationStack: [],
      // 期望的关键词数量
      expectedTagCount: 20,
      // 用于显示关键词信息的变量
      keywordInfo: '数据结构算法演示',
      keywordInfoList: [],
      // 关键词信息元素的左偏移量
      keywordInfoLeft: 'calc(50% - 300px - 60px)'
    };
  },
  async mounted() {
    await this.fetchData();
    this.getData();
    // 填充关键词
    this.fillTagsIfNeeded();
    this.initTags();
    this.setupInteraction();
    this.state.targetSpeedY = this.config.baseSpeed;
    this.requestAnimationFrame(this.update);
  },
  methods: {
    async fetchData() {
      try {
        const response = await http.get('/algorithm/getCatalogue');
        this.catalog = response.data.data;
        for (let index in this.catalog) {
          let item = this.catalog[index];
          const response1 = await http.get('/algorithm/getAlgorithmByCatalogueId/' + item.id);
          item["algorithms"] = response1.data.data;
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    },
    getData() {
      for (let item1 of this.tags) {
        for (let index in this.catalog) {
          let item2 = this.catalog[index];
          if (item1.id === item2.id) {
            for (let item3 of item2.algorithms) {
              let tempChildren = {text: item3.name, href: "/logicalContent/" + item3.id};
              if (item3.name.startsWith("力扣")) {
                item1.children[0].children.push(tempChildren);
              } else {
                item1.children.push(tempChildren);
              }
            }
          }
        }
      }
    },
    getRandomColor() {
      // 定义一些深色系颜色的范围
      const colorSchemes = [
        // 深蓝色系
        { r: [0, 50], g: [0, 50], b: [50, 150] },
        // 深紫色系
        { r: [50, 150], g: [0, 50], b: [50, 150] },
        // 深绿色系
        { r: [0, 50], g: [50, 150], b: [0, 50] }
      ];
      // 随机选择一种颜色方案
      const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
      // 从选定的颜色方案中随机生成 RGB 值
      const r = Math.floor(Math.random() * (scheme.r[1] - scheme.r[0]) + scheme.r[0]);
      const g = Math.floor(Math.random() * (scheme.g[1] - scheme.g[0]) + scheme.g[0]);
      const b = Math.floor(Math.random() * (scheme.b[1] - scheme.b[0]) + scheme.b[0]);
      return `rgb(${r},${g},${b})`;
    },
    fillTagsIfNeeded() {
      while (this.tags.length < this.expectedTagCount) {
        this.tags = this.tags.concat(this.tags.slice(0, this.expectedTagCount - this.tags.length));
      }
    },
    initTags() {
      const container = this.$refs.tagCloud;
      this.tagElements = this.tags.map((tag, index) => {
        const phi = Math.acos(-1 + (2 * index) / this.tags.length);
        const theta = Math.sqrt(this.tags.length * Math.PI) * phi;

        return {
          x: Math.cos(theta) * Math.sin(phi) * this.config.radius,
          y: Math.sin(theta) * Math.sin(phi) * this.config.radius,
          z: Math.cos(phi) * this.config.radius
        };
      });
    },
    rotateX(point, angle) {
      const rad = angle * Math.PI / 180;
      return {
        x: point.x,
        y: point.y * Math.cos(rad) - point.z * Math.sin(rad),
        z: point.y * Math.sin(rad) + point.z * Math.cos(rad)
      };
    },
    rotateY(point, angle) {
      const rad = angle * Math.PI / 180;
      return {
        x: point.x * Math.cos(rad) + point.z * Math.sin(rad),
        y: point.y,
        z: -point.x * Math.sin(rad) + point.z * Math.cos(rad)
      };
    },
    project(point) {
      const scale = this.config.fov / (this.config.fov - point.z);
      return {
        x: point.x * scale,
        y: point.y * scale,
        scale: scale,
        z: point.z
      };
    },
    update() {
      const container = this.$refs.tagCloud;
      if (container == null) return;
      const centerX = container.offsetWidth / 2;
      const centerY = container.offsetHeight / 2;

      this.state.angleX += this.state.targetSpeedX;
      this.state.angleY += this.state.targetSpeedY;

      this.tagElements.forEach((tag, index) => {
        let rotated = this.rotateX({x: tag.x, y: tag.y, z: tag.z}, this.state.angleX);
        rotated = this.rotateY(rotated, this.state.angleY);
        const projected = this.project(rotated);
        const depth = (projected.z + this.config.radius) / (2 * this.config.radius);

        const element = container.children[index];
        element.style.left = `${projected.x + centerX}px`;
        element.style.top = `${projected.y + centerY}px`;
        element.style.fontSize = `${this.config.minFont + depth * (this.config.maxFont - this.config.minFont)}px`;
        element.style.opacity = this.config.minOpacity + depth * (this.config.maxOpacity - this.config.minOpacity);
        element.style.zIndex = Math.floor(depth * 1000);
      });

      this.requestAnimationFrame(this.update);
    },
    setupInteraction() {
      setInterval(() => {
        if (!this.state.isHovered) {
          this.state.targetSpeedY += (this.config.baseSpeed - this.state.targetSpeedY) * 0.1;
          this.state.targetSpeedX = 0;
        }
      }, 100);
    },
    handleMouseEnter() {
      this.state.isHovered = true;
      this.state.targetSpeedX *= 0.3;
      this.state.targetSpeedY *= 0.3;
    },
    handleMouseLeave() {
      this.state.isHovered = false;
      this.state.targetSpeedX = 0;
      this.state.targetSpeedY = this.config.baseSpeed;
    },
    handleMouseMove(e) {
      if (!this.state.isHovered) return;

      const rect = this.$refs.tagCloud.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      this.state.targetSpeedY = deltaX * this.config.dragSpeed / 500;
      // 将 deltaY 取反
      this.state.targetSpeedX = -deltaY * this.config.dragSpeed / 500;
    },
    requestAnimationFrame(callback) {
      window.requestAnimationFrame(callback);
    },
    handleTagClick(tag) {
      if (tag.children && tag.children.length > 0) {
        this.navigationStack.push(this.tags);
        this.tags = tag.children;
        this.keywordInfo = tag.text;
        this.keywordInfoList.push(tag.text);

        // 使用nextTick确保DOM更新完成
        this.$nextTick(() => {
          // 重新填充和初始化
          this.fillTagsIfNeeded();
          this.initTags();
          // 重置旋转角度（可选）
          this.state.angleX = 0;
          this.state.angleY = 0;
        });
      } else {
        if (tag.href) window.location.href = tag.href;
      }
    },
    // 返回上一级的方法
    goBack() {
      if (this.navigationStack.length > 0) {
        // 从导航栈中弹出上一级标签列表
        this.tags = this.navigationStack.pop();
        // 更新关键词信息
        if (this.navigationStack.length === 0) {
          this.keywordInfo = '数据结构算法演示';
          this.keywordInfoList = [];
        } else {
          this.keywordInfoList.pop();
          this.keywordInfo = this.keywordInfoList[this.keywordInfoList.length - 1];
        }
        this.$nextTick(() => {
          this.fillTagsIfNeeded();
          this.initTags();
          // 重置旋转角度（可选）
          this.state.angleX = 0;
          this.state.angleY = 0;
        });
      }
    }
  }
};
</script>

<style scoped>
.tag-cloud {
  width: 550px;
  height: 420px;
  margin: 20px auto;
  position: relative;
  //cursor: move;
}

.tag-cloud a {
  opacity: 0;
  position: absolute;
  white-space: nowrap;
  transition: all 0.5s, opacity 0.5s, transform 0.5s;
  transform-origin: center center;
}

.tag-cloud a:hover {
  transform: scale(1.5);
  opacity: 1 !important;
  z-index: 999 !important;
}

.back-button {
  /* 定位调整 */
  position: absolute;
  top: 30px;
  left: calc(50% - 280px);
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  color: #2c3e50;
  font-family: 'Arial', sans-serif;
}

.back-button:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.back-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.back-button svg {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  stroke: #4a90e2;
}

.back-button span {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* 新增容器定位 */
.keyword-container {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
}

.keyword-info {
  font-size: 1.8rem;
  color: transparent;
  background: linear-gradient(45deg, #4f46e5 30%, #ec4899 70%);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(182, 195, 208, 0.2);
  font-family: 'Segoe UI', system-ui;
  font-weight: 500;
  letter-spacing: -0.8px;
  padding: 0 2rem;
}

.decor-line {
  background: linear-gradient(90deg, rgba(142, 197, 252, 0.3) 0%, transparent 100%);
}

.decor-line.right {
  background: linear-gradient(270deg, rgba(224, 195, 252, 0.3) 0%, transparent 100%);
}

/* 悬停动效优化 */
.keyword-info:hover {
  transform: scale(1.03);
  background: linear-gradient(45deg, #9BD2FC 20%, #E8D3FC 70%);
  text-shadow: 0 4px 8px rgba(182, 195, 208, 0.3);
}

/* 新增微光效果 */
.keyword-info::after {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle at 50% 50%, rgba(142, 197, 252, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .keyword-info {
    font-size: 2.2rem;
    background: linear-gradient(45deg, #9BC2EF 20%, #D8C3FC 70%);
  }
}

a{
  text-decoration: none;
}
</style>