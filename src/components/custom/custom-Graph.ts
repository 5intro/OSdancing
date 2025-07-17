const defaultNodeSize = 60;
const defaultColor = '#99CC99';
const defaultRadius = 150;
const defaultGridSize = 50;
const defaultContainerSize = 500;
const defaultArrowLength = 50;

// 定义结点和边的数据结构
interface GraphNode {
    id: number;        // 唯一标识
    value?: any;        // 结点的值
    color?: string;    // 结点颜色
    hidden?: boolean;   // 是否隐藏
    blink?: boolean;    // 是否闪烁
    position?: { x: number, y: number }; // 结点的位置信息
    actualPosition?: { x: number, y: number };
}

interface GraphEdge {
    from: number;      // 起始结点 ID
    fromValue?: any;   // 起始结点的值
    to: number;        // 目标结点 ID
    toValue?: any;     // 目标结点的值
    weight?: number;   // 权重（如果是加权图）
    color?: string;    // 连接线颜色
    hidden?: boolean;   // 是否隐藏
    blink?: boolean;    // 是否闪烁
}

interface GraphData {
    nodes: GraphNode[];  // 存储所有结点
    edges: GraphEdge[];  // 存储所有边
    directed?: boolean;  // 是否是有向图
    layout?: 'auto' | 'manual';  // 是否使用圆布局（默认为 'auto'）
    radius?: number;    // 圆布局的半径
    nodeSize?: number;  // 结点大小
    nodeColor?: string; // 结点颜色
    gridSize?: number;  // 虚拟方格大小
    containerSize?: number;  // 画布大小
}

interface arrowPoint {
    id: string;
    nodeId: number;
    text?: string;
    towards?: 'top' | 'bottom' | 'left' | 'right';
    length?: number;
}

// 邻接矩阵表示法
interface AdjacencyMatrix {
    matrix: number[][]; // 二维数组存储边的权重，0 表示无边
    nodes: GraphNode[]; // 存储所有结点
    directed?: boolean; // 是否是有向图
    isBoolean?: boolean; // 是否是布尔图
    title?: string; // 图的标题
}

// 邻接链表表示法
interface AdjacencyList {
    list: { [key: number]: { node: GraphNode, edges: GraphEdge[] } }; // 使用对象映射存储结点和其相连的边
    directed?: boolean; // 是否是有向图
}


// 图渲染策略
class GraphRendererStrategy {
    render(data: GraphData): string {
        const nodeSize = data.nodeSize || defaultNodeSize;
        const nodeColor = data.nodeColor || defaultColor;
        const containerSize = data.containerSize || defaultContainerSize; // 画布大小
        const centerX = containerSize / 2;
        const centerY = containerSize / 2;
        const radius = data.radius || defaultRadius; // 自动布局时的半径
        const gridSize = data.gridSize || defaultGridSize; // 虚拟方格大小

        // 计算节点位置
        if (data.layout !== 'manual') {
            const nodeCount = data.nodes.length;
            data.nodes.forEach((node, index) => {
                const angle = (index / nodeCount) * 2 * Math.PI; // 均匀分布在圆上
                node.position = {
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle)
                };
            });
        }else if (data.layout ==='manual') {
            data.nodes.forEach((node) => {
                if (node.actualPosition) {
                    // 将虚拟方格坐标映射到实际坐标
                    node.position = {
                        x: centerX + node.actualPosition.x * gridSize,
                        y: centerY + node.actualPosition.y * gridSize
                    };
                }
            });
        }

        return `
            <div class="Graph" style="position: relative; width: ${containerSize}px; height: ${containerSize}px;">
                ${data.nodes.map(node => {
                    // 判断节点是否隐藏，如果隐藏则跳过该节点
                    if (node.hidden) {
                        return '';  // 如果节点隐藏，不渲染该节点
                    }
        
                    // 判断节点是否需要闪烁效果
                    const blinkClass = node.blink ? 'blink' : '';  // 如果需要闪烁，添加 blink 类
        
                    return `
                        <div class="circle ${blinkClass}" 
                             id="node-${node.id}" 
                             style="width: ${nodeSize}px; height: ${nodeSize}px; 
                                    border-radius: 50%; font-size: 25px;
                                    border: 1px solid black;
                                    position: absolute;
                                    display: flex; justify-content: center; align-items: center;
                                    left: ${(node?.position?.x ?? 0) - nodeSize / 2}px;
                                    top: ${(node?.position?.y ?? 0) - nodeSize / 2}px;
                                    background-color: ${node.color || nodeColor};">
                            ${(node.value !== undefined && node.value !== null && node.value !== '') ? node.value : node.id}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
}

// 邻接矩阵表示法的图渲染策略
class GraphAdjacencyMatrixRendererStrategy {
     render(data: AdjacencyMatrix, changeColorMap: any, blinkMap: any): string {
        const matrix = data.matrix;
        const nodes = data.nodes;
        const size = nodes.length;

        return `
            <!-- 标题行 -->
            <div class="inner-block" style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
                <div class="l-box mid diagonal-box header-cell"></div>
                ${nodes.map((_, i) => `<div class="l-box mid header-cell">${i}</div>`).join('')}
            </div>

             <!-- 矩阵内容 -->
            ${nodes.map((_, i) => `
                <div class="inner-block" style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
                    <div class="l-box mid header-cell">${i}</div>
                    ${nodes.map((_, j) => {
                        let value: string = '';
                        if (data.isBoolean) {
                            value = matrix[i][j] !== 0 ? '1' : '0';
                        } else {
                            value = matrix[i][j] !== 0 ? matrix[i][j].toString() : '∞'; 
                        }
            
                        const cellId = `cell-${i}-${j}`;
                        const index = i * size + j; // 计算唯一索引
                        const colorStyle = changeColorMap[index]
                            ? `background-color: ${changeColorMap[index]};`
                            : "";
                        const classBlink = blinkMap[index] ? 'blink' : '';

                        return `<div id="${cellId}" class="l-box mid content-cell ${classBlink}" style="${colorStyle}">${value}</div>`;

                    }).join('')}
                </div>
            `).join('')}
    `;
    }
}

class GraphAdjacencyListRendererStrategy {
    render(data: AdjacencyList, changeColorMap: any, blinkMap: any): string {
        const list = data.list;  // 获取邻接链表
        let htmlString = '';

        // 遍历链表中的每一个节点
        Object.keys(list).forEach(key => {
            const node = list[parseInt(key)].node;  // 获取当前节点
            const edges = list[parseInt(key)].edges;  // 获取该节点的边
            // 获取节点的颜色，优先使用 changeColorMap 中的颜色
            const nodeElementId = `node${node.id}`;


            // 创建每行的 HTML (节点及其连接的边)
            htmlString += `<div id="row${node.id}" style="display: flex; ">`;

            // 节点显示部分，应用颜色和闪烁效果
            htmlString += `
                <div id="${nodeElementId}" style="display: flex; margin-right: 40px;">
                    <div id="node${node.id}-text" class="node-box node-box-id" style="background-color: ${defaultColor};">
                        ${node.id}
                    </div>
                    <div id="node${node.id}-text" class="node-box node-box-value" style="background-color: ${defaultColor};">
                        ${node.value}
                    </div>
                    <div id="node${node.id}-next" class="node-box" style="background-color: ${defaultColor};">
                        ${edges.length == 0 ? '∧' : ''}
                    </div>
                </div>`;

            edges.forEach((edge, index) => {
                const targetNode = edge.toValue;  // 目标节点的ID
                const targetNodeElementId = `node${node.id}-to-node${edge.to}`; // 目标节点的 id
                const isLastEdge = index === edges.length - 1; // 判断是否是最后一个边

                htmlString += `
                    <div id="${targetNodeElementId}" style="display: flex; margin-right: 40px; --node-color: ${defaultColor};">
                        <div id="node${node.id}-node${edge.to}-text" class="node-box" style="background-color: ${defaultColor};">
                            ${targetNode}
                        </div>
                        <div id="node${node.id}-node${edge.to}-next" class="node-box" style="background-color: ${defaultColor};">
                            ${isLastEdge ? '∧' : ''}
                        </div>
                    </div>`;
            });

            // 结束当前行的 HTML 结构
            htmlString += `</div>`;
        });

        // 返回最终的 HTML 字符串
        return htmlString;
    }
}



