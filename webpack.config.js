const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const assign = require('object-assign');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const args = require('yargs').argv;
const env = args.env || 'dev';

const precss = require('precss');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDev = env !== 'production';
const pName = 'dist';

function getEntry(globPath, replaceDir, exclude) {
    let files = glob.sync(globPath);
    let entries = {};
    let entryname, filepath, dirname;

    for (let i = 0; i < files.length; i++) {
        filepath = files[i];
        dirname = path.dirname(filepath);

        if (replaceDir) {
            dirname = dirname.replace(new RegExp('^' + replaceDir), '');
        }

        entryname = dirname.substring(dirname.lastIndexOf('\/') + 1);

        if (exclude && exclude.indexOf(entryname) > -1) {
            continue;
        }
        entries[entryname] = [filepath];
    }
    return entries;
}

let srcEntry = path.resolve(__dirname, './src/app/*/main.js');

let js_arr = getEntry(srcEntry);
let srcComponentsDir = path.resolve(__dirname,'src/components');
let srcVendorsDir = path.resolve(__dirname,'src/vendors');

let entries = assign(js_arr, {
    'components' : glob.sync(srcComponentsDir + '/**/*.js'),
    'vendors' : glob.sync(srcVendorsDir + '/**/*.js')
});

let webpackConfig = {
    entry: entries,
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, './' + pName),
        filename: isDev ? 'statics/js/[name].js' : 'statics/js/[name].js?v=[chunkhash:8]',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.html$|\.htm$|\.php$/,
                loader: 'html-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$|\.less$/,
                loaders: ExtractTextPlugin.extract({
                    fallback: "vue-style-loader",
                    use: "css-loader!less-loader!postcss-loader"
                })
            },
            {
                test: /\.js$/,
                // loaders: ['babel-loader?presets[]=es2015'],
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|jpeg)(\?[a-z0-9]+)?$/,
                loader: 'url-loader?limit=10240&name=statics/images/[name].[ext]?v=[hash:8]',
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.css'],
        modules: [
            path.resolve(__dirname, 'src'), 'node_modules'
        ],
        alias: {
            'vue': isDev ? '../../_back/vue.js' : 'vendors/vue.js',
            'vue-router': 'vendors/vue-router.js',
            'ajax'      : 'components/ajax/main.js',
            'loading'   : 'components/loading/main.js',
            'toastr': 'components/toastr/main.js',
            'dialog': 'components/dialog/main.js',
            'conf': 'components/conf/main.js',
            'page': 'components/page/main.js',
            'user': 'components/user/main.js',
            'util': 'components/util/main.js',
            'share': 'components/share/main.js',
            'wechat':'components/wechat/main.js',
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        // new webpack.LoaderOptionsPlugin({
        //     options: {
        //         htmlLoader: {
        //             ignoreCustomFragments: [/\{\{.*?}}/],
        //             root: path.resolve(__dirname, 'src'),
        //             attrs: ['img:src', 'link:href']
        //         }
        //     }
        // }),

        new webpack.optimize.CommonsChunkPlugin({
            names: ['components', 'common', 'vendors'],
            minChunks: Infinity
        }),
        // new ExtractTextPlugin('css/[chunkhash:8].[name].css'),
        new ExtractTextPlugin('statics/css/[name].css?v=[contenthash:8]'),

        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'src/externals'),
            to: path.resolve(__dirname, pName + '/externals')
        },{
            from: path.resolve(__dirname, 'getweixincode.html'),
            to: path.resolve(__dirname, pName + '/getweixincode.html')
        },{
            from: path.resolve(__dirname, 'src/statics/favicon.ico'),
            to: path.resolve(__dirname, pName + '/favicon.ico')
        },{
            from: path.resolve(__dirname, 'src/statics/404.html'),
            to: path.resolve(__dirname, pName + '/404.html')
        }])
    ],
    devServer: {
        contentBase: path.join(__dirname, pName), //本地服务器所加载的页面所在的目录
        compress: true,
        publicPath: '/',
        port: '8008',
        // historyApiFallback: true, //不跳转
        inline: true, //实时刷新
        disableHostCheck: true,
        host: '0.0.0.0',
        proxy: {
            '/tomorrow/*': {
                target: 'http://apit.airobotq.com',
                host: 'apit.airobotq.com',
                changeOrigin: true,
                pathRewrite: {'^/tomorrow': '/tomorrow'},
                secure: false
            }
        }
    }
};

if (!isDev) {
    webpackConfig.plugins.push(
        new UglifyJsPlugin({ //压缩代码
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require'] //排除关键字
        }),
        new webpack.NoErrorsPlugin()
    );
}

let o = getEntry(srcEntry);
for (let x in o) {
    if (x === 'common') continue;
    let conf = {
        filename: x + '.html',
        template: path.resolve(__dirname, 'src/app/' + x + '/main.html'), //html模板路径
        chunks: ['vendors', 'common', 'components', x],
        // chunksSortMode: 'dependency'
    };

    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}


module.exports = webpackConfig;