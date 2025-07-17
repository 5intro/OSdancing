<template>
  <div style="width: 100%;
    overflow-y: hidden;">
    <!-- 语言选择器 -->
    <div class="card-header mb-2" style="display: flex; justify-content: flex-start; margin-top: 0px; background-color: white">
      <div id="language-selector" style="display: flex; gap: 10px;margin-left: -16px;">
        <div class="language-option" :class="{ active: selectedLanguage === 'cpp' }" @click="select" data-language="cpp">
          <img src="/img/cpp-logo.png" alt="Logo1" style="width: 20px; height: 20px; margin-right: 5px;margin-top: -2px;">C/C++
        </div>
        <div class="language-option" :class="{ active: selectedLanguage === 'python' }" @click="select" data-language="python">
          <img src="/img/python-logo.png" alt="Logo" style="width: 20px; height: 20px; margin-right: 5px;">Python
        </div>
        <div class="language-option" :class="{ active: selectedLanguage === 'cangjie' }" @click="select" data-language="cangjie">
          <img src="/img/cangjie-logo.png" alt="Logo" style="width: 20px; height: 20px; margin-right: 5px;">Cangjie
        </div>
      </div>
    </div>
    <!-- CodeMirror 编辑器 -->
    <textarea ref="code" id="code"></textarea>
    <!--复制按钮-->
<!--    <div class="copy" @mouseenter="handleHoverCopy" @mouseleave="handleLeaveCopy" @click="handleClickCopy">-->
<!--      <i class="fas fa-copy" style="color: gray">-->
<!--      <span class="copyText" id="copyText">-->
<!--        点击复制代码-->
<!--      </span>-->
<!--      </i>-->
<!--    </div>-->
  </div>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";
import http from "@/api/http";

