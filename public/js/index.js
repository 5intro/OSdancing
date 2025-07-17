/**
 * @file 自定义算法演示
 * @author 北京林业大学信息学院
 * @copyright 北京林业大学信息学院版权所有
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import {checkLogin, commonUtil, generateTabBar, initStorageContentFooter, redirectTo} from './util.js';
$(document).ready(function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!checkLogin()) {
            commonUtil.message("尚未登录！", "warning");
            // alert("您当前尚未登录！");
            redirectTo("/");
            return;
        }
        /**
         * 生成tabbar
         */
        generateTabBar(3);
        initStorageContentFooter();
    });
});
//# sourceMappingURL=index.js.map