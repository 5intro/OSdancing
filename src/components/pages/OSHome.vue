<template>
  <div class="page-container">
    <!-- 返回按钮 -->
    <a v-if="navigationStack.length > 0" @click="goBack" class="back-button">
      <i class="fas fa-undo" style="margin-right: 10px"></i>
      <span>返回</span>
    </a>

    <!-- 标签云 -->
    <div class="tag-cloud" ref="tagCloud" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
         @mousemove="handleMouseMove">
      <a v-for="(tag, index) in tags" :key="index" :href="tag.href" :style="{ color: getRandomColor() }"
         @click.prevent="handleTagClick(tag)">{{ tag.text }}</a>
    </div>
    <!-- 动态logo -->
    <!-- <div class="logo logo3">
      <img src="@/assets/img/cplogo3.png" alt="Logo 3">
    </div> -->
    <div class="logo logo2">
      <img src="@/assets/img/os1.jpg" alt="Logo 2">
    </div>
    <div class="logo logo1">
      <img src="@/assets/img/os2.jpg" alt="Logo 1">
    </div>
    <div class="logo logo4">
      <img src="@/assets/img/os3.jpg" alt="Logo 4">
    </div>
    <div class="logo logo5">
      <img src="@/assets/img/os4.jpg" alt="Logo 5">
    </div>

    <!-- 两个横向的下拉框 -->
    <div class="dropdown-container">
      <div class="dropdown" :class="{ show: isDropdown1Open }">
        <button class="dropbtn" @click="toggleDropdown1">
          进程
          <span class="arrow" :class="{ down:!isDropdown1Open, up: isDropdown1Open }"></span>
        </button>
        <div class="dropdown-content">
          <a v-for="(option, index) in options1" :key="index" :href="option.link">{{ option.name }}</a>
        </div>
      </div>
      <div class="dropdown" :class="{ show: isDropdown2Open }">
        <button class="dropbtn" @click="toggleDropdown2">
          内存
          <span class="arrow" :class="{ down:!isDropdown2Open, up: isDropdown2Open }"></span>
        </button>
        <div class="dropdown-content">
          <a v-for="(option, index) in options2" :key="index" :href="option.link">{{ option.name }}</a>
        </div>
      </div>
      
   
      <div class="dropdown" :class="{ show: isDropdown3Open }">
        <button class="dropbtn" @click="toggleDropdown3">
          磁盘
          <span class="arrow" :class="{ down:!isDropdown3Open, up: isDropdown3Open }"></span>
        </button>
        <div class="dropdown-content">
          <a v-for="(option, index) in options3" :key="index" :href="option.link">{{ option.name }}</a>
        </div>
      </div>
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
          id: 1, text: '先进先出调度算法', href: 'FCFS', children: []
        },
        {
          id: 2, text: '短作业优先调度算法', href: 'SJF', children: []
        },
        {
          id: 3, text: '高响应比优先调度算法', href: 'HighResponse', children: []
        },
        {
          id: 4, text: '优先级调度算法(非剥夺式)', href: 'HighPrio', children: []
        },
        {
          id: 5, text: '优先级调度算法(剥夺式)', href: 'HighPrio2', children: []
        },
        {
          id: 6, text: '时间片轮转调度算法', href: 'RR', children: []
        },
        {
          id: 7, text: '多级反馈队列调度算法', href: 'FeedbackQueue', children: []
        },
        {
          id: 8, text: '首次适应算法', href: 'PartitionAllocation_FF', children: []
        },
        {
          id: 9, text: '最佳适应算法', href: 'PartitionAllocation_BF', children: []
        },
        {
          id: 10, text: '最坏适应算法', href: 'PartitionAllocation_WF', children: []
        },
        {
          id: 11, text: '邻近适应算法', href: 'PartitionAllocation_NF', children: []
        },
        {
          id: 12, text: '先进先出置换算法', href: 'Replacement_FIFO', children: []
        },
        {
          id: 13, text: '最佳置换算法', href: 'Replacement_OPT', children: []
        },
        {
          id: 14, text: '最近最久未使用置换算法', href: 'Replacement_LRU', children: []
        },
        {
          id: 15, text: '先来先服务算法', href: 'FCFS2', children: []
        },
        {
          id: 16, text: '扫描算法', href: 'SCAN', children: []
        },
        {
          id: 17, text: '循环扫描算法', href: 'CSCAN', children: []
        },
        {
          id: 18, text: '最短寻道时间优先算法', href: 'SSTF', children: []
        }
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
      navigationStack: [],
      expectedTagCount: 20,
      keywordInfo: '编译原理算法演示',
      keywordInfoList: [],
      keywordInfoLeft: 'calc(50% - 300px - 60px)',

      isDropdown1Open: false,
      isDropdown2Open: false,
      isDropdown3Open: false,
      options1: [
        { name: '先进先出调度算法', link: 'FCFS' },
        { name: '短作业优先调度算法', link: 'SJF' },
        { name: '高响应比优先调度算法', link: 'HighResponse' },
        { name: '优先级调度算法(非剥夺式)', link: 'HighPrio' },
        { name: '优先级调度算法(剥夺式)', link: 'HighPrio2' },
        { name: '时间片轮转调度算法', link: 'RR' },
        { name: '多级反馈队列调度算法', link: 'FeedbackQueue' },
      ],
      options2: [
        { name: '首次适应算法', link: 'PartitionAllocation_FF' },
        { name: '最佳适应算法', link: 'PartitionAllocation_BF' },
        { name: '最坏适应算法', link: 'PartitionAllocation_WF' },
        { name: '邻近适应算法', link: 'PartitionAllocation_NF' },
        { name: '先进先出置换算法', link: 'Replacement_FIFO' },
        { name: '最佳置换算法', link: 'Replacement_OPT' },
        { name: '最近最久未使用置换算法', link: 'Replacement_LRU' },
      ],
      options3: [
        { name: '先来先服务算法', link: 'FCFS2' },
        { name: '扫描算法', link: 'SCAN' },
        { name: '循环扫描算法', link: 'CSCAN' },
        { name: '最短寻道时间优先算法', link: 'SSTF' },
      ],
    };
  },
  async mounted() {
    // await this.fetchData();
    // this.getData();
    this.fillTagsIfNeeded();
    this.initTags();
    this.setupInteraction();
    this.state.targetSpeedY = this.config.baseSpeed;
    this.requestAnimationFrame(this.update);
  },
  methods: {
    toggleDropdown1() {
      this.isDropdown1Open = !this.isDropdown1Open;
    },
    toggleDropdown2() {
      this.isDropdown2Open = !this.isDropdown2Open;
    },
    toggleDropdown3() {
      this.isDropdown3Open = !this.isDropdown3Open;
    },
    /*
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
    */

    getRandomColor() {
      const colorSchemes = [
        { r: [0, 50], g: [0, 50], b: [50, 150] },
        { r: [50, 150], g: [0, 50], b: [50, 150] },
        { r: [0, 50], g: [50, 150], b: [0, 50] }
      ];
      const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
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
      

      this.state.angleX += this.state.targetSpeedX;
      this.state.angleY += this.state.targetSpeedY;

      this.tagElements.forEach((tag, index) => {
        let rotated = this.rotateX({x: tag.x, y: tag.y, z: tag.z}, this.state.angleX);
        rotated = this.rotateY(rotated, this.state.angleY);
        const projected = this.project(rotated);
        const depth = (projected.z + this.config.radius) / (2 * this.config.radius);

        const element = container.children[index];
        element.style.transform = `translate(-50%, -50%) 
                              translate3d(${projected.x}px, ${projected.y}px, 0)`;
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

        this.$nextTick(() => {
          this.fillTagsIfNeeded();
          this.initTags();
          this.state.angleX = 0;
          this.state.angleY = 0;
        });
      } else {
        if (tag.href) window.location.href = tag.href;
      }
    },
    goBack() {
      if (this.navigationStack.length > 0) {
        this.tags = this.navigationStack.pop();
        if (this.navigationStack.length === 0) {
          this.keywordInfo = '编译原理算法演示';
          this.keywordInfoList = [];
        } else {
          this.keywordInfoList.pop();
          this.keywordInfo = this.keywordInfoList[this.keywordInfoList.length - 1];
        }
        this.$nextTick(() => {
          this.fillTagsIfNeeded();
          this.initTags();
          this.state.angleX = 0;
          this.state.angleY = 0;
        });
      }
    }
  }
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  max-width: 1500px;
  margin: 0 auto;
  display: flex;                /* 新增：使用 Flex 布局 */
  flex-direction: column;       /* 垂直排列子元素 */
  align-items: center;          /* 水平居中 */
  justify-content: center;      /* 垂直居中 */
  transition: background 0.5s ease;
  position: relative;
}

