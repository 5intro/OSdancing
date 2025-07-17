import {BASEURL} from "./base.js";


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

export function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

/**
 * @method
 * @desc 存储数据到localStorage，并设置过期时间（单位：毫秒）
 */
export function saveToLocalStorageWithExpiry(key, value, ttl) {
    const data = {
        value: value,
        expiry: new Date().getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * @method
 * @desc 从localStorage获取数据，并检查是否过期
 */
export function getFromLocalStorageWithExpiry(key) {
    const data = localStorage.getItem(key);
    if (!data) {
        return null;
    }
    const parsedData = JSON.parse(data);
    const now = new Date().getTime();
    if (now > parsedData.expiry) {
        // 数据已过期，清除并返回null
        localStorage.removeItem(key);
        return null;
    }
    return parsedData.value;
}

/**
 * @method
 * @param {milliseconds} 暂停的时间，以毫秒计时
 * @desc 暂停运行时间
 */
export function pauseExecution(milliseconds) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    });
}

/**
 * @method
 * @desc 从localStorage删除字符串
 */
export function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

/**
 * @method
 * @desc 存储字符串到sessionStorage
 */
export function saveToSessionStorage(key, value) {
    sessionStorage.setItem(key, value);
}

/**
 * @method
 * @desc 从sessionStorage获取字符串
 */
export function getFromSessionStorage(key) {
    return sessionStorage.getItem(key);
}

/**
 * @method
 * @desc 从sessionStorage删除字符串
 */
export function removeFromSessionStorage(key) {
    sessionStorage.removeItem(key);
}

/**
 * @method
 * @desc 生成模态框
 */
export function showModal(title, info) {
    // if ($(`#showModal`).length >= 1) {
    //     return;
    // }
    $('#showModal').remove();
    let dom = $(`
    <div class="modal fade" id="showModal" tabindex="-1" aria-labelledby="showModal"
         aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="card">
                        <div class="card-body">
                            ${info}
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="text-align: right">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>`);
    $(`#app`).append(dom);
    const myModal = new bootstrap.Modal(document.getElementById('showModal'), {});
    myModal.toggle();
}

/**
 * @method
 * @desc 生成消息提示框
 */
export var commonUtil = {
    /**
     * 弹出消息框
     * @param msg 消息内容
     * @param type 消息框类型（参考bootstrap的alert）
     */
    alert: function (msg, type) {
        if (typeof (type) == "undefined") { // 未传入type则默认为success类型的消息框
            type = "success";
        }
        // 创建bootstrap的alert元素
        var divElement = $("<div></div>").addClass('alert').addClass('alert-' + type).addClass('alert-dismissible').addClass('col-md-4').addClass('col-md-offset-4');
        divElement.css({
            "position": "absolute",
            "top": "260px",
            "left": "35%",
            'z-index': 9999
        });
        divElement.addClass('mid').text(msg); // 设置消息框的内容
        // 消息框添加可以关闭按钮
        // var closeBtn = $('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        // $(divElement).append(closeBtn);
        // 消息框放入到页面中
        $('body').append(divElement);
        return divElement;
    },
    /**
     * 短暂显示后上浮消失的消息框
     * @param msg 消息内容
     * @param type 消息框类型
     */
    message: function (msg, type) {
        var divElement = commonUtil.alert(msg, type); // 生成Alert消息框
        var isIn = false; // 鼠标是否在消息框中
        divElement.on({
            mouseover: function () {
                isIn = true;
            },
            mouseout: function () {
                isIn = false;
            }
        });
        // 短暂延时后上浮消失
        setTimeout(function () {
            var IntervalMS = 20; // 每次上浮的间隔毫秒
            var floatSpace = 60; // 上浮的空间(px)
            var nowTop = divElement.offset().top; // 获取元素当前的top值
            var stopTop = nowTop - floatSpace; // 上浮停止时的top值
            divElement.fadeOut(IntervalMS * floatSpace); // 设置元素淡出
            var upFloat = setInterval(function () {
                if (nowTop >= stopTop) { // 判断当前消息框top是否还在可上升的范围内
                    divElement.css({"top": nowTop--}); // 消息框的top上升1px
                } else {
                    clearInterval(upFloat); // 关闭上浮
                    divElement.remove(); // 移除元素
                }
            }, IntervalMS);
            if (isIn) { // 如果鼠标在setTimeout之前已经放在的消息框中，则停止上浮
                clearInterval(upFloat);
                divElement.stop();
            }
            divElement.hover(function () {
                clearInterval(upFloat);
                divElement.stop();
            }, function () {
                divElement.fadeOut(IntervalMS * (nowTop - stopTop)); // 这里设置元素淡出的时间应该为：间隔毫秒*剩余可以上浮空间
                upFloat = setInterval(function () {
                    if (nowTop >= stopTop) {
                        divElement.css({"top": nowTop--});
                    } else {
                        clearInterval(upFloat); // 关闭上浮
                        divElement.remove(); // 移除元素
                    }
                }, IntervalMS);
            });
        }, 1500);
    }
};

