define([],function(){
    var Screen  =function(option){
        this.data = option;
        this.maskDom = $(".mask-layer");
        this.screenParam = {};
        this.render();
    };
    Screen.prototype = {
        tpl:{
            tplItemRange:'<ul class="range" data="range"><li class="unlimited active"><p><span class="screen-txt">不限</span><span class="checkbox"></span></p></li><li class="single-choice"><p><span class="screen-txt">由远到近</span><span class="radiobox"></span></p></li><li class="single-choice"><p><span class="screen-txt">由近到远</span><span class="radiobox"></span></p></li></ul>',
        },
        render:function(){
            var allData = this.data;
            var sumUp = this.tpl.tplItemRange;
            for(var i in allData){
                var str = '<ul class="'+i+'" data="'+i+'"><li class="unlimited active"><p><span class="screen-txt">不限</span><span class="checkbox"></span></p></li>';
                allData[i].forEach(function(j){
                    str += '<li class="multi-choice"><p><span class="screen-txt">'+j+'</span><span class="checkbox"></span></p></li>'
                });
                str+="</ul>";
                sumUp += str;
            }
            this.domWrap = $(".plugin-list").html('<div class="screen">'+sumUp+'</div>');

            this.bindEvent();
        },
        updateTabContent:function(tabid){
            this.domWrap.find('ul.'+tabid+'').addClass("go-top").siblings().removeClass("go-top");

        },
        bindEvent:function(){
            var that = this;
            this.maskDom.on("click",function(){
                that.hide();
            });

            this.domWrap.on("click","li.multi-choice",function(){
                if($(this).hasClass("active")){
                    $(this).removeClass("active")
                }else{
                    $(this).addClass("active");
                    $(this).parent().find(".unlimited").removeClass("active");
                }

                that.screenMethod(that);

            });
            this.domWrap.on("click",".unlimited",function(){
                if($(this).hasClass("active")){
                    $(this).removeClass("active")
                }else{
                    $(this).addClass("active");
                    $(this).siblings().removeClass("active");
                }
                that.screenMethod(that);
            });
            this.domWrap.on("click",".single-choice",function(){
                if(!$(this).hasClass("active")){
                    $(this).addClass("active");
                    $(this).siblings().removeClass("active");
                }
                that.screenMethod();
            })

        },
        screenMethod:function(){
            var that = this;
            that.domWrap.find("ul").each(function(){
                var _key = $(this).attr("data"), _choice = [];
                $(this).find(".active .screen-txt").each(function(i,v){
                    _choice.push(v.innerHTML);
                });

                if(_choice[0] == "不限") _choice.pop();
                that.screenParam[_key] = _choice;
            });

            var wrapper = this.allLists,str = "",_range = "";
            for(var m in that.screenParam){
                if(m != "range" && this.screenParam[m].length>0){
                    this.screenParam[m].forEach(function(v){
                        str += 'li[data'+m+' = "'+v+'"],';
                    })
                }
                if(m == "range"){
                    _range = this.screenParam[m][0] || "由近到远";
                }
            }


            var _str = str.substr(0,str.length-1);
            wrapper.find("li").removeClass("hide");
            if(_str.length>0){
                wrapper.find("li").not(_str).addClass("hide");
            }

            _range && this.reOrder(_range);
        },
        reOrder:function(t){
            var arr = [],
                _li = this.allLists.find("li");

            _li.each(function(i,v){
                var distance = $(this).attr("datadistance"),
                    li_html = $(this)[0].outerHTML;
                arr.push({
                    dis: distance,
                    htm: li_html
                })
            });


            arr.sort(function(a,b){
                if( a.dis - b.dis > 0 ){
                    return 1
                }else if(a.dis - b.dis < 0 ){
                    return -1
                }else{
                    return 0
                }
            });

            var tempStr = "";
            if(t !="由近到远"){
                arr.reverse();
            }

            arr.forEach(function(v,i){
                tempStr += v.htm;
            });

            this.allLists.html(tempStr);
        },
        show:function(tabID){
            this.maskDom.removeClass("hide");
            this.tabId = tabID;
            $(".plugin-bottom").addClass("plugin-show");
            this.updateTabContent(this.tabId);
            this.allLists = $(".list-wrap ul");
        },
        hide:function(){
            $(".plugin-bottom").removeClass("plugin-show");
            this.maskDom.addClass("hide");
            $(".bottom-bar li").addClass("up-arrow").removeClass("down-arrow");
        }
    };

    return Screen;
});