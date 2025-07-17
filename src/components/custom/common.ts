// import {showErrorInfo} from "@/components/custom/util";

import $ from "jquery";
import CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";
import 'codemirror/theme/dracula.css';
import { MyTreeComponent } from './custom-element'
import { LinkedListComponent } from './custom-LinerList'
import { LinkedStackComponent } from './custom-Stack'
import { GraphComponent, GraphAdjacencyListComponent } from './custom-Graph'
import { BinaryTreeComponent } from './custom-binaryTree'
import { LinkedListComponent2 }from './custom-LinerList2'
import { BinaryTreeComponent2 } from "@/components/custom/custom-binaryTreeDepth";
import {ThreadBinaryTreeComponent} from "@/components/custom/custom-ThreadbinaryTree"
import {ThreadBinaryTreeComponent2} from "@/components/custom/custom-ThreadbinaryTree2"

/**
 * 自定义 Web 组件，提供通用功能，使用扩展 HTMLElement。
 * 主要功能包括步骤管理、进度条、沙盒 DOM 等。
 * 使用 Shadow DOM 隔离样式，确保组件复用性和样式安全性。
 */
class Common extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    private lastDom: Array<any> = [];
    private alertWrapperDom : Array<any> = [];
    private sepLineDom: Array<any> = [];
    private lastLineArgs: Array<any> = [];
    private isReplaceDom: boolean = true;
    private customizeData: Array<any> = [];

    //需在Vue中传入的函数
    private lastStepFunc: any = null; //上一步
    private ruleFunc: any = null; //输入规则
    private totalStepAndMapFunc: any = null; //设置总步骤和映射
    private codeMirror: any = null; //代码编辑器

    private totalSteps: number = 0; //总步数
    private stepMap: Array<any> = []; //步数映射
    private steps: number = 0; //当前步数
    private functionArray: Array<any> = []; //存放步数函数step1...
    private isPause: boolean = true; //暂停状态
    private isContinuous: boolean = true; //判断当前算法是否为连续播放
    private pauseTime: number = 0; //暂停时间
    // 缩放拖拽所用属性
    private currentScale: number = 1;
    private isDragging: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private Title: String = "Title";
    private Desc: String = "Desc";

    connectedCallback() {
        // 当元素被插入到 DOM 时，这个方法会被调用
        this.render()
    }

    render() {
        // 获取构建时的 BASE_URL
        const baseUrl = process.env.BASE_URL || '';

        // 创建 link 标签来引入外部 Bootstrap 样式
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // 使用 BASE_URL 动态拼接路径
        link.href = `${baseUrl}css/bootstrap.css`;

        // 将 link 标签添加到 shadowRoot 中
        this.shadowRoot?.appendChild(link);

        // 继续渲染组件 HTML
        this.shadowRoot!.innerHTML += `
        <style>
            #animation {
                cursor: pointer;
                position: relative;
            }
            #cartoonArea {
                height: 350px;
                width: 100%;
                overflow: hidden;
                position: relative;
                border: 1px solid #4CAF50;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                background-color: transparent;
                transition: all 0.3s ease;
                margin: 10px;
            }
            .flex-row {
                flex-direction: row !important;
            }
            .d-flex {
                display: flex !important;
            }
            div {
              user-select: none;
            }
            .icon-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 13%;
                gap: 6px; /* 图标和文字之间的间距 */
                padding: 8px 12px;
                border: 1px solid #007bff; /* 蓝色边框 */
                border-radius: 6px;
                background-color: white; /* 白色背景 */
                color: #007bff; /* 蓝色文字 */
                cursor: pointer;
                transition: all 0.2s ease; /* 平滑过渡效果 */
                font-size: 14px;
            }
            
            .icon-btn:hover {
                background-color: #007bff; /* 蓝色背景 */
                color: white; /* 白色文字 */
            }
            
            .icon-btn:disabled {
                border-color: #ccc;
                color: #ccc;
                cursor: not-allowed;
            }
            
            .icon-btn:disabled:hover {
                background-color: transparent;
                color: #ccc;
            }
            
            .icon-btn i {
                font-size: 16px; /* 图标大小 */
            }
            
            /* 按钮组容器 */
            .button-group {
                display: flex;
                gap: 8px;
                align-items: center; /* 垂直居中 */
            }
            
            /* 分割线样式 */
            #sepLine {
                margin: 15px auto 25px;
                width: 30%;
                /*border-bottom: 1px solid #ddd; !* 更柔和的分割线 *!*/
            }
            
            /* 警告信息容器 */
            #alartWrapper {
                /* 你可以根据需要添加样式，例如字体颜色、背景色等 */
            }
            
            /* 滑块容器 */
            .slider-wrapper {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            /* 覆盖 Bootstrap 样式 (如果需要) */
            .btn-outline-primary {
                border: none; /* 移除 Bootstrap 边框 */
                color: inherit; /* 继承父元素的颜色 */
                background-color: transparent; /* 透明背景 */
                padding: 0; /* 移除 Bootstrap 内边距 */
            }
            
            .btn-outline-primary:hover {
                color: inherit; /* 继承父元素的颜色 */
                background-color: transparent; /* 透明背景 */
                border-color: transparent; /* 透明边框 */
            }
            
            .btn-outline-primary:focus,
            .btn-outline-primary:active {
                /*box-shadow: none !important; !* 移除焦点/激活时的阴影 *!*/
            }
            
            /* 自定义select样式 */
            .custom-select {
                /* 基础样式 */
                border: 1px solid #ced4da;
                border-radius: 0; /* 直角矩形 */
                background: transparent;
                padding: 6px 32px 6px 12px; /* 右侧留出箭头空间 */
                color: #495057;
                font-size: 14px;
                line-height: 1.5;
            
                /* 去除默认样式 */
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
            
                /* 自定义下拉箭头 */
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23333' d='M2 5l6 6 6-6z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 8px center;
                background-size: 12px;
            
                /* 过渡效果 */
                transition: border-color 0.2s ease;
            }
            
            /* 悬停状态 */
            .custom-select:hover {
                border-color: #888;
            }
            
            /* 焦点状态 */
            .custom-select:focus {
                outline: none;
                border-color: #555;
                box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
            }
            
            /* 父容器左对齐 */
            .card-header {
                justify-content: flex-start !important; /* 强制左对齐 */
                gap: 15px; /* 添加右侧间距 */
            }
            
            .resizer:hover{
                /*background-color:  #f0f0f0 !important;*/
            }

            .mid {
                display: flex;
                justify-content: center;
                align-items: center;
                align-content: center;
            }
            .l-box {
                font-size: 25px;
                width: 80px;
                height: 60px;
                background-color: #CCFFCC;
                border: 1px solid black;
            }            
        </style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        <div id="dataWrapper" style="width: 95%">
            <algorithm-title>${this.Title}</algorithm-title>
            <algorithm-desc>${this.Desc}</algorithm-desc>
            <slot name="input"></slot>  
            <div class="container" id = "textCenter">
                <div class="text-center">
                    <p>tips:点击播放或者下一步开始进行演示哦！</p>
                </div>
            </div>

            <div id="cartoonArea">
                <div id="animation" v-draggable style="position: relative; ">
                    <div id="listcontainer" class="container mid" style="margin-bottom: 10px; z-index: 1000; width: 650px">
                        <slot name="cartoonMain"></slot>
                        <slot name="customize"></slot>
                    </div>
                </div>
            </div>

            <div class="button-group d-flex flex-wrap justify-content-center align-items-center gap-2">
                <div class="d-flex flex-wrap justify-content-center align-items-center gap-2 w-100">
                    <button id="zoomInBtn" class="icon-btn">
                        <i class="fas fa-search-plus"></i>
                        <span>放大</span>
                    </button>
                    <button id="zoomOutBtn" class="icon-btn">
                        <i class="fas fa-search-minus"></i>
                        <span>缩小</span>
                    </button>
                    <button id="resetZoomBtn" class="icon-btn">
                        <i class="fas fa-sync-alt"></i>
                        <span>复原</span>
                    </button>
                    <button type="button" class="icon-btn" id="stopBtn">
                        <i class="fas fa-undo"></i>
                        <span>重置</span>
                    </button>
                    <button type="button" class="icon-btn" id="lastStep" disabled>
                        <i class="fas fa-step-backward"></i>
                        <span>上一步</span>
                    </button>
                    <button type="button" class="icon-btn" id="centerStep">
                        <i class="fas fa-play"></i>
                        <span>播放</span>
                    </button>
                    <button type="button" class="icon-btn" id="nextStep">
                        <i class="fas fa-step-forward"></i>
                        <span>下一步</span>
                    </button>
                </div>
                <div style="display: flex;
                        margin-left: auto;
                        text-align: right;  /* 进度条内容右对齐 */
                        margin-top: 10px;">
                    <div style="margin-right: 10px">拖动滑块改变动画速度</div>
                    <div>
                        <input id="slider" type="range" min="0" max="2000" value="1000" class="w-100">
                    </div>
                </div>
            </div>
 
            <div id="alertWrapper" style="text-align: center"></div>
            <div id="sepLine" style="margin: 0 auto; width: 30%; margin-top: 15px; margin-bottom: 25px;"></div>     
        </div>
    `;
    }

    //反转暂停状态
    public setIsPause(){
        this.isPause = !this.isPause;
    }
    //获取暂停状态
    public getIsPause(){
        return this.isPause;
    }

    //设置当前算法是否为连续播放
    public setIsContinuous(isContinuous: boolean){
        this.isContinuous = isContinuous
    }

    // 设置当前算法的标题和描述
    public setTitleAndDesc(Title: string, Desc: string): void {
        this.Title = Title;
        this.Desc = Desc;
        this.updateElementTextContent('algorithm-title', Title);
        this.updateElementTextContent('algorithm-desc', Desc);
    }


    // 更新元素文本内容
    private updateElementTextContent(selector: string, message: string): void {
        // 获取 shadow DOM 中的目标元素
        const element = this.shadowRoot!.querySelector(selector);
        if (element) {
            const innerShadowRoot = element.shadowRoot;
            if (innerShadowRoot) {
                const h3Element = innerShadowRoot.querySelector('h3');
                if (h3Element) {
                    h3Element.textContent = message;
                }
            }
        }
    }

    //设定step函数数组
    public setFunctionArray(functionArray: Array<any>) {
        this.functionArray = functionArray;
    }

    //设定上一步函数
    public setLastStepFunction(lastStepFunc: any): void {
        this.lastStepFunc = lastStepFunc;
    }

    //设定输入规则函数
    public setInputRuleFunc(ruleFunc: any): void {
        this.ruleFunc = ruleFunc;
    }

    //设定总步数与步数映射函数
    public setTotalStepAndMapFunc(totalStepAndMapFunc: any): void {
        this.totalStepAndMapFunc = totalStepAndMapFunc;
    }

    public setPauseTime(pauseTime: number){
        this.pauseTime = pauseTime;
    }

    public setIsReplaceDom(isReplaceDom: boolean){
        this.isReplaceDom = isReplaceDom;
    }

    public setCodeMirror(codeMirror: any): void {
        this.codeMirror = codeMirror;
    }

    public setCustomizeData(customizeData: any): void {
        this.customizeData[this.steps - 1] = JSON.parse(JSON.stringify(customizeData));
        // console.log("setCustomizeData:" , customizeData, this.steps);
        // console.log("setCustomizeData:" , this.customizeData, this.steps);
    }

    public getCustomizeData(): any {
        // console.log("getCustomizeData:" , this.customizeData, this.steps);
        return this.customizeData[this.steps];
    }
    /**
     * @method
     * @desc 给按钮解锁
     */
    public open(): void {
        const playBtn = this.shadowRoot?.getElementById('centerStep');
        const nextBtn = this.shadowRoot?.getElementById('nextStep');
        const lastBtn = this.shadowRoot?.getElementById('lastStep');

        if (!this.isContinuous) {
            // 非连续模式下的解锁逻辑
            if (this.steps !== 0) {
                lastBtn?.removeAttribute('disabled');
            }
            if (this.steps !== this.totalSteps) {
                nextBtn?.removeAttribute('disabled');
            }
            playBtn?.removeAttribute('disabled');
        } else {
            // 连续模式下的解锁逻辑
            if(this.steps !== 0){
                lastBtn?.removeAttribute('disabled');
            }
            nextBtn?.removeAttribute('disabled');
            playBtn?.removeAttribute('disabled');
        }

        // 输入框解锁
        const inputSlot = this.querySelector('#input');
        // console.log(this.steps, this.totalSteps);
        if (inputSlot && ((this.steps == this.totalSteps && this.isContinuous))) {
            // 查找 inputSlot 本身和它的所有阴影 DOM 中的 input 元素并解锁
            const allInputs = this.getAllInputs(inputSlot);

            // 给找到的所有 input 元素解锁
            allInputs.forEach((input: HTMLInputElement) => {
                input.removeAttribute('disabled');
            });
        }

    }

    /**
     * @method
     * @desc 给按钮加锁
     */
    public lock() {
        const nextBtn = this.shadowRoot?.getElementById('nextStep');
        const lastBtn = this.shadowRoot?.getElementById('lastStep');
        // const playBtn = this.shadowRoot?.getElementById('centerStep');
        /**
         * 给按钮加锁
         */
        lastBtn?.setAttribute('disabled', 'true');
        nextBtn?.setAttribute('disabled', 'true');
        // playBtn?.classList.add('disabled');

        // 输入框加锁
        const inputSlot = this.querySelector('#input');
        //console.log(this.steps, this.totalSteps);
        if (inputSlot) {
            // 查找 inputSlot 本身和它的所有阴影 DOM 中的 input 元素
            const allInputs = this.getAllInputs(inputSlot);

            // 给找到的所有 input 元素加锁
            allInputs.forEach((input: HTMLInputElement) => {
                input.setAttribute('disabled', 'true');
            });
        }

    }

    // 递归函数：查找元素及其所有阴影 DOM 内的 input 元素
    private getAllInputs(element: Element): HTMLInputElement[] {
        let inputs: HTMLInputElement[] = [];

        // 查找当前元素内的所有 input 元素
        inputs = inputs.concat(Array.from(element.querySelectorAll('input, textarea')));

        // 如果该元素有 shadowRoot，则递归查找 shadowRoot 中的 input 元素
        const shadowRoot = element.shadowRoot;
        if (shadowRoot) {
            inputs = inputs.concat(this.getAllInputs(shadowRoot as unknown as Element));
        }

        // 查找所有子元素的 shadow DOM
        element.querySelectorAll('*').forEach(child => {
            inputs = inputs.concat(this.getAllInputs(child));
        });

        return inputs;
    }

    //下一步
    public async nextStep(){
        this.lock();
        // 保存Dom状态
        this.setLastLineArgs();
        this.addLastDom();

        // 根据functionArray来写下一步
        const { index, isInSubArray, isLastInSubArray } = this.findStepIndex();

        // 确定要调用的函数索引 [1,[2,3],4,5] [step1,step2,step3,step4]
        const funcIndex = this.getNextStepIndex(index, isInSubArray, isLastInSubArray);
        // 边界检查
        if (funcIndex < 0 || funcIndex >= this.functionArray.length) {
            this.showError(`Function index ${funcIndex} 超出范围`);
        }

        // console.log(`当前步骤：${this.steps}，下一步函数索引：${funcIndex}`);
        // console.log(`当前步骤函数：${this.functionArray}`);
        // console.log(`当前步骤Dom：${this.lastDom}`);
        // console.log(`当前步骤映射：${this.stepMap}`);
        this.addSteps();
        this.addProgressBar();
        // 动态调用对应的函数
        await this.functionArray[funcIndex]();

        this.open();

        if(this.steps == this.totalSteps){
            if(!this.isContinuous){
                const playBtn = this.shadowRoot?.getElementById('centerStep');
                playBtn?.setAttribute('disabled', 'true');
            }
        }
    }

    public setLastLineArgs(): void {
        let currentLine = this.codeMirror.getCurrentLine();
        this.lastLineArgs[this.steps] = currentLine;
        console.log("currentLine:" + currentLine);
        console.log("setCurrentStep:" + this.steps);
        console.log("lastLineArgs:" + this.lastLineArgs);
    }

    public getLastLineArgs(): number {
        // console.log("getLastLineArgs:" + this.lastLineArgs);
        // console.log("getCurrentStep:" + this.steps);
        return this.lastLineArgs[this.steps];
    }

    public async lastStep(): Promise<void> {
        this.lock();
        this.decreaseSteps();
        this.replaceCommon();

        // 执行上一步函数和 DOM 重置操作并行
        const lastStepTask = this.lastStepFunc ? this.lastStepFunc() : await Promise.resolve();
        const domResetTask = await this.commonDomReset();

        // 等待两个任务都完成
        await Promise.all([lastStepTask, domResetTask]);

        this.open();
    }

    private async commonDomReset(): Promise<void> {
        return new Promise((resolve) => {
            // 执行 DOM 重置操作
            if(!(this.isConnected && this.steps === 0)){
                this.codeMirror.highlightLine(this.getLastLineArgs());
                this.shadowRoot?.querySelector('#alertWrapper')?.replaceWith(this.alertWrapperDom[this.steps]);
                this.shadowRoot?.querySelector('#sepLine')?.replaceWith(this.sepLineDom[this.steps]);
            }else{
                //处理进度条
                const sepLine = this.shadowRoot?.getElementById('sepLine');
                const alertWrapper = this.shadowRoot?.getElementById('alertWrapper');
                if (sepLine) {
                    // 清空原有进度条并插入新的进度条
                    sepLine.innerHTML = '';  // 清空现有内容
                }
                if(alertWrapper){
                    alertWrapper.innerHTML = ''; //清空现有内容
                }
                this.codeMirror.highlightLine(-1);
            }

            resolve();
        });
    }

    /**
     * 播放功能。
     * 预期功能：自动播放任务或操作。
     */
    public async play(): Promise<void> {

        // 播放
        for(let i = this.steps; i < this.totalSteps; i++) {
            if(!this.isPause){
                await this.nextStep();
            }
        }

        if(this.steps == this.totalSteps){
            //播放完毕/暂停后恢复isPause状态
            const playBtn = this.shadowRoot?.getElementById('centerStep');
            if (playBtn) {
                playBtn.textContent = "播放";
            }
            this.setIsPause();
            if(!this.isContinuous){
                const playBtn = this.shadowRoot?.getElementById('centerStep');
                playBtn?.setAttribute('disabled', 'true');
            }
        }
    }

    //绑定各按钮监听事件
    public buttonAddListener(): void {
        // 绑定按钮事件
        const playBtn = this.shadowRoot?.getElementById('centerStep');
        const nextBtn = this.shadowRoot?.getElementById('nextStep');
        const lastBtn = this.shadowRoot?.getElementById('lastStep');

        // 播放
        playBtn?.addEventListener('click', async () => {
            //考虑连续播放的情况
            if(this.steps === this.totalSteps){
                this.steps = 0;
            }

            if(this.ruleFunc){
                if(this.ruleFunc()){
                    if(this.totalStepAndMapFunc){
                        await this.totalStepAndMapFunc();
                    }
                }
            }

            // console.log("this.totalSteps:" + this.totalSteps);
            // console.log("this.stepMap:" + this.stepMap);

            if(this.ruleFunc){
                if(this.ruleFunc()){
                    if (!this.getIsPause()) {
                        this.setIsPause();
                        playBtn.textContent = "播放";
                    } else {
                        this.setIsPause();
                        playBtn.textContent = "暂停";
                        await this.play();
                    }
                }
            }else{
                if (!this.getIsPause()) {
                    this.setIsPause();
                    playBtn.textContent = "播放";
                } else {
                    this.setIsPause();
                    playBtn.textContent = "暂停";
                    await this.play();
                }
            }
        });

        // 下一步
        nextBtn?.addEventListener('click', async () => {
            //考虑连续播放的情况
            if(this.steps === this.totalSteps){
                this.steps = 0;
            }

            if(this.ruleFunc){
                if(this.ruleFunc()){
                    if(this.totalStepAndMapFunc){
                        await this.totalStepAndMapFunc();
                    }
                }
            }

            // 下一步动画执行时锁定播放按钮，播完再解锁
            if(this.ruleFunc){
                if(this.ruleFunc()){
                    playBtn?.classList.add('disabled');
                    // this.resetZoom();
                    await this.nextStep();
                    playBtn?.classList.remove('disabled');
                }
            }else{
                playBtn?.classList.add('disabled');
                // this.resetZoom();
                await this.nextStep();
                playBtn?.classList.remove('disabled');
            }
        });

        // 上一步按钮
        lastBtn?.addEventListener('click', async () => {
            // 上一步操作的代码
            playBtn?.classList.add('disabled');
            await this.lastStep();
            playBtn?.classList.remove('disabled');
        });

        // 重置按钮
        const resetBtn = this.shadowRoot?.getElementById('stopBtn');
        resetBtn?.addEventListener('click', () => {
            // 重置操作的代码
            location.reload();
        });
    }

    /**
     * 获取当前步骤数。
     * @returns 当前步骤数。
     */
    public getSteps(): number {
        return this.steps;
    }

    /**
     * 增加步骤数。
     */
    public addSteps():void {
        this.steps++;
    }
    /**
     * 减少步骤数。
     */
    public decreaseSteps():void {
        this.steps--;
    }

    /**
     * 设置总步骤数和步骤映射。
     * @param steps 总步骤数。
     * @param stepMap 步骤映射
     */
    public setTotalSteps(steps:number, stepMap: Array<any>): void {
        if (steps <= 0) {
            this.showError('总步骤数不能小于等于0');
            return;
        }
        this.totalSteps = steps;
        this.stepMap = stepMap;
        // this.steps = 0;
    }

    /**
     * 获取总步骤数。
     * @returns 总步骤数。
     */
    public getTotalSteps(): number {
        return this.totalSteps;
    }

    /**
     * 添加 DOM 状态
     */
    public addLastDom(): void {
        const originalElement = document.querySelector('div[slot="customize"]') as HTMLElement;
        if (originalElement) {
            const clonedElement = this.deepCloneWithShadow(originalElement);
            //console.log("克隆元素:", clonedElement, this.steps);
            this.lastDom[this.steps] = clonedElement;
        }else{
            this.lastDom[this.steps] = null;
        }
        //console.log("lastDom:", this.lastDom[this.steps]);

        // console.log("addLastDom:", this.steps);
        // 保存提示区
        this.alertWrapperDom[this.steps] = this.shadowRoot?.querySelector('#alertWrapper')?.cloneNode(true);
        // 保存进度条
        this.sepLineDom[this.steps] = this.shadowRoot?.querySelector('#sepLine')?.cloneNode(true);

    }

    private deepCloneWithShadow(element: HTMLElement): HTMLElement {
        // 浅克隆当前元素
        const clone = element.cloneNode(false) as HTMLElement;

        // 递归克隆普通子元素
        Array.from(element.childNodes).forEach(child => {
            if (child instanceof HTMLElement) {
                clone.appendChild(this.deepCloneWithShadow(child));
            } else {
                clone.appendChild(child.cloneNode(true)); // 处理文本节点等
            }
        });

        // 处理当前元素的 Shadow DOM
        if (element.shadowRoot) {
            const shadowContent = document.createDocumentFragment();
            Array.from(element.shadowRoot.children).forEach(shadowChild => {
                shadowContent.appendChild(this.deepCloneWithShadow(shadowChild as HTMLElement));
            });

            // 创建新 Shadow Root 并附加克隆内容
            const shadowRoot = clone.shadowRoot || clone.attachShadow({ mode: 'open' });
            shadowRoot.innerHTML = '';
            shadowRoot.appendChild(shadowContent);
        }

        return clone;
    }

    /**
     * 使用原生 JavaScript 替换 #common 元素
     * 将 this.lastDom[this.steps] 作为新元素进行替换
     */
    private replaceCommon(): void {
        // 恢复时
        if (!this.isReplaceDom) return;
        let elementToReplace = document.querySelector('div[slot="customize"]');
        // console.log(this.steps)

        const newElement = this.lastDom[this.steps];
        // console.log("正在替换元素:", elementToReplace);
        // console.log("替换为新的元素:", newElement);
        // 确保原始元素和替换元素都存在
        if (elementToReplace && newElement) {
            elementToReplace.replaceWith(newElement);
        } if (elementToReplace){
            elementToReplace.remove();
        } else{
            console.error("找不到要替换的元素");
        }


    }

    /**
     * 获取上一步的 DOM 状态。
     * @returns 上一步的 DOM 状态数组。
     */
    public getLastDom():Array<any> {
        return this.lastDom;
    }

    private findStepIndex() {
        let index = -1; // functionArray的数组下标
        let isInSubArray = false; // 是否在子数组内
        let isLastInSubArray = false; // 是否为子数组的最后一个元素

        // 遍历 stepMap 查找当前 step 的位置
        for (let i = 0; i < this.stepMap.length; i++) {
            const element = this.stepMap[i];

            if (Array.isArray(element)) {
                const stepIndex = element.indexOf(this.steps);
                if (stepIndex !== -1) {
                    isInSubArray = true;
                    index = i;
                    isLastInSubArray = stepIndex === element.length - 1;
                    break;
                }
            } else if (element === this.steps) {
                index = i;
                break;
            }
        }

        return { index, isInSubArray, isLastInSubArray };
    }

    private getNextStepIndex(index: number, isInSubArray: boolean, isLastInSubArray: boolean): number {
        if (index === -1) {
            // 默认调用第一个函数（如初始状态）
            return 0;
        } else {
            if (isInSubArray) {
                // 如果在子数组内，如果是子数组最后一个元组，则调用下一个step
                // 如果不是最后一个元素，则仍然调用当前step
                const isSubArrayEnd = Array.isArray(this.stepMap[index]) && isLastInSubArray;
                return isSubArrayEnd ? index + 1 : index;
            } else {
                // 不在子数组内，直接调用下一个step
                return  index + 1;
            }
        }
    }

    /**
     * 生成进度条。
     * 根据总步骤和当前步骤生成视觉状态。
     */
    public generatorProgressBar(): void {
        if (this.totalSteps <= 0) {
            this.showError("未设置有效的总步骤数");
            return;
        }

        // 1. 计算当前进度
        let progressPercent = Math.floor((this.steps / this.totalSteps) * 100);
        let progressText = `${progressPercent}%`;

        // 2. 生成进度条 DOM 结构
        const progressBarWrapper = document.createElement('div');
        progressBarWrapper.classList.add('progress');
        progressBarWrapper.setAttribute('role', 'progressbar');
        progressBarWrapper.setAttribute('aria-label', '进度条');
        progressBarWrapper.setAttribute('aria-valuenow', `${progressPercent}`);
        progressBarWrapper.setAttribute('aria-valuemin', '0');
        progressBarWrapper.setAttribute('aria-valuemax', '100');
        progressBarWrapper.style.height = '20px';

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.id = 'progress1';
        progressBar.style.width = progressText;
        progressBar.textContent = `${this.steps}/${this.totalSteps}`;

        // 3. 将进度条添加到 wrapper 中
        progressBarWrapper.appendChild(progressBar);

        // 4. 获取 Shadow DOM 中的 #sepLine 元素
        const sepLine = this.shadowRoot?.getElementById('sepLine');
        if (sepLine) {
            // 清空原有进度条并插入新的进度条
            sepLine.innerHTML = '';  // 清空现有内容
            sepLine.appendChild(progressBarWrapper);  // 插入新的进度条
        }
    }

    /**
     * 更新进度条状态。
     * 根据当前步骤动态调整进度条形状。
     */
    public addProgressBar(): void {

        if (this.steps > this.totalSteps) {
            this.showError("步骤已达到最大值");
            return;
        }

        // 计算进度百分比
        let progressPercent = Math.floor((this.steps / this.totalSteps) * 100) + '%';

        // 使用原生 JavaScript 访问 Shadow DOM 中的 #progress1 元素并更新进度条
        const progressBar = this.shadowRoot?.getElementById('progress1');

        if (progressBar instanceof HTMLElement) {
            // 更新进度条宽度和文本
            progressBar.style.width = progressPercent;
            progressBar.textContent = `${this.steps}/${this.totalSteps}`;
        }else{
            this.generatorProgressBar();
        }
    }

    /**
     * 添加新的提示信息。
     * @param message 提示文本内容
     */
    private addAlgorithmText(message: string): void {
        //console.log(`添加提示信息: ${message}`);
        const dom = document.createElement('div');
        dom.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show', 'm-auto');
        dom.setAttribute('role', 'alert');
        dom.style.width = '98%';
        dom.style.maxWidth = '900px';
        dom.style.marginBottom = '10px';
        dom.id = 'algorithmTextWrapper';

        const messageElement = document.createElement('div');
        messageElement.classList.add('fs-5', 'mid');
        messageElement.id = 'algorithmText';
        messageElement.textContent = message;

        dom.appendChild(messageElement);

        const alertWrapper = this.shadowRoot?.getElementById('alertWrapper');

        // 确保 alertWrapper 存在且是 HTMLElement 类型
        if (alertWrapper instanceof HTMLElement) {
            alertWrapper.style.marginTop = '10px';
            alertWrapper.innerHTML = '';  // 清空现有内容
            alertWrapper.appendChild(dom);  // 插入新内容
        }
    }

    /**
     * 更新提示信息内容。
     * @param message 新的提示文本
     */
    public updateAlgorithmText(message: string): void {
        // 使用原生 JavaScript 查找 Shadow DOM 中的元素
        const textElement = this.shadowRoot?.getElementById('algorithmText');
        // console.log(textElement);
        if (textElement instanceof HTMLElement) {
            // 如果找到元素，更新它的文本内容
            textElement.textContent = message;
        } else {
            // 如果提示框不存在，则新建
            this.addAlgorithmText(message);
        }
    }

    /**
     * @method showErrorc
     * @param {string} message - 传入的错误信息
     * @desc 在页面中显示错误信息，直接显示在页面正上方
     */
    private showError(message: string): void {
        const errorDom = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert" id="alert" 
                 style="position: fixed; top: 10px; left: 50%; transform: translateX(-50%); z-index: 1050; width: auto;">
                <strong>出现异常!</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        // 将 errorDom 直接添加到 body 中
        $("body").append(errorDom);
    }

    // 缩放、拖拽、重置功能实现
    public zoom(): void {
        const animationDiv = this.shadowRoot?.getElementById('animation');
        if (!animationDiv) return;

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
            if (!this.isDragging) return;
            this.offsetX = e.clientX - this.startX;
            this.offsetY = e.clientY - this.startY;
            this.applyTransform();
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }

    //放大缩小重置按钮
    public shrink(): void {
        // 绑定按钮事件
        const zoomInBtn = this.shadowRoot?.getElementById('zoomInBtn');
        const zoomOutBtn = this.shadowRoot?.getElementById('zoomOutBtn');
        const resetBtn = this.shadowRoot?.getElementById('resetZoomBtn');

        zoomInBtn?.addEventListener('click', () => {
            this.currentScale = Math.min(3, this.currentScale * 1.1);
            this.applyTransform();
        });

        zoomOutBtn?.addEventListener('click', () => {
            this.currentScale = Math.max(0.5, this.currentScale * 0.9);
            this.applyTransform();
        });

        resetBtn?.addEventListener('click', () => {
            this.resetZoom();
        });
    }

    public resetZoom(): void {
        this.currentScale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.applyTransform();
    }

    public btnShrink() {
        // 模拟点击缩小按钮 一般在动画占用页面较大时调用
        const zoomOutBtn = this.shadowRoot?.getElementById('zoomOutBtn');
        zoomOutBtn?.click();
    }

    // 缩放拖拽辅助方法：应用变换
    private applyTransform(): void {
        const animationDiv = this.shadowRoot?.getElementById('animation');
        if (animationDiv) {
            animationDiv.style.transform =
                `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.currentScale})`;
        }

        // 触发所有链表组件重新绘制连接线
        const linkedLists = document.querySelectorAll('linked-list');
        linkedLists.forEach(list  => {
            if (list instanceof LinkedListComponent) {
                list.setScale(this.getScaleFactor(animationDiv));
            }
        });

        const TreeNodes:NodeListOf<MyTreeComponent> = document.querySelectorAll('tree-component');
        TreeNodes.forEach((node: MyTreeComponent) => {
            node.setScale(this.getScaleFactor(animationDiv));
        });

        const BinaryTreeNodes:NodeListOf<BinaryTreeComponent> = document.querySelectorAll('binary-tree-component');
        BinaryTreeNodes.forEach((node: BinaryTreeComponent) => {
            node.setScale(this.getScaleFactor(animationDiv));
        });

        const stackNodes:NodeListOf<LinkedStackComponent> = document.querySelectorAll('linked-stack');
        stackNodes.forEach((node: LinkedStackComponent) => {
            node.setScale(this.getScaleFactor(animationDiv));
        });

        const graphNodes:NodeListOf<GraphComponent> = document.querySelectorAll('graph-component');
        graphNodes.forEach((node: GraphComponent) => {
            node.setScale(this.getScaleFactor(animationDiv));
        });

        const graphListNodes:NodeListOf<GraphAdjacencyListComponent> = document.querySelectorAll('graph-adjacency-list-component');
        graphListNodes.forEach((node: GraphAdjacencyListComponent) => {
            node.setScale(this.getScaleFactor(animationDiv));
        });

        const linkedLists2:NodeListOf<LinkedListComponent2> = document.querySelectorAll('linked-list2');
        linkedLists2.forEach((node: LinkedListComponent2) => {
            node.setScale(this.getScaleFactor(animationDiv));
        });

        const BinaryTreeNodes2:NodeListOf<BinaryTreeComponent2> = document.querySelectorAll('binary-tree-component2');
        BinaryTreeNodes2.forEach((node: BinaryTreeComponent2) => {
            node.setScale(this.getScaleFactor(animationDiv));
        });

        const BinaryTreeNodes3:NodeListOf<ThreadBinaryTreeComponent> = document.querySelectorAll('binary-threadtree-component');
        BinaryTreeNodes3.forEach((node: ThreadBinaryTreeComponent) => {
            node.setScale(this.getScaleFactor(animationDiv));
        });

        const BinaryTreeNodes4:NodeListOf<ThreadBinaryTreeComponent2> = document.querySelectorAll('binary-threadtree2-component');
        BinaryTreeNodes4.forEach((node: ThreadBinaryTreeComponent2) => {
            node.setScale(this.getScaleFactor(animationDiv));
        });
    }

    private getScaleFactor(element: any): number {
        const transform = window.getComputedStyle(element).transform;
        // 默认没有缩放时，transform 会是 'none'
        if (transform === 'none') {
            return 1; // 没有缩放，返回 1
        }

        // 提取 scale 值
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (matrix) {
            const values = matrix[1].split(',').map(parseFloat);
            // 如果是 2D 缩放，scale 值应该是第 1 个或第 3 个元素
            return values[0];  // 或者 values[3]，如果是非均匀缩放
        }
        return 1;
    }

    public getPauseTime(){
        const slider = this.shadowRoot?.getElementById('slider') as HTMLInputElement;
        return 2000 - Number(slider?.value || 100) + 100;
    }

    public async pauseExecution(milliseconds?: number): Promise<any> {
        // 如果没有传入参数，使用 getPauseTime 获取暂停时间
        const timeToPause = milliseconds ?? this.getPauseTime();
        //console.log(`暂停时间: ${timeToPause} 毫秒`);

        return new Promise(resolve => {
            setTimeout(resolve, timeToPause);
        });
    }

    public simulateZoomOutClick(count: number): void {
        const zoomOutBtn = this.shadowRoot?.getElementById('zoomOutBtn');
        if (zoomOutBtn) {
            while(count--){
                zoomOutBtn.click(); // 触发点击事件，执行现有的缩放逻辑
            }
        }
    }
    public simulateDrag(deltaX: number, deltaY: number): void {
        // 更新偏移量并应用变换
        this.offsetX += deltaX;
        this.offsetY += deltaY;
        this.applyTransform();
    }

    public forceLock(){
        const nextBtn = this.shadowRoot?.getElementById('nextStep');
        const lastBtn = this.shadowRoot?.getElementById('lastStep');
        const playBtn = this.shadowRoot?.getElementById('centerStep');
        /**
         * 给按钮加锁
         */
        lastBtn?.setAttribute('disabled', 'true');
        nextBtn?.setAttribute('disabled', 'true');
        playBtn?.setAttribute('disabled', 'true');
    }
    public forceOpen(){
        const playBtn = this.shadowRoot?.getElementById('centerStep');
        const nextBtn = this.shadowRoot?.getElementById('nextStep');
        // const lastBtn = this.shadowRoot?.getElementById('lastStep');
        // lastBtn?.removeAttribute('disabled');
        nextBtn?.removeAttribute('disabled');
        playBtn?.removeAttribute('disabled');
    }
}

// 确保只定义一次
if (!customElements.get('common-element')) {
    customElements.define('common-element', Common);
}
