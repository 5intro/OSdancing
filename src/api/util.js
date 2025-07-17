import http from "@/api/http";
import {
    redirectTo,
    isEmail,
    saveToLocalStorageWithExpiry,
    saveToSessionStorage,
    pauseExecution,
    commonUtil
} from "../../public/js/util";

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
    if ($(`#loadingModal`).length <= 0)
        $(`#app`).append(dom);
    const myModal = new bootstrap.Modal(document.getElementById('loadingModal'), {});
    myModal.toggle();
    return myModal


}

export function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

/**
 * @method
 * @desc 生成登录注册
 */
export async function initLoginOrRegister() {
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
                                     <div class="input-group">
                                         <input id="loginPwd" type="password" class="form-control" placeholder="密码" aria-label="Password" aria-describedby="basic-addon1">
                                         <button class="btn btn-outline-secondary" type="button" id="loginPwdToggle">
                                            <div id="showText">显示密码</div>                                        
                                         </button>
                                     </div>
                                     <div class="d-flex align-items-center">
                                        <div id="loginPwdStrength1"></div>  
                                        <div id="loginPwdStrength"></div>                        
                                     </div>
                                     
                                     <div style="height: 15px"></div>
                                     <div class="form-check" style="margin-bottom: 15px;">
                                          <input id="check" class="form-check-input" type="checkbox" value="" checked>
                                          <label class="form-check-label" for="flexCheckChecked">
                                            记住我
                                          </label>
                                    </div>
                                    <!-- 登录验证码输入框 -->
                                    <div class="input-group mb-3">
                                        <input id="loginCaptcha" type="text" class="form-control" placeholder="验证码" aria-label="Captcha" aria-describedby="basic-addon1">
                                        <canvas id="loginCaptchaCanvas" width="140" height="40"></canvas>
                                        <button class="btn btn-outline-secondary" type="button" id="loginCaptchaRefresh">刷新</button>
                                    </div>
                                    <button id="loginBtn" type="button" class="btn btn-primary w-100" style="margin-bottom: 15px;">登录</button>
                                    <div class="w-100 d-flex justify-content-between">
                                        <div style="font-size: 16px; cursor: pointer" class="text-secondary toForget">忘记密码</div>
                                        <div style="display: flex; align-items: center">
                                            
                                            <div style="font-size: 16px; cursor: pointer" class="text-secondary toRegister">注册</div>                            
                                        </div>

                                    </div>
                                    <div>
                                更多登录方式：
                                <a id="third_party_weixin_connect_link_base" class = " toWechat" href="#" style="margin-right: 5px">
                                    <img class="img" src="https://cdn.acwing.com/static/web/img/third_party_icons/icon48_wx_logo.png" width="30px" alt="微信图标">
                                </a>
                              </div>
<!--                                    <div style="margin-right: 10px;font-size: 16px; cursor: pointer" class="text-secondary ">微信登录</div>-->
                                </div>
                            </div>
                        </form>
                        <form id="weChatForm" style="display: none">
                            <div class="card">
<!--                                <div class="card-header">-->
<!--                                    <div class="d-flex align-items-center ">-->
<!--                                        <div class="text-primary mx-2 fs-6">请输入注册信息</div>-->
<!--                                    </div>-->
<!--                                </div>-->
                                <div class="card-body">
                                     <div>
                                        <img id="img">
                                    </div>
                                    <div class="w-100 d-flex justify-content-between">
                                        <div style="font-size: 16px; cursor: pointer" class="text-secondary toLogin">登录</div>
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
                                     <div class="input-group">
                                         <input id="regPwd" type="password" class="form-control" placeholder="密码" aria-label="Password" aria-describedby="basic-addon1">
                                         <button class="btn btn-outline-secondary" type="button" id="regPwdToggle">
                                              <div id="regPwdText">隐藏密码</div>                                   
                                         </button>
                                     </div>
                                     <div style="display: flex; align-items: center; margin-top: 5px; text-align: center">
                                         <div id="regPwdStrength1"></div>
                                         <div id="regPwdStrength" style=""></div>              
                                     </div>
                                     
                                     <div style="height: 15px"></div>
                                     <input id="regEmail" type="text" class="form-control" placeholder="邮箱" aria-label="Username" aria-describedby="basic-addon1">
                                     <div style="height: 15px"></div>
                                     <!-- 注册验证码输入框 -->
                                    <div class="input-group mb-3">
                                        <input id="regCaptcha" type="text" class="form-control" placeholder="验证码" aria-label="Captcha" aria-describedby="basic-addon1">
                                        <canvas id="regCaptchaCanvas" width="140" height="40"></canvas>
                                        <button class="btn btn-outline-secondary" type="button" id="regCaptchaRefresh">刷新</button>
                                    </div>
                                    <button type="button" class="btn btn-primary w-100" style="margin-bottom: 15px;" id="register">注册</button>
                                    <div class="w-100 d-flex justify-content-between">
                                        <div style="font-size: 16px; cursor: pointer" class="text-secondary toLogin">登录</div>
                                        <div style="margin-right: 10px;font-size: 16px; cursor: pointer" class="text-secondary toWechat">微信登录</div>

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
    $(`#app`).append(dom);

    // 生成验证码的函数
    function generateCaptcha() {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 4; i++) {
            captcha += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return captcha;
    }

    // 绘制验证码到 canvas 的函数
    function drawCaptcha(canvasId, captcha) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 设置背景颜色
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制干扰线
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.strokeStyle = getRandomColor();
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // 绘制验证码字符
        for (let i = 0; i < captcha.length; i++) {
            ctx.font = '24px Arial';
            ctx.fillStyle = getRandomColor();
            ctx.fillText(captcha[i], 20 + i * 18, 30);
        }
    }

    // 生成随机颜色的函数
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }

    // 初始化登录和注册的验证码
    let loginCaptcha = generateCaptcha();
    drawCaptcha('loginCaptchaCanvas', loginCaptcha);
    let regCaptcha = generateCaptcha();
    drawCaptcha('regCaptchaCanvas', regCaptcha);

    $(async function () {
        // 切换到注册页面
        $(".toRegister").click(async function () {
            $(`#loginForm`).css('display', 'none');
            $(`#forgetForm`).css('display', 'none');
            $(`#weChatForm`).css('display', 'none');

            await pauseExecution(200);
            $(`#registerForm`).fadeIn();
        });
        // 切换到登录页面
        $(".toLogin").click(async function () {
            $(`#registerForm`).css('display', 'none');
            $(`#forgetForm`).css('display', 'none');
            $(`#weChatForm`).css('display', 'none');

            await pauseExecution(200);
            $(`#loginForm`).fadeIn();
        });
        // 切换到忘记密码页面
        $(".toForget").click(async function () {
            $(`#loginForm`).css('display', 'none');
            $(`#registerForm`).css('display', 'none');
            $(`#weChatForm`).css('display', 'none');
            await pauseExecution(200);
            $(`#forgetForm`).fadeIn();
        });
        // 切换到忘记密码页面
        $(".toWechat").click(async function () {
            $(`#loginForm`).css('display', 'none');
            $(`#registerForm`).css('display', 'none');
            $(`#forgetForm`).css('display', 'none');
            await pauseExecution(200);
            const response = await http.get('/user/weChatLogin/');
            console.log(response);
            let url = response.data.data.url
            let scene = response.data.data.scene
            $(`#img`).attr('src', url);
            $(`#weChatForm`).fadeIn();
            let tem_poll = setInterval(async () => {
                const resp1 = await http.get('/user/weChatVerify?scene=' + scene);

                if (resp1.data.data != null) {
                    // 清除定时器
                    clearInterval(this.tem_poll)
                    let jwt_token = resp1.data.data;
                    saveToSessionStorage("jwt_token", jwt_token);
                    redirectTo('/')
                }
            }, 1000)
        });
        // 密码可见性切换 - 登录
        $("#loginPwdToggle").click(function () {
            const passwordInput = $("#loginPwd");

            const icon = $(this).find("i");
            if (passwordInput.attr("type") === "password") {
                $(`#showText`).text("隐藏密码")
                passwordInput.attr("type", "text");
            } else {
                $(`#showText`).text("显示密码")
                passwordInput.attr("type", "password");
            }
        });
        // 密码可见性切换 - 注册
        $("#regPwdToggle").click(function () {
            const passwordInput = $("#regPwd");
            const icon = $(this).find("i");
            if (passwordInput.attr("type") === "password") {
                $('#regPwdText').text("隐藏密码")
                passwordInput.attr("type", "text");

            } else {
                $('#regPwdText').text("显示密码")

                passwordInput.attr("type", "password");

            }
        });
        // 动态显示密码强度 - 登录
        $("#loginPwd").on("input", function () {
            const password = $(this).val();
            const strength = calculatePasswordStrength(password);
            updatePasswordStrengthDisplay("loginPwdStrength", strength);
        });
        // 动态显示密码强度 - 注册
        $("#regPwd").on("input", function () {
            const password = $(this).val();
            const strength = calculatePasswordStrength(password);
            updatePasswordStrengthDisplay("regPwdStrength", strength);
        });
        // 刷新登录验证码
        $("#loginCaptchaRefresh").click(function () {
            loginCaptcha = generateCaptcha();
            drawCaptcha('loginCaptchaCanvas', loginCaptcha);
        });
        // 刷新注册验证码
        $("#regCaptchaRefresh").click(function () {
            regCaptcha = generateCaptcha();
            drawCaptcha('regCaptchaCanvas', regCaptcha);
        });
        // 点击注册
        $("#register").click(async function () {
            let username = $('#regUser').val(), password = $('#regPwd').val(), email = $(`#regEmail`).val();
            let captchaInput = $('#regCaptcha').val();
            // 验证验证码
            if (captchaInput !== regCaptcha) {
                commonUtil.message("验证码输入错误，请重新输入", "warning");
                regCaptcha = generateCaptcha();
                drawCaptcha('regCaptchaCanvas', regCaptcha);
                return;
            }
            // 验证用户名格式
            if (!validateUsername(username)) {
                commonUtil.message("用户名必须包含字母和数字，长度为 6 - 20个字符", "warning");
                return;
            }
            // 验证密码复杂度
            if (!validatePassword(password)) {
                commonUtil.message("密码至少8个字符，且包含大小写字母、数字和特殊字符", "warning");
                return;
            }
            let data = {"username": username, "password": password, "email": email};
            if (username == undefined || username == ''
                || password == undefined || password == '' || email == undefined || email == '') {
                commonUtil.message("请检查用户名、密码和邮箱是否为空", "warning");
                return;
            }
            let modal = initLoading();
            const response = await http.post('/user/register/', data);
            modal.hide();

            if (response.data.data == null)
                commonUtil.message(response.data.msg, "warning");
            else commonUtil.message(response.data.msg, "success");
        });
        // 点击登录
        $("#loginBtn").click(async function () {
            let username = String($('#loginUser').val()), password = $('#loginPwd').val();
            let check = $('#check').prop('checked'), type = 1;
            let captchaInput = $('#loginCaptcha').val();
            // 验证验证码
            if (captchaInput !== loginCaptcha) {
                commonUtil.message("验证码输入错误，请重新输入", "warning");
                loginCaptcha = generateCaptcha();
                drawCaptcha('loginCaptchaCanvas', loginCaptcha);
                return;
            }
            if (isEmail(username)) type = 2;
            // 验证密码复杂度
            // if (!validatePassword(password)) {
            //     // commonUtil.message("密码至少8个字符，且包含大小写字母、数字和特殊字符", "warning");
            //     return;
            // }
            let data = {"username": username, "password": password, "type": type};
            if (username == undefined || username == '' || password == undefined || password == '') {
                commonUtil.message("请检查用户名密码是否为空", "warning");
                return;
            }
            let modal = initLoading();
            const response = await http.post('/user/login/', data);
            modal.hide();

            if (response.data.data == null) {
                commonUtil.message(response.data.msg, "warning");
                destroyLoading();
                return;
            } else {
                commonUtil.message(response.data.msg, "success");
                let jwt_token = response.data.data;
                if (check) {
                    let time = 30 * 24 * 60 * 1000;
                    saveToLocalStorageWithExpiry("jwt_token", jwt_token, time);
                } else {
                    saveToSessionStorage("jwt_token", jwt_token);
                }
            }
            redirectTo('/');
        });
        $("#forgetBtn").click(async function () {
            let email = String($('#forgetEmail').val());
            if (email == undefined || email == '') {
                commonUtil.message("请检查邮箱是否为空", "warning");
                return;
            }
            let data = {'email': email};
            let modal = initLoading();
            const response = await http.post('/user/forget/', data);
            modal.hide();
            if (response.data.data == null)
                commonUtil.message(response.data.msg, "warning");
            else commonUtil.message(response.data.msg, "success");
        });
    });
}

// 验证用户名格式的函数
function validateUsername(username) {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
    return regex.test(username);
}

// 验证密码复杂度的函数
function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

// 计算密码强度的函数
function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
}

// 更新密码强度显示的函数
function updatePasswordStrengthDisplay(elementId, strength) {
    const strengthElement = $(`#${elementId}`);
    const strengthElement1 = $(`#${elementId}1`);
    let text = "";
    let color = "";
    if (strength < 2) {
        strengthElement1.text("当前密码强度：")
        text = "弱";
        color = "red";
    } else if (strength < 4) {
        strengthElement1.text("当前密码强度：")
        text = "中";
        color = "orange";
    } else {
        strengthElement1.text("当前密码强度：")
        text = "强";
        color = "green";
    }
    strengthElement.text(text).css("color", color);
}