class GraphConnectorRendererStrategy {
     drawConnectors(data: GraphData, svg: SVGSVGElement, shadowRoot: ShadowRoot, scale: number, arrowPositions: arrowPoint[]): void {
        data.edges.forEach(edge => {
            if (edge.hidden) return;

            const arrowKey = `${edge.from}-${edge.to}`;

            const fromNodeElement = shadowRoot.getElementById(`node-${edge.from}`);
            const toNodeElement = shadowRoot.getElementById(`node-${edge.to}`);

            // 存在隐藏的节点，则不渲染该边
            if (!fromNodeElement || !toNodeElement) return;

            const { fromNodeAdjustedX, fromNodeAdjustedY, toNodeAdjustedX, toNodeAdjustedY} = this.getAdjustedCoordinates(fromNodeElement, toNodeElement, svg, data, scale);

            // 判断是否存在反向边
            const existsNode2ToNode1 = data.edges.some(e => e.from === edge.to && e.to === edge.from);

            // 存在反向边，且是无向图，不绘制大节点指向小节点
            if (existsNode2ToNode1 && edge.from >= edge.to && !data.directed) return;

            const createLineWithDirection = () => {
                // 无反向边直接创建直线
                if (!existsNode2ToNode1) return this.createLine(fromNodeAdjustedX, fromNodeAdjustedY, toNodeAdjustedX, toNodeAdjustedY, edge, arrowKey, data.directed);

                // 处理存在反向边的情况
                const isAscendingOrder = edge.from < edge.to;
                const curveDirection = isAscendingOrder ? 30 : -30;

                // 有向图曲线，无向图直线
                return data.directed
                    ? this.createCurvedLine(fromNodeAdjustedX, fromNodeAdjustedY, toNodeAdjustedX, toNodeAdjustedY, edge, curveDirection, arrowKey)
                    : this.createLine(fromNodeAdjustedX, fromNodeAdjustedY, toNodeAdjustedX, toNodeAdjustedY, edge, arrowKey, data.directed);
            };

            const lineGroup = createLineWithDirection();
            if (!lineGroup) return;

            if(arrowPositions) this.addArrowPoints(arrowPositions, shadowRoot, svg, data.nodeSize || defaultNodeSize, scale);

            // 添加图形到DOM
            svg.appendChild(lineGroup);

        });
    }

    private computeArrowPoint(
        x1: number, y1: number, radius: number,
        towards: 'top' | 'bottom' | 'left' | 'right',
        length: number, scale: number,
        offset: number // 额外的偏移量
    ) {
        let x2 = x1, y2 = y1;
        length = length * scale;

        switch (towards) {
            case 'top':
                x1 += offset; // 让箭头左右分布
                x2 += offset;
                y2 = y1 - radius;
                y1 = y2 - length;
                break;
            case 'bottom':
                x1 += offset; // 让箭头左右分布
                x2 += offset;
                y2 = y1 + radius;
                y1 = y2 + length;
                break;
            case 'left':
                y1 += offset; // 让箭头上下分布
                y2 += offset;
                x2 = x1 - radius;
                x1 = x2 - length;
                break;
            case 'right':
                y1 += offset; // 让箭头上下分布
                y2 += offset;
                x2 = x1 + radius;
                x1 = x2 + length;
                break;
        }

        return { x1, y1, x2, y2 };
    }

    private createArrowPoint(arrowPoint: arrowPoint, radius: number, shadowRoot: ShadowRoot, svg: SVGSVGElement, scale: number,  offset: number = 0): void {
        if (!arrowPoint.nodeId) {
         console.warn('arrowPoint.nodeId is not defined');
         return;
        }
        const lineObjectElement = svg.querySelector(`line#${arrowPoint.id ?? ''}`);
        if (lineObjectElement) return;
        const nodeElement = shadowRoot.getElementById(`node-${arrowPoint.nodeId}`);
        let nodex, nodey;
        if (!nodeElement){
            nodex = 0;
            nodey = 0;
        } else {
            const nodeElementRect = nodeElement.getBoundingClientRect();
            const svgRect = svg.getBoundingClientRect();
            nodex = (nodeElementRect.left + nodeElementRect.width / 2 - svgRect.left);
            nodey = (nodeElementRect.top + nodeElementRect.height / 2 - svgRect.top);
            radius = nodeElementRect.width / 2;
        }

        const {x1, y1, x2, y2} = this.computeArrowPoint(nodex, nodey,  radius, arrowPoint.towards ?? 'left', arrowPoint.length ?? defaultArrowLength, scale, offset);
        // 创建箭头的 SVG 元素
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
        arrow.setAttribute("x1", (x1 / scale).toString());
        arrow.setAttribute("y1", (y1 / scale).toString());
        arrow.setAttribute("x2", (x2 / scale).toString());
        arrow.setAttribute("y2", (y2 / scale).toString());
        arrow.setAttribute("stroke", "black");
        arrow.setAttribute("stroke-width", "2");
        arrow.setAttribute("id", arrowPoint.id ?? arrowPoint.text ?? '');

        arrow.setAttribute("marker-end", "url(#arrowhead-black)");


        svg.appendChild(arrow);

        if (!arrowPoint.text) return;

        const foreignObjectElement = svg.querySelector(`foreignObject#${arrowPoint.text ?? ''}`) as SVGForeignObjectElement;
        if (foreignObjectElement) return;

        // 创建foreignObject容器
        const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        const rectWidth = 60;  // 设置宽度
        const rectHeight = 30; // 设置高度

        // 根据箭头朝向调整位置
        switch (arrowPoint.towards) {
            case 'top':
                foreignObject.setAttribute("x", (((x1 + x2) / 2 - rectWidth * scale / 2) / scale).toString()); // 中心对齐
                foreignObject.setAttribute("y", ((Math.min(y1, y2) - rectHeight) / scale).toString()); // 在箭头上方
                break;
            case 'bottom':
                foreignObject.setAttribute("x", (((x1 + x2) / 2 - rectWidth * scale / 2) / scale).toString()); // 中心对齐
                foreignObject.setAttribute("y", ((Math.max(y1, y2)/ scale)).toString()) ; // 在箭头下方
                break;
            case 'left':
                foreignObject.setAttribute("x", ((Math.min(x1, x2) - rectWidth) / scale).toString()); // 在箭头左侧
                foreignObject.setAttribute("y", (((y1 + y2) / 2 - rectHeight * scale / 2) / scale).toString()); // 垂直居中
                break;
            case 'right':
                foreignObject.setAttribute("x", ((Math.max(x1, x2)) / scale).toString()); // 在箭头右侧
                foreignObject.setAttribute("y", (((y1 + y2) / 2 - rectHeight * scale / 2) / scale).toString()); // 垂直居中
                break;
        }

        // 设置 foreignObject 的宽度和高度
        foreignObject.setAttribute("id", `${arrowPoint.text ?? ''}`);
        foreignObject.setAttribute("width", (rectWidth).toString());
        foreignObject.setAttribute("height", (rectHeight).toString());

        // 创建div元素，放置文本
        const div = document.createElement("div");
        const fontSize = 24;

        div.setAttribute("style", `
          width: ${rectWidth}px;
          height: ${rectHeight}px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: ${fontSize}px;
        `);

        // 设置文本内容
        div.textContent = arrowPoint.text ?? "";

        // 将div添加到foreignObject容器中
        foreignObject.appendChild(div);

        // 将foreignObject添加到SVG容器中
        svg.appendChild(foreignObject);

    }

