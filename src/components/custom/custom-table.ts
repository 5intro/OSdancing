import {SequentialStackComponent} from "@/components/custom/custom-Stack";

interface TableCell {
    value: any;
    isNew?: boolean;
    isDeleting?: boolean;
    color?: string;
}

interface TableData {
    grid: TableCell[][]; // 行列结构：grid[rowIndex][colIndex]
}

class TableRendererStrategy {
    render(data: TableData): string {
        if (!data.grid.length) {
            return `<div style="padding: 20px;"></div>`;
        }

        const rowCount = data.grid.length;
        const colCount = data.grid[0].length;

        // 生成表头（列下标）
        const thead = `
            <thead>
                <tr>
                    <th style="width: 60px;">行\列</th>
                    ${Array.from({length: colCount}, (_, colIndex) => `
                        <th style="width: 80px; font-size: 18px;">${colIndex}</th>
                    `).join('')}
                </tr>
            </thead>
        `;

        // 生成表身
        const tbody = `
            <tbody>
                ${
            data.grid.map((row, rowIndex) => `
                        <tr>
                            <!-- 行标签 -->
                            <td style="font-size: 18px; text-align: center;"></td>
                            <!-- 每个单元格 -->
                            ${row.map((cell, colIndex) => `
                                <td 
                                   class="cell${cell.isNew ? ' new-cell' : ''}${cell.isDeleting ? ' deleting' : ''}"
                                   style="
                                       border: 2px solid #666; 
                                       width: 80px; 
                                       height: 60px; 
                                       text-align: center; 
                                       vertical-align: middle;
                                       background-color: ${cell.color || '#CCFFCC'};
                                       position: relative;
                                       font-size: 20px;
                                   "
                                >
                                    ${cell.value}
                                    <!-- 在单元格下方显示列下标 -->
                                  
                                </td>
                            `).join('')}
                        </tr>
                    `).join('')
        }
            </tbody>
        `;

        return `
            <div class="table-container" style="padding: 20px;">
                <table style="border-collapse: collapse;">
<!--                    ${thead}-->
                    ${tbody}
                </table>
            </div>
        `;
    }
}

