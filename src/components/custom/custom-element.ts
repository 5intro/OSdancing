interface TreeDataNode {
    id: number;
    name: string;
    children: TreeDataNode[];
    parentId?: number | null;
    isNew?: boolean; // 默认为 false
    isDeleting?: boolean; // 默认为 false
    color?: string;
    isRight?: boolean;
}

interface arrowPoint {
    id: string;
    nodeId: number;
    text?: string;
    towards?: 'top' | 'bottom' | 'left' | 'right';
    length?: number;
}

interface DashedLine {
    startId: number;
    endId: number;
    color?: string;
    id?: string;
}

// 删除节点动画策略（新增）
class DeleteAnimationStrategy {
    animateDeletion(node: TreeDataNode, nodeElement: HTMLElement): Promise<void> {
        return new Promise<void>((resolve) => {
            // 添加动画类
            nodeElement.classList.add('deleting');

            // 等待动画完成
            setTimeout(() => {
                resolve();
            }, 100); // 动画时长
        });
    }
}

// 修改 TreeRendererStrategy 以支持动画类
class TreeRendererStrategy {
    renderTreeNode(node: TreeDataNode, level: number = 0, isSmallerHorizontalSpacing: boolean): string {
        const nodeSize = 60;
        const horizontalSpacing = isSmallerHorizontalSpacing ? 15 : 30;
        const verticalSpacing = 10;
        const newNodeClass = node.isNew ? ' new-node' : '';
        const deletingClass = node.isDeleting ? ' deleting' : ''; // 新增

        let childrenHTML = '';
        node.children.forEach(child => {
            childrenHTML += this.renderTreeNode(child, level + 1, isSmallerHorizontalSpacing);
        });

        return `
            <div class="node${newNodeClass}${deletingClass}" id="node-${node.id}" style="display: flex; flex-direction: column; 
            align-items: center; position: relative; margin-${node.isRight ? 'left' : 'right'}: ${level * horizontalSpacing}px;">
                <div class="circle" style="width: ${nodeSize}px; height: ${nodeSize}px; border-radius: 50%; 
                font-size: 25px;
                border: 1px solid black;
                background-color: ${node.color || '#99CC99'}; display: flex; justify-content: center; align-items: center; margin: ${verticalSpacing}px 0;">
                    ${node.name}
                </div>
                <div class="content" style="margin-top: ${verticalSpacing}px;"></div>
                <div class="children" style="display: flex; justify-content: center; margin: ${verticalSpacing}px 0;">
                    ${childrenHTML}
                </div>
            </div>
        `;
    }
}

