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
    description?: string; // 添加描述字段
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
            <div class="container-wrapper" style="display: flex; align-items: flex-start;">
                <div id="description-container" style="min-width: 200px;display: flex; align-items: center;"></div>
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
                                     font-size: 25px; color: black;">${data.isIndex ? data.nodes.indexOf(node) : '' }</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
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
    }

    private renderList() {
        if (!this.shadowRoot) return;

        const container = this.shadowRoot.querySelector('.sequential-container')!;
        container.innerHTML = this.renderer.render(this.data);

        // 恢复description的显示
        if (this.data.description) {
            const descriptionContainer = this.shadowRoot.getElementById('description-container');
            if (descriptionContainer) {
                descriptionContainer.innerHTML = `<div style="font-size: 25px;">${this.data.description}</div>`;
            }
        }

        this.restorePointers()
    }

    private initializeStyles(): string {
        return `
            <style>
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
                    left: -25px;
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
                    padding: 2px 5px;
                }

                .node-container {
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

                #description-container {
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    color: black;
                    text-align: right;
                    padding-top: 25px;
                }
                
                .container-wrapper {
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-start;
                    width: 100%;
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

    /**
     * 设置顺序表旁边的说明文字
     * @param text 说明文字内容
     * @param fontSize 字体大小（可选，默认25px）
     */
    public async setDescription(text: string, fontSize: string = '25px') {
        this.data.description = text;
        if (!this.shadowRoot) return;

        const container = this.shadowRoot.getElementById('description-container');
        if (container) {
            container.innerHTML = `<div style="font-size: ${fontSize};">${text}</div>`;
        }
    }
}


// 注册自定义元素
if (!customElements.get('sequential-list2')) {
    customElements.define('sequential-list2', SequentialListComponent);
}