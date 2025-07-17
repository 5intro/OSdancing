"use strict";
class AlgorithmTitle extends HTMLElement {
    constructor() {
        super();
        // 创建 shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });
        // 创建内容容器
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'text-center');
        // 创建标题元素
        const title = document.createElement('h5');
        title.setAttribute('class', 'display-6 text-primary');
        // 设置标题文本内容为标签内的内容
        title.textContent = this.innerHTML;
        // 将标题添加到容器中
        wrapper.appendChild(title);
        // 将容器添加到 shadow DOM
        shadow.appendChild(wrapper);
        // 也可以在这里添加样式
        const style = document.createElement('style');
        style.textContent = `
                    .text-center {
                        text-align: center;
                    }
                    .display-6 {
                        font-size: 1.25rem;
                        font-weight: 600;
                    }
                    .text-primary {
                        color: #007bff;
                    }
                `;
        shadow.appendChild(style);
    }
}
if (!customElements.get('algorithm-title')) {
    customElements.define('algorithm-title', AlgorithmTitle);
}
//# sourceMappingURL=custom-component.js.map