// 策略：绘制连接线
class ConnectorRendererStrategy {
    drawConnectors(node: TreeDataNode, nodeMap: Map<number, HTMLElement>, svg: SVGSVGElement, scale: number, arrowPoints: arrowPoint[], dashedLines: DashedLine[] ): void {
        node.children.forEach(child => {
            const parentElement = nodeMap.get(node.id as number);
            const currentElement = nodeMap.get(child.id as number);

            if (parentElement && currentElement) {
                const parentCircle = parentElement.querySelector('.circle') as HTMLElement;
                const currentCircle = currentElement.querySelector('.circle') as HTMLElement;

                const parentRect = parentCircle.getBoundingClientRect();
                const currentRect = currentCircle.getBoundingClientRect();
                const svgContainer = svg.getBoundingClientRect();

                const parentCenterX = (parentRect.left + parentRect.width / 2 - svgContainer.left) / scale;
                const parentCenterY = (parentRect.top + parentRect.height / 2 - svgContainer.top) / scale;
                const currentCenterX = (currentRect.left + currentRect.width / 2 - svgContainer.left) / scale;
                const currentCenterY = (currentRect.top + currentRect.height / 2 - svgContainer.top) / scale;

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', parentCenterX.toString());
                line.setAttribute('y1', parentCenterY.toString());
                line.setAttribute('x2', currentCenterX.toString());
                line.setAttribute('y2', currentCenterY.toString());
                line.setAttribute('stroke', 'black');
                line.setAttribute('stroke-width', '2');
                line.style.strokeLinecap = 'round';

                svg.appendChild(line);

                if (child.isNew) {
                    const totalLength = line.getTotalLength();
                    line.style.strokeDasharray = `${totalLength}px`;
                    line.style.strokeDashoffset = `${totalLength}px`;
                    line.style.animation = `drawLine 2s forwards`;
                }
            }

            this.drawConnectors(child, nodeMap, svg, scale, arrowPoints, dashedLines);
        });

        // 新增箭头绘制
        if(arrowPoints.length > 0){
            arrowPoints.forEach(point => {
                const nodeElement = nodeMap.get(point.nodeId);
                if (!nodeElement) return;

                const circle = nodeElement.querySelector('.circle') as HTMLElement;
                const containerRect = svg.getBoundingClientRect();
                const nodeRect = circle.getBoundingClientRect();
                const nodeSize = nodeRect.width;

                // 计算节点边缘坐标（基于60px节点直径）
                const nodeCenterX = (nodeRect.left + nodeRect.width / 2 - containerRect.left) / scale;
                const nodeCenterY = (nodeRect.top + nodeRect.height / 2 - containerRect.top) / scale;
                const radius = nodeSize / 2 / scale; // 节点半径

                // 根据方向计算箭头终点（指向节点边缘）
                let endX = nodeCenterX;
                let endY = nodeCenterY;
                let startX = endX;
                let startY = endY;
                const length = point.length || 50;

                switch (point.towards) {
                    case 'top':
                        endY -= radius;
                        startY = endY - length;
                        break;
                    case 'bottom':
                        endY += radius;
                        startY = endY + length;
                        break;
                    case 'left':
                        endX -= radius;
                        startX = endX - length;
                        break;
                    case 'right':
                        endX += radius;
                        startX = endX + length;
                        break;
                }

                // 绘制从外部指向节点的箭头
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', startX.toString());
                line.setAttribute('y1', startY.toString());
                line.setAttribute('x2', endX.toString());
                line.setAttribute('y2', endY.toString());
                line.setAttribute('stroke', 'black');
                line.setAttribute('marker-end', 'url(#arrowhead)'); // 箭头在终点（节点边缘）

                // 添加文字标签（放在箭头中间位置）
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                const textX = (startX + endX) / 2;
                const textY = (startY + endY) / 2;

                // 根据方向调整文字偏移
                switch (point.towards) {
                    case 'right':
                        text.setAttribute('dy', '-0.5em');
                        break;
                    case 'left':
                        text.setAttribute('dy', '-0.5em');
                        break;
                    case 'top':
                        text.setAttribute('dx', '-0.5em');
                        break;
                    case 'bottom':
                        text.setAttribute('dx', '-0.5em');
                        break;
                }

                text.setAttribute('x', textX.toString());
                text.setAttribute('y', textY.toString());
                text.setAttribute('font-size', '25px');
                text.setAttribute('text-anchor', 'middle');
                text.textContent = point.text || '';

                svg.appendChild(line);
                svg.appendChild(text);
            });
        }

        //虚线绘制
        if(dashedLines.length > 0){
            dashedLines.forEach(line => {
                const startElement = nodeMap.get(line.startId);
                const endElement = nodeMap.get(line.endId);

                if (startElement && endElement) {
                    const startCircle = startElement.querySelector('.circle') as HTMLElement;
                    const endCircle = endElement.querySelector('.circle') as HTMLElement;

                    const startRect = startCircle.getBoundingClientRect();
                    const endRect = endCircle.getBoundingClientRect();
                    const svgContainer = svg.getBoundingClientRect();

                    // 计算连接线起点和终点（从起始节点边缘到目标节点边缘）
                    const startCenterX = (startRect.left + startRect.width/2 - svgContainer.left) / scale;
                    const startCenterY = (startRect.top + startRect.height/2 - svgContainer.top) / scale;
                    const endCenterX = (endRect.left + endRect.width/2 - svgContainer.left) / scale;
                    const endCenterY = (endRect.top + endRect.height/2 - svgContainer.top) / scale;

                    // 计算方向向量
                    const dx = endCenterX - startCenterX;
                    const dy = endCenterY - startCenterY;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    const radius = 30 / scale; // 节点半径

                    // 调整起点和终点到节点边缘
                    const startX = startCenterX + (dx/distance)*radius;
                    const startY = startCenterY + (dy/distance)*radius;
                    const endX = endCenterX - (dx/distance)*radius;
                    const endY = endCenterY - (dy/distance)*radius;

                    const dashedLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    dashedLine.setAttribute('x1', startX.toString());
                    dashedLine.setAttribute('y1', startY.toString());
                    dashedLine.setAttribute('x2', endX.toString());
                    dashedLine.setAttribute('y2', endY.toString());
                    dashedLine.setAttribute('stroke', line.color || 'black');
                    dashedLine.setAttribute('stroke-width', '1.5');
                    dashedLine.setAttribute('stroke-dasharray', '1 5');

                    svg.appendChild(dashedLine);
                }
            });
        }
    }
}

