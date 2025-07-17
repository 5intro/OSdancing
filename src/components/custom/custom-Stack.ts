// 顺序栈数据接口
interface SequentialStackData {
    nodes: Array<{
        id: number;
        value: any;
        isNew?: boolean;
        isDeleting?: boolean;
        color?: string;
    }>;
}

// 顺序栈渲染策略
class SequentialStackRendererStrategy {
    render(data: SequentialStackData): string {
        return `
            <div class="sequential-stack" style="display: flex; flex-direction: column-reverse; align-items: center; 
                 padding: 40px 20px;">
                ${data.nodes.map(node => `
                    <div class="node-container" style="display: flex; align-items: center; position: relative;" 
                         id="container-${node.id}">
                        <div class="node${node.isNew ? ' new-node' : ''}${node.isDeleting ? ' deleting' : ''}" 
                             id="node-${node.id}" 
                             style="width: 150px; height: 60px; border: 2px solid #666;
                                    background-color: ${node.color || '#CCFFCC'};
                                    display: flex; flex-direction: column; align-items: center;
                                    justify-content: center; position: relative;">
                            <span style="font-size: 25px">${node.value}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// 顺序栈组件
export class SequentialStackComponent extends HTMLElement {
    private data: SequentialStackData = { nodes: [] };
    private renderer = new SequentialStackRendererStrategy();
    private pointers: Array<{ nodeId: number, label: string, position: 'left' | 'right' }> = [];

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = this.initializeStyles();
        this.renderStack();
    }

    /**
     * 初始化栈
     * @param array 初始元素数组（第一个元素为栈底）
     */
    public async init(array: Array<any>) {
        this.data.nodes = array.map((value, index) => ({
            id: index,
            value,
            color: '#CCFFCC'
        }));
        await this.renderStack();
    }

    /**
     * 元素入栈
     * @param value 入栈元素值
     */
    public async push(value: any) {
        const newId = this.data.nodes.length;
        const newNode = {
            id: newId,
            value,
            isNew: true,
            color: '#CCFFCC'
        };

        this.data.nodes.push(newNode);
        await this.renderStack();

        // 触发重排以应用动画
        this.shadowRoot!.querySelectorAll('.node').forEach(node => {
            node.getBoundingClientRect();
        });
    }

    /**
     * 元素出栈
     */
    public async pop() {
        if (this.data.nodes.length === 0) return;

        const topNode = this.data.nodes[this.data.nodes.length - 1];
        topNode.isDeleting = true;
        await this.renderStack();

        this.data.nodes.pop();
        await this.renderStack();
    }

    /**
     * 改变节点颜色
     * @param nodeId 节点ID
     * @param color 新的颜色值
     */
    public async changeColor(nodeId: number, color: string) {
        const node = this.data.nodes.find(n => n.id === nodeId);
        if (node) node.color = color;
        await this.renderStack();
    }

    /**
     * 改变节点值
     * @param nodeId 节点ID
     * @param value 新的值
     */
    public async changeValue(nodeId: number, value: any) {
        const node = this.data.nodes.find(n => n.id === nodeId);
        if (node) node.value = value;
        await this.renderStack();

        const valueElement = this.shadowRoot?.getElementById(`container-${nodeId}`);
        if (valueElement) {
            valueElement.classList.add('value-change');
            // 动画结束后移除类
            setTimeout(() => {
                valueElement.classList.remove('value-change');
            }, 500);
        }
    }

    /**
     * 在节点左侧添加箭头
     * @param nodeId 节点ID
     * @param label 箭头标签
     */
    public async addLeftPointer(nodeId: number, label: string) {
        await this.removeLeftPointer(nodeId, label);
        this.pointers.push({ nodeId, label, position: 'left' });

        if (!this.shadowRoot) return;
        const container = this.shadowRoot.getElementById(`container-${nodeId}`);
        if (!container) return;

        const pointer = document.createElement('div');
        pointer.className = 'left-pointer';
        pointer.id = `left-pointer-${nodeId}-${label}`;
        pointer.innerHTML = `
            <div style="display: flex; align-items: center; position: absolute; left: -110px; top:-15px; ">
                <div style="font-size: 20px; margin-right: 5px;">${label}</div>
                <div style="width: 20px; height: 4px; background: black;"></div>
                <div style="width: 0; height: 0; border-top: 8px solid transparent;
                     border-bottom: 8px solid transparent; border-left: 12px solid black;"></div>
            </div>
        `;
        container.appendChild(pointer);
    }

    /**
     * 删除左侧指定箭头
     * @param nodeId 节点ID
     * @param label 箭头标签
     */
    public async removeLeftPointer(nodeId: number, label: string) {
        if (!this.shadowRoot) return;
        const pointer = this.shadowRoot.getElementById(`left-pointer-${nodeId}-${label}`);
        pointer?.remove();
        this.pointers = this.pointers.filter(p => !(p.nodeId === nodeId && p.label === label && p.position === 'left'));
    }

    /**
     * 在节点右侧添加箭头
     * @param nodeId 节点ID
     * @param label 箭头标签
     */
    public async addRightPointer(nodeId: number, label: string) {
        await this.removeRightPointer(nodeId, label);
        this.pointers.push({ nodeId, label, position: 'right' });

        if (!this.shadowRoot) return;
        const container = this.shadowRoot.getElementById(`container-${nodeId}`);
        if (!container) return;

        const pointer = document.createElement('div');
        pointer.className = 'right-pointer';
        pointer.id = `right-pointer-${nodeId}-${label}`;
        pointer.innerHTML = `
            <div style="display: flex; align-items: center; position: absolute; right: -255px; top: -15px">
                <div style="width: 0; height: 0; border-top: 8px solid transparent;
                     border-bottom: 8px solid transparent; border-right: 12px solid black;"></div>
                <div style="width: 20px; height: 4px; background: black;"></div>
                <div style="font-size: 20px; margin-left: 5px;">${label}</div>
            </div>
        `;
        container.appendChild(pointer);
    }

    /**
     * 删除指定箭头
     * @param nodeId 节点ID
     * @param label 箭头标签
     */
    public async removeRightPointer(nodeId: number, label: string) {
        if (!this.shadowRoot) return;
        const pointer = this.shadowRoot.getElementById(`right-pointer-${nodeId}-${label}`);
        pointer?.remove();
        this.pointers = this.pointers.filter(p => !(p.nodeId === nodeId && p.label === label && p.position === 'right'));
    }

    private renderStack() {
        if (!this.shadowRoot) return;

        const container = this.shadowRoot.querySelector('.stack-container')!;
        container.innerHTML = this.renderer.render(this.data);

        this.restorePointers();
    }

    private initializeStyles(): string {
        return `
            <style>
                /* 新增值变化动画 */
                @keyframes valueChange {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% {transform: scale(1); }
                }
                .value-change {
                    animation: valueChange 0.5s ease-in-out;
                }
                .new-node {
                    opacity: 0;
                    animation: slideIn 0.001s ease-out forwards;
                }

                .deleting {
                    animation: shrinkUp 0.001s ease-in forwards;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shrinkUp {
                    to {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.8);
                    }
                }

                .left-pointer, .right-pointer {
                    position: absolute;
                    z-index: 0;
                }
            </style>
            <div class="stack-container"></div>
        `;
    }

    private restorePointers(): void {
        this.pointers.forEach(({ nodeId, label, position }) => {
            const nodeExists = this.data.nodes.some(n => n.id === nodeId);
            if (nodeExists) {
                if (position === 'left') {
                    this.addLeftPointer(nodeId, label);
                } else {
                    this.addRightPointer(nodeId, label);
                }
            }
        });
    }

    public async getCurrentState() {
        return {
            data: structuredClone(this.data),
            pointers: structuredClone(this.pointers),
        };
    }

    public async restoreState(state: any) {
        this.data = state.data;
        this.pointers = state.pointers;
        this.renderStack();
    }
}

//链栈
interface StackNode {
    id: number;
    value: any;
    next: number | null;
    isNew?: boolean;
    isDeleting?: boolean;
    isLast?: boolean;
    color?: string;
    isTop: boolean; // 是否为栈顶
}

//链栈渲染策略
class StackRendererStrategy {
    async render(data: StackNode[]) {
        return `
            <div class="stack" style="display: flex; flex-direction: column; align-items: center; 
                 gap: 40px; padding: 40px 0;">
                ${data.map(node => `
                    <div class="node-container" style="position: relative;" id="container-${node.id}">
                        <div class="node${node.isNew ? ' new-node' : ''}${node.isDeleting ? ' deleting' : ''}" 
                             id="node-${node.id}"
                             style="width: 140px; height: 60px; border: 1px solid black; 
                                    background-color: ${node.color || '#CCFFCC'};
                                    display: flex; position: relative;">
                            <div style="flex: 7; border-right: 1px solid black; font-size: 25px;
                                 display: flex; align-items: center; justify-content: center;" id="value-${node.id}">
                                ${node.value}
                            </div>
                            <div style="flex: 3; background-color: #99CC99; font-size: 25px;
                                 display: flex; align-items: center; justify-content: center;">
                                 ${node.isLast ? '^' : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

//箭头绘制策略
class StackConnectorStrategy {
    drawConnectors(nodes: StackNode[], svg: SVGSVGElement, shadowRoot: ShadowRoot, scale: number,
                   hiddenArrows: Set<string>, ): void {
        const container = shadowRoot.querySelector('.stack') as HTMLElement;
        if (!container) return;
        const scrollTop = container ? container.scrollTop : 0;

        // 获取容器相对视口的位置
        const containerRect = container.getBoundingClientRect();

        nodes.forEach(node => {
            if (node.next === null) return;

            const arrowKey = `${node.next}-${node.id}`;
            if (hiddenArrows.has(arrowKey)) {
                return;
            }

            const currentElement = shadowRoot.getElementById(`node-${node.id}`);
            const nextElement = shadowRoot.getElementById(`node-${node.next}`);

            if (currentElement && nextElement) {
                const currentRect = currentElement.getBoundingClientRect();
                const nextRect = nextElement.getBoundingClientRect();

                // 计算相对于容器左上角的坐标
                const startX = (((currentRect.left + currentRect.width/2 - containerRect.left)) / scale) + 50;
                const startY = ((currentRect.bottom - containerRect.top) / scale) - 40;
                const endX = (((nextRect.left + nextRect.width/2 - containerRect.left)) / scale) + 50;
                const endY = (((nextRect.top - containerRect.top)) / scale) + 40;

                // 添加调试线条
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', startX.toString());
                line.setAttribute('y1', endY.toString());
                line.setAttribute('x2', endX.toString());
                line.setAttribute('y2', startY.toString());
                line.setAttribute('stroke', '#666');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('marker-end', 'url(#arrowhead)');
                svg.appendChild(line);
                line.setAttribute('id', arrowKey);
            }
        });
    }
}

// 链栈组件
export class LinkedStackComponent extends HTMLElement {
    private data: StackNode[] = [];
    private renderer = new StackRendererStrategy();
    private connectorStrategy = new StackConnectorStrategy();
    private svg: SVGSVGElement | null = null;
    private scale: number = 1;
    private hiddenArrows: Set<string> = new Set();
    private pointers: Array<{ nodeId: number, label: string, position: 'left' | 'right' }> = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = this.initializeStyles();
    }

    async connectedCallback() {
        await this.renderStack();
    }

    private initializeStyles(): string {
        return `
            <style>
                /* 新增值变化动画 */
                @keyframes valueChange {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% {transform: scale(1); }
                }
                .value-change {
                    animation: valueChange 0.5s ease-in-out;
                }
                .node {
                    transition: transform 0.001s ease, opacity 0.3s ease;
                }
                .new-node {
                    opacity: 0;
                    transform: translateY(-20px);
                    animation: fadeIn 0.001s ease-out forwards;
                }
                .deleting {
                    animation: shrink 0.001s ease-in forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shrink {
                    to { transform: scale(0); opacity: 0; }
                }
                svg {
                    pointer-events: none;
                }
                /* 容器需要相对定位 */
                .left-pointer {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translate(-100%, -50%);
                    pointer-events: none;
                }
                
                .pointer-content {
                    display: flex;
                    align-items: center;
                }
                
                .pointer-label {
                    font-size: 20px;
                    white-space: nowrap;
                    margin-right: 5px;
                }
                
                .pointer-line {
                    width: 25px;
                    height: 4px;
                    background: black;
                }
                
                 .left-pointer .pointer-arrow {
                    width: 0;
                    height: 0;
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-left: 12px solid black;
                }
                
                /* 右箭头专用样式 */
                .right-pointer {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translate(100%, -50%);
                    pointer-events: none;
                }
                
                .right-pointer .pointer-arrow {
                    width: 0;
                    height: 0;
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-right: 12px solid black;
                }
            </style>
            <div class="container" style="position: relative;"></div>
        `;
    }

    public async init(array: any[]) {
        for(let i=0 ; i<array.length ; i++){
            await this.push(array[i]);
        }
        await this.renderStack();
    }

    public async getTop(): Promise<any | null> {
        return this.data.length > 0 ? this.data[0].value : null;
    }

    public async push(value: any) {
        const newId = this.data.length > 0 ? this.data[0].id + 1 : 0;
        const newNode: StackNode = {
            id: newId, // 使用递增ID确保顺序
            value,
            next: null,
            isNew: true,
            isTop: true
        };
        // 插入到数组头部保持栈顶在首项
        this.data.unshift(newNode);
        // 更新前一个栈顶的isTop状态
        if (this.data.length > 1) {
            this.data[1].isTop = false;
            this.data[1].next = newId;
        }
        await this.renderStack();

        const valueElement = this.shadowRoot?.getElementById(`container-${newId}`);
        if (valueElement) {
            valueElement.classList.add('value-change');
            // 动画结束后移除类
            setTimeout(() => {
                valueElement.classList.remove('value-change');
            }, 500);
        }
    }

    public async pushWithoutArrow(value: any) {
        const newId = this.data.length > 0 ? this.data[0].id + 1 : 0;
        const newNode: StackNode = {
            id: newId,
            value,
            next: null,
            isNew: true,
            isTop: true
        };
        this.data.unshift(newNode);
        if (this.data.length > 1) {
            this.hiddenArrows.add(`${newId}-${newId-1}`);
            this.data[1].isTop = false;
            this.data[1].next = newId;
        }
        // console.log(this.data)
        // console.log(this.hiddenArrows)
        await this.renderStack();

        const valueElement = this.shadowRoot?.getElementById(`container-${newId}`);
        if (valueElement) {
            valueElement.classList.add('value-change');
            // 动画结束后移除类
            setTimeout(() => {
                valueElement.classList.remove('value-change');
            }, 500);
        }
    }

    public async createArrow(fromId: number, toId: number): Promise<void> {
        const arrowKey = `${fromId}-${toId}`;
        if (this.hiddenArrows.has(arrowKey)) {
            this.hiddenArrows.delete(arrowKey);
        }
        console.log(this.hiddenArrows)
        await this.renderStack();
    }

    public async deleteArrow(fromId: number, toId: number): Promise<void> {
        const arrowKey = `${fromId}-${toId}`;
        this.hiddenArrows.add(arrowKey);
        await this.renderStack();
    }

    public async pop() {
        if (this.data.length === 0) return;
        // 删除数组首项（栈顶）
        this.data.shift();
        if (this.data.length > 0) {
            this.data[0].isTop = true;
        }
        await this.renderStack();
    }

    public async changeColor(id: number, color: string) {
        this.data.forEach(node =>{
            if(node.id === id){
                node.color = color;
            }
        })
        await this.renderStack();
    }

    public async changeValue(id: number, value: any) {
        this.data.forEach(node =>{
            if(node.id === id){
                node.value = value;
            }
        })
        await this.renderStack();

        const valueElement = this.shadowRoot?.getElementById(`container-${id}`);
        if (valueElement) {
            valueElement.classList.add('value-change');
            // 动画结束后移除类
            setTimeout(() => {
                valueElement.classList.remove('value-change');
            }, 500);
        }
    }

    public async addLast(id: number) {
        this.data.forEach(node =>{
            if(node.id === id){
                node.isLast = true;
            }
        })
        await this.renderStack();
    }

    /**
     * 设置不为最后一个节点（指针域删去"^"）
     * @param id 节点ID
     */
    public async deleteLast(id: number) {
        this.data.forEach(node =>{
            if(node.id === id){
                node.isLast = false;
            }
        })
        await this.renderStack();
    }

    public async createLeftArrow(nodeId: number, label: string) {
        await this.deleteLeftArrow(nodeId, label);
        this.pointers.push({ nodeId, label, position: 'left' });

        if (!this.shadowRoot) return;
        const container = this.shadowRoot.getElementById(`container-${nodeId}`);
        if (!container) return;

        const pointer = document.createElement('div');
        pointer.className = 'left-pointer';
        pointer.id = `left-pointer-${nodeId}-${label}`;
        pointer.innerHTML = `
            <div class="pointer-content">
                <div class="pointer-label">${label}</div>
                <div class="pointer-line"></div>
                <div class="pointer-arrow"></div>
            </div>
        `;
        container.appendChild(pointer);
    }

    public async deleteLeftArrow(nodeId: number, label: string) {
        if (!this.shadowRoot) return;
        const pointer = this.shadowRoot.getElementById(`left-pointer-${nodeId}-${label}`);
        pointer?.remove();
        this.pointers = this.pointers.filter(p => !(p.nodeId === nodeId && p.label === label && p.position === 'left'));
    }

    public async createRightArrow(nodeId: number, label: string) {
        await this.deleteRightArrow(nodeId, label);
        this.pointers.push({ nodeId, label, position: 'right' });

        if (!this.shadowRoot) return;
        const container = this.shadowRoot.getElementById(`container-${nodeId}`);
        if (!container) return;

        const pointer = document.createElement('div');
        pointer.className = 'right-pointer';
        pointer.id = `right-pointer-${nodeId}-${label}`;
        pointer.innerHTML = `
            <div class="pointer-content">
                <div class="pointer-arrow"></div>
                <div class="pointer-line"></div>
                <div class="pointer-label">${label}</div>
            </div>
        `;
        container.appendChild(pointer);
    }

    public async deleteRightArrow(nodeId: number, label: string) {
        if (!this.shadowRoot) return;
        const pointer = this.shadowRoot.getElementById(`right-pointer-${nodeId}-${label}`);
        pointer?.remove();
        this.pointers = this.pointers.filter(p => !(p.nodeId === nodeId && p.label === label && p.position === 'right'));
    }

    private async renderStack() {
        if (!this.shadowRoot) return;

        const container = this.shadowRoot.querySelector('.container')!;
        container.innerHTML = await this.renderer.render(this.data);

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.style.position = 'absolute';
        this.svg.style.width = '1000%';
        this.svg.style.height = '1000%';
        container.prepend(this.svg);

        this.svg.innerHTML = `
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
                </marker>
            </defs>
        `;

        requestAnimationFrame(() => {
            this.connectorStrategy.drawConnectors(
                this.data,
                this.svg!,
                this.shadowRoot!,
                this.scale,
                this.hiddenArrows,
            );
            this.restorePointers(); // 渲染后恢复指针
        });
    }

    private restorePointers(): void {
        this.pointers.forEach(({ nodeId, label, position }) => {
            const nodeExists = this.data.some(n => n.id === nodeId);
            if (nodeExists) {
                if (position === 'left') {
                    this.createLeftArrow(nodeId, label);
                } else {
                    this.createRightArrow(nodeId, label);
                }
            }
        });
    }

    public setScale(scale: number) {
        this.scale = scale;
    }

    public async getCurrentState() {
        return {
            data: structuredClone(this.data),
            pointers: structuredClone(this.pointers),
            hiddenArrows: new Set(this.hiddenArrows),
        };
    }

    public async restoreState(state: any) {
        this.data = state.data;
        this.pointers = state.pointers;
        this.hiddenArrows = new Set(state.hiddenArrows);
        await this.renderStack();
    }

}


// 注册自定义元素
if (!customElements.get('linked-stack')) {
    customElements.define('linked-stack', LinkedStackComponent);
}

if (!customElements.get('sequential-stack')) {
    customElements.define('sequential-stack', SequentialStackComponent);
}