/**
 * @method
 * @desc 生成加载中样式
 */
export function initLoading() {
    // let dom = $(`<div id="loading" class="spinner-border" style="position: absolute; top: 50%; left: 50%; z-index: 10000" role="status">
    //       <span class="sr-only"></span>
    //     </div>`);
    let dom = $(`<!-- 加载中的模态框 -->
            <div class="modal" id="loadingModal" tabindex="-1" role="dialog" aria-labelledby="loadingModalLabel" aria-hidden="true" 
            data-backdrop="static" style="z-index: 10000; background-color:transparent;">
              <div class="modal-dialog modal-dialog-centered" role="document" style="border: none">
                <div class="modal-content" style="background:transparent; border: none">
                  <div class="modal-body text-center" style="border: none">
                    <div class="spinner-border" role="status">
                      <span class="sr-only"></span>
                    </div>
<!--                    <p class="mb-0 mt-2">加载中...</p>-->
                  </div>
                </div>
              </div>
            </div>`);
    if ($(`#loading`).length <= 0)
        $(`body`).append(dom);
    let loadingModal = $('#loadingModal');
    loadingModal.modal("toggle");
}

/**
 * @method
 * @desc 销毁加载中样式
 */
export function destroyLoading() {
    // if ($(`#loading`).length > 0)
    //     $(`#loading`).remove();
    let loadingModal = $('#loadingModal');
    loadingModal.modal('hide');
}

/**
 * @method
 * @desc 显示登录窗口
 */
export function showLoginDialog() {
    let loginModal = $("#loginModal");
    loginModal.modal("toggle");
}

/**
 * @method
 * @desc 判断是否是邮箱
 */
export function isEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

/**
 * @method
 * @desc 跳转到指定url
 */
export function redirectTo(url) {
    window.location.href = url;
}

/**
 * @method
 * @desc 检查用户是否登录
 */
export function checkLogin() {
    return getFromSessionStorage('jwt_token') != null || getFromLocalStorageWithExpiry('jwt_token') != null;
}

/**
 * @method
 * @desc 生成登录注册
 */