.page-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  /* 修改为从四周向中心的明亮透明蓝紫色渐变 */
  background: radial-gradient(circle at center, rgba(204, 153, 255, 0) 20%, rgb(75, 233, 255) 80%, rgb(101, 246, 234) 100%);
  opacity: 0.1;
  z-index: -1;
}
/*
.logo-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
*/
.logo-container {
  position: absolute;
  width: 100%;
  height: 60%;
  pointer-events: none;
  top: 0;
  /*
  display: flex;
  justify-content: space-between;
  align-items: center;*/
}

.logo {
  position: absolute;
  width: 60px;
  height: 60px;
  animation: float 3s ease-in-out infinite;
}

.logo1 {
  top: 10%; /* 确保在渐变色背景区域内 */
  left: 20%;
  animation-delay: 0.5s;
}

.logo2 {
  top: 40%; /* 确保在渐变色背景区域内 */
  left: 15%;
  animation-delay: 1.5s;
}

.logo3 {
  top: 80%; /* 确保在渐变色背景区域内 */
  left: 10%;
  animation-delay: 2.5s;
}

.logo4 {
  top: 10%; /* 确保在渐变色背景区域内 */
  right: 20%;
  animation-delay: 0.5s;
}

.logo5 {
  top: 40%; /* 确保在渐变色背景区域内 */
  right: 15%;
  animation-delay: 1.5s;
}

