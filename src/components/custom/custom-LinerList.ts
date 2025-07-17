interface ListNode {
    id: number;
    value: any;
    next: number | null;
    isNew?: boolean;
    isDeleting?: boolean;
    isLast?: boolean;
    color?: string;
    isHead: boolean; //是否为头节点
}

// 链表渲染策略
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
                             style="width: 140px; height: 60px; border: 1px solid black; 
                                    background-color: ${node.color || '#CCFFCC'}; 
                                    display: flex; position: relative;">
                            <div style="flex: 7; border-right: 1px solid black; font-size: 25px;
                                 display: flex; align-items: center; justify-content: center; background-color: ${node.isHead ? 'grey' : ''}" id="value-${node.id}">
                                ${node.value}
                            </div>
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
export class LinkedListComponent extends HTMLElement {
    private data: ListNode[] = [];
    private renderer = new LinkedListRendererStrategy();
    private connectorStrategy = new LinkedListConnectorStrategy();
    private svg: SVGSVGElement | null = null;
    private scale: number = 1; // 缩放倍数
    private pointers: Array<{ nodeId: number, label: string, position: 'top' | 'bottom' }> = []; //存储指针Point状态
    private hiddenArrows: Set<string> = new Set(); // 新增成员变量管理隐藏的箭头，存储格式为 "fromId-toId"
    // private pointers: Array<{ nodeId: number, label: string }> = [];
    private customArrows: Set<string> = new Set();
    private arrows: { fromId: number; toId: number }[] = [];

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