export function initLoginOrRegister() {
    return __awaiter(this, void 0, void 0, function* () {
        let dom = $(`<!-- Modal -->
        <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModal"
             aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">登录/注册</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="loginForm">
                            <div class="card">
                                <div class="card-header">
                                    <div class="d-flex align-items-center ">
                                        <div class="text-primary mx-2 fs-6">请输入登录信息</div>
                                    </div>
                                </div>
                                <div class="card-body">
                                
                                     <input id="loginUser" type="text" class="form-control" placeholder="用户名或邮箱" aria-label="Username" aria-describedby="basic-addon1">
                                     <div style="height: 15px"></div>
                                     <input id="loginPwd" type="password" class="form-control" placeholder="密码" aria-label="Password" aria-describedby="basic-addon1">
                                     <div style="height: 15px"></div>
                                     <div class="form-check" style="margin-bottom: 15px;">
                                          <input id="check" class="form-check-input" type="checkbox" value="" checked>
                                          <label class="form-check-label" for="flexCheckChecked">
                                            记住我
                                          </label>
                                    </div>
                                    <button id="loginBtn" type="button" class="btn btn-primary w-100" style="margin-bottom: 15px;">登录</button>
                                    <div class="w-100 d-flex justify-content-between">
                                        <div style="font-size: 16px; cursor: pointer" class="text-secondary toForget">忘记密码</div>         
                                        <div style="font-size: 16px; cursor: pointer" class="text-secondary toRegister">注册</div>         
                                    </div>         
                                       
                                          
         
                                </div>
                            </div>
                        </form>   
                        <form id="registerForm" style="display: none">
                            <div class="card">
                                <div class="card-header">
                                    <div class="d-flex align-items-center ">
                                        <div class="text-primary mx-2 fs-6">请输入注册信息</div>
                                    </div>
                                </div>
                                <div class="card-body">
                                     <input id="regUser" type="text" class="form-control" placeholder="用户名" aria-label="Username" aria-describedby="basic-addon1">
                                     <div style="height: 15px"></div>
                                     <input id="regPwd" type="password" class="form-control" placeholder="密码" aria-label="Password" aria-describedby="basic-addon1">
                                     <div style="height: 15px"></div>
                                     <input id="regEmail" type="text" class="form-control" placeholder="邮箱" aria-label="Username" aria-describedby="basic-addon1">
                                     <div style="height: 15px"></div>
                                    <button type="button" class="btn btn-primary w-100" style="margin-bottom: 15px;" id="register">注册</button>
                                    <div class="w-100 d-flex justify-content-end">
                                        <div style="font-size: 16px; cursor: pointer" class="text-secondary toLogin">登录</div>         
                                    </div>      
                                </div>
                            </div>
                        </form> 
                        <form id="forgetForm" style="display: none">
                            <div class="card">
                                <div class="card-header">
                                    <div class="d-flex align-items-center ">
                                        <div class="text-primary mx-2 fs-6">请输入绑定的邮箱地址</div>
                                    </div>
                                </div>
                                <div class="card-body">
                                     <input id="forgetEmail" type="text" class="form-control" placeholder="邮箱" aria-label="Email" aria-describedby="basic-addon1">
                                     <div style="height: 15px"></div>
                                    <button id="forgetBtn" type="button" class="btn btn-primary w-100" style="margin-bottom: 15px;">发送</button>
                                    <div class="w-100 d-flex justify-content-between">
                                        <div style="font-size: 16px; cursor: pointer" class="text-secondary toLogin">登录</div>      
                                        <div style="font-size: 16px; cursor: pointer" class="text-secondary toRegister">注册</div>         
                                    </div>      
                                </div>
                            </div>
                        </form>     
    
                    </div>
                    <div class="modal-footer justify-content-between" >
                        
                    </div>
                </div>
            </div>
        </div>`);
        $(`body`).append(dom);
        $(function () {
            return __awaiter(this, void 0, void 0, function* () {
                // 切换到注册页面
                $(".toRegister").click(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        $(`#loginForm`).css('display', 'none');
                        $(`#forgetForm`).css('display', 'none');
                        yield pauseExecution(200);
                        $(`#registerForm`).fadeIn();
                    });
                });
                // 切换到登录页面
                $(".toLogin").click(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        $(`#registerForm`).css('display', 'none');
                        $(`#forgetForm`).css('display', 'none');
                        yield pauseExecution(200);
                        $(`#loginForm`).fadeIn();
                    });
                });
                // 切换到忘记密码页面
                $(".toForget").click(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        $(`#loginForm`).css('display', 'none');
                        $(`#registerForm`).css('display', 'none');
                        yield pauseExecution(200);
                        $(`#forgetForm`).fadeIn();
                    });
                });
                // 点击注册
                $("#register").click(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        let username = $('#regUser').val(), password = $('#regPwd').val(), email = $(`#regEmail`).val();
                        // 验证用户名格式
                        if (!validateUsername(username)) {
                            commonUtil.message("用户名必须包含字母和数字，长度为 6 - 20 个字符", "warning");
                            return;
                        }
                        let data = {"username": username, "password": password, "email": email};
                        if (username == undefined || username == ''
                            || password == undefined || password == '' || email == undefined || email == '') {
                            commonUtil.message("请检查用户名、密码和邮箱是否为空", "warning");
                            return;
                        }
                        initLoading();
                        $.ajax({
                            type: 'post',
                            url: BASEURL + "user/register/",
                            contentType: 'application/json', //指定字符编码格式
                            data: JSON.stringify(data),
                            success: function (data) {
                                destroyLoading();
                                if (data.data != null) {
                                    commonUtil.message(data["msg"], "success");
                                }
                                else commonUtil.message(data["msg"], "warning");
                            },
                            error: function () {
                                alert('Error loading data!');
                            }
                        });
                    });
                });
                // 点击登录
                $("#loginBtn").click(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        let username = String($('#loginUser').val()), password = $('#loginPwd').val();
                        let check = $('#check').prop('checked'), type = 1;
                        if (isEmail(username))
                            type = 2;
                        let data = {"username": username, "password": password, "type": type};
                        if (username == undefined || username == '' || password == undefined || password == '') {
                            commonUtil.message("请检查用户名密码是否为空", "warning");
                            return;
                        }
                        initLoading();
                        $.ajax({
                            type: 'post',
                            url: BASEURL + "user/login/",
                            contentType: 'application/json', //指定字符编码格式
                            data: JSON.stringify(data),
                            success: function (data) {
                                destroyLoading();
                                if (data.data != null) {
                                    commonUtil.message(data["msg"], "success");
                                    let jwt_token = data.data["jwt_token"];
                                    if (check) {
                                        let time = 30 * 24 * 60 * 1000;
                                        saveToLocalStorageWithExpiry("jwt_token", jwt_token, time);
                                    } else {
                                        saveToSessionStorage("jwt_token", jwt_token);
                                    }
                                    redirectTo('/');
                                } else commonUtil.message(data["msg"], "warning");
                            },
                            error: function () {
                                alert('Error loading data!');
                            }
                        });
                    });
                });
                $("#forgetBtn").click(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        let email = String($('#forgetEmail').val());
                        if (email == undefined || email == '') {
                            commonUtil.message("请检查邮箱是否为空", "warning");
                            return;
                        }
                        let data = {'email': email};
                        initLoading();
                        $.ajax({
                            type: 'post',
                            url: BASEURL + "user/forget/",
                            contentType: 'application/json', //指定字符编码格式
                            data: JSON.stringify(data),
                            success: function (data) {
                                destroyLoading();
                                if (data.data != null) commonUtil.message(data["msg"], "success");
                                else commonUtil.message(data["msg"], "warning");
                            },
                            error: function () {
                                alert('Error loading data!');
                            }
                        });
                    });
                });
            });
        });
    });
}

