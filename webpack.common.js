const path = require('path');
const webpack = require('webpack');
/*
* SA|SC|C/SS Plugin
* [FixStyleOnlyEntriesPlugin] 解決Webpack編譯SASS會自動產生 *.js 的問題
* [MiniCssExtractPlugin] 打包SASS及最小化CSS
* [AutoPreFixer] 預先編譯SCSS至瀏覽器可用版本
* [CSSNano] 壓縮打包後的CSS檔案
* */
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoPreFixer = require('autoprefixer');
const CSSNano = require('cssnano');
/*
* Webpack Plugin
* [CleanWebpackPlugin] 清除./dist資料夾
* [HtmlWebpackPlugin] 拷貝HTML檔案
* */
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/*
* WebpackConfig 定義
* [rootDir] 製作檔根目錄位置 ./path/to/wwwroot
* [devMode] 辨識開發、產品模式
* */
const rootDir = path.resolve(__dirname, 'wwwroot');
const devMode = process.env.NODE_ENV !== 'production';
const styleOutputDir = 'assets/css/';
const jsOutputDir = 'assets/js/';

module.exports = {
    context: path.resolve(__dirname, rootDir + '/src'),
    entry: {
        // vendor: ['jquery', 'gsap'],
        app: rootDir + '/src/App.js',
        style: rootDir + '/scss/all.scss'
    },
    output: {
        filename: jsOutputDir + (devMode ? '[name].js' : '[name].[hash:8].js'),
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../../'
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                AutoPreFixer({
                                    cascade: false
                                }),
                                CSSNano({
                                    normalizeWhitespace: false,
                                    discardComments: {removeAll: true}
                                })
                            ]
                        }
                    },
                    'resolve-url-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.(png|jpg|gif|jpeg|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[hash:8].[ext]",
                            limit: 1024, // size <= 1kib
                            outputPath: "assets/images",
                            esModule: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new CleanWebpackPlugin(),
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: styleOutputDir + (devMode ? '[name].css' : '[name].[hash:8].css'),
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ['style', 'app', 'vendor'],
            removeComments: true,
            template: rootDir + '/index.html',
            filename: 'index.html',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]

};