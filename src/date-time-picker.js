'use strict';

var DateTimePicker = function (opts, $dateTimePicker, refreshPicker) {
    var _this = this;

    _this.options = opts;

    if (_this.options.format == null) {
        _this.options.format = _this.options.mode == 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss';
    }

    _this.options.$dateTimePicker = $dateTimePicker;
    _this.options.refreshPicker = refreshPicker;

    var targetList = _this.options.$dateTimePicker.data('targetList');
    if (!targetList) {
        targetList = [];
    }
    targetList.push(_this.options.$target[0]);
    _this.options.$dateTimePicker.data('targetList', targetList);

    _this.options.$target.prop('readonly', true);

    _this._bindEvents();
};

DateTimePicker.prototype._getDateByFormat = function (dateStr) {
    if (dateStr === '') {
        return new Date();
    }

    var _this = this,
        format = _this.options.format,
        strList = ['y', 'M', 'd', 'H', 'm', 's'],
        obj = {
            y: 0,
            M: 0,
            d: 0,
            H: 0,
            m: 0,
            s: 0
        },
        date = null;

    for (var i = 0, len = strList.length; i < len; i++) {
        var curStr = strList[i],
            index = format.search(curStr),
            match = format.match(new RegExp(curStr, 'g'));

        obj[curStr] = dateStr.substring(index, index + (match ? match.length : 0)) * 1;
    }

    date = new Date(obj.y, obj.M - 1, obj.d, obj.H, obj.m, obj.s);

    if (isNaN(date.valueOf())) date = new Date();

    return date;
};

DateTimePicker.prototype._bindEvents = function () {
    var _this = this;

    _this.options.$target.on('focus', function () {
        var $this = $(this),
            val = $this.val(),
            date = _this._getDateByFormat(val),
            hour = 0,
            minute = 0,
            second = 0,
            dayNameHtml = '',
            monthNameHtml = '',
            offset = $this.offset(),
            left = offset.left,
            top = offset.top + $this.outerHeight(),
            $document = $(document),
            maxLeft = $document.width() - _this.options.$dateTimePicker.outerWidth(),
            maxTop = $document.height() - _this.options.$dateTimePicker.outerHeight();

        _this.options.$dateTimePicker.data({
            curTarget: $this,
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
            originalYear: date.getFullYear(),
            originalMonth: date.getMonth(),
            originalDate: date.getDate(),
            original: date,
            yearName: _this.options.yearName,
            monthName: _this.options.monthName,
            limitMax: _this.options.limitMax,
            limitMin: _this.options.limitMin,
            format: _this.options.format,
            mode: _this.options.mode
        });

        _this.options.refreshPicker();

        if (_this.options.mode == 'dateTime') {
            hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
            minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
            second = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
            _this.options.$dateTimePicker.find('.J-dtp-date-btn-wrap').hide();
            _this.options.$dateTimePicker.find('.J-dtp-time-btn-wrap').show();
        } else {

            var limitMaxDate = null,
                limitMinDate = null,
                now = new Date();

            //类型为选日期，需要对今天按钮做可用判断
            if (_this.options.limitMax != null) {
                var limitMax = _this.options.limitMax;

                if (limitMax instanceof $) {
                    limitMaxDate = new Date(limitMax.val());
                } else {
                    limitMaxDate = new Date(limitMax);
                }

                if (isNaN(limitMaxDate.valueOf())) {
                    limitMaxDate = null;
                } else {
                    limitMaxDate.setHours(0);
                    limitMaxDate.setMinutes(0);
                    limitMaxDate.setSeconds(0);
                }
            }

            if (_this.options.limitMin != null) {
                var limitMin = _this.options.limitMin;

                if (limitMin instanceof $) {
                    limitMinDate = new Date(limitMin.val());
                } else {
                    limitMinDate = new Date(limitMin);
                }

                if (isNaN(limitMinDate.valueOf())) {
                    limitMinDate = null;
                } else {
                    limitMinDate.setHours(0);
                    limitMinDate.setMinutes(0);
                    limitMinDate.setSeconds(0);
                }
            }

            if (limitMaxDate && now > limitMaxDate || limitMinDate && now < limitMinDate) {
                _this.options.$dateTimePicker.find('.J-dtp-btn-today').addClass('cmp-dp-btn-disabled').prop('disabled', true);
            } else {
                _this.options.$dateTimePicker.find('.J-dtp-btn-today').removeClass('cmp-dp-btn-disabled').prop('disabled', false);
            }

            _this.options.$dateTimePicker.find('.J-dtp-date-btn-wrap').show();
            _this.options.$dateTimePicker.find('.J-dtp-time-btn-wrap').hide();

        }

        _this.options.$dateTimePicker.find('.J-dtp-hour-input').val(hour);
        _this.options.$dateTimePicker.find('.J-dtp-minute-input').val(minute);
        _this.options.$dateTimePicker.find('.J-dtp-second-input').val(second);

        $.each(_this.options.dayName, function (i, name) {
            dayNameHtml += '<span class="cmp-dp-day-item">' + name + '</span>';
        });
        _this.options.$dateTimePicker.find('.J-dtp-day-name').html(dayNameHtml);

        $.each(_this.options.monthName, function (i, name) {
            monthNameHtml += '<span class="cmp-dp-month-item J-dtp-month-item">' + name + '</span>';
        });
        _this.options.$dateTimePicker.find('.J-dtp-month-menu').html(monthNameHtml);

        _this.options.$dateTimePicker.css({
            top: top > maxTop ? maxTop : top,
            left: left > maxLeft ? maxLeft : left
        }).show();

        _this.options.$dateTimePicker.find('.J-dtp-month-menu').hide();
        _this.options.$dateTimePicker.find('.J-dtp-hour-menu').hide();
        _this.options.$dateTimePicker.find('.J-dtp-minute-menu').hide();
        _this.options.$dateTimePicker.find('.J-dtp-second-menu').hide();

        if (val == '') {
            _this.options.$dateTimePicker.find('.J-dtp-btn-clear').addClass('cmp-dp-btn-disabled').prop('disabled', true);
        } else {
            _this.options.$dateTimePicker.find('.J-dtp-btn-clear').removeClass('cmp-dp-btn-disabled').prop('disabled', false);
        }
    });
};

