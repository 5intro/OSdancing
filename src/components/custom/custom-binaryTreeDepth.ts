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
    description?: string; // 新增：节点的文字说明
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
        const deletingClass = node.isDeleting ? ' deleting' : '';
        const placeholderClass = node.isPlaceholder ? ' placeholder' : '';

        let leftChildHTML = '';
        if (node.leftChild) {
            leftChildHTML = this.renderTreeNode(node.leftChild, level + 1);
        }

        let rightChildHTML = '';
        if (node.rightChild) {
            rightChildHTML = this.renderTreeNode(node.rightChild, level + 1);
        }

        // 添加描述文字的HTML
        const descriptionHTML = node.description ? `
            <div class="node-description fade-in" style="
                position: absolute;
                right: calc(100% + 10px);
                top: 50%;
                transform: translateY(-50%);
                white-space: nowrap;
                font-size: 25px;
                color: black;
                text-align: right;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                opacity: 0;
                animation: fadeInDescription 0.5s ease-in-out forwards;
            ">
                ${node.description}
            </div>
        ` : '';

        return `
            <div class="node${newNodeClass}${deletingClass}${placeholderClass}" id="node-${node.id}" style="display: flex; flex-direction: column; 
            align-items: center; position: relative; margin-right: ${level * horizontalSpacing}px;">
                <div style="position: relative; display: flex; align-items: center;">
                    <div class="circle" style="width: ${nodeSize}px; height: ${nodeSize}px; border-radius: 50%; 
                    font-size: 25px;
                    border: 1px solid black;
                    background-color: ${node.color || '#99CC99'}; display: flex; justify-content: center; align-items: center; margin: ${verticalSpacing}px 0;">
                        ${node.name}
                    </div>
                    ${descriptionHTML}
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

export class BinaryTreeComponent2 extends HTMLElement {
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
                .deleting .circle {
                    opacity: 0;
                    animation: fadeOut 1s ease-in-out forwards;
                }
                .placeholder {
                    visibility: hidden;
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
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                }
                @keyframes fadeInDescription {
                    from {
                        opacity: 0;
                        transform: translate(-10px, -50%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(0, -50%);
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
     * @param nodeId 节点 ID。
     * @param color 新的颜色。
     */
    public reStoreNodeColor(node: TreeDataNode): void {
        node.color = "#99CC99";
        if (node.leftChild) {
            this.reStoreNodeColor(node.leftChild);
        }
        if (node.rightChild) {
            this.reStoreNodeColor(node.rightChild);
        }
    }

    /**
     * 设置指定节点的描述文字
     * @param nodeId 节点 ID
     * @param description 描述文字
     */
    public setNodeDescription(nodeId: number, description: string): void {
        if (!this.isConnected || !this.treeData) return;
        const node = this.findNodeById(this.treeData, nodeId);
        if (!node) return;
        node.description = description;
        this.renderTree();
    }

    /**
     * 清除指定节点的描述文字
     * @param nodeId 节点 ID
     */
    public clearNodeDescription(nodeId: number): void {
        if (!this.isConnected || !this.treeData) return;
        const node = this.findNodeById(this.treeData, nodeId);
        if (!node) return;
        delete node.description;
        this.renderTree();
    }
}

if (!customElements.get('binary-tree-component2')) {
    customElements.define('binary-tree-component2', BinaryTreeComponent2);
}