export class MyTreeComponent extends HTMLElement {
    private treeData: TreeDataNode | null = null;
    private svg: SVGSVGElement | null = null;
    private scale: number = 1; // 缩放倍数
    private rendererStrategy: TreeRendererStrategy = new TreeRendererStrategy();
    private connectorStrategy: ConnectorRendererStrategy = new ConnectorRendererStrategy();
    private deleteAnimationStrategy: DeleteAnimationStrategy = new DeleteAnimationStrategy(); // 新增
    private arrowPoints: Array<arrowPoint> = []; // 新增箭头点存储
    private dashedLines: DashedLine[] = []; //虚线存储
    private isSmallerHorizontalSpacing: boolean = false;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = this.initializeStyles();
    }

    connectedCallback() {
        if (this.isConnected && this.treeData) {
            this.renderTree();
        }
    }

    public async setIsSmallerHorizontalSpacing(isSmallerHorizontalSpacing: boolean) {
        this.isSmallerHorizontalSpacing = isSmallerHorizontalSpacing;
    }

    public pause(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public async deleteLeafNode(leafId: number, force: boolean = false): Promise<boolean> {
        if (!this.treeData) return false;

        const leafNode = this.findNodeById(this.treeData, leafId);
        if (!leafNode) return false;

        if (!force && leafNode.children.length > 0) {
            return false;
        }

        // 标记节点为正在删除
        leafNode.isDeleting = true;

        // 找到父节点
        const parentNode = this.findParentNode(this.treeData!, leafNode.parentId!);
        if (!parentNode) {
            return false;
        }

        // 移除节点
        parentNode.children = parentNode.children.filter(child => child.id !== leafNode.id);

        // 获取节点对应的 DOM 元素
        const nodeElement = this.shadowRoot!.querySelector(`#node-${leafId}`) as HTMLElement;
        await this.deleteAnimationStrategy.animateDeletion(leafNode, nodeElement);

        // 重新渲染树
        await this.setTreeData(this.treeData as TreeDataNode);

        // 强制重新绘制连线
        requestAnimationFrame(() => {
            this.drawConnectors();
        });

        return true;
    }

    private findParentNode(node: TreeDataNode, targetId: number): TreeDataNode | undefined {
        if (node.id === targetId) return node;
        for (const child of node.children) {
            const found = this.findParentNode(child, targetId);
            if (found) return found;
        }
        return undefined;
    }

    public setTreeData(data: TreeDataNode) {
        this.treeData = data;
        if (this.isConnected) {
            this.renderTree();
            this.initializeParentIds(this.treeData as TreeDataNode);
            requestAnimationFrame(() => {
                this.drawConnectors();
            });
        }
    }

    public getTreeData(): TreeDataNode | null {
        return this.treeData;
    }

    public async addLeafNode(parentId: number, leafNode: Omit<TreeDataNode, 'parentId' | 'isNew'>) {
        if (!this.treeData) return false;

        const parent = this.findNodeById(this.treeData, parentId);
        if (parent) {
            const newNode: TreeDataNode = {
                ...leafNode,
                parentId: parentId,
                children: [],
                isNew: true
            };
            parent.children.push(newNode);
            await this.setTreeData(this.treeData as TreeDataNode);
            this.clearNewNodeMark();

            return true;
        }
        return false;
    }

    public async addRightLeafNode(parentId: number, leafNode: Omit<TreeDataNode, 'parentId' | 'isNew'>) {
        if (!this.treeData) return false;

        const parent = this.findNodeById(this.treeData, parentId);
        if (parent) {
            const newNode: TreeDataNode = {
                ...leafNode,
                parentId: parentId,
                children: [],
                isNew: true,
                isRight: true,
            };
            parent.children.push(newNode);
            await this.setTreeData(this.treeData as TreeDataNode);
            this.clearNewNodeMark();

            return true;
        }
        return false;
    }

    /**
     * 改变指定节点的颜色。
     * @param nodeId 节点 ID。
     * @param color 新的颜色。
     */
    public changeNodeColor(nodeId: number, color: string): void {
        if (!this.isConnected || !this.treeData) return;
        const node = this.findNodeById(this.treeData, nodeId);
        if(!node) return;
        node.color = color;
        this.renderTree();
    }

    /**
     * 改变指定节点的值。
     * @param nodeId 节点 ID。
     * @param value 新的值。
     */
    public async changeNodeValue(nodeId: number, value: string) {
        if (!this.isConnected || !this.treeData) return;
        const node = this.findNodeById(this.treeData, nodeId);
        if(!node) return;
        node.name = value;
        this.renderTree();

        const valueElement = this.shadowRoot?.getElementById(`node-${nodeId}`);
        if (valueElement) {
            valueElement.classList.add('value-change');
            // 动画结束后移除类
            setTimeout(() => {
                valueElement.classList.remove('value-change');
            }, 500);
        }
    }

    public async addArrowPoint(
        nodeId: number,
        text: string,
        length?: number,
        id?: string,
        towards?: 'top' | 'bottom' | 'left' | 'right'
    ) {
        if (!this.isConnected || !this.treeData) return;

        // 查找节点对应的DOM元素
        const nodeElement = this.shadowRoot!.querySelector(`#node-${nodeId} .circle`);
        if (!nodeElement) return;

        // 自动判断方向
        if (!towards) {
            const treeContainer = this.shadowRoot!.querySelector('.tree-container')!;
            const containerRect = treeContainer.getBoundingClientRect();
            const nodeRect = nodeElement.getBoundingClientRect();

            // 计算相对位置
            const relativeX = nodeRect.left - containerRect.left / 2;
            const relativeY = nodeRect.top - containerRect.top / 2;

            // 根据节点在容器中的位置判断最佳方向
            const containerCenterX = containerRect.width / 2;

            if (relativeX < containerCenterX - 100) {
                towards = 'right'; // 节点在左侧，箭头从右边来
            } else if (relativeX > containerCenterX + 100) {
                towards = 'left'; // 节点在右侧，箭头从左边来
            } else if (relativeY < containerRect.height / 2) {
                towards = 'bottom'; // 节点在上半部，箭头从下方来
            } else {
                towards = 'top'; // 节点在下半部，箭头从上方来
            }
        }

        this.arrowPoints.push({
            id: id || text,
            nodeId,
            text,
            towards,
            length: length || 50
        });

        this.drawConnectors(); // 重绘连接线和箭头
    }

    public async removeArrowPoint(id: string) {
        const index = this.arrowPoints.findIndex(p => p.id === id);
        if (index !== -1) {
            this.arrowPoints.splice(index, 1);
            this.drawConnectors();
        }
    }

    public async moveArrowPoint(id: string, newNodeId: number) {
        const point = this.arrowPoints.find(p => p.id === id);
        if (point) {
            point.nodeId = newNodeId;
            this.drawConnectors();
        }
    }

    // 新增虚线
    public async addDashedLine(startNodeId: number, endNodeId: number, color?: string, id?: string) {
        this.dashedLines.push({
            startId: startNodeId,
            endId: endNodeId,
            color: color || 'black',
            id: id || `${startNodeId}-${endNodeId}`
        });
        this.drawConnectors();
    }

    // 删除虚线
    public async removeDashedLine(id: string) {
        const index = this.dashedLines.findIndex(line => line.id === id);
        if (index !== -1) {
            this.dashedLines.splice(index, 1);
            this.drawConnectors();
        }
    }

    public async reStoreNodeColor(node: TreeDataNode) {
        if (!node) return; // 如果根节点为空，直接返回

        node.color = '#99CC99';

        // 递归处理所有子节点（一般树，children 可能有任意数量）
        node.children.forEach(child => this.reStoreNodeColor(child));
    }

    private initializeParentIds(node: TreeDataNode, parentId: number | null = null): void {
        if(node){
            node.parentId = parentId;
            node.children.forEach(child => this.initializeParentIds(child, node.id));
        }
    }

    private findNodeById(node: TreeDataNode, targetId: number): TreeDataNode | undefined {
        if (node.id === targetId) return node;
        for (const child of node.children) {
            const found = this.findNodeById(child, targetId);
            if (found) return found;
        }
        return undefined;
    }

    private clearNewNodeMark(): void {
        this.markNodesAsNotNew(this.treeData as TreeDataNode);
    }

    private markNodesAsNotNew(node: TreeDataNode): void {
        node.isNew = false;
        node.children.forEach(child => this.markNodesAsNotNew(child));
    }

    private renderTree(): void {
        const treeContainer = this.shadowRoot!.querySelector('.tree-container')!;
        if(!this.treeData){
            treeContainer.innerHTML = ``
        }
        if (!this.isConnected || !this.treeData) return;

        treeContainer.innerHTML = this.rendererStrategy.renderTreeNode(this.treeData,0, this.isSmallerHorizontalSpacing);

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.style.position = 'absolute';
        this.svg.style.top = '0';
        this.svg.style.left = '0';
        this.svg.style.width = '100%';
        this.svg.style.height = '100%';
        treeContainer.prepend(this.svg);

        requestAnimationFrame(() => {
            this.drawConnectors();
        });
    }

    private drawConnectors(): void {
        // 清空当前的连接线
        if (this.svg) {
            while (this.svg.firstChild) {
                this.svg.removeChild(this.svg.firstChild);
            }
        }

        const nodes = this.shadowRoot!.querySelectorAll('.node') as NodeListOf<HTMLElement>;
        const nodeMap = new Map<number, HTMLElement>();

        nodes.forEach(node => {
            const id = Number(node.id.split('-')[1]);
            nodeMap.set(id, node);
        });

        // 创建箭头标记定义
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        marker.appendChild(polygon);
        defs.appendChild(marker);
        if(this.svg)
            this.svg.appendChild(defs);

        this.connectorStrategy.drawConnectors(this.treeData as TreeDataNode, nodeMap, this.svg!, this.scale, this.arrowPoints, this.dashedLines);
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
                 /* 新增箭头样式 */
                svg line {
                    stroke-width: 2;
                    stroke-linecap: round;
                }
                svg text {
                    fill: #333;
                    font-family: Arial, sans-serif;
                    user-select: none;
                }
                /* 确保箭头标记颜色一致 */
                #arrowhead polygon {
                    fill: currentColor;
                }
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    position: relative;
                    margin: 40px auto;
                    width: 80%;
                }
                .node {
                    position: relative;
                    display: inline-block;
                }
                .circle {
                    opacity: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .new-node .circle {
                    opacity: 0;
                    animation: fadeIn 0.5s ease-in-out forwards;
                }
                .deleting .circle { /* 新增 */
                    opacity: 0;
                    animation: fadeOut 1s ease-in-out forwards;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeOut { /* 新增 */
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                }
                svg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
                @keyframes drawLine {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                .new-line {
                    animation: drawLine 2s forwards;
                }
            </style>
            <div class="tree-container" style="position: relative; width: fit-content; margin: 0 auto;"></div>
        `;
    }

    //设置缩放倍数，在common中调用
    public setScale(scale: number) {
        this.scale = scale;
    }

    //上一步所调用的方法
    public async getCurrentState() {
        return {
            data: structuredClone(this.treeData),
            arrowPoints: structuredClone(this.arrowPoints),
            dashedLines: structuredClone(this.dashedLines),
        };
    }
    //上一步所调用的方法
    public async restoreState(state: any) {
        this.treeData = state.data;
        this.arrowPoints = state.arrowPoints || [];
        this.dashedLines = state.dashedLines || [];
        this.renderTree();
        // this.drawConnectors();
    }
}

if (!customElements.get('tree-component')) {
    customElements.define('tree-component', MyTreeComponent);
}