export default {
  data() {
    return {
      selectedLanguage: 'cpp', // 新增数据属性
      currentLine: -1,
      editor: null,
      currentMode: "javascript", // 默认模式是 JavaScript
    };
  },
  mounted() {
    this.$nextTick(() => {
      // 等待 DOM 更新完成后再执行
      this.setEqualHeight();
      // // 创建 ResizeObserver 监听容器变化
      // this.resizeObserver = new ResizeObserver(() => {
      //   console.log('resize');
      //   this.setEqualHeight(); // 容器高度变化时调用
      // });
      // const firstItem = document.querySelector('#mainContainer')?.firstElementChild;
      // if (firstItem) {
      //   this.resizeObserver.observe(firstItem); // 确保容器存在
      // }
    });
  },
  methods: {
    select(event) {
      const code = this.$refs.code.value
      const selectedLanguage = event.currentTarget.getAttribute('data-language');
      console.log(selectedLanguage);
      this.selectedLanguage = selectedLanguage;
      this.$emit('language-changed', selectedLanguage); // 发送语言变化事件
      if(this.$refs.code.value === '' || code === this.$refs.code.value){
        this.setCode('建设中......')
      }
    },
    setEqualHeight() {
      const container = document.querySelector('#mainContainer');
      const firstItem = container?.firstElementChild; // 获取第一个子元素
      const items = container?.children; // 获取所有子元素
      console.log(firstItem, items, container);
      const firstItemHeight = firstItem?.offsetHeight ?? 0; // 获取第一个子元素的高度

      // 遍历子元素，跳过第一个
      if (firstItem && items) {
        Array.from(items).forEach((item, index) => {
          if (index !== 0) { // 只修改从第二个元素开始的高度
            item.style.height = `${firstItemHeight}px`;
          }
        });
      }
    },

    beforeDestroy() {
      // 在组件销毁前停止观察
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    },
    // 语言选择变化时的回调函数
    onLanguageChange(event) {
      const selectedLanguage = event.target.value;
      // 通过 $emit 发送选择的语言给父组件
      this.$emit("language-changed", selectedLanguage);
    },

    setCode(code) {
      this.$refs.code.value = code;
      this.editor = CodeMirror.fromTextArea(this.$refs.code, {
        lineNumbers: true,
        mode: 'javascript',
        readOnly: true,
        lineWrapping: true,
        viewportMargin: Infinity
      });
      // this.editor.setValue(code);
    },

    loadCodeFile(filePath) {
      if (!filePath || filePath.trim() === "") {
        this.setCode(""); // 清空编辑器内容
      }
      // fetch(filePath)
      //     .then(response => {
      //       if (!response.ok) {
      //         throw new Error('Network response was not ok');
      //       }
      //       return response.text(); // 读取文本内容
      //     })
      //     .then(code => {
      //       this.setCode(code); // 将内容设置到编辑器
      //     })
      //     .catch(err => {
      //       console.error('Failed to load file:', err); // 错误处理
      //     });
    },

    async loadCodeFromDB(id){
      let answerText = "";
      const response = await http.get('algorithm/getCodeByAlgorithmId/' + id);
      for(let i=0 ; i< response.data.data.length ; i++){
        if(response.data.data[i].code_type === "C++"){
          answerText = response.data.data[i].code;
        }
      }

      this.setCode(answerText); // 将内容设置到编辑器
      console.log(response);
    },

    async loadCodeFromDBcpp(id){
      let answerText = "";
      const response = await http.get('algorithm/getCodeByAlgorithmId/' + id);
      for(let i=0 ; i< response.data.data.length ; i++){
        if(response.data.data[i].code_type === "C++"){
          answerText = response.data.data[i].code;
        }
      }

      this.setCode(answerText); // 将内容设置到编辑器
      console.log(response);
    },

    async loadCodeFromDBcangjie(id){
      let answerText = "";
      const response = await http.get('algorithm/getCodeByAlgorithmId/' + id);
      for(let i=0 ; i< response.data.data.length ; i++){
        if(response.data.data[i].code_type === "Cangjie"){
          answerText = response.data.data[i].code;
        }
      }

      this.setCode(answerText); // 将内容设置到编辑器
      console.log(response);
    },

    async loadCodeFromDBPython(id){
      let answerText = "";
      const response = await http.get('algorithm/getCodeByAlgorithmId/' + id);
      for(let i=0 ; i< response.data.data.length ; i++){
        if(response.data.data[i].code_type === "Python"){
          answerText = response.data.data[i].code;
        }
      }

      this.setCode(answerText); // 将内容设置到编辑器
      console.log(response);
    },

    async scroll(id){
      this.editor.scrollIntoView({line: id, ch: 0}, 100);
    },

    moveDown() {
      // 移除当前行的红色框
      this.editor.removeLineClass(this.currentLine, "wrap", "red-outline");

      // 移动到下一行
      this.currentLine += 1;
      if (this.currentLine >= this.editor.lineCount()) {
        this.currentLine = 0; // 重新回到第一行
      }

      // 为新行添加红色框
      this.editor.addLineClass(this.currentLine, "wrap", "red-outline");
    },

    highlightLine(lineNumber) {
      if (lineNumber < 0 || lineNumber > this.editor.lineCount()){
        this.editor.removeLineClass(this.currentLine, "wrap", "red-outline");
        this.currentLine = -1;
        return;
      }
      // 移除当前行的高亮
      this.editor.removeLineClass(this.currentLine, "wrap", "red-outline");

      // 更新当前行号
      this.currentLine = lineNumber;

      // 添加新的高亮
      this.editor.addLineClass(this.currentLine, "wrap", "red-outline");

      // 让 CodeMirror 滚动到可见区域
      const targetPos = this.editor.charCoords({ line: lineNumber, ch: 0 }, "local").top;
      const scrollContainer = this.editor.getScrollerElement();
      const halfHeight = scrollContainer.offsetHeight / 2;

      // 手动设置滚动位置
      this.editor.scrollTo(null, targetPos - halfHeight - 5);
    },
    getCurrentLine() {
      return this.currentLine;
    },

    handleHoverCopy(){
      const tooltipText = document.getElementById('copyText');
      tooltipText.style.visibility = 'visible';
      tooltipText.style.opacity = '1';
    },
    handleLeaveCopy(){
      const tooltipText = document.getElementById('copyText');
      tooltipText.style.visibility = 'hidden';
      tooltipText.style.opacity = '0';
    },
    handleClickCopy() {
      const textarea = this.$refs.code; // 获取 textarea 的引用
      const textToCopy = textarea.value; // 获取 textarea 中的内容

      // 使用 Clipboard API 复制文本
      navigator.clipboard.writeText(textToCopy)
          .then(() => {
            // 复制成功后更新提示文本
            const tooltipText = document.getElementById('copyText');
            tooltipText.innerText = "复制成功√";

            // 设置定时器在适当的时间后恢复文本
            setTimeout(() => {
              tooltipText.innerText = "点击复制代码";
            }, 2000); // 2000 毫秒后恢复文本（可以根据需要调整时间）
          })
          .catch(err => {
            console.error('复制失败:', err); // 处理复制失败的情况
          });
    },
  }


};