        const valueElement = this.shadowRoot?.getElementById(`container-${index}`);
        if (valueElement) {
            valueElement.classList.add('value-change');
            // 动画结束后移除类
            setTimeout(() => {
                valueElement.classList.remove('value-change');
            }, 500);
        }
    }

    /**
     * 在指定位置插入一个节点，同时删除其左右节点的箭头
     * @param index 插入的位置，同时作为新节点的id
     * @param value 节点的值
     */
    public async appendNodeAndDeleteArrow(index: number, value: any) {
        if (index < 0 || index > this.data.length) {
            throw new Error('Invalid index');
        }

        const newNode: ListNode = {
            id: index,
            value,
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

        const valueElement = this.shadowRoot?.getElementById(`container-${index}`);
        if (valueElement) {
            valueElement.classList.add('value-change');
            // 动画结束后移除类
            setTimeout(() => {
                valueElement.classList.remove('value-change');
            }, 500);
        }
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
    public async changeValue(index: number, value: string) {
        // if (index < 0 || index >= this.data.length) return;
        // this.data[index].value = value;
        // await this.renderList();
        if (index < 0 || index >= this.data.length) return;
        this.data[index].value = value;
        await this.renderList(); // 等待渲染完成

        const nodeId = this.data[index].id;
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

    public async deleteArrow(fromId: number, toId: number): Promise<void> {
        // 仅允许删除相邻节点的普通箭头
        if (Math.abs(fromId - toId) !== 1) {
            throw new Error("deleteArrow 仅用于相邻节点的普通箭头");
        }

        const arrowKey = `${fromId}-${toId}`;
        this.hiddenArrows.add(arrowKey);
        await this.renderList();
    }
    /**
     * 绘制指定非相邻节点间的箭头
     * @param fromId 起始节点ID
     * @param toId 目标节点ID
     */
    public async createCurveArrow(fromId: number, toId: number): Promise<void> {

        const fromNode = this.data.find(node => node.id === fromId);
        const toNode = this.data.find(node => node.id === toId);
        if (!fromNode || !toNode) {
            console.error("起始节点或目标节点不存在");
            return;
        }

        // 删除可能存在的旧箭头
        await this.deleteCurveArrow(fromId, toId);

        // 确保 SVG 容器已初始化
        if (!this.svg) {
            console.error("SVG 容器未初始化");
            return;
        }

        // 获取起始节点和目标节点的容器
        const fromContainer = this.shadowRoot!.getElementById(`container-${fromId}`);
        const toContainer = this.shadowRoot!.getElementById(`container-${toId}`);
        if (!fromContainer || !toContainer) {
            console.error("节点容器未找到");
            return;
        }

        // 强制触发布局计算，确保坐标准确
        fromContainer.getBoundingClientRect();
        toContainer.getBoundingClientRect();
        // 先删除可能存在的旧箭头
        // this.deleteCurveArrow(fromId, toId);
        const arrowKey = `${fromId}-${toId}`;

        // 如果箭头已存在，先删除旧箭头
        if (this.customArrows.has(arrowKey)) {
            await this.deleteCurveArrow(fromId, toId);
        }
        // 保存新箭头信息
        this.customArrows.add(arrowKey);

        if (!this.shadowRoot || !this.svg) return;


        // 计算节点坐标
        const fromRect = fromContainer.getBoundingClientRect();
        const toRect = toContainer.getBoundingClientRect();

        // 计算缩放和滚动偏移
        const container = this.shadowRoot.querySelector('.linked-list');
        const scrollLeft = container ? container.scrollLeft : 0;

        // 计算起点和终点的相对坐标
        const rect = this.svg.getBoundingClientRect();
        const startX = (fromRect.right - rect.left + scrollLeft) / this.scale;
        const startY = (fromRect.top + fromRect.height / 2 - rect.top) / this.scale;

        // 将目标节点的 endY 设置为节点的中间，并稍微调整避免重叠
        const endX = (toRect.left - rect.left) / this.scale;
        let endY = (toRect.top + toRect.height / 2 - rect.top) / this.scale; // 中间位置

        // 增加偏移量，确保箭头不被目标节点覆盖
        const offset = 35; // 增加偏移值，避免与目标节点重叠
        endY -= offset; // 向上偏移，避免箭头覆盖

        // 动态计算控制点偏移量
        const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2); // 计算节点之间的距离
        const controlOffset = distance * 0.2; // 根据距离动态调整偏移量

        // 计算控制点（形成三次贝塞尔曲线）
        const controlX1 = startX + (endX - startX) * 0.25; // 第一个控制点的 X 坐标
        const controlY1 = startY - controlOffset; // 第一个控制点的 Y 坐标（向上偏移）
        const controlX2 = endX - (endX - startX) * 0.25; // 第二个控制点的 X 坐标
        const controlY2 = endY - controlOffset; // 第二个控制点的 Y 坐标（向上偏移）

        // 进一步微调终点 Y 位置，确保箭头指向目标节点的正中央且不被覆盖
        endY = (toRect.top + toRect.height / 2 - rect.top) / this.scale;

        // 再次增加偏移，确保不被目标节点覆盖
        endY -= offset; // 向上偏移

        // 创建SVG路径（线）
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute(
            'd',
            `M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`
        );
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('id', `curve-arrow-line-${fromId}-${toId}`);

        // 创建SVG箭头标记
        const arrowMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        arrowMarker.setAttribute('id', `arrowhead-${fromId}-${toId}`);
        arrowMarker.setAttribute('markerWidth', '15'); // 增加宽度
        arrowMarker.setAttribute('markerHeight', '10'); // 增加高度
        arrowMarker.setAttribute('refX', '12'); // 调整定位点
        arrowMarker.setAttribute('refY', '5'); // 调整定位点
        arrowMarker.setAttribute('orient', 'auto');
        const arrowPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        arrowPolygon.setAttribute('points', '0 0, 15 5, 0 10');
        arrowPolygon.setAttribute('fill', '#666');
        arrowMarker.appendChild(arrowPolygon);

        // 将箭头标记添加到SVG的 <defs> 中
        let defs = this.svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            this.svg.appendChild(defs);
        }
        defs.appendChild(arrowMarker);

        // 将路径的 marker-end 属性指向箭头标记
        path.setAttribute('marker-end', `url(#arrowhead-${fromId}-${toId})`);

        // 添加路径到SVG
        this.svg.appendChild(path);

        // 调整SVG容器的尺寸
        this.svg.style.width = '100%'; // 宽度设置为 100%
        this.svg.style.height = `${Math.max(fromRect.bottom, toRect.bottom) - Math.min(fromRect.top, toRect.top) + 200}px`; // 动态计算高度
        this.svg.style.overflow = 'visible'; // 确保内容不会被裁剪
    }


    public async deleteCurveArrow(fromId: number, toId: number): Promise<void> {
        const arrowKey = `${fromId}-${toId}`;

        // 删除 SVG 路径
        const pathId = `curve-arrow-line-${fromId}-${toId}`;
        const pathElement = this.svg?.getElementById(pathId);
        if (pathElement) pathElement.remove();

        // 删除箭头标记
        const markerId = `arrowhead-${fromId}-${toId}`;
        const markerElement = this.svg?.querySelector(`#${markerId}`);
        if (markerElement) markerElement.remove();

        // 从集合中移除
        this.customArrows.delete(arrowKey);
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

    private async renderList(): Promise<void> {
        if (!this.shadowRoot || !this.data) return;

        const container = this.shadowRoot.querySelector('.container')!;
        container.innerHTML = this.renderer.render(this.data);

        // 创建 SVG 容器
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

        // 使用 Promise 确保渲染完成
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                this.connectorStrategy.drawConnectors(this.data, this.svg!, this.shadowRoot!, this.scale, this.hiddenArrows);
                this.restorePointers();
                this.restoreCurveArrow();
                resolve();
            });
        });
    }

    private initializeStyles(): string {
        return `
            <style>
                /* 添加值变化动画 */
                @keyframes valueChange {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                .value-change {
                    animation: valueChange 0.5s ease-in-out;
                }
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
                    left: 55%;
                    transform: translateX(-50%);
                    background-color: black;
                    position: relative;
                }

                .pointer-line::after {
                    content: '';
                    position: absolute;
                    top: -5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-bottom: 8px solid black;
                }

                .pointer-label {
                    position: absolute;
                    bottom: -38px;
                    left: 50%;
                    transform: translateX(-50%);
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
                
                .top-pointer-line {
                    width: 4px;
                    height: 60px;
                    left: 55%;
                    transform: translateX(-50%);
                    background-color: black;
                    position: relative;
                }
                
                .top-pointer-line::after {
                    content: '';
                    position: absolute;
                    bottom: -7px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 8px solid black;
                }
                
                .top-pointer-label {
                    position: absolute;
                    bottom: 55px;
                    left: 50%;
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
            hiddenArrows: Array.from(this.hiddenArrows), // 转换为数组
            customArrows: Array.from(this.customArrows), // 新增：保存曲线箭头信息
        };
    }
    private restoreCurveArrow(): void {
        // 再重新绘制所有曲线箭头（确保 DOM 已更新）
        this.customArrows.forEach(arrow => {
            const [fromId, toId] = arrow.split('-');
            this.createCurveArrow(Number(fromId), Number(toId));
        });
    }

    public async restoreState(state: any) {
        // 恢复基础状态
        this.data = state.data;
        this.pointers = state.pointers;
        this.hiddenArrows = new Set(state.hiddenArrows);
        this.customArrows = new Set(state.customArrows || []);

        // 清空 SVG 容器
        if (this.svg) this.svg.innerHTML = '';

        // 先渲染链表结构
        await this.renderList();


    }

}

//顺序表
interface SequentialListData {
    nodes: Array<{
        id: number; //节点id，也代表该节点在顺序表中的位置
        value: any;
        isNew?: boolean;
        isDeleting?: boolean;
        color?: string;
    }>;
    isIndex: boolean;
    isStartWith1?: boolean;
}

// 顺序表渲染策略
class SequentialRendererStrategy {
    render(data: SequentialListData): string {
        const hasNodes = data.nodes.length > 0 && data.isIndex;
        const indexLabel = hasNodes ?
            `<div class="index-label" style="width: 80px; font-size: 25px; position: relative; top:65px;
                 height: 50px; display: flex; align-items: center; justify-content: center;">
                <span>下标</span>
             </div>` : '';

        return `
            <div class="sequential-list" style="display: flex; padding: 20px; align-items: flex-start;">
                ${indexLabel}
                ${data.nodes.map(node => `
                    <div class="node-container" style="display: flex; flex-direction: column; align-items: center;"
                         id="container-${node.id}">
                        <div class="node${node.isNew ? ' new-node' : ''}${node.isDeleting ? ' deleting' : ''}" 
                             id="node-${node.id}" 
                             style="width: 80px; height: 60px; border: 2px solid #666; 
                                    background-color: ${node.color || '#CCFFCC'}; 
                                    display: flex; flex-direction: column; align-items: center; 
                                    justify-content: center; position: relative;">
                            <span style="font-size: 25px">${node.value}</span>
                            <div class="index" style="position: absolute; bottom: -50px;
                                 font-size: 25px; color: black;">${data.isIndex ? (data.isStartWith1 ? data.nodes.indexOf(node)+1 : data.nodes.indexOf(node)) : '' }</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// 顺序表组件
class SequentialListComponent extends HTMLElement {
    private data: SequentialListData = { nodes: [], isIndex: true};
    private renderer = new SequentialRendererStrategy();
    private pointers: Array<{ nodeId: number, label: string, position: 'top' | 'bottom' }> = [];

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = this.initializeStyles();
        this.renderList();
    }

    /**
     * 设置是否显示下标
     * @param isIndex 是否显示下标
     */
    public async setIsIndex(isIndex: boolean) {
        this.data.isIndex = isIndex;
    }
    /**
     * 设置下标是否从1开始
     * @param isStartWith1 设置下标是否从1开始
     */
    public async setIsStartWith1(isStartWith1: boolean) {
        this.data.isStartWith1 = isStartWith1;
    }
    /**
     * 初始化顺序表
     * @param array 存放所有元素的数组
     */
    public async init(array: Array<any>) {
        for (let i = 0 ; i < array.length ; i++) {
            await this.insert(i, array[i])
        }
    }

    /**
     * 在指定位置插入一个节点
     * @param index 插入的位置，同时作为新节点的id
     * @param value 节点的值
     */
    public async insert(index: number, value: any) {
        const newNode = {
            id: index,
            value,
            isNew: true
        };

        //新节点后的所有节点ID加1
        this.data.nodes.forEach(
            node => {
                if(node.id >= newNode.id){
                    node.id =  node.id + 1;
                }
            }
        )

        this.data.nodes.splice(index, 0, newNode);
        await this.renderList();

        // 触发重排以应用动画
        this.shadowRoot!.querySelectorAll('.node').forEach(node => {
            node.getBoundingClientRect();
        });
    }

    /**
     * 删除指定位置的节点
     * @param index 节点的位置
     */
    public async delete(index: number) {
        if (index < 0 || index >= this.data.nodes.length) return;

        this.data.nodes[index].isDeleting = true;

        //处理id
        for(let i = index + 1 ; i < this.data.nodes.length ; i++){
            this.data.nodes[i].id--;
        }

        this.data.nodes.splice(index, 1);
        await this.renderList();
    }

    /**
     * 改变顺序表中指定节点的颜色
     * @param index 节点的 id
     * @param color 新的颜色值（CSS 颜色字符串）
     */
    public async changeColor(index: number, color: string) {
        if (index < 0 || index >= this.data.nodes.length) return;

        this.data.nodes[index].color = color;
        await this.renderList();
    }

    /**
     * 生成节点指针(在节点下方)
     * @param nodeId 节点ID
     * @param label 显示的标签文本
     */
    public async createBottomPointer(nodeId: number, label: string): Promise<void> {
        this.deleteBottomPointer(nodeId, label);
        this.pointers.push({ nodeId, label, position: 'bottom' });

        if (!this.shadowRoot) return;

        const container = this.shadowRoot.getElementById(`container-${nodeId}`);
        if (!container) return;

        const pointerContainer = document.createElement('div');
        pointerContainer.className = 'pointer-container';
        pointerContainer.id = `pointer-${nodeId}-${label}`;

        const pointerLine = document.createElement('div');
        pointerLine.className = 'pointer-line';

        const labelElement = document.createElement('div');
        labelElement.className = 'pointer-label';
        labelElement.textContent = label;

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

    /**
     * 删除节点指针（在节点上方）
     * @param nodeId 节点ID
     * @param label 要删除的指针标签
     */
    public deleteTopPointer(nodeId: number, label: string): void {
        if (!this.shadowRoot) return;

        const pointer = this.shadowRoot.getElementById(`top-pointer-${nodeId}-${label}`);
        pointer?.remove();

        this.pointers = this.pointers.filter(p => !(p.nodeId === nodeId && p.label === label && p.position === 'top'));
    }

    /**
     * 改变顺序表中指定节点的值
     * @param index 节点的 id
     * @param value 新的值
     */
    public async changeValue(index: number, value: string) {
        if (index < 0 || index >= this.data.nodes.length) return;

        this.data.nodes[index].value = value;
        await this.renderList();
        // if (index < 0 || index >= this.data.nodes.length) return;
        //
        // this.data.nodes[index].value = value;
        // await this.renderList();
        //
        // const nodeId = this.data.nodes[index].id;
        // const valueElement = this.shadowRoot?.getElementById(`container-${nodeId}`);
        // if (valueElement) {
        //     valueElement.classList.remove('value-change');
        //     void valueElement.offsetWidth; // 触发重绘
        //     valueElement.classList.add('value-change');
        //     setTimeout(() => {
        //         valueElement.classList.remove('value-change');
        //     }, 500);
        // }
    }

    /**
     * 恢复index为起点的结点的颜色
     * @param index 节点的 id
     */
    public async reStoreNodeColor(index :number){
        for(let i= index ; i < this.data.nodes.length ; i++){
            this.data.nodes[i].color = '#CCFFCC'
        }
    }

    private renderList() {
        if (!this.shadowRoot) return;

        const container = this.shadowRoot.querySelector('.sequential-container')!;
        container.innerHTML = this.renderer.render(this.data);

        this.restorePointers()
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
                /* 新增指针样式 */
                .pointer-container {
                    position: absolute;
                    bottom: -110px;
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
                    left: 55%;
                    transform: translateX(-50%);
                    background-color: black;
                    position: relative;
                }

                .pointer-line::after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    top: -5px;
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-bottom: 8px solid black;
                }

                .pointer-label {
                    position: absolute;
                    bottom: -38px;
                    left: 50%;
                    transform: translateX(-50%);
                    white-space: nowrap;
                    color: black;
                    font-size: 27px;
                    padding: 2px 5px;
                }

                .top-pointer-container {
                    position: absolute;
                    top: -70px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 1;
                }

                .top-pointer-line {
                    width: 4px;
                    height: 60px;
                    left: 55%;
                    transform: translateX(-50%);
                    background-color: black;
                    position: relative;
                }

                .top-pointer-line::after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: -7px;
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 8px solid black;
                }

                .top-pointer-label {
                    position: absolute;
                    bottom: 55px;
                    left: 50%;
                    transform: translateX(-50%);
                    white-space: nowrap;
                    color: black;
                    font-size: 27px;
                    padding: 2px 5px;
                }

                .node-container {
                    overflow: visible !important;
                    contain: layout style;
                    position: relative;
                }
            
                .new-node {
                    opacity: 0;
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
            </style>
            <div class="sequential-container"></div>
        `;
    }

    private restorePointers(): void {
        this.pointers.forEach(({ nodeId, label, position }) => {
            const nodeExists = this.data.nodes.some(node => node.id === nodeId);
            if (nodeExists) {
                if (position === 'bottom') {
                    this.createBottomPointer(nodeId, label);
                } else {
                    this.createTopPointer(nodeId, label);
                }
            } else {
                this.pointers = this.pointers.filter(p => !(p.nodeId === nodeId && p.label === label && p.position === position));
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
        this.renderList();
    }
}


// 注册自定义元素
if (!customElements.get('sequential-list')) {
    customElements.define('sequential-list', SequentialListComponent);
}

if (!customElements.get('linked-list')) {
    customElements.define('linked-list', LinkedListComponent);
}