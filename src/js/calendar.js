define(["jquery","js/common"],function($, common){
    /*show()的入参 type: object
    * {
    *     _class : ".sel-date-in",
    *     _date: txt,
    *     callback:function(){}
    * }
    *
    * */

    Calendar = function(option){
        var defaults = {
            currentDate:"",
            monthCounts: 3
        };
        this.settings = $.extend({},defaults,option);
        var htmlWrap = '<div class="calendar"><h2 class="title"><a href="javascript:;" class="back"></a>选择日期</h2></div>';
        this.htmlStr = '<div class="cal-title">{YM}</div>'+
            '<div class="cal-week"><ol class="clearfix"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ol></div>'+
            '<div class="cal-days"><ul class="clearfix" data="{YM}">${content}</ul></div>';
        this.weekArr = ["日","一","二","三","四","五","六"];
        this.targetEle = $(htmlWrap);
        this.init();
    };
    Calendar.prototype.getYearMonth = function(n){
        var _date = new Date();
        var curYear =  _date.getFullYear(),
            curMonth = this.curMonth = _date.getMonth()+ n,
            curDay = this.curDay = _date.getDate();
        var newDate = new Date(curYear,curMonth,1,0,0,0);
        return {
            year: newDate.getFullYear(),
            month: newDate.getMonth()
        }
    };
    Calendar.prototype.getDays = function(year,m){
        var days = 0;
        if(m == 1 || m == 3 ||m == 5||m == 7||m == 8||m == 10||m == 12){
            days = 31;
        }else if(m == 4||m == 6||m == 9||m == 11){
            days = 30
        }else{
            if( year % 4 == 0 && year % 100 != 0 || year % 400 == 0){
                days = 29;
            }else{
                days = 28;
            }
        }
        return days;
    };
    Calendar.prototype.render=function(n){
        var YM = this.getYearMonth(n);//得到的是原始的月份索引
        var weekIndex = new Date(YM.year, YM.month, 1).getDay();
        var days = this.getDays(YM.year, YM.month+1);
        var prvDays;
        if(YM.month == 0){
            prvDays = this.getDays(YM.year-1, 12);
        }else{
            prvDays = this.getDays(YM.year, YM.month);
        }

        var str ="",
            selectedDate = this.param;

        for(var i=0; i< 42; i++){
            if(i< weekIndex){
                str+='<li class="disabled">'+(prvDays - weekIndex + i + 1 )+'</li>';
            }else
            if(i < (days+weekIndex)){
                if((i+1-weekIndex) < this.curDay && (new Date().getMonth()) == YM.month){
                    str+='<li class="disabled" day="d'+(i+1-weekIndex)+'">'+(i+1-weekIndex)+'</li>';
                }else
                if((i+1-weekIndex) == this.curDay && (new Date().getMonth()) == YM.month){
                    str+='<li class="cur day" day="d'+(i+1-weekIndex)+'">'+(i+1-weekIndex)+'</li>';
                }else{
                    str+='<li class="day" day="d'+(i+1-weekIndex)+'">'+(i+1-weekIndex)+'</li>';
                }
            }else{
                str += '<li class="disabled">'+(i+1-days-weekIndex)+'</li>';
            }
        }
        var tempStr = this.htmlStr.replace(/\$\{content\}/,str).replace(/\{YM\}/g,YM.year+"年"+(YM.month+1)+"月");
        this.targetEle.append($(tempStr));
    };
    Calendar.prototype.bindEvent = function(){
        var that = this;
        this.targetEle.on("click",".back",function(){
            that.hide();
        });
        this.targetEle.on("click","li.day",function(){
            that.targetEle.find("li").removeClass("cur");
            $(this).addClass("cur");
            var day = $(this).text();
            var YM = $(this).parent().attr("data").replace("年","-").replace("月","-");
            $(that.param._class).text(YM + day);
            that.selectedDate = YM + day;
            that.hide();
        })

    };
    Calendar.prototype.hide = function(){
        $(".plugin").removeClass("plugin-show");
        !!this.param.callback && this.param.callback(this.selectedDate);
        this.afterHide();
    };
    Calendar.prototype.afterHide = function(){
        $(".plugin").one(common.transitionEnd(),function(){
            $(this).html("");
        });
    };
    Calendar.prototype.init = function(){
        for(var m = 0; m<this.settings.monthCounts; m++){
            this.render(m);
        }
    };
    Calendar.prototype.afterShow = function(){
        var curDate = this.param._date == ""||this.param._date == "undefined" ? this.settings.currentDate : this.param._date;
        if(curDate == "" || curDate == undefined) return;
        var arr = curDate.split("-"), _data = arr[0]+"年"+ common.minusZero(arr[1]) +"月";
        this.targetEle.find(".cur").removeClass("cur");
        this.targetEle.find("ul[data="+_data+"]").find("li[day='d"+arr[2]+"']").addClass("cur");
    };
    Calendar.prototype.show = function(param){
        $(".plugin").append(this.targetEle).addClass("plugin-show");
        this.param = param;
        this.bindEvent();
        this.afterShow();
    };

    return Calendar;

});