export class TableComponent extends HTMLElement {
    private data: TableData = {grid: []};
    private renderer = new TableRendererStrategy();

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        // 初始化样式
        this.shadowRoot!.innerHTML = this.initializeStyles();
        // 首次渲染
        this.renderTable();
    }

    /**
     * 获取指定行(rowIndex)与列(colIndex)的单元格值
     * @param rowIndex 行索引
     * @param colIndex 列索引
     * @returns 对应单元格的 value；若越界或不存在则返回 undefined
     */
    public getCellValue(rowIndex: number, colIndex: number) {
        if (
            rowIndex < 0 || rowIndex >= this.data.grid.length ||
            colIndex < 0 || colIndex >= this.data.grid[rowIndex]?.length
        ) {
            return undefined;
        }
        return this.data.grid[rowIndex][colIndex].value;
    }

    /**
     * 初始化表格，指定行数和列数
     * @param rowCount 行数
     * @param colCount 列数
     * @param initialValue 初始值，可选。如果传入，会用此值填充整张表格
     */
    public async init(rowCount: number, colCount: number) {
        this.data.grid = [];
        for (let r = 0; r < rowCount; r++) {
            const row: TableCell[] = [];
            if (r == 0) {
                row.push({
                    value: "结点i"
                });
                row.push({
                    value: "weight"
                });
                row.push({
                    value: "parent"
                });
                row.push({
                    value: "lchild"
                });
                row.push({
                    value: "rchild"
                });
            } else {
                row.push({
                    value: r
                });
                row.push({
                    value: ''
                })
                for (let c = 0; c < 3; c++) {
                    row.push({
                        value: '0'
                    })
                }
            }
            this.data.grid.push(row);
        }
        await this.renderTable();
        // 触发重排以应用动画
        this.triggerLayoutReflow();
    }

    /**
     * 在表格的指定位置插入一个单元格
     * 注意：此处示例是将指定行的列插入一个单元格，相当于“该行上插入列”。
     * 如果想插入整行，则需要写一个插入行的逻辑
     * @param rowIndex 第几行
     * @param colIndex 插入到该行的第几列
     * @param value 单元格的值
     */
    public async insertCell(rowIndex: number, colIndex: number, value: any) {
        if (!this.data.grid[rowIndex]) return;
        const newCell: TableCell = {
            value,
            isNew: true
        };
        this.data.grid[rowIndex].splice(colIndex, 0, newCell);
        await this.renderTable();
        this.triggerLayoutReflow();
    }

    /**
     * 在表格中插入一整行
     * @param rowIndex 在第几行之前插入
     * @param colCount 这一行的列数
     * @param defaultValue 每个单元格的默认值
     */
    public async insertRow(rowIndex: number, colCount: number, defaultValue?: any) {
        const newRow: TableCell[] = [];
        for (let c = 0; c < colCount; c++) {
            newRow.push({value: defaultValue ?? '', isNew: true});
        }
        this.data.grid.splice(rowIndex, 0, newRow);
        await this.renderTable();
        this.triggerLayoutReflow();
    }

    /**
     * 删除某个单元格
     * 注意：此示例的逻辑是“删除该单元格所在列”，剩余列向前收缩
     * 若想删除整行或整列，可自行修改
     * @param rowIndex 第几行
     * @param colIndex 第几列
     */
    public async deleteCell(rowIndex: number, colIndex: number) {
        if (!this.data.grid[rowIndex] || !this.data.grid[rowIndex][colIndex]) return;
        this.data.grid[rowIndex][colIndex].isDeleting = true;
        // 删除
        this.data.grid[rowIndex].splice(colIndex, 1);
        await this.renderTable();
        this.triggerLayoutReflow();
    }

    /**
     * 删除某一整行
     * @param rowIndex 行号
     */
    public async deleteRow(rowIndex: number) {
        if (rowIndex < 0 || rowIndex >= this.data.grid.length) return;
        // 可以先将整行标记 isDeleting，再一起删除
        this.data.grid[rowIndex].forEach(cell => cell.isDeleting = true);
        this.data.grid.splice(rowIndex, 1);
        await this.renderTable();
        this.triggerLayoutReflow();
    }

    /**
     * 改变表格中指定单元格的颜色
     * @param rowIndex 行号
     * @param colIndex 列号
     * @param color 新的颜色值（CSS 颜色字符串）
     */
    public async changeColor(rowIndex: number, colIndex: number, color: string) {
        if (!this.data.grid[rowIndex] || !this.data.grid[rowIndex][colIndex]) return;
        this.data.grid[rowIndex][colIndex].color = color;
        await this.renderTable();
    }

    /**
     * 改变表格中指定单元格的值
     * @param rowIndex 行号
     * @param colIndex 列号
     * @param value 新的值
     */
    public async changeValue(rowIndex: number, colIndex: number, value: any) {
        if (!this.data.grid[rowIndex] || !this.data.grid[rowIndex][colIndex]) return;
        this.data.grid[rowIndex][colIndex].value = value;
        await this.renderTable();
    }

    /**
     * 获取当前表格状态（包括所有单元格的值、颜色、动画标识等）
     */
    public async getCurrentState() {
        // 这里用 structuredClone 以深拷贝
        return structuredClone(this.data);
    }

    /**
     * 恢复某个之前保存的表格状态
     * @param state 之前保存的状态对象
     */
    public async restoreState(state: TableData) {
        this.data = state;
        await this.renderTable();
    }

    private async renderTable() {
        if (!this.shadowRoot) return;
        const container = this.shadowRoot.querySelector('.table-root') as HTMLElement;
        container.innerHTML = this.renderer.render(this.data);
    }

    private initializeStyles(): string {
        return `
            <style>
                .table-root {
                    position: relative;
                }

                /* 新增单元格动画 */
                .new-cell {
                    opacity: 0;
                    animation: fadeIn 0.3s forwards;
                }
                
                /* 删除单元格动画 */
                .deleting {
                    animation: shrink 0.3s forwards;
                }

                @keyframes fadeIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                @keyframes shrink {
                    to { transform: scale(0); opacity: 0; }
                }
            </style>
            <div class="table-root"></div>
        `;
    }

    /**
     * 触发一次重排，确保动画可以正确执行
     */
    private triggerLayoutReflow() {
        // 让浏览器计算一次布局
        this.shadowRoot!.querySelectorAll('.cell').forEach(cell => {
            (cell as HTMLElement).getBoundingClientRect();
        });
    }
}

if (!customElements.get('table-component')) {
    customElements.define('table-component', TableComponent);
}




