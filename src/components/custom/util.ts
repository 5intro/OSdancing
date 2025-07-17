/**
 * @method showErrorInfo
 * @param {string} message - 传入的错误信息
 * @desc 在页面中显示错误信息，直接显示在页面正上方
 */
export function showErrorInfo(message: string): void {
    // 如果已存在错误信息，先移除
    if ($("#alert").length) {
        $("#alert").remove();
    }

    const errorDom = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" id="alert" 
             style="position: fixed; top: 10px; left: 50%; transform: translateX(-50%); z-index: 1050; width: auto;">
            <strong>出现异常!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // 将 errorDom 直接添加到 body 中
    $("body").append(errorDom);
}