// 验证用户名格式的函数
function validateUsername(username) {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
    return regex.test(username);
}

/**
 * @method
 * @desc 生成底部footer
 */
export function initStorageContentFooter() {
    let dom = $(`
        <div class="card-footer text-body-secondary text-center" id="end">
            <div class="w-100">
                Original tool © 2010-2018 Philip Guo. This version by CS Circles.
            </div>
        </div>
`);
    $(`body`).append(dom);
}

/**
 * @method
 * @desc 生成底部footer
 */
export function initFooter() {
    let dom = $(`
         <footer class="d-flex flex-column align-items-center py-3 my-4 border-top">
          <ul class="nav justify-content-center list-unstyled d-flex mb-3">
            <li class="ms-3"><a class="text-muted" href="/agreement" style="text-decoration: none">用户协议&nbsp&nbsp| </a ></li>
            <li class="ms-3"><a class="text-muted" href="/privacy" style="text-decoration: none">隐私政策&nbsp&nbsp| </a ></li>
<!--            <li class="ms-3"><a class="text-muted" href="#" style="text-decoration: none">常见问题&nbsp&nbsp| </a ></li>-->
            <li class="ms-3"><a class="text-muted" href="/contactus" style="text-decoration: none">联系我们</a ></li>
          </ul>
          <div class="d-flex align-items-center">
            <img src="/img/pic014.png" alt="北京林业大学" width="80" height="80" class="d-inline-block align-text-top mb-2" style="margin-right: 20px">
            <div class="flex-column">
                <span class="text-muted">© 北京中科启迪数码科技有限公司 版权所有</span><br/>
                <span class="text-muted">地址：北京市海淀区清华东路35号</span><br/>
                <span class="text-muted">邮编：100083 电话：010-62338279</span>
            </div>
          </div>
        </footer>
`);
    $(`body`).append(dom);
}

/**
 * @method
 * @desc 生成内容页导航栏
 */
export function insertContentTabBar(idx) {
    let url = window.location.href;
    const result = getNumberAfterLastSlash(url);
    let storageJump = `/storageContent/${result}`;
    let logicalJump = `/logicalContent/${result}`;
    let exerciseJump = `/exercise/${result}`;
    let dom = $(`<ul class="nav nav-pills justify-content-evenly">
            <li class="nav-item">
                <a class="nav-link" href=${logicalJump} id="a-2">逻辑结构展示</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" aria-current="page" href=${storageJump} id="a-1">存储结构展示</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href=${exerciseJump} id="a-3">编程练习</a>
            </li>
        </ul>`);
    $(`#cardHeader`).append(dom);
    $(`#a-${idx}`).addClass("active");
}

/**
 * @method
 * @desc 退出登录
 */
