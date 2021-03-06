const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// 判断当前运行环境是开发模式还是生产模式
const nodeEnv = process.env.NODE_ENV || 'development';
const __DEV__ = nodeEnv !== 'production';
console.log('当前运行环境：', __DEV__ ? 'development' : 'production');

// 是否使用preact
const __PREACT__ = false;

// 区别path和 publicPath的作用
// path 用来存放打包后文件的输出目录
// publicPath 用来定义静态资源的引用地址

module.exports = {
  cache: true,
  context: path.resolve(__dirname),
  devtool: '#source-map',
  entry: {
    index: [
      './index.js'
    ]
  },
  output: {
    filename: 'js/[name].[hash:12].js',
    // 输出的打包文件
    path: path.join(__dirname, 'dist'),
    // 项目输出路径
    publicPath: 'http://127.0.0.1:3000/',
    // 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)
    chunkFilename: 'js/[name].[chunkhash].js',
    // 从外部拉取资源
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader?cacheDirectory'],
        exclude: /^node_modules$/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        exclude: /^node_modules$/
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ],
        include: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]',
          'less-loader'
        ],
        exclude: /node_modules/
      },
      {
        // 匹配.html文件
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href']
            }
          }
        ],
        exclude: /^node_modules$/
      },
      {
        test: /favicon\.png$/,
        use: [
          {
            // 使用file-loader
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]'
            }
          }
        ],
        exclude: /^node_modules$/
      },
      {
        // 处理静态资源
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.bundle\.js$/,
        include: /(src)/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'bundle-loader',
          options: {
            name: 'app-[name]',
            lazy: true
          }
        }, {
          loader: 'babel-loader'
        }]
      }
    ]
  },

  resolve: {
    extensions: ['.jsx', '.js', '.less', '.json'],
    alias: {
      api: path.resolve(__dirname, 'src/api'),
      utils: path.resolve(__dirname, 'src/utils'),
      store: path.resolve(__dirname, 'src/store'),
      react: __PREACT__ ? 'preact-compat/dist/preact-compat' : 'react',
      'react-dom': __PREACT__ ? 'preact-compat/dist/preact-compat' : 'react-dom',
      'create-react-class': __PREACT__ ? 'preact-compat/lib/create-react-class' : 'create-react-class'
    }
  },

  externals: {
    // axios: 'axios'
  },

  plugins: [
    // 将第三方库单独打包
    new webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'manifest'] }),

    new webpack.HotModuleReplacementPlugin(),
    // 开启全局的模块热替换(HMR)

    new webpack.NamedModulesPlugin(),
    // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息

    // scope-hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),

    // uglifyjs plugin
    new UglifyJSPlugin(),

    new HtmlWebpackPlugin({
      template: 'index.html',
      hash: false,
      filename: 'index.html',
      inject: 'body',
      chunks: ['manifest', 'vendor', 'index'],
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true
      }
    })
  ]
};
