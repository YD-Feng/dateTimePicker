module.exports = {
    plugins: [
        require('autoprefixer')({browsers: [
            'last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
        ]}),
        require('postcss-clean')({
            compatibility: 'ie7'
        })
    ]
}