    private addArrowPoints(arrowPositions: arrowPoint[], shadowRoot: ShadowRoot, svg: SVGSVGElement, radius: number, scale:number, ) {
        const markerId = `arrowhead-black`;
        this.addArrowMarker(svg, markerId, 'black');

        // 统计每个节点的每个方向的箭头数量
        const arrowCountMap = new Map<number, Map<string, number>>();

        // 统计箭头数量
        arrowPositions.forEach(arrowPosition => {
            if (!arrowCountMap.has(arrowPosition.nodeId)) {
                arrowCountMap.set(arrowPosition.nodeId, new Map());
            }
            const nodeArrows = arrowCountMap.get(arrowPosition.nodeId)!;
            const count = nodeArrows.get(arrowPosition.towards ?? 'left') ?? 0;
            nodeArrows.set(arrowPosition.towards ?? 'left', count + 1);
        });

        // 计算偏移量并创建箭头
        const arrowOffsetMap = new Map<number, Map<string, number>>(); // 记录每个方向当前的偏移索引

        arrowPositions.forEach(arrowPosition => {
            const nodeId = arrowPosition.nodeId;
            const direction = arrowPosition.towards ?? 'left';
            const totalArrows = arrowCountMap.get(nodeId)?.get(direction) ?? 1; // 该方向的总箭头数量

            let offset = 0;

            // 需要偏移时，计算偏移量
            if (totalArrows > 1) {
                if (!arrowOffsetMap.has(nodeId)) {
                    arrowOffsetMap.set(nodeId, new Map());
                }
                const nodeOffsetMap = arrowOffsetMap.get(nodeId)!;
                const currentOffset = nodeOffsetMap.get(direction) ?? 0;

                // 偏移计算：在 [-spread, +spread] 范围内均匀分布
                const spread = 10; // 控制最大偏移范围
                offset = ((currentOffset - (totalArrows - 1) / 2) * spread) / scale;

                // 记录偏移索引
                nodeOffsetMap.set(direction, currentOffset + 1);
            }

            // 传递偏移量给 `createArrowPoint`
            this.createArrowPoint(arrowPosition, radius / 2, shadowRoot, svg, scale, offset);
        });
    }

    /**
     * 绘制完整的连线和箭头元素
     */
    private createLine(
        fromNodeAdjustedX: number, fromNodeAdjustedY: number, toNodeAdjustedX: number, toNodeAdjustedY: number,
        edge: GraphEdge, arrowKey: string, isDirected: boolean = false
    ): SVGGElement {
        const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const edgeColor = edge.color || 'black';

        const line = this.createLineBaseElement(fromNodeAdjustedX, fromNodeAdjustedY, toNodeAdjustedX, toNodeAdjustedY, edgeColor);
        line.setAttribute('stroke-width', '2');

        // 添加箭头
        if (isDirected) {
            const markerId = `arrowhead-${arrowKey}`;
            const defs = this.createArrowMarker(markerId, edgeColor);
            lineGroup.appendChild(defs);

            const {arrowStartX, arrowStartY} = this.calculateArrowStart(fromNodeAdjustedX, fromNodeAdjustedY, toNodeAdjustedX, toNodeAdjustedY);
            const arrow = this.createArrow(arrowStartX, arrowStartY, toNodeAdjustedX, toNodeAdjustedY, edgeColor);
            arrow.setAttribute("marker-end", `url(#${markerId})`);
            lineGroup.appendChild(arrow);
        }

        // 添加权重文本
        if (edge.weight != null) {
            const { textX, textY, adjustedAngle } = this.calculateTextPositionAndAngle(fromNodeAdjustedX, fromNodeAdjustedY, toNodeAdjustedX, toNodeAdjustedY);
            const textSvgElement = this.addEdgeWeightText(textX, textY, edge, adjustedAngle);
            lineGroup.appendChild(textSvgElement);
        }

        // 闪烁动画
        if (edge.blink) {
            const animateColor = this.addBlinkAnimation('stroke', edgeColor, 'rgb(255, 153, 102)');
            line.appendChild(animateColor);

            const animateWidth = this.addBlinkAnimation('stroke-width', '2', '3');
            line.appendChild(animateWidth);

            const polygonElement = lineGroup.querySelector('polygon');
            polygonElement?.appendChild(this.addBlinkAnimation('fill', edgeColor, 'rgb(255, 153, 102)'));

            const textElement = lineGroup.querySelector('text');
            textElement?.appendChild(this.addBlinkAnimation('fill', edgeColor, 'rgb(255, 153, 102)'));
        }

        line.setAttribute('id', arrowKey);
        lineGroup.appendChild(line);
        return lineGroup;
    }

    /**
     * 根据两点计算文本显示的位置和斜率
     */
    private calculateTextPositionAndAngle(fromNodeAdjustedX: number, fromNodeAdjustedY: number, toNodeAdjustedX: number, toNodeAdjustedY: number, offset: number = 20) {
        // 计算线条角度（弧度）
        const angle = Math.atan2(
            toNodeAdjustedY - fromNodeAdjustedY,
            toNodeAdjustedX - fromNodeAdjustedX
        );
        // 计算文本位置
        const textX = fromNodeAdjustedX + Math.cos(angle) * offset;
        const textY = fromNodeAdjustedY + Math.sin(angle) * offset;
        // 将角度转换为度数并调整
        let adjustedAngle = angle * (180 / Math.PI);
        adjustedAngle += (adjustedAngle > 90 || adjustedAngle < -90) ? 180 : 0;
        return { textX, textY, adjustedAngle };
    }