.logo6 {
  top: 80%; /* 确保在渐变色背景区域内 */
  right: 10%;
  animation-delay: 2.5s;
}

.logo img {
  width: 150%;
  height: 150%;
  object-fit: contain;
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

@keyframes background-scroll {
  0% { background-position: 0 0; }
  100% { background-position: 100% 0; }
}

.tag-cloud {
  width: 550px;
  height: 420px;
  margin: 20px auto;
  position: relative;

}

.tag-cloud a {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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

.keyword-info:hover {
  transform: scale(1.03);
  background: linear-gradient(45deg, #9BD2FC 20%, #E8D3FC 70%);
  text-shadow: 0 4px 8px rgba(182, 195, 208, 0.3);
}

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

@media (max-width: 768px) {
  .keyword-info {
    font-size: 2.2rem;
    background: linear-gradient(45deg, #9BC2EF 20%, #D8C3FC 70%);
  }
}

a{
  text-decoration: none;
}

.dropdown-container {
  display: flex;
  gap: 20px;
  width: 70%;
  margin: 50px auto;
  height: 200px;
}

.dropdown {
  position: relative;
  flex: 1;
}

.dropbtn {
  background-color: #f8f8f8;
  color: black;
  padding: 16px;
  font-size: 20px;
  font-weight: bold;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 4px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1
}

.dropdown.show .dropdown-content {
  display: block;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transition: transform 0.3s ease;
}

.down {
  transform: rotate(45deg);
}

.up {
  transform: rotate(-135deg);
}
</style>