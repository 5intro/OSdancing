import { showError } from "@/components/custom/util";
import $ from "jquery";
/**
 * 自定义 Web 组件，提供通用功能，使用扩展 HTMLElement。
 * 主要功能包括步骤管理、进度条、沙盒 DOM 等。
 * 使用 Shadow DOM 隔离样式，确保组件复用性和样式安全性。
 */
class Common extends HTMLElement {
    constructor() {
        super();
        this.lastDom = [];
        this.totalSteps = 0;
        this.steps = 0;
        this.functionArray = [];
        this.pause = true;
        // 缩放拖拽所用属性
        this.currentScale = 1;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        // 当元素被插入到 DOM 时，这个方法会被调用
        this.render();
    }
    render() {
        // 创建一些内容并将其添加到 Shadow DOM 中
        this.shadowRoot.innerHTML = `
            <style>
                #animation{
                    cursor: pointer;
                    position: relative;
                }
                
                #cartoonArea{
                    height: 40%;
                    width: 100%;
                    /*background: linear-gradient(135deg, #6a11cb, #2575fc);*/
                    overflow: hidden; /* 裁剪超出部分 */
                    position: relative;
                    border: 1px solid #4CAF50; /* 绿色边框 */
                    padding: 20px; /* 内边距 */
                    border-radius: 10px; /* 圆角 */
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影 */
                    /*background: #f9f9f9; !* 背景色 *!*/
                    background-color: transparent; /* 完全透明 */
                    transition: all 0.3s ease; /* 添加过渡效果 */
                    margin: 10px;
                }
            </style>
            <div>
                <div id="cartoonArea">
                    <div id = "animation" v-draggable style="position: relative">
                        <div id = "listcontainer" class="container mid" style="margin-bottom: 10px; z-index: 1000;">
                            <slot></slot>
                        </div>
                    </div>
                </div>
                <div>
                    <button id="zoomInBtn" style="margin-left: 10px;">放大</button>
                    <button id="zoomOutBtn">缩小</button>
                    <button id="resetZoomBtn">重置</button>
                </div>
            </div>
        `;
    }
    // 代码编辑器
    // 文字描述
    setFunctionArray(functionArray) {
        this.functionArray = functionArray;
    }
    nextStep() {
        // 根据functionArray来写下一步
        this.addSteps();
        this.addProgressBar();
    }
    /**
     * 播放功能，未实现。
     * 预期功能：自动播放任务或操作。
     */
    play() {
        // 播放
    }
    /**
     * 获取当前步骤数。
     * @returns 当前步骤数。
     */
    getSteps() {
        return this.steps;
    }
    /**
     * 增加步骤数。
     */
    addSteps() {
        this.steps++;
    }
    /**
     * 减少步骤数。
     */
    decreaseSteps() {
        this.steps--;
    }
    /**
     * 设置总步骤数，并生成进度条。
     * @param steps 总步骤数。
     */
    setTotalSteps(steps) {
        if (steps <= 0) {
            showError('总步骤数不能小于等于0');
            return;
        }
        this.totalSteps = steps;
        this.steps = 0; // 初始化当前步数
        this.generatorProgressBar();
    }
    /**
     * 获取总步骤数。
     * @returns 总步骤数。
     */
    getTotalSteps() {
        return this.totalSteps;
    }
    /**
     * 设置上一步的 DOM 状态。
     * @param lastDom 上一步的 DOM 状态数组。
     */
    setLastDom(lastDom) {
        this.lastDom = lastDom;
    }
    /**
     * 获取上一步的 DOM 状态。
     * @returns 上一步的 DOM 状态数组。
     */
    getLastDom() {
        return this.lastDom;
    }
    /**
     * 执行上一步操作。
     * 需要考虑与变量状态的同步问题。
     */
    lastStep() {
        // lastDom存储的Common的每一步状态，如何同步其余变量的上一步状态？
        // 先写好 ？ 如何让使用者重写这个这个代码
        // 通用性，无论是有for循环的还是没有for循环的，需要考虑通用性
    }
    /**
     * 生成进度条。
     * 根据总步骤和当前步骤生成视觉状态。
     */
    generatorProgressBar() {
        if (this.totalSteps <= 0) {
            showError("未设置有效的总步骤数");
            return;
        }
        // 1. 计算当前进度
        let progressPercent = Math.floor((this.steps / this.totalSteps) * 100);
        let progressText = `${progressPercent}%`;
        // 2. 生成进度条 DOM 结构
        let progressBar = $(`
            <div class="progress" role="progressbar" aria-label="进度条" 
                 aria-valuenow="${progressPercent}" aria-valuemin="0" 
                 aria-valuemax="100" style="height: 20px">
                <div class="progress-bar" id="progress1" style="width: ${progressText}">
                    ${this.steps}/${this.totalSteps}
                </div>
            </div>
        `);
        // 3. 清空原有进度条，插入新进度条
        $('#sepLine').empty().append(progressBar);
    }
    /**
     * 更新进度条状态。
     * 根据当前步骤动态调整进度条形状。
     */
    addProgressBar() {
        if (this.steps > this.totalSteps) {
            showError("步骤已达到最大值");
            return;
        }
        // 计算进度百分比
        let progressPercent = Math.floor((this.steps / this.totalSteps) * 100) + '%';
        // 更新进度条
        $(`#progress1`).css('width', progressPercent).text(`${this.steps}/${this.totalSteps}`);
    }
    /**
     * 添加新的提示信息。
     * @param message 提示文本内容
     */
    addAlgorithmText(message) {
        let dom = $(`
            <div class="alert alert-warning alert-dismissible fade show m-auto" role="alert" 
                 style="width: 98%; max-width: 900px; margin-bottom: 10px;" id="algorithmTextWrapper">
                <div class="fs-5 mid" id="algorithmText">${message}</div>
            </div>
        `);
        $(`#alartWrapper`).empty().append(dom);
    }
    /**
     * 更新提示信息内容。
     * @param message 新的提示文本
     */
    updateAlgorithmText(message) {
        let textElement = $(`#algorithmText`);
        if (textElement.length > 0) {
            textElement.text(message);
        }
        else {
            // 如果提示框不存在，则新建
            this.addAlgorithmText(message);
        }
    }
    // 缩放、拖拽、重置功能实现
    zoom() {
        var _a;
        const animationDiv = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('animation');
        if (!animationDiv)
            return;
        // 鼠标滚轮缩放
        animationDiv.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.currentScale = Math.min(Math.max(this.currentScale * delta, 0.5), 3);
            this.applyTransform();
        });
        // 拖拽功能实现
        animationDiv.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.clientX - this.offsetX;
            this.startY = e.clientY - this.offsetY;
        });
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging)
                return;
            this.offsetX = e.clientX - this.startX;
            this.offsetY = e.clientY - this.startY;
            this.applyTransform();
        });
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }
    //放大缩小重置按钮
    shrink() {
        var _a, _b, _c;
        // 绑定按钮事件
        const zoomInBtn = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('zoomInBtn');
        const zoomOutBtn = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById('zoomOutBtn');
        const resetBtn = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.getElementById('resetZoomBtn');
        zoomInBtn === null || zoomInBtn === void 0 ? void 0 : zoomInBtn.addEventListener('click', () => {
            this.currentScale = Math.min(3, this.currentScale * 1.1);
            this.applyTransform();
        });
        zoomOutBtn === null || zoomOutBtn === void 0 ? void 0 : zoomOutBtn.addEventListener('click', () => {
            this.currentScale = Math.max(0.5, this.currentScale * 0.9);
            this.applyTransform();
        });
        resetBtn === null || resetBtn === void 0 ? void 0 : resetBtn.addEventListener('click', () => {
            this.resetZoom();
        });
    }
    resetZoom() {
        this.currentScale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.applyTransform();
    }
    btnShrink() {
        var _a;
        // 模拟点击缩小按钮 一般在动画占用页面较大时调用
        const zoomOutBtn = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('zoomOutBtn');
        zoomOutBtn === null || zoomOutBtn === void 0 ? void 0 : zoomOutBtn.click();
    }
    // 缩放拖拽辅助方法：应用变换
    applyTransform() {
        var _a;
        const animationDiv = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('animation');
        if (animationDiv) {
            animationDiv.style.transform =
                `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.currentScale})`;
        }
    }
}
// 确保只定义一次
if (!customElements.get('common-element')) {
    customElements.define('common-element', Common);
}
//# sourceMappingURL=common.js.map