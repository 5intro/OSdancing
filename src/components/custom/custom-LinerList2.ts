interface ListNode {
    id: number;
    value: any;
    value2:any;
    next: number | null;
    isNew?: boolean;
    isDeleting?: boolean;
    isLast?: boolean;
    color?: string;
    isHead: boolean; //是否为头节点
}

//双值域链表渲染策略
class LinkedListRendererStrategy {
    render(data: ListNode[]): string {
        return `
            <div class="linked-list" style="display: flex; gap: 60px; padding: 20px; 
                 flex-wrap: nowrap; align-items: center;">
                ${data.map(node => `
                    <div class="node-container" style="display: flex; align-items: center; 
                         gap: 10px; position: relative;" id="container-${node.id}">
                        <div class="node${node.isNew ? ' new-node' : ''}${node.isDeleting ? ' deleting' : ''}" 
                             id="node-${node.id}" 
                             style="width: 220px; height: 60px; border: 1px solid black; 
                                    background-color: ${node.color || '#CCFFCC'}; 
                                    display: flex; position: relative;">
                            <!-- 值域 1 -->
                            <div style="flex: 5; border-right: 1px solid black; font-size: 25px;
                                 display: flex; align-items: center; justify-content: center; background-color: ${node.isHead ? 'grey' : ''}">
                                ${node.value}
                            </div>
                            <!-- 值域 2 -->
                            <div style="flex: 5; border-right: 1px solid black; font-size: 25px;
                                 display: flex; align-items: center; justify-content: center;background-color: ${node.isHead ? 'grey' : ''}">
                                ${node.value2}
                            </div>
                            <!-- 指针域 (指向下一个节点) -->
                            <div style="flex: 3; display: flex; background-color: #99CC99; font-size: 25px;
                                 align-items: center; justify-content: center;" id="arrowArea-${node.id}">
                                 ${node.isLast ? '^' : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}
// 链表连接线策略
class LinkedListConnectorStrategy {
    drawConnectors(nodes: ListNode[], svg: SVGSVGElement, shadowRoot: ShadowRoot, scale: number, hiddenArrows: Set<string>): void {
        nodes.forEach(node => {
            if (!node.next) {
                // console.log("NULLNULL")
                return;
            }

            const arrowKey = `${node.id}-${node.next}`;
            // 如果箭头在隐藏集合中，跳过绘制
            if (hiddenArrows.has(arrowKey)) {
                // console.log("hidden: " + arrowKey)
                return;
            }

            const currentElement = shadowRoot.getElementById(`node-${node.id}`);
            const nextElement = shadowRoot.getElementById(`node-${node.next}`);

            if (currentElement && nextElement) {
                // 创建唯一箭头ID
                const arrowId = `arrow-${node.id}-${node.next}`;
                // 确定箭头坐标
                const currentRect = currentElement.getBoundingClientRect();
                const nextRect = nextElement.getBoundingClientRect();
                const svgContainer = svg.getBoundingClientRect();

                const container = shadowRoot.querySelector('.linked-list');
                const scrollLeft = container ? container.scrollLeft : 0;

                const startX = ((currentRect.right - svgContainer.left + scrollLeft) / scale) ;
                const startY = (currentRect.top + currentRect.height / 2 - svgContainer.top + scrollLeft) / scale;
                const endX = ((nextRect.left - svgContainer.left ) / scale) ;
                const endY = (nextRect.top + nextRect.height / 2 - svgContainer.top) / scale;

                // 绘制箭头
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', startX.toString());
                line.setAttribute('y1', startY.toString());
                line.setAttribute('x2', endX.toString());
                line.setAttribute('y2', endY.toString());
                line.setAttribute('stroke', 'black');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('marker-end', 'url(#arrowhead)');

                // 将箭头显示在页面上
                svg.appendChild(line);
                // 设置箭头ID
                line.setAttribute('id', arrowId);
            }
        });
    }
}

// 链表组件
export class LinkedListComponent2 extends HTMLElement {
    private data: ListNode[] = [];
    private renderer = new LinkedListRendererStrategy();

    private connectorStrategy = new LinkedListConnectorStrategy();
    private svg: SVGSVGElement | null = null;
    private scale: number = 1; // 缩放倍数
    private pointers: Array<{ nodeId: number, label: string, position: 'top' | 'bottom' }> = []; //存储指针Point状态
    private hiddenArrows: Set<string> = new Set(); // 新增成员变量管理隐藏的箭头，存储格式为 "fromId-toId"
    // private pointers: Array<{ nodeId: number, label: string }> = [];

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = this.initializeStyles();
    }

    connectedCallback() {
        // console.log("connectedCallback:")
        // console.log("connectedCallback:", this.isConnected)
        // console.log("connectedCallback:", this.data)
        if (this.isConnected && this.data) {
            //console.log("connectedCallback:", this.data)
            this.renderList();
        }
    }

    public async getHiddenArrows(){
        // 将Set转换为数组，并返回Promise
        return Array.from(this.hiddenArrows);
    }

    //返回一个结点的id
    public async getListNodeID(index: number) {
        return this.data[index].id;
    }

    //返回一个结点的value
    public async getListNodeValue(index: number) {
        return this.data[index].value;
    }

    //返回一个结点的next
    public async getListNodeNext(index: number) {
        return this.data[index].next;
    }

    // 返回一个结点的isNew
    public async getListNodeIsNew(index: number) {
        return this.data[index].isNew;
    }

    // 返回一个结点的isDeleting
    public async getListNodeIsDeleting(index: number) {
        return this.data[index].isDeleting;
    }

    // 返回一个结点的isLast
    public async getListNodeIsLast(index: number) {
        return this.data[index].isLast;
    }

    // 返回一个结点的color
    public async getListNodeColor(index: number) {
        return this.data[index].color;
    }

    // 返回一个结点的isHead
    public async getListNodeIsHead(index: number) {
        return this.data[index].isHead;
    }

    /**
     * 初始化链表
     * @param array 存放所有元素的数组
     * @param isHead 是否存在头节点，默认存在
     */
    public async init(array: Array<any>, isHead: boolean = true) {
        if(isHead){
            const HeadNode: ListNode = {
                id: 0,
                value: '',
                value2:'',
                isNew: true,
                next: null,
                isHead: true,
            };
            // 头节点插入第0个位置
            this.data.splice(0, 0, HeadNode);
            // 头节点占下标为0的位置，元素从1开始
            for (let i = 0 ; i < array.length ; i++) {
                await this.appendNode(i + 1, array[i])
            }
        }else{  // 若无头节点，元素从0开始
            for (let i = 0 ; i < array.length ; i++) {
                await this.appendNode(i, array[i])
            }
        }
        //console.log(this.data)
    }

    /**
     * 在指定位置插入一个节点
     * @param index 插入的位置，同时作为新节点的id
     * @param value 节点的值
     */
    public async appendNode(index: number, value: any) {
        if (index < 0 || index > this.data.length) {
            throw new Error('Invalid index');
        }

        const newNode: ListNode = {
            id: index,
            value,
            value2:'',
            isNew: true,
            next: null,
            isHead: false,
        };

        // 插入新节点到数组的index位置
        this.data.splice(index, 0, newNode);

        // 更新插入位置之后节点的id
        for (let i = index + 1; i < this.data.length; i++) {
            this.data[i].id += 1;
        }

        // 调整所有节点的next值
        for (const node of this.data) {
            if (node.next !== null && node.next >= index) {
                node.next += 1;
            }
        }

        // 处理前驱节点的next指向新节点
        if (index > 0) {
            const prevNode = this.data[index - 1];
            prevNode.next = newNode.id;
        }

        // 设置新节点的next指向原位置的节点（现在后移了一位，id为index + 1）
        if (index < this.data.length - 1) {
            newNode.next = index + 1;
        } else {
            newNode.next = null;
        }

        await this.renderList();
    }

    /**
     * 在指定位置插入一个节点，同时删除其左右节点的箭头
     * @param index 插入的位置，同时作为新节点的id
     * @param value 节点的值
     */
    public async appendNodeAndDeleteArrow(index: number, value: any,value2:any) {
        if (index < 0 || index > this.data.length) {
            throw new Error('Invalid index');
        }

        const newNode: ListNode = {
            id: index,
            value,
            value2,
            isNew: true,
            next: null,
            isHead: false,
        };
        // 插入新节点到数组的index位置
        this.data.splice(index, 0, newNode);

        // 更新插入位置之后节点的id
        for (let i = index + 1; i < this.data.length; i++) {
            this.data[i].id += 1;
        }

        // 调整所有节点的next值
        for (const node of this.data) {
            if (node.next !== null && node.next >= index) {
                node.next += 1;
            }
        }

        // 处理前驱节点的next指向新节点
        if (index > 0) {
            const prevNode = this.data[index - 1];
            const originalPrevNext = prevNode.next;
            prevNode.next = newNode.id;

            // 记录需要隐藏的左侧箭头
            if (originalPrevNext !== null) {
                this.hiddenArrows.add(`${prevNode.id}-${originalPrevNext}`);
            }
            this.hiddenArrows.add(`${prevNode.id}-${newNode.id}`);
        }

        // 处理新节点的next指向
        if (index < this.data.length - 1) {
            newNode.next = index + 1;
            // 记录需要隐藏的右侧箭头
            this.hiddenArrows.add(`${newNode.id}-${newNode.next}`);
        } else {
            newNode.next = null;
        }

        await this.renderList();
    }

    /**
     * 删除指定位置的节点
     * @param index 节点的位置
     */
    public async deleteNode(index: number) {
        if (index < 0 || index >= this.data.length) return;

        this.data[index].isDeleting = true;

        // 生成唯一箭头标识
        const arrowKey1 = `${index}-${index + 1}`;
        const arrowKey2 = `${index - 1}-${index}`;
        //考虑删除appendNodeAndDeleteArrow添加结点的情况
        if(this.data[index].next && this.hiddenArrows.has(arrowKey1)) {
            this.hiddenArrows.delete(arrowKey1);
        }
        if(index > 0 && this.data[index - 1].next && this.hiddenArrows.has(arrowKey2)){
            this.hiddenArrows.delete(arrowKey2);
        }

        //处理删除后整个链表的next与id
        if(index > 0){
            for(let i = index + 1 ; i < this.data.length ; i++) {
                this.data[i].id -= 1;
                if(this.data[i].next !== null){
                    this.data[i].next! -= 1;
                }
            }
            this.data[index - 1].next = this.data[index].id;
        }

        this.data.splice(index, 1);
        // for(let i = 0 ; i < this.data.length ; i++){
        //     console.log("id: " + this.data[i].id)
        // }
        //
        // for(let i = 0 ; i < this.data.length ; i++){
        //     console.log("next: " + this.data[i].next)
        // }
        await this.renderList();
    }

    /**
     * 改变顺序表中指定节点的颜色
     * @param index 节点的 id
     * @param color 新的颜色值（CSS 颜色字符串）
     */
    public async changeNodeColor(index: number, color: string) {
        if (index < 0 || index >= this.data.length) return;
        this.data[index].color = color;
        await this.renderList();
    }

    /**
     * 改变顺序表中指定节点的值
     * @param index 节点的 id
     * @param value 新的值
     */
    // public async changeValue(index: number, value: string) {
    //     if (index < 0 || index >= this.data.length) return;
    //     this.data[index].value = value;
    //     await this.renderList();
    // }
    public async changeValue(index: number, value: string, value2: string) {
        if (index < 0 || index >= this.data.length) return;
        this.data[index].value = value; // 修改第一个值域
        this.data[index].value2 = value2; // 修改第二个值域
        await this.renderList(); // 重新渲染链表
    }


    /**
     * 设置为最后一个节点（指针域加上"^"）
     * @param index 节点ID
     */
    public async createLast(index: number) {
        if (index < 0 || index >= this.data.length) return;
        this.data[index].isLast = true;
        await this.renderList();
    }

    /**
     * 设置不为最后一个节点（指针域删去"^"）
     * @param index 节点ID
     */
    public async deleteLast(index: number) {
        if (index < 0 || index >= this.data.length) return;
        this.data[index].isLast = false;
        await this.renderList();
    }

    /**
     * 绘制指定节点间的箭头
     * @param fromId 起始节点ID
     * @param toId 目标节点ID
     */
    public async createArrow(fromId: number, toId: number): Promise<void> {
        if (!this.svg || !this.shadowRoot) return;

        // 生成唯一箭头标识
        const arrowKey = `${fromId}-${toId}`;
        // 如果存在于隐藏集合则移除
        if (this.hiddenArrows.has(arrowKey)) {
            console.log("arrowKey: " + arrowKey)
            this.hiddenArrows.delete(arrowKey);
        }

        await this.renderList();
    }

    /**
     * 删除指定节点间的箭头
     * @param fromId 起始节点ID
     * @param toId 目标节点ID
     */
    public async deleteArrow(fromId: number, toId: number) {
        if (!this.svg) return;

        // 生成唯一箭头标识
        const arrowKey = `${fromId}-${toId}`;
        this.hiddenArrows.add(arrowKey);

        await this.renderList();
    }

    /**
     * 生成节点指针(在节点下方)
     * @param nodeId 节点ID
     * @param label 显示的标签文本
     */
    public async createBottomPointer(nodeId: number, label: string): Promise<void> {
        // 先删除可能存在的旧指针
        this.deleteBottomPointer(nodeId, label);
        // 保存指针信息
        this.pointers.push({ nodeId, label, position: 'bottom' });

        if (!this.shadowRoot) return;

        const container = this.shadowRoot.getElementById(`container-${nodeId}`);
        if (!container) return;

        // 创建指针容器
        const pointerContainer = document.createElement('div');
        pointerContainer.className = 'pointer-container';
        pointerContainer.id = `pointer-${nodeId}-${label}`;

        // 创建指针线
        const pointerLine = document.createElement('div');
        pointerLine.className = 'pointer-line';

        // 创建标签
        const labelElement = document.createElement('div');
        labelElement.className = 'pointer-label';
        labelElement.textContent = label;

        // 组装元素
        pointerContainer.appendChild(pointerLine);
        pointerContainer.appendChild(labelElement);
        container.appendChild(pointerContainer);
    }

    /**
     * 删除节点指针（在节点下方）
     * @param nodeId 节点ID
     * @param label 要删除的指针标签
     */
    public deleteBottomPointer(nodeId: number, label: string): void {
        if (!this.shadowRoot) return;

        const pointer = this.shadowRoot.getElementById(`pointer-${nodeId}-${label}`);
        pointer?.remove();

        // 从数组中移除记录
        this.pointers = this.pointers.filter(p => !(p.nodeId === nodeId && p.label === label && p.position === 'bottom'));
    }

    /**
     * 生成节点指针(在节点上方)
     * @param nodeId 节点ID
     * @param label 显示的标签文本
     */
    public createTopPointer(nodeId: number, label: string): void {
        this.deleteTopPointer(nodeId, label);
        this.pointers.push({ nodeId, label, position: 'top' });

        if (!this.shadowRoot) return;

        const container = this.shadowRoot.getElementById(`container-${nodeId}`);
        if (!container) return;

        const pointerContainer = document.createElement('div');
        pointerContainer.className = 'top-pointer-container';
        pointerContainer.id = `top-pointer-${nodeId}-${label}`;

        const pointerLine = document.createElement('div');
        pointerLine.className = 'top-pointer-line';

        const labelElement = document.createElement('div');
        labelElement.className = 'top-pointer-label';
        labelElement.textContent = label;

        pointerContainer.appendChild(labelElement);
        pointerContainer.appendChild(pointerLine);
        container.appendChild(pointerContainer);
    }


    public createTopPointer2(nodeId: number, label: string): void {
        this.deleteTopPointer(nodeId, label);
        this.pointers.push({ nodeId, label, position: 'top' });

        if (!this.shadowRoot) return;

        const container = this.shadowRoot.getElementById(`container-${nodeId}`);
        if (!container) return;

        const pointerContainer = document.createElement('div');
        pointerContainer.className = 'top-pointer2-container';
        pointerContainer.id = `top-pointer-${nodeId}-${label}`;

        const pointerLine = document.createElement('div');
        pointerLine.className = 'top-pointer-line';

        const labelElement = document.createElement('div');
        labelElement.className = 'top-pointer-label';
        labelElement.textContent = label;

        pointerContainer.appendChild(labelElement);
        pointerContainer.appendChild(pointerLine);
        container.appendChild(pointerContainer);
    }

    /**
     * 删除节点指针（在节点下方）
     * @param nodeId 节点ID
     * @param label 要删除的指针标签
     */
    public deleteTopPointer(nodeId: number, label: string): void {
        if (!this.shadowRoot) return;

        const pointer = this.shadowRoot.getElementById(`top-pointer-${nodeId}-${label}`);
        pointer?.remove();

        this.pointers = this.pointers.filter(p => !(p.nodeId === nodeId && p.label === label && p.position === 'top'));
    }

    private renderList(): void {
        if (!this.shadowRoot || !this.data) return;

        const container = this.shadowRoot.querySelector('.container')!;
        container.innerHTML = this.renderer.render(this.data);

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.style.position = 'absolute';
        this.svg.style.top = '0';
        this.svg.style.left = '0';
        this.svg.style.width = '500%';
        this.svg.style.height = '100%';
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
            this.connectorStrategy.drawConnectors(this.data, this.svg!, this.shadowRoot!, this.scale, this.hiddenArrows);

            this.restorePointers(); // 渲染后恢复指针
        });
    }

    private initializeStyles(): string {
        return `
            <style>
                .pointer-container {
                    position: absolute;
                    bottom: -65px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 1;
                }

                .pointer-line {
                    width: 4px;
                    height: 60px;
                    background-color: black;
                    position: relative;
                }

                .pointer-line::after {
                    content: '';
                    position: absolute;
                    top: -5px;
                    left: -3.2px;
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-bottom: 8px solid black;
                }

                .pointer-label {
                    position: absolute;
                    bottom: -38px;
                    left: -8px;
                    white-space: nowrap;
                    color: black;
                    font-size: 27px;
                    /*background: white;*/
                    padding: 2px 5px;
                    border-radius: 3px;
                    /*box-shadow: 0 2px 4px rgba(0,0,0,0.2);*/
                }
                


                 .top-pointer-container {
                    position: absolute;
                    top: -65px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 1;
                }
                .top-pointer2-container {
                    position: absolute;
                    top: -65px;
                    left: 88%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 1;
                }
                
                .top-pointer-line {
                    width: 4px;
                    height: 60px;
                    background-color: black;
                    position: relative;
                }
                
                .top-pointer-line::after {
                    content: '';
                    position: absolute;
                    bottom: -7px;
                    left: -3px;
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 8px solid black;
                }
                
                .top-pointer-label {
                    position: absolute;
                    bottom: 55px;
                    left: 3px;
                    transform: translateX(-50%);
                    white-space: nowrap;
                    color: black;
                    font-size: 27px;
                    /*background: white;*/
                    padding: 2px 5px;
                    border-radius: 3px;
                    /*box-shadow: 0 2px 4px rgba(0,0,0,0.2);*/
                }
                .node {
                    transition: transform 0.001ms ease, opacity 0.001ms ease;
                }
                .new-node {
                    opacity: 0;
                    transform: scale(0.8);
                    animation: fadeIn 0.001ms ease-out forwards;
                }
                
                .deleting {
                    animation: shrink 0.001ms ease-in forwards;
                }

                @keyframes fadeIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                @keyframes shrink {
                    to { transform: scale(0); opacity: 0; }
                }

                svg {
                    pointer-events: none;
                }
                               
            </style>
            <div class="container" style="position: relative; min-width: 1000px;"></div>
        `;
    }

    //设置缩放倍数，在common中调用
    public setScale(scale: number) {
        this.scale = scale;
    }

    /**
     * 恢复所有保存的指针
     */
    private restorePointers(): void {
        // 遍历所有指针信息并重新创建
        this.pointers.forEach(({ nodeId, label, position }) => {
            const nodeExists = this.data.some(node => node.id === nodeId);
            if (nodeExists) {
                if (position === 'bottom') {
                    this.createBottomPointer(nodeId, label);
                } else {
                    this.createTopPointer(nodeId, label);
                }
            } else {
                // 若节点不存在，移除此指针记录
                this.pointers = this.pointers.filter(p => !(p.nodeId === nodeId && p.label === label && p.position === position));
            }
        });
    }

    // 在LinkedListComponent类中添加以下方法
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

        this.renderList();
    }
}

if (!customElements.get('linked-list2')) {
    customElements.define('linked-list2', LinkedListComponent2);
}