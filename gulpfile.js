var gulp = require('gulp'),

    named = require('vinyl-named'),
    webpack = require('gulp-webpack'),
    uglify = require('gulp-uglify'),

    clean = require('gulp-clean'),

    util = require('gulp-util'),
    notify = require('gulp-notify'),

    path = require('path'),

    sequence = require('gulp-sequence'),

    webPackConfig = {
        module: {
            //加载器配置
            loaders: [
                //.js 文件使用 babel-loader 来编译处理
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loaders: ['es3ify-loader', 'babel']
                },
                //html 文件先通过 html-loader 处理成字符串
                {
                    test: /\.html$/,
                    loader: 'html-loader?interpolate=require'
                },
                //less 文件先通过 less-load 处理成 css，然后再通过 css-loader 加载成 css 模块，最后由 extractTextPlugin 插件通过 style-loader 加载器提取出 css 文件
                {
                    test: /\.less$/,
                    loader: 'style-loader!css-loader!postcss-loader!less-loader'
                },
                //图片文件使用 file-loader 来处理
                {
                    test: /\.(png|jpg|gif)$/,
                    exclude: /src\/img/,
                    loader: 'file-loader?name=app-img/[name]-[hash].[ext]'
                }
            ]
        },

        babel: {
            presets: ['es2015']//es2015 用于支持 ES6 语法
        },

        htmlLoader: {
            ignoreCustomFragments: [/\{\{.*?}}/],
            root: __dirname + '/src'
        },

        //其它解决方案配置
        resolve: {
            //查找 module 的话从这里开始查找
            root: __dirname + '\src'
        }
    };

//控制台错误处理
function handleErrors () {
    var args = Array.prototype.slice.call(arguments);

    notify.onError({
        title : 'compile error',
        message : '<%= error.message %>'
    }).apply(this, args);//替换为当前对象

    this.emit();//提交
}

//webPack构建封装
function webPackBuild (srcPath) {
    return gulp.src(srcPath)
        .pipe(named(function (file) {
            return path.basename(file.path, '.js') + '.min';
        }))
        .pipe(webpack(webPackConfig))
        .on('error', handleErrors)
        .pipe(uglify())
        .on('error', handleErrors)
        .pipe(gulp.dest('dist'));
}

gulp.task('clean', function () {
    var stream = gulp.src('dist')
        .pipe(clean({
            force: true
        }));
    return stream;
});

gulp.task('webpack', function () {
    return webPackBuild('src/date-time-picker.js');
});

gulp.task('build', function (cb) {
    sequence('clean', 'webpack')(cb);
});

gulp.task('default', function () {
    gulp.start('build');
});