    /**
     * 创建line的基础元素
     */
    private createLineBaseElement(fromNodeAdjustedX: number, fromNodeAdjustedY: number, toNodeAdjustedX: number, toNodeAdjustedY: number, edgeColor: string = 'black', strokeWidth: string = '2') {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromNodeAdjustedX.toString());
        line.setAttribute('y1', fromNodeAdjustedY.toString());
        line.setAttribute('x2', toNodeAdjustedX.toString());
        line.setAttribute('y2', toNodeAdjustedY.toString());
        line.setAttribute('stroke', edgeColor);
        line.setAttribute('stroke-width', strokeWidth);
        return line;
    }

    /**
     * 根据两点计算箭头斜率
     */
    private calculateArrowStart(fromNodeAdjustedX: number, fromNodeAdjustedY: number, toNodeAdjustedX: number, toNodeAdjustedY: number, arrowLength: number = 10) {
        // 计算线条角度
        const angle = Math.atan2(
            toNodeAdjustedY - fromNodeAdjustedY,
            toNodeAdjustedX - fromNodeAdjustedX
        );
        // 计算箭头起点
        const arrowStartX = toNodeAdjustedX - arrowLength * Math.cos(angle);
        const arrowStartY = toNodeAdjustedY - arrowLength * Math.sin(angle);
        return { arrowStartX, arrowStartY };
    }

    /**
     * 创建箭头 SVG 元素
     */
    private createArrow(arrowStartX: number, arrowStartY: number, toNodeAdjustedX: number, toNodeAdjustedY: number, edgeColor: string = 'black') {
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        arrow.setAttribute('x1', arrowStartX.toString());
        arrow.setAttribute('y1', arrowStartY.toString());
        arrow.setAttribute('x2', toNodeAdjustedX.toString());
        arrow.setAttribute('y2', toNodeAdjustedY.toString());
        arrow.setAttribute('stroke', edgeColor);
        arrow.setAttribute('stroke-width', '2');
        return arrow;
    }

    /**
     * 为 SVG 元素添加闪烁动画
     */
    private addBlinkAnimation(attributeName: string, baseValues: string, values: string, duration: number = 1, repeatCount: string = 'indefinite') {
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', attributeName);
        animate.setAttribute('values', `${baseValues};${values};${baseValues}`);
        animate.setAttribute('dur', `${duration}s`);
        animate.setAttribute('repeatCount', repeatCount);
        return animate;
    }

    private createCurvedLine(fromNodeAdjustedX: number, fromNodeAdjustedY: number, toNodeAdjustedX: number, toNodeAdjustedY: number, edge: GraphEdge, curveHeight: number, arrowKey: string) {
        const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const edgeColor = edge.color || 'black';

        let controlX1, controlY1, controlX2, controlY2;
        ({ controlX1, controlY1, controlX2, controlY2 } = this.calculateEllipseControlPoints(fromNodeAdjustedX, fromNodeAdjustedY, toNodeAdjustedX, toNodeAdjustedY, curveHeight));

        if (curveHeight < 0) {
            const { symX, symY } = this.findSymmetricPoint(fromNodeAdjustedX, fromNodeAdjustedY, toNodeAdjustedX, toNodeAdjustedY, controlX1, controlY1);
            controlX1 = symX;
            controlY1 = symY;
        } else {
            const { symX, symY } = this.findSymmetricPoint(fromNodeAdjustedX, fromNodeAdjustedY, toNodeAdjustedX, toNodeAdjustedY, controlX2, controlY2);
            controlX2 = symX;
            controlY2 = symY;
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // 构建贝塞尔曲线路径
        path.setAttribute('d',
            `M ${fromNodeAdjustedX},${fromNodeAdjustedY} 
         C ${controlX1},${controlY1} ${controlX2},${controlY2} ${toNodeAdjustedX},${toNodeAdjustedY}`
        );

        path.setAttribute('stroke', edgeColor);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'transparent');
        path.setAttribute('id', arrowKey);

        const markerId = `arrowhead-${arrowKey}`;
        const defs = this.createArrowMarker(markerId, edgeColor);
        lineGroup.appendChild(defs);

        const {arrowStartX, arrowStartY} = this.calculateArrowStart(controlX2, controlY2, toNodeAdjustedX, toNodeAdjustedY);
        const arrow = this.createArrow(arrowStartX, arrowStartY, toNodeAdjustedX, toNodeAdjustedY, edgeColor);
        arrow.setAttribute("marker-end", `url(#${markerId})`);
        lineGroup.appendChild(arrow);

        if(edge.weight != null){
            // 计算贝塞尔曲线中点
            const t = 0.5; // 取中点
            const midX =
                (1 - t) * (1 - t) * fromNodeAdjustedX +
                2 * (1 - t) * t * controlX1 +
                t * t * toNodeAdjustedX;
            const midY =
                (1 - t) * (1 - t) * fromNodeAdjustedY +
                2 * (1 - t) * t * controlY1 +
                t * t * toNodeAdjustedY;

            // 计算切线角度
            const tangentX =
                2 * (1 - t) * (controlX1 - fromNodeAdjustedX) +
                2 * t * (toNodeAdjustedX - controlX1);
            const tangentY =
                2 * (1 - t) * (controlY1 - fromNodeAdjustedY) +
                2 * t * (toNodeAdjustedY - controlY1);
            const angle = Math.atan2(tangentY, tangentX);

            let adjustedAngle = angle * (180 / Math.PI);
            adjustedAngle += adjustedAngle > 90 || adjustedAngle < -90 ? 180 : 0;
            const textSvgElement = this.addEdgeWeightText(midX, midY, edge, adjustedAngle);
            lineGroup.appendChild(textSvgElement);
        }

        if (edge.blink) {
            const animateColor = this.addBlinkAnimation('stroke', edgeColor, 'rgb(255, 153, 102)');
            path.appendChild(animateColor);

            const animateWidth = this.addBlinkAnimation('stroke-width', '2', '3');
            path.appendChild(animateWidth);

            const polygonElement = lineGroup.querySelector('polygon');
            polygonElement?.appendChild(this.addBlinkAnimation('fill', edgeColor, 'rgb(255, 153, 102)'));


            const textElement = lineGroup.querySelector('text');
            textElement?.appendChild(this.addBlinkAnimation('fill', edgeColor, 'rgb(255, 153, 102)'));
        }

        lineGroup.appendChild(path);
        return lineGroup;
    }

    private findSymmetricPoint(x1: number, y1: number, x2: number, y2: number, controlX2: number, controlY2: number) {
        // 计算线的斜率 m
        const m = (y2 - y1) / (x2 - x1);
        // 计算线的截距 b
        const b = y1 - m * x1;

        // 计算垂直线的交点
        const perpendicularSlope = -1 / m;  // 垂线的斜率是原线斜率的负倒数
        const perpendicularB = controlY2 - perpendicularSlope * controlX2;  // 垂线的截距

        // 计算交点 (intersectX, intersectY)
        const intersectX = (perpendicularB - b) / (m - perpendicularSlope);
        const intersectY = m * intersectX + b;

        // 计算对称点 (symX, symY)
        const symX = 2 * intersectX - controlX2;
        const symY = 2 * intersectY - controlY2;

        return { symX, symY };
    }

    // 曲线控制点计算方法
    private calculateEllipseControlPoints(fromX: number, fromY: number, toX: number, toY: number, curveHeight: number) {
        // 计算节点连线中点
        const centerX = (fromX + toX) / 2;
        const centerY = (fromY + toY) / 2;

        // 计算节点连线方向向量
        const dx = toX - fromX;
        const dy = toY - fromY;

        // 计算垂直方向向量（旋转90度）
        const perpendicularX = -dy;
        const perpendicularY = dx;

        // 标准化垂直向量
        const length = Math.sqrt(perpendicularX**2 + perpendicularY**2);
        const normalizedX = perpendicularX / length;
        const normalizedY = perpendicularY / length;

        // 计算椭圆控制点（双向对称偏移）
        return {
            controlX1: centerX + normalizedX * curveHeight,  // 正向边控制点
            controlY1: centerY + normalizedY * curveHeight,
            controlX2: centerX - normalizedX * curveHeight,  // 反向边控制点
            controlY2: centerY - normalizedY * curveHeight
        };
    }

    private createArrowMarker(markerId: string, edgeColor: string) {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", markerId);
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "9");
        marker.setAttribute("refY", "3.5");
        marker.setAttribute("orient", "auto");
        marker.setAttribute("markerUnits", "strokeWidth");

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
        polygon.setAttribute("fill", edgeColor || "black");

        marker.appendChild(polygon);
        defs.appendChild(marker);
        return marker;
    }

    private addArrowMarker(svg: SVGSVGElement, markerId: string, edgeColor: string) {
        if (!svg.querySelector(`#${markerId}`)) {
            const defs = svg.querySelector("defs") || document.createElementNS("http://www.w3.org/2000/svg", "defs");
            if (!svg.contains(defs)) svg.appendChild(defs);
            const marker = this.createArrowMarker(markerId, edgeColor);
            defs.appendChild(marker);
        }
    }

    private addEdgeWeightText(textX: number, textY: number, edge: GraphEdge, adjustedAngle: number) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', textX.toString());
        text.setAttribute('y', textY.toString());
        text.setAttribute('fill', edge.color || 'black');
        text.setAttribute('font-size', '20px');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.textContent = edge.weight!.toString();
        text.setAttribute('transform', `rotate(${adjustedAngle}, ${textX}, ${textY})`);

        return text;
    }

    private getAdjustedCoordinates(fromNodeElement: HTMLElement, toNodeElement: HTMLElement, svg : SVGSVGElement, data: GraphData, scale = 1) {
        const fromNodeRect = fromNodeElement.getBoundingClientRect();
        const toNodeRect = toNodeElement.getBoundingClientRect();
        const svgContainer = svg.getBoundingClientRect();

        const nodeRadius = (data.nodeSize || defaultNodeSize / 2);

        const fromNodeCenterX = (fromNodeRect.left + fromNodeRect.width / 2 - svgContainer.left) / scale;
        const fromNodeCenterY = (fromNodeRect.top + fromNodeRect.height / 2 - svgContainer.top) / scale;
        const toNodeCenterX = (toNodeRect.left + toNodeRect.width / 2 - svgContainer.left) / scale;
        const toNodeCenterY = (toNodeRect.top + toNodeRect.height / 2 - svgContainer.top) / scale;

        const dx = toNodeCenterX - fromNodeCenterX;
        const dy = toNodeCenterY - fromNodeCenterY;
        const angle = Math.atan2(dy, dx);

        const fromNodeAdjustedX = (fromNodeCenterX + nodeRadius * Math.cos(angle));
        const fromNodeAdjustedY = (fromNodeCenterY + nodeRadius * Math.sin(angle));
        const toNodeAdjustedX = (toNodeCenterX - nodeRadius * Math.cos(angle));
        const toNodeAdjustedY = (toNodeCenterY - nodeRadius * Math.sin(angle));

        return {
            fromNodeAdjustedX,
            fromNodeAdjustedY,
            toNodeAdjustedX,
            toNodeAdjustedY,
        };
    }
}