module.exports = (function ($) {
    //拓展Date对象，添加format方法
    Date.prototype.format = function (fmt) {
        var o = {
            'M+': this.getMonth() + 1, //月份
            'd+': this.getDate(), //日
            'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            'H+': this.getHours(), //小时
            'm+': this.getMinutes(), //分
            's+': this.getSeconds(), //秒
            'q+': Math.floor((this.getMonth() + 3) / 3), //季度
            'S': this.getMilliseconds() //毫秒
        };

        var week = {
            '0': '/u65e5',
            '1': '/u4e00',
            '2': '/u4e8c',
            '3': '/u4e09',
            '4': '/u56db',
            '5': '/u4e94',
            '6': '/u516d'
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + '']);
        }

        for (var k in o) {
            if (new RegExp('('+ k +')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    };

    //引入组件样式
    require('./date-time-picker.less');

    var def = $.Deferred();

    $(function () {
        //只生成一个日期选择器DOM实例
        var $dateTimePicker = $(require('./date-time-picker.html'));
        $dateTimePicker.appendTo('body');

        var $dateWrap = $dateTimePicker.find('.J-dtp-date-wrap'),
            $btnYes = $dateTimePicker.find('.J-dtp-btn-yes'),

            $yearTxt = $dateTimePicker.find('.J-dtp-year-txt'),
            $monthTxt = $dateTimePicker.find('.J-dtp-month-txt'),

            $monthMenu = $dateTimePicker.find('.J-dtp-month-menu'),
            $hourMenu = $dateTimePicker.find('.J-dtp-hour-menu'),
            $minuteMenu = $dateTimePicker.find('.J-dtp-minute-menu'),
            $secondMenu = $dateTimePicker.find('.J-dtp-second-menu'),

            $hourInput = $dateTimePicker.find('.J-dtp-hour-input'),
            $minuteInput = $dateTimePicker.find('.J-dtp-minute-input'),
            $secondInput = $dateTimePicker.find('.J-dtp-second-input'),

            //刷新日期选择区
            refreshPicker = function () {
                var data = $dateTimePicker.data(),
                    selectedYear = data['year'],
                    selectedMonth = data['month'],
                    firstDay = new Date(selectedYear, selectedMonth, 1),
                    lastDay = new Date(selectedYear, selectedMonth + 1, 0),
                    now = new Date(),
                    dateListHtml = '',
                    limitMaxDate = null,
                    limitMinDate = null,
                    limitFlag = 1; // 1：需要对当月的每一天进行判断是否可用，2：全部都为不可用状态

                $yearTxt.text(selectedYear + data['yearName']);
                $monthTxt.text(data['monthName'][selectedMonth]);

                if (data['limitMax'] != null) {
                    var limitMax = data['limitMax'];

                    if (limitMax instanceof $) {
                        limitMaxDate = new Date(limitMax.val());
                    } else {
                        limitMaxDate = new Date(limitMax);
                    }

                    if (isNaN(limitMaxDate.valueOf())) {
                        limitMaxDate = null;
                    } else {
                        limitMaxDate.setHours(0);
                        limitMaxDate.setMinutes(0);
                        limitMaxDate.setSeconds(0);
                    }
                }

                if (data['limitMin'] != null) {
                    var limitMin = data['limitMin'];

                    if (limitMin instanceof $) {
                        limitMinDate = new Date(limitMin.val());
                    } else {
                        limitMinDate = new Date(limitMin);
                    }

                    if (isNaN(limitMinDate.valueOf())) {
                        limitMinDate = null;
                    } else {
                        limitMinDate.setHours(0);
                        limitMinDate.setMinutes(0);
                        limitMinDate.setSeconds(0);
                    }
                }

                if (
                    (limitMaxDate && firstDay > limitMaxDate) ||
                    (limitMinDate && lastDay < limitMinDate) ||
                    (limitMaxDate && limitMinDate && limitMinDate > limitMaxDate)
                ) {
                    //当月的第一天比【限制最大日】还要大，或者当月的最后一天比【限制最小日】还要小，【限制最小日】大于【限制最大日】,当月的每一天都不可选
                    limitFlag = 2;
                }

                //生成上个月的日期
                for (var i = firstDay.getDay(); i > 0; i--) {
                    var _date = new Date(selectedYear, selectedMonth, 1 - i, 0, 0, 0),
                        disabledCls = '';

                    if (
                        (limitMaxDate && limitMaxDate < _date) ||
                        (limitMinDate && limitMinDate > _date)
                    ) {
                        disabledCls = ' cmp-dp-date-item-disabled';
                    }

                    dateListHtml += '<span class="cmp-dp-date-item cmp-dp-date-item-other' + disabledCls + ' J-dtp-date-item" data-date="' + _date.getDate() + '" data-month="-1">' + _date.getDate() + '</span>';
                }

                //生成当月的可选日期
                for (var i = firstDay.getDate(), count = lastDay.getDate() + 1; i < count; i++) {

                    var cls = '',
                        _date = null;

                    if (selectedYear == now.getFullYear() && selectedMonth == now.getMonth() && i == now.getDate()) {
                        cls += ' cmp-dp-date-item-today';
                    }

                    if (
                        data['originalYear'] == selectedYear && data['originalMonth'] == selectedMonth && data['originalDate'] == i
                    ) {
                        cls += ' cmp-dp-date-item-cur';
                    }

                    if (limitFlag == 1) {
                        _date = new Date(selectedYear, selectedMonth, i, 0, 0, 0);
                        if (
                            (limitMaxDate && limitMaxDate < _date) ||
                            (limitMinDate && limitMinDate > _date)
                        ) {
                            cls = ' cmp-dp-date-item-disabled';
                        }
                    } else if (limitFlag == 2) {
                        cls += ' cmp-dp-date-item-disabled';
                    }

                    dateListHtml += '<span class="cmp-dp-date-item' + cls + ' J-dtp-date-item" data-date="' + i + '" data-month="0">' + i + '</span>';
                }

                //生成下个月的日期
                for (var i = 6, num = lastDay.getDay(); i > num; i--) {
                    var number = 7 - i,
                        _date = new Date(selectedYear, selectedMonth + 1, number, 0, 0, 0),
                        disabledCls = '';

                    if (
                        (limitMaxDate && limitMaxDate < _date) ||
                        (limitMinDate && limitMinDate > _date)
                    ) {
                        disabledCls = ' cmp-dp-date-item-disabled';
                    }

                    dateListHtml += '<span class="cmp-dp-date-item cmp-dp-date-item-other' + disabledCls + ' J-dtp-date-item" data-date="' + number + '" data-month="1">' + number + '</span>';
                }

                $dateWrap.html(dateListHtml);

                if (data['mode'] == 'dateTime') {
                    var $canSelectList = $dateWrap.find('.J-dtp-date-item').not('.cmp-dp-date-item-disabled');

                    if ($canSelectList.length > 0) {
                        var $curMonthCanSelectList = $canSelectList.not('.cmp-dp-date-item-other'),
                            flag = $canSelectList.filter('.cmp-dp-date-item-cur').length > 0;

                        if (!flag) {
                            if ($curMonthCanSelectList.length > 0) {
                                $curMonthCanSelectList.eq(0).click();
                            } else {
                                $canSelectList.eq(0).click();
                            }
                        }

                        $btnYes.removeClass('cmp-dp-btn-disabled').prop('disabled', false);
                    } else {
                        $btnYes.addClass('cmp-dp-btn-disabled').prop('disabled', true);
                    }
                }
            },

            //设置数值为时间范围值
            setTimeValue = function (value, min, max) {
                if (isNaN(value * 1)) {
                    return 0;
                } else if (value < min) {
                    return 0;
                } else if (value > max) {
                    return max;
                } else {
                    return value;
                }
            },

            //将选择器的值设置到输入框中去
            setValue = function () {
                var data = $dateTimePicker.data(),
                    hour = $hourInput.val() * 1,
                    minute = $minuteInput.val() * 1,
                    second = $secondInput.val() * 1,
                    date = null;

                hour = setTimeValue(hour, 0, 23);
                minute = setTimeValue(minute, 0, 59);
                second = setTimeValue(second, 0, 59);

                date = new Date(data['year'], data['month'], data['date'], hour, minute, second);

                if (data['mode'] == 'dateTime') {

                    var limitMaxDate = null,
                        limitMinDate = null;

                    if (data['limitMax'] != null) {
                        var limitMax = data['limitMax'];

                        if (limitMax instanceof $) {
                            limitMaxDate = new Date(limitMax.val());
                        } else {
                            limitMaxDate = new Date(limitMax);
                        }

                        if (isNaN(limitMaxDate.valueOf())) {
                            limitMaxDate = null;
                        }
                    }

                    if (data['limitMin'] != null) {
                        var limitMin = data['limitMin'];

                        if (limitMin instanceof $) {
                            limitMinDate = new Date(limitMin.val());
                        } else {
                            limitMinDate = new Date(limitMin);
                        }

                        if (isNaN(limitMinDate.valueOf())) {
                            limitMinDate = null;
                        }
                    }

                    if (limitMinDate) {
                        date = date < limitMinDate ? limitMinDate : date;
                    }

                    if (limitMaxDate) {
                        date = date > limitMaxDate ? limitMaxDate : date;
                    }

                }

                data['curTarget'].val(date.format(data['format']));
                $dateTimePicker.hide();
            };

        //为日期选择器绑定事件
        $(document).on('click.dateTimePicker', function (e) {
            var $target = $(e.target);

            if ($target.closest($dateTimePicker).length == 0 && $target.closest($dateTimePicker.data('targetList')).length == 0) {
                $dateTimePicker.hide();
            }
        });

        $dateTimePicker
            .on('click', function (e) {
                var $target = $(e.target);

                if ($target.closest('.J-dtp-month-menu').length == 0 && $target.closest('.J-dtp-month-txt').length == 0) {
                    $monthMenu.hide();
                }

                if ($target.closest('.J-dtp-hour-menu').length == 0 && $target.closest('.J-dtp-hour-input').length == 0) {
                    $hourMenu.hide();
                }

                if ($target.closest('.J-dtp-minute-menu').length == 0 && $target.closest('.J-dtp-minute-input').length == 0) {
                    $minuteMenu.hide();
                }

                if ($target.closest('.J-dtp-second-menu').length == 0 && $target.closest('.J-dtp-second-input').length == 0) {
                    $secondMenu.hide();
                }
            })
            .on('click', '.J-dtp-btn-ctrl', function (e) {
                var data = $(this).data(),
                    curPickerData = $dateTimePicker.data(),
                    num = data['ctrl'] == 'prev' ? -1 : 1,
                    date = null;

                if (data['type'] == 'year') {
                    $dateTimePicker.data({
                        year: curPickerData['year'] + num,
                        date: 1
                    });
                } else {
                    var date = new Date(curPickerData['year'], curPickerData['month'] + num, 1);
                    $dateTimePicker.data({
                        year: date.getFullYear(),
                        month: date.getMonth(),
                        date: 1
                    });
                }

                refreshPicker();
            });

        $monthMenu.on('click', '.J-dtp-month-item', function (e) {
            $dateTimePicker.data({
                month: $(this).index(),
                date: 1
            });
            refreshPicker();
            $monthMenu.hide();
        });

        $hourMenu.on('click', '.J-dtp-hour-item', function (e) {
            $hourInput.val($(this).text());
            $hourMenu.hide();
        });

        $hourInput.on('click', function (e) {
            $hourMenu.toggle();
        });

        $minuteMenu.on('click', '.J-dtp-minute-item', function (e) {
            $minuteInput.val($(this).text());
            $minuteMenu.hide();
        });

        $minuteInput.on('click', function (e) {
            $minuteMenu.toggle();
        });

        $secondMenu.on('click', '.J-dtp-second-item', function (e) {
            $secondInput.val($(this).text());
            $secondMenu.hide();
        });

        $secondInput.on('click', function (e) {
            $secondMenu.toggle();
        });

        $monthTxt.on('click', function (e) {
            $monthMenu.toggle();
        });

        $dateWrap.on('click', '.J-dtp-date-item', function (e) {
            var $this = $(this),
                data = $dateTimePicker.data();

            if ($this.hasClass('cmp-dp-date-item-disabled')) {
                return;
            }

            $dateTimePicker.data({
                month: data['month'] + $this.data('month'),
                date: $this.data('date')
            });

            if (data['mode'] == 'dateTime') {
                $this.addClass('cmp-dp-date-item-cur').siblings().removeClass('cmp-dp-date-item-cur');
            } else if (data['mode'] == 'date') {
                setValue();
            }
        });

        $dateTimePicker.find('.J-dtp-btn-clear').on('click', function () {
            if ($(this).hasClass('cmp-dp-btn-disabled')) {
                return;
            }
            $dateTimePicker.data('curTarget').val('');
            $dateTimePicker.hide();
        });

        $dateTimePicker.find('.J-dtp-btn-today').on('click', function () {
            if ($(this).hasClass('cmp-dp-btn-disabled')) {
                return;
            }

            var date = new Date();

            $dateTimePicker.data({
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate()
            });

            refreshPicker();
            setValue();
        });

        $btnYes.on('click', function () {
            if ($(this).hasClass('cmp-dp-btn-disabled')) {
                return;
            }
            setValue();
        });

        def.resolve($dateTimePicker, refreshPicker);
    });

    var defaultConfig = {
        $target: null, //需要生成日期选择器的目标，需传入JQ对象
        limitMax: null, //如果设定了此配置项，日期选择范围会限制在此输入框当前时间之前（包含当前时间），可传入JQ对象，或者具体日期(请保证日期格式符合国际标准)
        limitMin: null, //如果设定了此配置项，日期选择范围会限制在此输入框当前时间之后（包含当前时间），可传入JQ对象，或者具体日期(请保证日期格式符合国际标准)
        yearName: '年',
        monthName: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], //月份显示格式
        dayName: ['日', '一', '二', '三', '四', '五', '六'], //星期显示格式
        mode: 'date', //模式，可传 "date" 或 "dateTime"
        format: null //时间格式
    };

    $.fn.dateTimePicker = function (opts) {
        var $this = $(this);

        def.done(function ($dateTimePicker, refreshPicker) {
            new DateTimePicker($.extend({}, defaultConfig, {
                $target: $this
            }, opts), $dateTimePicker, refreshPicker);
        });

        return $this;
    };

    $.setDateTimePickerConfig = function (opts) {
        defaultConfig = $.extend(defaultConfig, opts);
    };
})($);
