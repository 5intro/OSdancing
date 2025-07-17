/**
 * @method
 * @param {message} 传入的错误信息
 * @desc 在页面中显示错误信息
 */
export function showError(message) {
    let errorDom;
    // 修改Dom节点
    errorDom = `<div class="alert alert-danger alert-dismissible fade show" role="alert" id="alert" >
                <strong>出现异常!</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
    // jq,通过append在父节点新增子节点dom
    $("#alertWrapper").empty();
    $("#alertWrapper").append(errorDom);
}
//# sourceMappingURL=util.js.map