class GraphAdjacencyListConnectorStrategy {
    drawConnectors(data: AdjacencyList, svg: SVGSVGElement, shadowRoot: ShadowRoot, scale: number): void {
        // 遍历每个节点
        Object.keys(data.list).forEach(nodeId => {
            const nodeInfo = data.list[Number(nodeId)];
            const edges = nodeInfo.edges;
            const node = nodeInfo.node;

            edges.forEach(edge => {


                const targetNode = edge.to;  // 目标节点的ID
                const nextElement = shadowRoot.getElementById(`node${node.id}-to-node${targetNode}`);
                const currentElement = nextElement ? nextElement.previousElementSibling : null;
                const secondChild = currentElement?.querySelectorAll('*')[1]; // 获取第二个子元素
                if (currentElement && nextElement && secondChild) {
                    // 创建唯一箭头ID
                    const arrowId = `arrow-${node.id}-${targetNode}`;
                    // 确定箭头坐标
                    const currentRect = currentElement.getBoundingClientRect();
                    const nextRect = nextElement.getBoundingClientRect();
                    const svgContainer = svg.getBoundingClientRect();
                    const secondChildRect = secondChild.getBoundingClientRect();

                    const startX = ((currentRect.left + currentRect.width - secondChildRect.width / 2 - svgContainer.left) / scale);
                    const startY = (currentRect.top + currentRect.height / 2 - svgContainer.top) / scale;
                    const endX = ((nextRect.left - svgContainer.left) / scale);
                    const endY = (nextRect.top + nextRect.height / 2 - svgContainer.top) / scale;

                    // 绘制边连接线
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', startX.toString());
                    line.setAttribute('y1', startY.toString());
                    line.setAttribute('x2', endX.toString());
                    line.setAttribute('y2', endY.toString());
                    line.setAttribute('stroke', 'black');
                    line.setAttribute('stroke-width', '2');
                    line.setAttribute('marker-end', 'url(#arrowhead)');

                    // 将连接线添加到SVG中
                    svg.appendChild(line);
                    line.setAttribute('id', arrowId);
                }
            });
        });
    }
}

