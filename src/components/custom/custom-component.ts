class AlgorithmTitle extends HTMLElement {
    private wrapper: HTMLDivElement;

    constructor() {
        super(); // 调用父类 HTMLElement 的构造函数

        // 创建 shadow DOM
        this.attachShadow({ mode: 'open' });

        // 创建内容容器
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'text-center');

        // 创建标题元素
        const title = document.createElement('h3');
        title.setAttribute('class', 'display-6 text-primary');

        // 将标题添加到容器中
        this.wrapper.appendChild(title);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .text-center {
                text-align: center;
            }
            .display-6 {
                font-size: 1.8rem;
                font-weight: 400;
            }
            .text-primary {
                color: #007bff;
            }
        `;
        this.shadowRoot?.appendChild(style);

        // 将容器添加到 shadow DOM
        this.shadowRoot?.appendChild(this.wrapper);
    }

    connectedCallback() {
        // 获取传递给元素的文本内容
        const title = this.shadowRoot?.querySelector('h3');
        if (title) {
            title.textContent = this.textContent?.trim() || 'Default Title';
        }
    }
}

// 注册自定义元素
if (!customElements.get('algorithm-title')) {
    customElements.define('algorithm-title', AlgorithmTitle);
}

class AlgorithmDesc extends HTMLElement {
    private wrapper: HTMLDivElement;

    constructor() {
        super(); // 调用父类 HTMLElement 的构造函数

        // 创建 shadow DOM
        this.attachShadow({ mode: 'open' });

        // 创建内容容器
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'text-center');

        // 创建标题元素
        const title = document.createElement('h3');
        title.setAttribute('class', 'display-6 text-primary');

        // 将标题添加到容器中
        this.wrapper.appendChild(title);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .text-center {
                text-align: center;
            }
            .display-6 {
                font-size: 1.5rem;
                font-weight: 400;
            }
            .text-primary {
                // color: #007bff;
            }
        `;
        this.shadowRoot?.appendChild(style);

        // 将容器添加到 shadow DOM
        this.shadowRoot?.appendChild(this.wrapper);
    }

    connectedCallback() {
        // 获取传递给元素的文本内容
        const title = this.shadowRoot?.querySelector('h3');
        if (title) {
            title.textContent = this.textContent?.trim() || 'Default Title';
        }
    }
}

// 注册自定义元素
if (!customElements.get('algorithm-desc')) {
    customElements.define('algorithm-desc', AlgorithmDesc);
}

class InputForm extends HTMLElement {
    private wrapper: HTMLDivElement;

    constructor() {
        super(); // 调用父类 HTMLElement 的构造函数

        // 创建 shadow DOM
        this.attachShadow({ mode: 'open' });

        // 创建内容容器
        this.wrapper = document.createElement('div');
        this.wrapper.setAttribute('class', 'container mid');
        this.wrapper.setAttribute('id', 'inputWrapper');

        // 插入位置表单
        const positionDiv = document.createElement('div');

        const positionLabel = document.createElement('div');
        positionLabel.setAttribute('class', 'mb-2 mid');
        positionLabel.setAttribute('style', 'font-size: 1rem;');
        positionLabel.textContent = '请输入插入位置i';
        const positionGroup = document.createElement('div');
        positionGroup.setAttribute('class', 'input-group mb-3 input-min-size');
        positionGroup.setAttribute('style', 'width: 100%;');

        const positionSpan = document.createElement('span');
        positionSpan.setAttribute('class', 'input-group-text');
        positionSpan.textContent = '插入位置';

        const positionInput = document.createElement('input');
        positionInput.setAttribute('id', 'inp_pos input_content');
        positionInput.setAttribute('type', 'text');
        positionInput.setAttribute('class', 'form-control');
        positionInput.setAttribute('placeholder', '请输入[1~n+1]，n为链表长度');
        positionInput.setAttribute('aria-describedby', 'basic-addon1');
        positionInput.value = '3';

        positionGroup.appendChild(positionSpan);
        positionGroup.appendChild(positionInput);
        positionDiv.appendChild(positionLabel);
        positionDiv.appendChild(positionGroup);

        // 待插入元素表单
        const valueDiv = document.createElement('div');
        valueDiv.setAttribute('style', 'margin-left: 20px;');
        const valueLabel = document.createElement('div');
        valueLabel.setAttribute('class', 'mb-2 mid');
        valueLabel.setAttribute('style', 'font-size: 1rem;');
        valueLabel.textContent = '请输入待插入的元素e';
        const valueGroup = document.createElement('div');
        valueGroup.setAttribute('class', 'input-group mb-3 input-min-size');
        valueGroup.setAttribute('style', 'width: 100%;');

        const valueSpan = document.createElement('span');
        valueSpan.setAttribute('class', 'input-group-text');
        valueSpan.textContent = '元素';

        const valueInput = document.createElement('input');
        valueInput.setAttribute('id', 'val input_content');
        valueInput.setAttribute('type', 'text');
        valueInput.setAttribute('class', 'form-control');
        valueInput.setAttribute('placeholder', '请输入一个整数');
        valueInput.setAttribute('aria-describedby', 'basic-addon1');
        valueInput.value = '20';

        valueGroup.appendChild(valueSpan);
        valueGroup.appendChild(valueInput);
        valueDiv.appendChild(valueLabel);
        valueDiv.appendChild(valueGroup);

        // 将两个表单部分添加到 wrapper 中
        this.wrapper.appendChild(positionDiv);
        this.wrapper.appendChild(valueDiv);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .mid {
                display: flex;
                justify-content: center;
                align-items: center;
                align-content: center;
            }
            .input-min-size {
                max-width: 300px;
            }
            .input-group-text {
                min-width: 120px;
            }
        `;

        this.shadowRoot?.appendChild(style);

        // 获取构建时的 BASE_URL
        const baseUrl = process.env.BASE_URL || '';

        // 创建 link 标签来引入外部 Bootstrap 样式
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // 使用 BASE_URL 动态拼接路径
        link.href = `${baseUrl}css/bootstrap.css`;

        // 将 link 标签添加到 shadowRoot 中
        this.shadowRoot?.appendChild(link);

        // 将 wrapper 添加到 shadow DOM
        this.shadowRoot?.appendChild(this.wrapper);
    }

    connectedCallback() {
        // 你可以在这里访问 this.shadowRoot 和其他 DOM 元素
    }

    // 获取插入位置
    get position() {
        const positionInput = this.shadowRoot?.querySelector('#inp_pos') as HTMLInputElement;
        return positionInput ? positionInput.value : '';
    }

    // 获取待插入元素
    get value() {
        const valueInput = this.shadowRoot?.querySelector('#val') as HTMLInputElement;
        return valueInput ? valueInput.value : '';
    }
}

// 注册自定义元素
if (!customElements.get('input-form')) {
    customElements.define('input-form', InputForm);
}

