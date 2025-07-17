// src/api/http.js
import axios from 'axios';
import {BASEURL} from "../../public/js/base";

// 创建一个 Axios 实例
const http = axios.create({
    // 设置基础的请求路径
    baseURL: BASEURL,
    // 设置请求超时时间
    timeout: 100000,
    // 这里可以设置更多的 Axios 配置
});


// 请求拦截器
// http.interceptors.request.use(
//     config => {
//         // 在发送请求之前做些什么
//         // 例如，添加认证令牌
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     error => {
//         // 对请求错误做些什么
//         return Promise.reject(error);
//     }
// );
//
// // 响应拦截器
// http.interceptors.response.use(
//     response => {
//         // 对响应数据做点什么
//         return response;
//     },
//     error => {
//         // 对响应错误做点什么
//         return Promise.reject(error);
//     }
// );

export default http;


