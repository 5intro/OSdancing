/**
 * @file 具体存储结构页面
 * @author 北京林业大学信息学院
 * @copyright 北京林业大学信息学院版权所有
 */
import {BASEURL} from "./base.js";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import {
    generateTabBar,
    initStorageContentFooter,
    insertContentTabBar,
    checkLogin,
    redirectTo,
} from './util.js';

function getQueryParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}
/**
 * @method
 * @desc 获取具体算法代码
 */
function getAlgoById() {
    let url = window.location.href;
    const result = getQueryParam('id');
    $.ajax({
        url:  BASEURL + "algorithm/getAlgorithmById/" + result + "/", // 替换为你的JSON数据URL
        dataType: 'json',
        success: function (data) {
            let code = data.data["code"];
            initCode(code);
        },
        error: function () {
            alert('Error loading data!');
        }
    });
}
/**
 * @method
 * @desc 初始化ace
 */
function initCode(code) {
    /**
     * 生成tabbar
     */
    generateTabBar(2);
    let pyInputAceEditor = ace.edit('codeInputPane');
    pyInputAceEditor.setValue(code);
    pyInputAceEditor.setReadOnly(true);
    $('#executeBtn').trigger('click');
    // 选择目标节点
    var target = document.getElementById('inner');
    // 创建一个观察者对象
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.target.id == 'editBtn') {
                let dom = mutation.target;
                dom.style["display"] = 'none';
            }
            // 这里可以执行你需要的操作，比如更新页面布局、触发事件等
        });
    });
    // 观察者的配置（观察目标节点的属性变化）
    var config = { attributes: true, childList: true, subtree: true };
    // 传入目标节点和观察选项并开始观察
    observer.observe(target, config);
}
$(document).ready(function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!checkLogin()) {
            alert("您当前尚未登录！");
            redirectTo("/");
            return;
        }
        insertContentTabBar(1);
        getAlgoById();
        initStorageContentFooter();
    });
});
//# sourceMappingURL=storageContent.js.map