// 图组件
export class GraphComponent extends HTMLElement {
    private data: GraphData | null= null;
    private scale: number = 1; // 缩放倍数
    private svg: SVGSVGElement | null = null;
    private renderer = new GraphRendererStrategy();
    private connectorStrategy = new GraphConnectorRendererStrategy();
    private arrowPoints: Array<arrowPoint> = [];

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = this.initializeStyles();
    }

    connectedCallback() {
        if (this.isConnected && this.data) {
            this.renderGraph();
        }
    }

    private renderGraph(): void {
        const graphContainer = this.shadowRoot!.querySelector('.graph-container');

        if (!graphContainer) return;


        if (!this.data) graphContainer.innerHTML = ``;

        if (!this.shadowRoot || !this.data) return;

        graphContainer.innerHTML = this.renderer.render(this.data);

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.style.position = 'absolute';
        this.svg.style.top = '0';
        this.svg.style.left = '0';
        this.svg.style.width = '100%';
        this.svg.style.height = '100%';

        this.svg.setAttribute('viewBox', `0 0 ${graphContainer.clientWidth} ${graphContainer.clientHeight}`);
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        this.svg.innerHTML = `
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor"/>
                </marker>
            </defs>
        `;

        graphContainer.prepend(this.svg);

        //console.log("renderGraph:svg: ", this.svg);
        requestAnimationFrame(() => {
            if (this.svg) {
                const children = Array.from(this.svg.children);
                const nonDefsChildren = children.filter(child => child.tagName !== 'defs');
                nonDefsChildren.forEach(child => child.remove());
            }

            this.connectorStrategy.drawConnectors(this.data!, this.svg!, this.shadowRoot!, this.scale, this.arrowPoints);
        });
    }

    private initializeStyles(): string {
        return `
            <style>
                @keyframes blinkAnimation {
                    50% {
                        background-color: rgb(255, 153, 102);
                        stroke: rgb(255, 153, 102);
                        stroke-width: 3;
                    }
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
                .blink {
                    animation: blinkAnimation 1s infinite; 
                    animation-direction: alternate;
                    animation-fill-mode: both;
                }
  
                .only-blink{
                    animation: blinkAnimation 1s 3; 
                    animation-direction: alternate;
                    animation-fill-mode: both;
                }
               
                              
            </style>
            <div class="graph-container" style="position: relative; width: fit-content; min-width: max-content;"></div>
        `;
    }

    // 从 GraphData 转换为 AdjacencyMatrix
    public convertToAdjacencyMatrix(data?: GraphData): AdjacencyMatrix {
        const graphData = this.data || data;

        if (!graphData || !graphData.nodes || !graphData.edges) {
            throw new Error("图数据不完整");
        }

        const nodeCount = graphData.nodes.length;

        // 初始化邻接矩阵，所有元素初始化为 0
        const matrix: number[][] = Array.from({ length: nodeCount }, () => Array(nodeCount).fill(0));

        // 创建节点 id 到索引的映射
        const nodeIdToIndex: { [key: number]: number } = {};
        graphData.nodes.forEach((node, index) => {
            nodeIdToIndex[node.id] = index;
        });

        // 遍历所有边，填充矩阵
        graphData.edges.forEach(edge => {

            const fromIndex = nodeIdToIndex[edge.from];
            const toIndex = nodeIdToIndex[edge.to];

            // 如果是有向图
            if (graphData.directed) {
                matrix[fromIndex][toIndex] = edge.weight || 1;
            } else {
                // 如果是无向图
                matrix[fromIndex][toIndex] = edge.weight || 1;
                matrix[toIndex][fromIndex] = edge.weight || 1;
            }
        });

        // 返回邻接矩阵
        return {
            matrix,
            nodes: graphData.nodes,
            directed: graphData.directed
        };
    }

    // 从 this.data 转换为邻接链表
    public convertToAdjacencyList(data?: GraphData): AdjacencyList {
        const graphData = this.data || data;
        // 确保 this.data 存在并且是有效的
        if (!graphData || !graphData.nodes || !graphData.edges) {
            throw new Error('Invalid graph data');
        }

        const adjacencyList: AdjacencyList = {
            list: {},
            directed: graphData.directed,
        };

        // 初始化邻接链表中的每个节点
        graphData.nodes.forEach(node => {
            adjacencyList.list[node.id] = { node, edges: [] };
        });

        // 遍历所有边，填充邻接链表
        graphData.edges.forEach(edge => {
            // 将边添加到源节点的邻接链表中
            adjacencyList.list[edge.from].edges.push(edge);
        });

        return adjacencyList;
    }


    //设置缩放倍数
    public setScale(scale: number) {
        this.scale = scale;
    }

    public setGraphData(data: GraphData) {
        this.data = data;
        if (this.isConnected) {
            this.renderGraph();
        }
    }

    public getData(): GraphData | null {
        return this.data;
    }

    private getEdgeElement(edgeFromId: number, edgeToId: number){
        if (!this.isConnected || !this.data) return null;
        if (!this.data.directed){
            const existsNode2ToNode1 = this.data.edges.some(e => e.from === edgeToId && e.to === edgeFromId);
            if (existsNode2ToNode1 && edgeFromId > edgeToId) return this.data.edges.find(edge => edge.from === edgeToId && edge.to === edgeFromId);
            return this.data.edges.find(edge => edge.from === edgeFromId && edge.to === edgeToId);
        }
        return this.data.edges.find(edge => edge.from === edgeFromId && edge.to === edgeToId);
    }
    // 改变节点颜色
    public changeNodeColor(nodeId: number, color?: string){
        if (!this.isConnected || !this.data) return;
        const node = this.data.nodes.find(node => node.id === nodeId);
        if(!node) return;
        node.color = color || 'rgb(255, 153, 102)';
        this.renderGraph();
    }

    // 改变边颜色
    public changeEdgeColor(edgeFromId: number, edgeToId: number, color: string){
        if (!this.isConnected || !this.data) return;
        const edge = this.getEdgeElement(edgeFromId, edgeToId);
        if(!edge) return;
        edge.color = color;
        this.renderGraph();
    }

    // 改变边权重
    public changeEdgeWeight(edgeFromId: number, edgeToId: number, weight: number){
        if (!this.isConnected || !this.data) return;
        const edge = this.getEdgeElement(edgeFromId, edgeToId);
        if(!edge) return;
        edge.weight = weight;
        this.renderGraph();
    }

    // 让节点消失
    public hideNode(nodeId: number){
        if (!this.isConnected || !this.data) return;
        const node = this.data.nodes.find(node => node.id === nodeId);
        if(!node) return;
        node.hidden = true;
        this.renderGraph();
    }

    // 让节点出现
    public showNode(nodeId: number){
        if (!this.isConnected || !this.data) return;
        const node = this.data.nodes.find(node => node.id === nodeId);
        if(!node) return;
        node.hidden = false;
        this.renderGraph();
    }

    // 使节点闪烁
    public blinkNode(nodeId: number){
        if (!this.isConnected || !this.data) return;
        const node = this.data.nodes.find(node => node.id === nodeId);
        if(!node) return;
        node.blink = true;
        this.renderGraph();
    }

    public blinkNodeOnce(nodeId: number){
        if (!this.isConnected || !this.data) return;
        const node = this.data.nodes.find(node => node.id === nodeId);
        if(!node) return;
        this.shadowRoot!.querySelector(`#node-${nodeId}`)?.classList.add('only-blink');
    }

    // 清除节点闪烁
    public clearBlinkNode(nodeId: number){
        if (!this.isConnected || !this.data) return;
        const node = this.data.nodes.find(node => node.id === nodeId);
        if(!node) return;
        node.blink = false;
        this.renderGraph();
    }

    public clearAllBlinkNodes() {
        if (!this.isConnected || !this.data || !Array.isArray(this.data.nodes)) return;

        this.data.nodes.forEach(node => node.blink = false);

        this.renderGraph();
    }


    // 隐藏边
    public hideEdge(edgeFromId: number, edgeToId: number){
        if (!this.isConnected || !this.data) return;
        const edge= this.getEdgeElement(edgeFromId, edgeToId);
        if(!edge) return;
        edge.hidden = true;
        this.renderGraph();
    }

    // 显示边
    public showEdge(edgeFromId: number, edgeToId: number){
        if (!this.isConnected || !this.data) return;
        const edge= this.getEdgeElement(edgeFromId, edgeToId);
        if(!edge) return;
        edge.hidden = false;
        this.renderGraph();
    }

    // 隐藏所有边
    public hideAllEdges(){
        if (!this.isConnected || !this.data) return;
        this.data.edges.forEach(edge => edge.hidden = true);
        this.renderGraph();
    }

    // 显示所有边
    public showAllEdges(){
        if (!this.isConnected || !this.data) return;
        this.data.edges.forEach(edge => edge.hidden = false);
        this.renderGraph();
    }

    // 边闪烁
    public blinkEdge(edgeFromId: number, edgeToId: number){
        if (!this.isConnected || !this.data) return;
        const edge= this.getEdgeElement(edgeFromId, edgeToId);
        if(!edge) return;
        edge.blink = true;
        this.renderGraph();
    }

    // 清除边闪烁
    public clearBlinkEdge(edgeFromId: number, edgeToId: number){
        if (!this.isConnected || !this.data) return;
        const edge= this.getEdgeElement(edgeFromId, edgeToId);
        if(!edge) return;
        edge.blink = false;
        this.renderGraph();
    }

    // 清除所有边闪烁
    public clearAllBlinkEdges() {
        if (!this.isConnected || !this.data || !Array.isArray(this.data.edges)) return;

        this.data.edges.forEach(edge => edge.blink = false);

        this.renderGraph();
    }

    public addArrowPoint(
        nodeId: number,
        text: string,
        length?: number,
        id?: string,
        towards?: 'top' | 'bottom' | 'left' | 'right'
    ) {
        if (!this.isConnected || !this.data) return;

        // 查找节点
        const node = this.data.nodes.find(node => node.id === nodeId);
        if (!node || !node.position) return;

        // 获取圆心坐标
        const centerX = this.data.containerSize! / 2;
        const centerY = this.data.containerSize! / 2;

        // 获取当前节点的位置
        const { x, y } = node.position;

        // 计算箭头朝向（如果没有指定 `towards`）
        if (!towards) {
            if (Math.abs(x - centerX) > Math.abs(y - centerY)) {
                // **左右方向**
                towards = x < centerX ? 'left' : 'right';
            } else {
                // **上下方向**
                towards = y < centerY ? 'top' : 'bottom';
            }
        }

        // 创建箭头对象
        const arrowPoint: {
            nodeId: number,
            text: string,
            id: string,
            length?: number,
            towards: 'top' | 'bottom' | 'left' | 'right'
        } = {
            nodeId,
            text,
            towards,
            id: id || text, // 如果 `id` 为空，则使用 `text`
        };

        // 如果提供了 `length`，则将其添加到 `arrowPoint`
        if (length) {
            arrowPoint.length = length;
        }

        // 添加到 `arrowPoints` 数组
        this.arrowPoints.push(arrowPoint);

        // 重新渲染图
        this.renderGraph();
    }

    public removeArrowPoint(id: string) {
        if (!this.isConnected || !this.data) return;

        const index = this.arrowPoints.findIndex(point => point.id === id);
        if (index !== -1) {
            this.arrowPoints.splice(index, 1);
        }
        this.renderGraph();
    }

    public moveArrowPoint(id: string, nodeId: number) {
        if (!this.isConnected || !this.data) return;

        // 查找目标节点
        const node = this.data.nodes.find(node => node.id === nodeId);
        if (!node || !node.position) return;

        // 查找箭头
        const arrowPoint = this.arrowPoints.find(point => point.id === id);
        if (!arrowPoint) return;

        // 获取圆心坐标
        const centerX = this.data.containerSize! / 2;
        const centerY = this.data.containerSize! / 2;

        // 获取当前节点的位置
        const { x, y } = node.position;

        // 判断箭头方向
        if (Math.abs(x - centerX) > Math.abs(y - centerY)) {
            // 左右方向
            arrowPoint.towards = x < centerX ? 'left' : 'right';
        } else {
            // 上下方向
            arrowPoint.towards = y < centerY ? 'top' : 'bottom';
        }

        // 更新箭头关联的节点
        arrowPoint.nodeId = nodeId;

        // 重新渲染图
        this.renderGraph();
    }


    public async getCurrentState() {
        return {
            data: structuredClone(this.data),
            arrowPoints: structuredClone(this.arrowPoints),
        };
    }

    public async restoreState(state: any) {
        this.data = state.data;
        this.arrowPoints = state.arrowPoints;
        this.renderGraph();
    }
}

