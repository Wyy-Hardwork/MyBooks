const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  pwa: {//改图标
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  devServer: {
    proxy: {
      '/base': {
        target: 'http://47.94.80.85:3000',
        changeOrigin: true,//是否跨域
        pathRewrite: {
          '^/base': ''
        },
        header:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      },
      '/socket.io': {
        target: 'http://47.94.80.85:4000',
        changeOrigin: true,
        pathRewrite: {
          '^/socket.io': ''
        },
      },
      '/nm': {
        target: 'https://linovelib.moeyy.cn/linovelib/m',//接口
        changeOrigin: true,//是否跨域
        pathRewrite: {
          '^/nm': ''//url中带有apis标识才跨域跨域,pathRewrite是为了防止url都要加上apis才跨
        },
        headers: {
          "Referer": "https://linovelib.moeyy.cn/linovelib/m",
          "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.51"
        }
      },
      '/no': {
        target: 'https://moeyy.cn/linovelib',//接口
        changeOrigin: true,//是否跨域
        pathRewrite: {
          '^/no': ''//url中带有apis标识才跨域跨域,pathRewrite是为了防止url都要加上apis才跨
        },
        headers: {
          // "Referer": "https://www.linovelib.com",
          "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.51"
        }
      },
      '/pic': {
        target: 'https://linovelib-img.moeyy.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/pic': ''
        },
        headers: {
          "Referer": "https://moeyy.cn",
          "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.51"
        }
      },
      '/du': {
        target: 'https://www.dushu.com',
        changeOrigin: true,
        pathRewrite: {
          '^/du': ''
        },
      },
      '/dt': {
        target: 'https://img.dushu.com',
        changeOrigin: true,
        pathRewrite: {
          '^/dt': ''
        },
        headers: {
          "Referer": "https://www.dushu.com/",
        }
      },
    },
  },
  configureWebpack: {//避免pinia不识别
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    },
  },
  
})

