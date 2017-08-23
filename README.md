# 项目简介<br />
一个基于 Jquery 的日期时间选择器插件（使用的时候，请保证插件脚本在 Jquery 之后引用）<br />
插件兼容到 IE7 ，但 IE7 和 IE8 下需要多引入一个 es5-shim.min.js （在 demo 目录下可以找到）<br />

<br />

虽然目前市面上这类插件很多，但大多数都只提供日期选择功能，没有精确到时分秒<br />
又或者虽然提供时间选择，但界面过于花俏，不够简洁，要用到项目中必须花不少精力去调整样式<br />
这个插件本着简洁的初衷，界面极少用到黑白以外的色调，确保能适应大多数场景<br />
啥？你的站点本来就是很花俏，需要鲜艳的风格？<br />
不好意思，要么找更适合你的插件，要么直接该源文件调整样式吧...实在没考虑到那样的需求，毕竟它不是完美的...<br />

<br />


插件使用了 webpack 打包，最终只生成一个 js 文件，确保了使用上的简单<br />
但...同时也正因为使用了 webpack 打包，对于 IE7 和 IE8，需要引入 es5-shim.min.js 使其支持 es5 语法拓展，插件才能正常运行<br />
<b>如果只是单纯的使用，直接引用 dist 目录下的 date-time-picker.min.js 即可</b><br />
插件文档如下，使用 demo 下载源码后自己直接在本地查看即可<br />
<br />

# 如何做自定义调整<br />
先下载源码到本地，然后打开 src 目录。里面分别有三个文件（html，js，less）<br />
大部分情况下，只需要修改 less 文件，来改变选择器的外观色调<br />
其他两个文件，建议不要轻易改动。<br />
修改完毕后，到项目根目录下，执行下面两条命令（安装项目打包依赖模块、项目打包）：<br />
```
npm install
gulp
```
<br />

# $.setDateTimePickerConfig(configObj);<br />
此方法用于设置插件的全局配置<br />
下面是这个方法的调用例子：
```
$.setDateTimePickerConfig({
    yearName: '',
    monthName: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], //月份显示格式
    dayName: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
});
```

<br /><br />

# $.fn.dateTimePicker([configObj]);<br />
生成日期选择器实例<br />
下面是这个方法的调用例子：
```
$('#J-demo-01').dateTimePicker();
```

```
$('#J-demo-02').dateTimePicker({
    mode: 'dateTime'
});
```

```
$('#J-demo-03').dateTimePicker({
    mode: 'dateTime',
    limitMin: '2017-03-10 08:00:00',
    limitMax: '2017-03-20 08:00:00',
    format: 'yyyy/MM/dd HH:mm:ss',
    yearName: '',
    monthName: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], //月份显示格式
    dayName: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
});
```

<br /><br />

# configObj<br />
日期选择器的配置对象，它包含多个属性，下面是每个属性的注解<br />

### limitMax【Str|JqObj】<br />
如果设定了此配置项，日期选择范围会限制在此输入框当前时间之前（包含当前时间），可传入日期输入框JQ对象（比如开始时间不可大于结束时间，就把结束时间输入框的JQ对象传入），或者具体日期(请保证日期格式符合国际标准)
<br /><br />

### limitMin【Str|JqObj】<br />
如果设定了此配置项，日期选择范围会限制在此输入框当前时间之后（包含当前时间），可传入日期输入框JQ对象（比如结束时间不可小于开始时间，就把开始时间输入框的JQ对象传入），或者具体日期(请保证日期格式符合国际标准)
<br /><br />

### yearName【Str】<br />
年份名，默认值为："年"
<br /><br />

### monthName【StrArr】<br />
月份显示格式，需传入一个字符串数组，默认值为：['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
<br /><br />

### dayName【StrArr】<br />
星期显示格式，需传入一个字符串数组，默认值为：['日', '一', '二', '三', '四', '五', '六']
<br /><br />

### mode【Str】<br />
选择器模式，可传 "date" 或 "dateTime"，默认值为："date"
<br /><br />

### format【Str】<br />
时间格式，默认值为：'yyyy-MM-dd'（当 mode 为 "date" 时） 或 'yyyy-MM-dd HH:mm:ss'（当 mode 为 "dateTime" 时）
<br /><br />
