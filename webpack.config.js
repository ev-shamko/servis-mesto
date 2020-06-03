const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // читает CSS внутри JS-кода
const HtmlWebpackPlugin = require('html-webpack-plugin'); // учит вебпак работать с html
const WebpackMd5Hash = require('webpack-md5-hash'); // пакет для отслеживания и обновления хеша
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // плагин для дополнительной оптимизации css
const isDev = process.env.NODE_ENV === 'development'; // добавляет стили, добавленные через @import, в финальную сборку


module.exports = {
    entry: { main: './src/script.js' }, //потому что изначально в проекте именно script.js, а не index.js 
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [{
                test: /\.js$/, // регулярное выражение, которое ищет все js файлы
                use: { loader: "babel-loader" }, // весь JS обрабатывается пакетом babel-loader
                exclude: /node_modules/ // исключает папку node_modules
            },
            {
                test: /\.css$/, // регулярка: применять это правило только к CSS-файлам
                use: [
                        (isDev ? 'style-loader' : MiniCssExtractPlugin.loader), // в зависимости от типа сборки применяем один из этих пакетов
                        'css-loader',
                        'postcss-loader'
                    ] // к этим файлам нужно применить пакеты: mini-css-extract-plugin, css-loader 
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/, // решает проблему с ошибкой сборки из-за шрифтов
                loader: "file-loader?name=./vendor/[name].[ext]",
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/i, // решает проблему с svg
                use: [{
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            publicPath: "images",
                            outputPath: "images",
                            useRelativePath: true,
                            esModule: false,
                        },
                    },

                    {
                        loader: "image-webpack-loader",
                        options: {},
                    },
                ],
            },

        ]
    },
    plugins: [ // плагин для чтения CSS внутри JS-кода. Он нужен на тот случай, если прописываем стили элементов через JavaScript
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default'],
            },
            canPrint: true
        }), // подключите плагин после MiniCssExtractPlugin
        new WebpackMd5Hash(),
        new HtmlWebpackPlugin({
            // настраиваем плагин:
            inject: false, // стили НЕ нужно прописывать внутри тегов
            template: './src/index.html', // откуда брать образец для сравнения с текущим видом проекта
            filename: 'index.html' // имя выходного файла, то есть того, что окажется в папке dist после сборки
        }),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]

};