// 图矩阵组件
export class GraphMatrixComponent extends HTMLElement {
    private data: AdjacencyMatrix | null= null;
    private scale: number = 1; // 缩放倍数
    private renderer = new GraphAdjacencyMatrixRendererStrategy();
    private changeColorMap: { [key: number]: string } = {};
    private blinkMap: { [key: number]: boolean } = {};

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = this.initializeStyles();
    }

    connectedCallback() {
        if (this.isConnected && this.data) {
            this.renderGraphMatrix();
        }
    }

    private initializeStyles(): string {
        return `
            <style>
                @keyframes blinkAnimation {
                    50% {
                        background-color: rgb(255, 153, 102);
 
                    }
                }

                @keyframes fadeIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                @keyframes shrink {
                    to { transform: scale(0); opacity: 0; }
                }

                .blink {
                    animation: blinkAnimation 1s infinite; 
                    animation-direction: alternate;
                    animation-fill-mode: both;
                }
                .inner-block {
                    display: flex;
                }
                
                .l-box {
                    font-size: 25px;
                    width: 80px;
                    height: 60px;
                    background-color: #CCFFCC;
                    border: 1px solid black;
                }
                
                .mid {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    align-content: center;
                }
                
                .diagonal-box {
                    position: relative;
                }
                .diagonal-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(225deg, transparent 49%, black 49%, black 51%, transparent 51%);
                }
                
                .graph-matrix-container {
                    padding: 12px;
                    border: 2px solid #4CAF50;
                    background-color: #E6F4EA; /* 浅绿色背景 */
                    border-radius: 8px;
                    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    width: fit-content;
                    min-width: max-content;
                }
                
                /* 当容器没有内容时，移除背景色 */
                .graph-matrix-container:empty {
                    background-color: transparent;
                    border: none; 
                    box-shadow: none;
                }
                
                .graph-matrix-title {
                    font-size: 20px;  /* 设置字体大小 */
                    color: #388E3C;   /* 设置文本颜色，深绿色 */
                    font-weight: bold;  /* 加粗文本 */
                    text-align: center;  /* 文本居中对齐 */
                    margin-top: 10px;  /* 设置顶部间距 */
                    padding: 5px;      /* 添加内边距 */
                }
                
                /* 标题单元格（索引行、索引列） */
                .header-cell {
                    height: 40px;
                    width: 40px;
                    font-weight: bold;
                    background-color: #A3D9A5;  /* 深绿色背景 */
                    border: 1px solid #4CAF50;
                    color: #2E7D32; /* 深绿色文字 */
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                }
    
                /* 矩阵内容单元格 */
                .content-cell {
                    height: 40px;
                    width: 40px;
                    border: 1px solid #4CAF50;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #D4EDDA; /* 浅绿色 */
                    color: #1B5E20; /* 更深的绿色 */
                    font-weight: bold;
                    border-radius: 4px;
                }
    
                /* 左上角单元格，带绿色斜线 */
                .diagonal-box {
                    height: 40px;
                    width: 40px;
                    position: relative;
                    background: linear-gradient(225deg, transparent 48%, #4CAF50 48%, #4CAF50 52%, transparent 52%);
                }
    
                /* 让整个矩阵更整洁 */
                .inner-block {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                }
               
                              
            </style>
            <div class="graph-matrix-container"></div>
        `;
    }

    private renderGraphMatrix(): void {
        const graphMatrixContainer = this.shadowRoot!.querySelector('.graph-matrix-container');
        const existingTitle = this.shadowRoot!.querySelector('.graph-matrix-title');

        if (!graphMatrixContainer) return;

        if (!this.data) {
            graphMatrixContainer.innerHTML = ``;
            existingTitle?.remove();
        }

        if (!this.shadowRoot || !this.data) return;

        graphMatrixContainer.innerHTML = this.renderer.render(this.data, this.changeColorMap, this.blinkMap);

        // 如果 data.title 不为空，插入标题
        if (this.data.title) {
            existingTitle?.remove();
            const titleElement = document.createElement('div');
            titleElement.classList.add('graph-matrix-title');
            titleElement.textContent = this.data.title || '邻接矩阵G';
            graphMatrixContainer.insertAdjacentElement('afterend', titleElement);
        }
    }

    // 创建size大小的空矩阵
    public createAdjacencyMatrix(size: number, directed: boolean = false, isBoolean: boolean = false, title?: string) {
        const matrix: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
        const nodes: GraphNode[] = Array.from({ length: size }, (_, index) => ({ id: index }));

        const adjacencyMatrix: AdjacencyMatrix = {
            matrix,
            nodes,
            directed,
            isBoolean,
            title,
        };

        this.setGraphMatrixData(adjacencyMatrix);
    }
    public setGraphMatrixData(data: AdjacencyMatrix) {
        this.data = data;
        if (this.isConnected) {
            this.renderGraphMatrix();
        }
    }

    public getMatrixData(): AdjacencyMatrix | null {
        return this.data;
    }

    public setGraphTitle(title: string) {
        if (!this.isConnected || !this.data) return;
        this.data.title = title;
        this.renderGraphMatrix();
    }

    public changeNodeValue(i: number, j: number, value: number){
        if (!this.isConnected || !this.data) return;
        this.data.matrix[i][j] = value;
        const cell = this.shadowRoot!.getElementById(`cell-${i}-${j}`);
        if (!cell) return;
        cell.innerHTML = value.toString();
    }

    public changeNodeColor(i: number, j: number, color: string){
        if (!this.isConnected || !this.data) return;
        this.changeColorMap[i*this.data.nodes.length + j] = color;
        const cell = this.shadowRoot!.getElementById(`cell-${i}-${j}`);
        if (!cell) return;
        cell.style.backgroundColor = color;
    }

    public async changeRowColorUntil(
        i: number,
        j: number,
        color: string = 'rgb(255, 153, 102)',
        delay: number = 100
    ) {
        if (!this.isConnected || !this.data) return;

        const numCols = this.data.nodes.length;
        const targetCol = j === -1 ? numCols - 1 : j;
        let startCol = -1;

        // 从右向左查找已经是目标颜色的最后一个元素
        for (let col = numCols - 1; col >= 0; col--) {
            const cell = this.shadowRoot!.getElementById(`cell-${i}-${col}`) as HTMLElement;
            if (cell && cell.style.backgroundColor === color) {
                startCol = col;
                break;
            }
        }

        // 从 startCol + 1 到 targetCol，逐个变色
        for (let col = startCol + 1; col <= targetCol; col++) {
            const cell = this.shadowRoot!.getElementById(`cell-${i}-${col}`) as HTMLElement;
            if (cell) {
                cell.style.backgroundColor = color;
                this.changeColorMap[i * numCols + col] = color;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    public resetAllCellColors(defaultColor: string = '#CCFFCC') {
        if (!this.isConnected || !this.data) return;

        const numRows = this.data.nodes.length;

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numRows; j++) {
                const cell = this.shadowRoot!.getElementById(`cell-${i}-${j}`) as HTMLElement;
                if (cell) {
                    cell.style.backgroundColor = defaultColor;
                }
            }
        }

        // 清空颜色记录
        this.changeColorMap = {};
    }


    public recoverNodeColor(i: number, j: number){
        if (!this.isConnected || !this.data) return;
        const index = i * this.data.nodes.length + j;
        const cell = this.shadowRoot!.getElementById(`cell-${i}-${j}`);
        if (!cell) return;
        cell.style.backgroundColor = "";
        delete this.changeColorMap[index];
    }

    public blinkNode(i: number, j: number){
        if (!this.isConnected || !this.data) return;
        const cell = this.shadowRoot!.getElementById(`cell-${i}-${j}`);
        if (!cell) return;
        cell.classList.add('blink');
        const index = i * this.data.nodes.length + j;
        this.blinkMap[index] = true;
    }

    public clearBlinkNode(i: number, j: number){
        if (!this.isConnected || !this.data) return;
        const cell = this.shadowRoot!.getElementById(`cell-${i}-${j}`);
        if (!cell) return;
        cell.classList.remove('blink');
        const index = i * this.data.nodes.length + j;
        delete this.blinkMap[index];
    }

    public clearAllBlinkNodes() {
        if (!this.isConnected || !this.data) return;

        for (const indexStr in this.blinkMap) {
            const index = Number(indexStr);
            const i = Math.floor(index / this.data.nodes.length);
            const j = index % this.data.nodes.length;
            const cell = this.shadowRoot!.getElementById(`cell-${i}-${j}`);
            if (cell) {
                cell.classList.remove('blink');
            }
            delete this.blinkMap[index];
        }
    }


    public async getCurrentState() {
        return {
            data: structuredClone(this.data),
            changeColorMap: structuredClone(this.changeColorMap),
            blinkMap: structuredClone(this.blinkMap),
        };
    }

    public async restoreState(state: any) {
        this.data = state.data;
        this.changeColorMap = state.changeColorMap;
        this.blinkMap = state.blinkMap;
        this.renderGraphMatrix();
    }
}

