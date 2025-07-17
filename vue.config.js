const { defineConfig } = require('@vue/cli-service')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
var WebpackObfuscator = require("webpack-obfuscator");
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
      output: {
          filename: '[name].[contenthash:8].js',
          chunkFilename: '[name].[contenthash:8].js'
      },
    devtool: false, // 不生成source map
    // plugins: [
    //   new CompressionWebpackPlugin({
    //     test: /\.(js|css|html)?$/i,//压缩文件格式
    //     filename: '[path][base].gz',//压缩后文件名
    //     algorithm: 'gzip',//使用gzip压缩
    //     minRatio: 0.8//压缩率小于0.8才会压缩
    //   }),
    //   new WebpackObfuscator({
    //     compact: true,// 在一行上紧凑的代码输出
    //     controlFlowFlattening: false,// 极大的影响性能，不建议使用
    //     controlFlowFlatteningThreshold: .75,// 较大的代码大小特别有用,控制流转换会减慢代码速度并增加代码大小
    //     deadCodeInjection: false,// 增加混淆很明显，但是也是增加代码量，会影响编译性能
    //     deadCodeInjectionThreshold: 0.4,// 允许设置受影响的节点的百分比,配合上一条属性使用
    //
    //     debugProtection: true,// 打开控制台可能会冻结浏览器，不建议使用，若使用后果自负
    //     debugProtectionInterval: 0,// 与上一条配合使用，不建议使用，若使用后果自负
    //     disableConsoleOutput: true,// 会影响console的使用，无需求不建议使用
    //     identifierNamesGenerator: 'hexadecimal',// 设置标识符名称生成器,(hexadecimal:如 0xabc123,mangled:如 、、abc)log: false，// 将信息记录到控制台
    //     numbersToExpressions: true,// 支持将数字转换为表达式
    //     renameGlobals: false,// 可能会破坏代码，影响功能，谨慎再谨慎的使用
    //     selfDefending: false,// 若使用，就不要更改混滑，否则会触发自我保护，代码会不起作用，谨慎再谨慎使用 使用了之后线上报错 页面空白
    //     simplify: true,// 简化启用其他代码模糊处理
    //     splitstrings: true,// 文本字符串拆分
    //     splitstringsChunkLength: 10,// 配合上一个使用，拆分长度
    //     stringArray: true,// 拆分字符串数组，以下11项若任意一个使用，则该属性必须有
    //     stringArrayCallsTransform: true,// 所有参数都可以提取到不同的对象+
    //     stringArrayCallsTransformThreshold: 0.5,// 配合上一条使用，设置提取调用概率
    //
    //     stringArrayEncoding: ['none'],// 相当于加密处理，(none: 不加密，base64: 加密，rc4: 狠密，性能也会慢)
    //     stringArrayIndexshift: true,// 字符串数组索引偏移，增加混淆度stringArrayRotate: true，// 字符串数组转移，增加混淆度
    //     stringArrayShuffle: true,// 字符串数组随机排列，增加混淆度
    //     stringArrayWrappersCount: 1,// 混淆作用域节点，增加混淆度
    //
    //     stringArraywrappersChainedCalls: true,// 启用链式调用，增加混淆度stringArrayWrappersParametersMaxCount: 4,// 字符串数组包装数量
    //     stringArraywrappersType: 'function',// 字符串数组包装类型
    //     stringArrayThreshold: .75,// 对较大的代码有用，会重复调用， 可能会减缓代码速度
    //     transformObjectKeys: false,// 对象键的转换，可能会改变代码结构，影响功能，谨慎后也不建议使用，若使用后果自负
    //
    //     unicodeEscapeSequence: true// 转义，会增加很大的代码量，
    //   })
    // ],
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        vm: require.resolve('vm-browserify'),
      },
        extensions: ['.js', '.ts'],
    },
    module: {
      rules: [
          {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
          },
      ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/')
        },
        extensions: ['.js', '.ts'], // 添加 .ts 扩展名
    }
  },
})
