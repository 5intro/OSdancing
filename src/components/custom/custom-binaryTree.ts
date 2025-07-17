// 定义二叉树节点接口
interface TreeDataNode {
    id: number;
    name: string;
    leftChild?: TreeDataNode | null; // 左子节点
    rightChild?: TreeDataNode | null; // 右子节点
    parentId?: number | null;
    isNew?: boolean; // 默认为 false
    isDeleting?: boolean; // 默认为 false
    color?: string;
    isPlaceholder?: boolean; // 新增：标记是否为虚假节点
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
    renderTreeNode(node: TreeDataNode, level: number = 0): string {
        const nodeSize = 60;
        const horizontalSpacing = 2;
        const verticalSpacing = 10;
        const newNodeClass = node.isNew ? ' new-node' : '';
        const deletingClass = node.isDeleting ? ' deleting' : ''; // 新增
        const placeholderClass = node.isPlaceholder ? ' placeholder' : ''; // 新增：虚假节点样式

        let leftChildHTML = '';
        if (node.leftChild) {
            leftChildHTML = this.renderTreeNode(node.leftChild, level + 1);
        }

        let rightChildHTML = '';
        if (node.rightChild) {
            rightChildHTML = this.renderTreeNode(node.rightChild, level + 1);
        }

        return `
            <div class="node${newNodeClass}${deletingClass}${placeholderClass}" id="node-${node.id}" style="display: flex; flex-direction: column; 
            align-items: center; position: relative; margin-right: ${level * horizontalSpacing}px;">
                <div class="circle" style="width: ${nodeSize}px; height: ${nodeSize}px; border-radius: 50%; 
                font-size: 25px;
                border: 1px solid black;
                background-color: ${node.color || '#99CC99'}; display: flex; justify-content: center; align-items: center; margin: ${verticalSpacing}px 0;">
                    ${node.name}
                </div>
                <div class="content" style="margin-top: ${verticalSpacing}px;"></div>
                <div class="children" style="display: flex; justify-content: center; margin: ${verticalSpacing}px 0;">
                    ${leftChildHTML}
                    ${rightChildHTML}
                </div>
            </div>
        `;
    }
}

// 策略：绘制连接线
class ConnectorRendererStrategy {
    drawConnectors(node: TreeDataNode, nodeMap: Map<number, HTMLElement>, svg: SVGSVGElement, scale: number): void {
        if (node.leftChild && !node.leftChild.isPlaceholder) {
            const parentElement = nodeMap.get(node.id as number);
            const currentElement = nodeMap.get(node.leftChild.id as number);

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

                if (node.leftChild.isNew) {
                    const totalLength = line.getTotalLength();
                    line.style.strokeDasharray = `${totalLength}px`;
                    line.style.strokeDashoffset = `${totalLength}px`;
                    line.style.animation = `drawLine 2s forwards`;
                }
            }

            this.drawConnectors(node.leftChild, nodeMap, svg, scale);
        }

        if (node.rightChild && !node.rightChild.isPlaceholder) {
            const parentElement = nodeMap.get(node.id as number);
            const currentElement = nodeMap.get(node.rightChild.id as number);

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

                if (node.rightChild.isNew) {
                    const totalLength = line.getTotalLength();
                    line.style.strokeDasharray = `${totalLength}px`;
                    line.style.strokeDashoffset = `${totalLength}px`;
                    line.style.animation = `drawLine 2s forwards`;
                }
            }

            this.drawConnectors(node.rightChild, nodeMap, svg, scale);
        }
    }
}

export class BinaryTreeComponent extends HTMLElement {
    private treeData: TreeDataNode | null = null;
    private svg: SVGSVGElement | null = null;
    private scale: number = 1; // 缩放倍数
    private rendererStrategy: TreeRendererStrategy = new TreeRendererStrategy();
    private connectorStrategy: ConnectorRendererStrategy = new ConnectorRendererStrategy();
    private deleteAnimationStrategy: DeleteAnimationStrategy = new DeleteAnimationStrategy(); // 新增

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