export function logout() {
    if (getFromSessionStorage("jwt_token") != null)
        removeFromSessionStorage("jwt_token");
    if (getFromLocalStorageWithExpiry("jwt_token") != null)
        removeFromLocalStorage('jwt_token');
}

/**
 * @method
 * @desc 生成导航栏
 */
export function generateTabBar(idx) {
    let style = 'text-decoration: none;\n' +
        '  font-size: 26px;\n' +
        '  padding: 0.5rem 1rem;\n' +
        '  border-radius: 32px;\n' +
        '  margin-left: 10px;\n' +
        '  transition: background-color 0.3s;'
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * 生成上方的导航栏
         */
        let navDom = $(`
        <nav class="navbar navbar-expand-lg custom-navbar">
          <div class="container-fluid"  style="height: 60px">
            <!-- Logo -->
            <div class="nav-item">
              <a class="navbar-brand logo" href="/">
                <img src="/img/logo3.jpg" alt="Logo" height="55" class="d-inline-block align-text-top">
              </a>
            </div>

            <!-- 右侧导航内容 -->
            <div class="navbar-collapse justify-content-end" style="margin-right: 10px;">
              <!-- 导航菜单 -->
              <ul class="navbar-nav nav-pills nav-fill">
                <li class="nav-item" style="margin-right: 20px">
                  <a  class="nav-link" href="/" id="bar-1" style="color: #333">首页</a>
                </li>
                <li class="nav-item" style="margin-right: 20px">
                  <a class="nav-link" href="/dataStructure" id="bar-2" style="color: #333">数据结构算法演示</a>
                </li>
                <li class="nav-item" style="margin-right: 20px">
                  <a class="nav-link" href="/live.html" id="bar-3" style="color: #333">自定义算法演示</a>
                </li>
                <li class="nav-item" style="margin-right: 20px">
                  <a class="nav-link" href="/onlineEvaluation" id="bar-4" style="color: #333">在线评测系统</a>
                </li>
                <li class="nav-item" style="margin-right: 20px">
                  <a class="nav-link" href="/others" id="bar-5" style="color: #333">其他课程算法演示</a>
                </li>
              </ul>

              <!-- 用户登录/注册 -->
              <div  style="margin-right: 20px;">
                <button type="button" class="btn btn-outline-secondary" id="login">登录/注册</button>
              </div>
            </div>
          </div>
        </nav>
    `);
        yield initLoginOrRegister();
        navDom.prependTo('body');
        // 判断是否登录，如果登录需要改一下
        if (checkLogin()) {
            let jwt_token = getFromLocalStorageWithExpiry('jwt_token');
            if (getFromSessionStorage('jwt_token') != null)
                jwt_token = getFromSessionStorage('jwt_token');
            $.ajax({
                url: BASEURL + "user/parseJwtToken?jwt_token=" + jwt_token,
                success: function (data) {
                    data = data.data;
                    let space = $(`<div class="dropdown" style="margin-left: 30px;">
                      <div type="button" class="dropdown-toggle" style="color: black" data-bs-toggle="dropdown" >
                        ${data["username"]}
                      </div>
                      <div class="dropdown-menu" style="background-color:#fafafa;">
                        <a class="dropdown-item" href="#" id="logout">退出登录</a>
                      </div>
                    </div>
                `);
                    $(function () {
                        $("#logout").click(function () {
                            logout();
                            redirectTo('/');
                        });
                    });
                    $(`#login`).replaceWith(space);
                },
                error: function () {
                    alert('Error loading data!');
                }
            });
        }
        $(function () {
            $("#login").click(function () {
                showLoginDialog();
            });
        });
        if (idx != 0)
            $(`#bar-${idx}`).css("color", "#489fc8");
        $(`#pic-${idx}`).attr("src", `/img/pic00${2 * idx + 1}.png`);
        if (idx == 4) {
            $(`#search`).css("bottom", "-10px");
        }
    });
}

/**
 * @method
 * @desc 获取url中最后的数字参数
 */
export function getNumberAfterLastSlash(url) {
    const lastSlashIndex = url.lastIndexOf('/');
    // 如果没有找到'/'，则返回null
    if (lastSlashIndex === -1) {
        return null;
    }
    // 截取最后一个'/'之后的所有字符
    const partAfterSlash = url.substring(lastSlashIndex + 1);
    // 使用正则表达式匹配数字
    const match = partAfterSlash.match(/\d+/);
    // 如果没有匹配到数字，则返回null；否则返回第一个匹配项
    return match ? match[0] : null;
}