</script>

<style>
div[style*="max-height: 100vh"] {
  height: 100vh; /* 或具体高度 */
  overflow: hidden; /* 禁止外部滚动 */
}

/* 红色框样式 */
.red-outline {
  outline: 2px solid red;
  outline-offset: -2px;
}

/* CodeMirror 样式 */
.CodeMirror {
  font-size: 19px; /* 调整字体大小 */
  height: 91% !important;
  width: 100% !important;
  font: 18px / normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  overflow: hidden; /* 裁剪超出部分 */
  position: relative;
  border: 1px solid #4CAF50; /* 绿色边框 */
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影 */
  background-color: transparent; /* 完全透明背景 */
  user-select: text !important; /* 确保用户可以选中文本 */
  transition: all 0.3s ease; /* 添加过渡效果 */
  //margin-top: -8.1px;
}

/* 纵向滚动条样式 */
.CodeMirror-vscrollbar {
  width: 8px;
  background: #f0f0f0;
  border-radius: 10px;
}

.CodeMirror-vscrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.CodeMirror-vscrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 横向滚动条样式 */
.CodeMirror-hscrollbar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 10px;
}

.CodeMirror-hscrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.CodeMirror-hscrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 针对 Firefox 设置的滚动条 */
.CodeMirror-scroll {
  scrollbar-width: thin;
  scrollbar-color: #888 #f0f0f0;
}

.CodeMirror-sizer > div {
  top: 0px !important;
}

.copy{
  position: absolute;
  top: 8vh;
  left: 45vh;
  cursor: pointer;
  //alignItems: center;
  //justifyContent: center;
}
.copyText{
  visibility: hidden;
  width: 100px;
  background-color: gray;
  color: black;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 30%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}
.cm-comment {
  color: #008E00 !important;  /* 改变注释的颜色 */
  /*font-style: italic;         !* 斜体 *!*/
}
/* 修改代码中的关键字颜色 */
.cm-s-dracula .cm-keyword {
  color: #ff79c6 !important;  /* 改变关键字的颜色 */
}
.cm-error{
  color: #C800A4 !important;
}
.cm-variable{
  /*color: #ff79c6 !important;*/
}
.cm-operator{
  color: #C800A4 !important;
}
.cm-number{
  color: #3A00DC !important;
}

.language-option{
  padding: 6px 12px; border: 1px solid #ced4da; border-radius: 8px; cursor: pointer; background-color: white;
}

.language-option.active {
  padding: 6px 12px;
  border: 1px solid rgb(206, 212, 218);
  border-radius: 8px;
  cursor: pointer;
  background-color: rgb(224, 224, 224);
}

.language-option:hover:not(.active) {
  background-color: #f8f9fa;
}
</style>