    public pause(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public async deleteLeafNode(leafId: number, force: boolean = false): Promise<boolean> {
        if (!this.treeData) return false;

        const leafNode = this.findNodeById(this.treeData, leafId);
        if (!leafNode) return false;

        if (!force && (leafNode.leftChild && !leafNode.leftChild.isPlaceholder || leafNode.rightChild && !leafNode.rightChild.isPlaceholder)) {
            return false;
        }

        // 先删除叶子节点的虚假子节点
        this.deletePlaceholderNodes(leafNode);

        // 标记节点为正在删除
        leafNode.isDeleting = true;

        // 找到父节点
        const parentNode = this.findParentNode(this.treeData, leafId);
        if (!parentNode) {
            return false;
        }

        // 移除节点
        if (parentNode.leftChild && parentNode.leftChild.id === leafId) {
            parentNode.leftChild = null;
        } else if (parentNode.rightChild && parentNode.rightChild.id === leafId) {
            parentNode.rightChild = null;
        }

        // 获取节点对应的 DOM 元素
        const nodeElement = this.shadowRoot?.querySelector(`#node-${leafId}`);
        if (nodeElement) {
            await this.deleteAnimationStrategy.animateDeletion(leafNode, nodeElement as HTMLElement);
        }

        // 重新渲染树
        if (this.treeData) {
            await this.setTreeData(this.treeData);
        }

        // 强制重新绘制连线
        requestAnimationFrame(() => {
            if (this.treeData && this.svg) {
                this.drawConnectors();
            }
        });

        return true;
    }

    private deletePlaceholderNodes(node: TreeDataNode) {
        if (node.leftChild && node.leftChild.isPlaceholder) {
            node.leftChild = null;
        } else if (node.leftChild) {
            this.deletePlaceholderNodes(node.leftChild);
        }
        if (node.rightChild && node.rightChild.isPlaceholder) {
            node.rightChild = null;
        } else if (node.rightChild) {
            this.deletePlaceholderNodes(node.rightChild);
        }
    }

    private findParentNode(node: TreeDataNode, targetId: number): TreeDataNode | undefined {
        if ((node.leftChild && node.leftChild.id === targetId) || (node.rightChild && node.rightChild.id === targetId)) {
            return node;
        }
        if (node.leftChild) {
            const found = this.findParentNode(node.leftChild, targetId);
            if (found) return found;
        }
        if (node.rightChild) {
            const found = this.findParentNode(node.rightChild, targetId);
            if (found) return found;
        }
        return undefined;
    }

    public setTreeData(data: TreeDataNode) {
        this.treeData = data;
        this.addPlaceholderNodes(this.treeData);
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

    public async addLeftLeafNode(parentId: number, leafNode: Omit<TreeDataNode, 'parentId' | 'isNew' | 'leftChild' | 'rightChild' | 'isPlaceholder'>) {
        if (!this.treeData) return false;

        const parent = this.findNodeById(this.treeData, parentId);
        if (parent) {
            const newNode: TreeDataNode = {
                ...leafNode,
                parentId: parentId,
                leftChild: this.createPlaceholderNode(leafNode.id),
                rightChild: this.createPlaceholderNode(leafNode.id),
                isNew: true,
                isPlaceholder: false
            };
            parent.leftChild = newNode;
            await this.setTreeData(this.treeData as TreeDataNode);
            this.clearNewNodeMark();

            return true;
        }
        return false;
    }

    public async addRightLeafNode(parentId: number, leafNode: Omit<TreeDataNode, 'parentId' | 'isNew' | 'leftChild' | 'rightChild' | 'isPlaceholder'>) {
        if (!this.treeData) return false;

        const parent = this.findNodeById(this.treeData, parentId);
        if (parent) {
            const newNode: TreeDataNode = {
                ...leafNode,
                parentId: parentId,
                leftChild: this.createPlaceholderNode(leafNode.id),
                rightChild: this.createPlaceholderNode(leafNode.id),
                isNew: true,
                isPlaceholder: false
            };
            parent.rightChild = newNode;
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
        if (!node) return;
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
        if (!node) return;
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

    private initializeParentIds(node: TreeDataNode, parentId: number | null = null): void {
        if (node) {
            node.parentId = parentId;
            if (node.leftChild) {
                this.initializeParentIds(node.leftChild, node.id);
            }
            if (node.rightChild) {
                this.initializeParentIds(node.rightChild, node.id);
            }
        }
    }

    private findNodeById(node: TreeDataNode, targetId: number): TreeDataNode | undefined {
        if (node.id === targetId) return node;
        if (node.leftChild) {
            const found = this.findNodeById(node.leftChild, targetId);
            if (found) return found;
        }
        if (node.rightChild) {
            const found = this.findNodeById(node.rightChild, targetId);
            if (found) return found;
        }
        return undefined;
    }

    private clearNewNodeMark(): void {
        this.markNodesAsNotNew(this.treeData as TreeDataNode);
    }

    private markNodesAsNotNew(node: TreeDataNode): void {
        node.isNew = false;
        if (node.leftChild) {
            this.markNodesAsNotNew(node.leftChild);
        }
        if (node.rightChild) {
            this.markNodesAsNotNew(node.rightChild);
        }
    }

    private renderTree(): void {
        const treeContainer = this.shadowRoot!.querySelector('.tree-container')!;
        if (!this.treeData) {
            treeContainer.innerHTML = ``;
        }
        if (!this.isConnected || !this.treeData) return;

        treeContainer.innerHTML = this.rendererStrategy.renderTreeNode(this.treeData);

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

        this.connectorStrategy.drawConnectors(this.treeData as TreeDataNode, nodeMap, this.svg!, this.scale);
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
                .placeholder {
                    visibility: hidden; /* 新增：虚假节点不可见 */
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

    // 设置缩放倍数，在 common 中调用
    public setScale(scale: number) {
        this.scale = scale;
    }

    // 上一步所调用的方法
    public async getCurrentState() {
        return {
            data: structuredClone(this.treeData),
        };
    }

    // 上一步所调用的方法
    public async restoreState(state: any) {
        this.treeData = state.data;
        if (this.treeData) { // 确保 treeData 不为 null
            this.addPlaceholderNodes(this.treeData);
        }
        this.renderTree();
    }

    // 创建虚假节点
    private createPlaceholderNode(parentId: number): TreeDataNode {
        const nextId = this.getNextPlaceholderId();
        return {
            id: nextId,
            name: '',
            leftChild: null,
            rightChild: null,
            parentId: parentId,
            isNew: false,
            isDeleting: false,
            color: '#99CC99',
            isPlaceholder: true
        };
    }
    // 获取下一个可用的占位节点 ID
    private getNextPlaceholderId(): number {
        let maxId = 0;
        const traverse = (node: TreeDataNode) => {
            if (node.id > maxId) {
                maxId = node.id;
            }
            if (node.leftChild) {
                traverse(node.leftChild);
            }
            if (node.rightChild) {
                traverse(node.rightChild);
            }
        };
        if (this.treeData) {
            traverse(this.treeData);
        }
        // 确保占位节点 ID 大于 100000
        return maxId < 100000 ? 100001 : maxId + 1;
    }

    // 为树中所有叶子节点添加虚假子节点
    private addPlaceholderNodes(node: TreeDataNode) {
        if (!node.leftChild) {
            node.leftChild = this.createPlaceholderNode(node.id);
        }
        if (!node.rightChild) {
            node.rightChild = this.createPlaceholderNode(node.id);
        }
        if (node.leftChild && !node.leftChild.isPlaceholder) {
            this.addPlaceholderNodes(node.leftChild);
        }
        if (node.rightChild && !node.rightChild.isPlaceholder) {
            this.addPlaceholderNodes(node.rightChild);
        }
    }

    // 获取下一个可用的节点 ID
    private getNextId(): number {
        let maxId = 0;
        const traverse = (node: TreeDataNode) => {
            if (node.id > maxId) {
                maxId = node.id;
            }
            if (node.leftChild) {
                traverse(node.leftChild);
            }
            if (node.rightChild) {
                traverse(node.rightChild);
            }
        };
        if (this.treeData) {
            traverse(this.treeData);
        }
        return maxId + 1;
    }

    /**
     * 改变指定节点的颜色。
     * @param node 指定节点
     */
    public async reStoreNodeColor(node: TreeDataNode) {
        node.color = "#99CC99";
        if (node.leftChild) {
            await this.reStoreNodeColor(node.leftChild);
        }
        if (node.rightChild) {
            await this.reStoreNodeColor(node.rightChild);
        }
    }

    public async drawThreadedLines(targgetId1 : number, targetId2 : number) {
        if (!this.svg || !this.treeData) return;

        // 1. 收集节点坐标
        const nodeCoords = new Map<number, {x: number, y: number}>();
        const nodes = this.shadowRoot!.querySelectorAll('.node') as NodeListOf<HTMLElement>;
        nodes.forEach(node => {
            const id = Number(node.id.split('-')[1]);
            const circle = node.querySelector('.circle') as HTMLElement;
            if (circle) {
                const rect = circle.getBoundingClientRect();
                const svgRect = this.svg!.getBoundingClientRect();
                nodeCoords.set(id, {
                    x: (rect.left + rect.width/2 - svgRect.left) / this.scale,
                    y: (rect.top + rect.height/2 - svgRect.top) / this.scale
                });
            }
        });

        // 2. 定义箭头标记
        const markerId = 'arrow';
        if (!this.svg.querySelector(`#${markerId}`)) {
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            marker.setAttribute('id', markerId);
            marker.setAttribute('viewBox', '0 0 10 10');
            marker.setAttribute('refX', '5');
            marker.setAttribute('refY', '5');
            marker.setAttribute('markerWidth', '6');
            marker.setAttribute('markerHeight', '6');
            marker.setAttribute('orient', 'auto-start-reverse');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
            path.setAttribute('fill', 'red');
            marker.appendChild(path);

            const defs = this.svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            defs.appendChild(marker);
            if (!this.svg.querySelector('defs')) {
                this.svg.insertBefore(defs, this.svg.firstChild);
            }
        }

        // 3. 清除旧线索
        this.svg.querySelectorAll('.thread-line').forEach(el => el.remove());

        // 4. 为每条线索单独绘制贝塞尔曲线
        const curveIntensity = 80; // 值越大曲线越弯曲

        // 线索1: a → + (2 → 1)
        const line1Start = nodeCoords.get(2);
        const line1End = nodeCoords.get(1);
        if (line1Start && line1End && targgetId1 == 2 && targetId2 == 1) {
            const controlX = (line1Start.x + line1End.x) / 2 + curveIntensity;
            const controlY = (line1Start.y + line1End.y) / 2 + curveIntensity;
            const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path1.setAttribute('d', `M ${line1Start.x} ${line1Start.y} Q ${controlX} ${controlY} ${line1End.x} ${line1End.y}`);
            path1.setAttribute('stroke', 'red');
            path1.setAttribute('stroke-width', '2');
            path1.setAttribute('fill', 'none');
            path1.setAttribute('marker-end', `url(#${markerId})`);
            path1.classList.add('thread-line');
            this.svg!.appendChild(path1);
        }

        // 线索2: b → * (4 → 3)
        const line2Start = nodeCoords.get(4);
        const line2End = nodeCoords.get(3);
        if (line2Start && line2End && targgetId1 == 4 && targetId2 == 3) {
            const controlX = (line2Start.x + line2End.x) / 2 + 100;
            const controlY = (line2Start.y + line2End.y) / 2 + 100;
            const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path2.setAttribute('d', `M ${line2Start.x} ${line2Start.y} Q ${controlX} ${controlY} ${line2End.x} ${line2End.y}`);
            path2.setAttribute('stroke', 'red');
            path2.setAttribute('stroke-width', '2');
            path2.setAttribute('fill', 'none');
            path2.setAttribute('marker-end', `url(#${markerId})`);
            path2.classList.add('thread-line');
            this.svg!.appendChild(path2);
        }

        // 线索3: b → + (4 → 1)
        const line3Start = nodeCoords.get(4);
        const line3End = nodeCoords.get(1);
        if (line3Start && line3End && targgetId1 == 4 && targetId2 == 1) {
            const controlX = (line3Start.x + line3End.x) / 2 - 450;
            const controlY = (line3Start.y + line3End.y) / 2 - 40;
            const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path3.setAttribute('d', `M ${line3Start.x} ${line3Start.y} Q ${controlX} ${controlY} ${line3End.x} ${line3End.y}`);
            path3.setAttribute('stroke', 'red');
            path3.setAttribute('stroke-width', '2');
            path3.setAttribute('fill', 'none');
            path3.setAttribute('marker-end', `url(#${markerId})`);
            path3.classList.add('thread-line');
            this.svg!.appendChild(path3);
        }

        // 线索4: c → * (6 → 3)
        const line4Start = nodeCoords.get(6);
        const line4End = nodeCoords.get(3);
        if (line4Start && line4End && targgetId1 == 6 && targetId2 == 3) {
            const controlX = (line4Start.x + line4End.x) / 2 - 420;
            const controlY = (line4Start.y + line4End.y) / 2 - 30;
            const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path4.setAttribute('d', `M ${line4Start.x} ${line4Start.y} Q ${controlX} ${controlY} ${line4End.x} ${line4End.y}`);
            path4.setAttribute('stroke', 'red');
            path4.setAttribute('stroke-width', '2');
            path4.setAttribute('fill', 'none');
            path4.setAttribute('marker-end', `url(#${markerId})`);
            path4.classList.add('thread-line');
            this.svg!.appendChild(path4);
        }

        // 线索5: c → - (6 → 5)
        const line5Start = nodeCoords.get(6);
        const line5End = nodeCoords.get(5);
        if (line5Start && line5End && targgetId1 == 6 && targetId2 == 5) {
            const controlX = (line5Start.x + line5End.x) / 2 + 160;
            const controlY = (line5Start.y + line5End.y) / 2 +30;
            const path5 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path5.setAttribute('d', `M ${line5Start.x} ${line5Start.y} Q ${controlX} ${controlY} ${line5End.x} ${line5End.y}`);
            path5.setAttribute('stroke', 'red');
            path5.setAttribute('stroke-width', '2');
            path5.setAttribute('fill', 'none');
            path5.setAttribute('marker-end', `url(#${markerId})`);
            path5.classList.add('thread-line');
            this.svg!.appendChild(path5);
        }

        // 线索6: b → - (7 → 5)
        const line6Start = nodeCoords.get(7);
        const line6End = nodeCoords.get(5);
        if (line6Start && line6End && targgetId1 == 7 && targetId2 == 5) {
            const controlX = (line6Start.x + line6End.x) / 2 - 160;
            const controlY = (line6Start.y + line6End.y) / 2 + 30;
            const path6 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path6.setAttribute('d', `M ${line6Start.x} ${line6Start.y} Q ${controlX} ${controlY} ${line6End.x} ${line6End.y}`);
            path6.setAttribute('stroke', 'red');
            path6.setAttribute('stroke-width', '2');
            path6.setAttribute('fill', 'none');
            path6.setAttribute('marker-end', `url(#${markerId})`);
            path6.classList.add('thread-line');
            this.svg!.appendChild(path6);
        }
    }

}

if (!customElements.get('binary-tree-component')) {
    customElements.define('binary-tree-component', BinaryTreeComponent);
}