export class GraphAdjacencyListComponent extends HTMLElement {
    private data: AdjacencyList | null= null;
    private scale: number = 1; // 缩放倍数
    private svg: SVGSVGElement | null = null;
    private renderer = new GraphAdjacencyListRendererStrategy();
    private connectorStrategy = new GraphAdjacencyListConnectorStrategy();
    private changeColorMap: { [key: string]: string } = {};
    private blinkMap: { [key: string]: boolean } = {};

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = this.initializeStyles();
    }

    connectedCallback() {
        if (this.isConnected && this.data) {
            this.renderGraphList();
        }
    }

    public setScale(scale: number) {
        this.scale = scale;
    }

    private initializeStyles(): string {
        return `
            <style>
                @keyframes blinkAnimation {
                    50% {
                        background-color: rgb(255, 153, 102);
                    }
                }
                svg {
                    pointer-events: none;
                }
                .blink {
                    animation: blinkAnimation 1s infinite; 
                    animation-direction: alternate;
                    animation-fill-mode: both;
                }
                .node-box {
                    border: 1px solid black;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                    width: 80px;
                    height: 40px;
                }
                .node-box-id {
                    width: 30px;
                }
                .node-box-value {
                    width: 50px;
                }

              
            </style>
            <div class="graph-adjacency-list-container" style="position: relative;"></div>
        `;
    }

    private renderGraphList(): void {
        const graphListContainer = this.shadowRoot!.querySelector('.graph-adjacency-list-container');

        if (!graphListContainer) return;

        if (!this.data) graphListContainer.innerHTML = ``;

        if (!this.shadowRoot || !this.data) return;

        graphListContainer.innerHTML = this.renderer.render(this.data, this.changeColorMap, this.blinkMap);

        // 更新背景颜色
        Object.keys(this.changeColorMap).forEach((elementId) => {
            const element = graphListContainer.querySelector(`#${elementId}`);  // 使用 querySelector 查找元素
            if (!element) return;

            // 修改该元素的子元素的背景颜色
            (element as HTMLElement).querySelectorAll(":scope > *").forEach(child => {
                (child as HTMLElement).style.backgroundColor = this.changeColorMap[elementId];
            });
        });

        // 添加闪烁效果
        Object.keys(this.blinkMap).forEach((elementId) => {
            const element = graphListContainer.querySelector(`#${elementId}`);  // 使用 querySelector 查找元素
            if (!element) return;

            // 为该元素的子元素添加 'blink' 类
            (element as HTMLElement).querySelectorAll(":scope > *").forEach(child => {
                (child as HTMLElement).classList.add('blink');
            });
        });

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.style.position = 'absolute';
        this.svg.style.top = '0';
        this.svg.style.left = '0';
        this.svg.style.width = '100%';
        this.svg.style.height = '100%';

        this.svg.setAttribute('viewBox', `0 0 ${graphListContainer.clientWidth} ${graphListContainer.clientHeight}`);
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        this.svg.innerHTML = `
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor"/>
                </marker>
            </defs>
        `;

        graphListContainer.prepend(this.svg);

        requestAnimationFrame(() => {
            if (this.svg) {
                const children = Array.from(this.svg.children);
                const nonDefsChildren = children.filter(child => child.tagName !== 'defs');
                nonDefsChildren.forEach(child => child.remove());
            }

            this.connectorStrategy.drawConnectors(this.data!, this.svg!, this.shadowRoot!, this.scale);
        });
    }

    public createAdjacencyList(size: number, directed: boolean = false) {
        const list: { [key: number]: { node: GraphNode, edges: GraphEdge[] } } = {};
        for (let i = 0; i < size; i++) {
            list[i] = {
                node: { id: i , value: String.fromCharCode('A'.charCodeAt(0) + i)},
                edges: []
            };
        }
        const adjacencyList: AdjacencyList = {
            list,
            directed
        };
        this.setGraphListData(adjacencyList);
    }

    public setGraphListData(data: AdjacencyList) {
        this.data = data;
        if (this.isConnected) {
            this.renderGraphList();
        }
    }

    public changeNodeColor(fromId: number, toId: number, color?: string) {
        if (!this.isConnected || !this.data) return;

        const defaultColor = 'rgb(255, 153, 102)';
        const finalColor = color || defaultColor;

        const nodeId = toId === -1 ? `node${fromId}` : `node${fromId}-to-node${toId}`;
        const nodeElement = this.shadowRoot!.getElementById(nodeId);
        if (!nodeElement) return;

        (nodeElement as HTMLElement).querySelectorAll(":scope > *").forEach(child => {
            (child as HTMLElement).style.backgroundColor = finalColor;
        });

        this.changeColorMap[nodeId] = finalColor;
    }


    public restoreNodeColor(fromId: number, toId: number) {
        if (!this.isConnected || !this.data) return;
        const nodeId = toId === -1 ? `node${fromId}` : `node${fromId}-to-node${toId}`;
        const nodeElement = this.shadowRoot!.getElementById(nodeId);
        if (!nodeElement) return;
        (nodeElement as HTMLElement).querySelectorAll(":scope > *").forEach(child => {
            (child as HTMLElement).style.backgroundColor = "";
        });
        delete this.changeColorMap[nodeId];
    }

    public blinkNode(fromId: number, toId: number){
        if (!this.isConnected || !this.data) return;
        const nodeId = toId === -1 ? `node${fromId}` : `node${fromId}-to-node${toId}`;
        const nodeElement = this.shadowRoot!.getElementById(nodeId);
        if (!nodeElement) return;
        (nodeElement as HTMLElement).querySelectorAll(":scope > *").forEach(child => {
            (child as HTMLElement).classList.add('blink');
        });
        this.blinkMap[nodeId] = true;
    }

    public clearBlinkNode(fromId: number, toId: number){
        if (!this.isConnected || !this.data) return;
        const nodeId = toId === -1 ? `node${fromId}` : `node${fromId}-to-node${toId}`;
        const nodeElement = this.shadowRoot!.getElementById(nodeId);
        if (!nodeElement) return;
        (nodeElement as HTMLElement).querySelectorAll(":scope > *").forEach(child => {
            (child as HTMLElement).classList.remove('blink');
        });
        delete this.blinkMap[nodeId];
    }

    public getListData(): AdjacencyList | null {
        return this.data;
    }

    public async getCurrentState() {
        return {
            data: structuredClone(this.data),
            changeColorMap: structuredClone(this.changeColorMap),
            blinkMap: structuredClone(this.blinkMap),
        };
    }

    public async restoreState(state: any) {
        this.data = state.data;
        this.changeColorMap = state.changeColorMap;
        this.blinkMap = state.blinkMap;
        this.renderGraphList();
    }
}
// 注册自定义元素
if (!customElements.get('graph-component')) {
    customElements.define('graph-component', GraphComponent);
}

if (!customElements.get('graph-adjacency-matrix-component')) {
    customElements.define('graph-adjacency-matrix-component', GraphMatrixComponent);
}

if (!customElements.get('graph-adjacency-list-component')) {
    customElements.define('graph-adjacency-list-component', GraphAdjacencyListComponent);
}