"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function pause(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// 删除节点动画策略（新增）
class DeleteAnimationStrategy {
    animateDeletion(node, nodeElement) {
        return new Promise((resolve) => {
            // 添加动画类
            nodeElement.classList.add('deleting');
            // 等待动画完成
            setTimeout(() => {
                resolve();
            }, 2000); // 动画时长
        });
    }
}
// 修改 TreeRendererStrategy 以支持动画类
class TreeRendererStrategy {
    renderTreeNode(node, level = 0) {
        const nodeSize = 50;
        const horizontalSpacing = 30;
        const verticalSpacing = 10;
        const newNodeClass = node.isNew ? ' new-node' : '';
        const deletingClass = node.isDeleting ? ' deleting' : ''; // 新增
        let childrenHTML = '';
        node.children.forEach(child => {
            childrenHTML += this.renderTreeNode(child, level + 1);
        });
        return `
            <div class="node${newNodeClass}${deletingClass}" id="node-${node.id}" style="display: flex; flex-direction: column; align-items: center; position: relative; margin-left: ${level * horizontalSpacing}px;">
                <div class="circle" style="width: ${nodeSize}px; height: ${nodeSize}px; border-radius: 50%; background-color: green; display: flex; justify-content: center; align-items: center; margin: ${verticalSpacing}px 0;">
                    ${node.id}
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
    drawConnectors(node, nodeMap, svg) {
        node.children.forEach(child => {
            const parentElement = nodeMap.get(node.id);
            const currentElement = nodeMap.get(child.id);
            if (parentElement && currentElement) {
                const parentCircle = parentElement.querySelector('.circle');
                const currentCircle = currentElement.querySelector('.circle');
                const parentRect = parentCircle.getBoundingClientRect();
                const currentRect = currentCircle.getBoundingClientRect();
                const svgContainer = svg.getBoundingClientRect();
                const parentCenterX = parentRect.left + parentRect.width / 2 - svgContainer.left;
                const parentCenterY = parentRect.top + parentRect.height / 2 - svgContainer.top;
                const currentCenterX = currentRect.left + currentRect.width / 2 - svgContainer.left;
                const currentCenterY = currentRect.top + currentRect.height / 2 - svgContainer.top;
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
            this.drawConnectors(child, nodeMap, svg);
        });
    }
}
class MyTreeComponent extends HTMLElement {
    constructor() {
        super();
        this.treeData = null;
        this.svg = null;
        this.rendererStrategy = new TreeRendererStrategy();
        this.connectorStrategy = new ConnectorRendererStrategy();
        this.deleteAnimationStrategy = new DeleteAnimationStrategy(); // 新增
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = this.initializeStyles();
    }
    deleteLeafNode(leafId_1) {
        return __awaiter(this, arguments, void 0, function* (leafId, force = false) {
            if (!this.treeData)
                return false;
            const leafNode = this.findNodeById(this.treeData, leafId);
            if (!leafNode)
                return false;
            if (!force && leafNode.children.length > 0) {
                return false;
            }
            // 标记节点为正在删除
            leafNode.isDeleting = true;
            // 找到父节点
            const parentNode = this.findParentNode(this.treeData, leafNode.parentId);
            if (!parentNode) {
                return false;
            }
            // 移除节点
            parentNode.children = parentNode.children.filter(child => child.id !== leafNode.id);
            // 获取节点对应的 DOM 元素
            const nodeElement = this.shadowRoot.querySelector(`#node-${leafId}`);
            yield this.deleteAnimationStrategy.animateDeletion(leafNode, nodeElement);
            // 重新渲染树
            yield this.setTreeData(this.treeData);
            // 强制重新绘制连线
            requestAnimationFrame(() => {
                this.drawConnectors();
            });
            return true;
        });
    }
    findParentNode(node, targetId) {
        if (node.id === targetId)
            return node;
        for (const child of node.children) {
            const found = this.findParentNode(child, targetId);
            if (found)
                return found;
        }
        return undefined;
    }
    connectedCallback() {
        if (this.isConnected && this.treeData) {
            this.renderTree();
        }
    }
    setTreeData(data) {
        this.treeData = data;
        if (this.isConnected) {
            this.renderTree();
            this.initializeParentIds(this.treeData);
            requestAnimationFrame(() => {
                this.drawConnectors();
            });
        }
        // setTimeout(() => {
        //     this.clearNewNodeMark();
        // }, 2000);
    }
    getTreeData() {
        return this.treeData;
    }
    addLeafNode(parentId, leafNode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.treeData)
                return false;
            const parent = this.findNodeById(this.treeData, parentId);
            if (parent) {
                const newNode = Object.assign(Object.assign({}, leafNode), { parentId: parentId, children: [], isNew: true });
                parent.children.push(newNode);
                yield this.setTreeData(this.treeData);
                yield pause(2000);
                this.clearNewNodeMark();
                return true;
            }
            return false;
        });
    }
    initializeParentIds(node, parentId = null) {
        node.parentId = parentId;
        node.children.forEach(child => this.initializeParentIds(child, node.id));
    }
    findNodeById(node, targetId) {
        if (node.id === targetId)
            return node;
        for (const child of node.children) {
            const found = this.findNodeById(child, targetId);
            if (found)
                return found;
        }
        return undefined;
    }
    clearNewNodeMark() {
        this.markNodesAsNotNew(this.treeData);
    }
    markNodesAsNotNew(node) {
        node.isNew = false;
        node.children.forEach(child => this.markNodesAsNotNew(child));
    }
    renderTree() {
        if (!this.isConnected || !this.treeData)
            return;
        const treeContainer = this.shadowRoot.querySelector('.tree-container');
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
    drawConnectors() {
        // 清空当前的连接线
        if (this.svg) {
            while (this.svg.firstChild) {
                this.svg.removeChild(this.svg.firstChild);
            }
        }
        const nodes = this.shadowRoot.querySelectorAll('.node');
        const nodeMap = new Map();
        nodes.forEach(node => {
            const id = Number(node.id.split('-')[1]);
            nodeMap.set(id, node);
        });
        this.connectorStrategy.drawConnectors(this.treeData, nodeMap, this.svg);
    }
    initializeStyles() {
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
    /**
     * 改变指定节点的颜色。
     * @param nodeId 节点 ID。
     * @param color 新的颜色。
     */
    changeNodeColor(nodeId, color) {
        if (!this.isConnected || !this.treeData)
            return;
        // 查找 DOM 元素
        const nodeElement = this.shadowRoot.querySelector(`#node-${nodeId} .circle`);
        if (nodeElement) {
            // 更改颜色
            nodeElement.style.backgroundColor = color;
        }
    }
}
if (!customElements.get('tree-component')) {
    customElements.define('tree-component', MyTreeComponent);
}
//# sourceMappingURL=custom-element.js.map