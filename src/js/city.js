define(["jquery", "../js/citydata", "js/common"], function($, data, base){
    var City=function(dom){
        this.wrap = $(dom);

        this.init();
    };
    City.prototype={
        tpl:{
            tplBody:'<div class="city"><h2 class="title"><a href="javascript:;" class="back"></a>选择城市</h2>' +
                        '<div class="page-wrapper"><div class="currentAddress"><h3 class="subTitle">当前</h3><ul> <li>XXXXXXXX</li><li>XXX <span class="checkbox"></span></li></ul></div>' +
                        '<div class="hotCity"><h3 class="subTitle">热门城市</h3><ul class="clearfix"></ul> </div>' +
                        '<div class="allCity"><div class="single-city"></div></div>' +
                        '</div>' +
                    '<ul id="alphabet" class="alphabet"><li><span>A</span></li></ul>' +
            '</div>'
        },
        init:function(){
            this.dom = $(this.tpl.tplBody);
            var allData = data;
            this.render(allData.data);
        },
        bindEvent:function(){
            var _page = this.dom, targetUl = {}, that = this;
            _page.find('#alphabet').on('click', 'span', function () {
                var alpha = _page.find('.allCity .subTitle'), txt, _ul;
                if (!targetUl['A']) {
                    var baseTop = _page.find('.page-wrapper').scrollTop();
                    for (var i = 0; i < alpha.length; i++) {
                        alphaTitle = alpha.eq(i);
                        txt = alphaTitle.text();
                        targetUl[txt] = alphaTitle.offset().top-44 + baseTop;
                    }
                    targetUl['toHotCity'] = 0;
                }
                var target = $(this).attr("alpha");

                _page.find('.page-wrapper').scrollTop(targetUl[target]);
                return false;
            });
            _page.on('click',".back",function(){
                that.hide();
            });
            _page.on("click","li",function(){
                $(".sel-city").text($(this).text());
                that.hide();
            });
        },
        render:function(_data){
            var data = _data.citylist,
                dataHot = _data.hotcitylist,
                allCityDom = this.dom.find(".single-city"),
                hotCityDom = this.dom.find(".hotCity ul"),
                html = htmlHot = "",
                alphabetStr = "<li><span alpha='toHotCity'>热门城市</span></li>";
            for( var i in data){
                var tmpStr = "";
                alphabetStr +='<li><span alpha="'+i+'">'+i+'</span></li>';
                data[i].forEach(function(c){
                    for(j in c){
                        tmpStr += '<li data="'+c[j].id+'" py="'+c[j].pinyin+'">'+c[j].name+'</li>';
                    }
                })
                html += '<h3 class="subTitle">'+i+'</h3><ul class="clearfix">'+tmpStr+'</ul>';
            }

            dataHot.forEach(function(i){
                htmlHot += '<li data="'+ i.id+'" py="'+i.pinyin+'">'+ i.name+'</li>';
            });

            allCityDom.html(html);
            hotCityDom.html(htmlHot);
            this.dom.find(".alphabet").html(alphabetStr);
        },
        beforeShow:function(){

        },
        show:function(param){
            this.beforeShow();
            $(".plugin").append(this.dom);
            $('.city').parent().addClass("plugin-show");
            this.afterShow();
        },
        afterShow:function(flag){
            this.bindEvent();
        },
        afterHide:function(){
            var that = this;
            $(".plugin").one(base.transitionEnd(),function(){
                $(this).trigger("hide");
            }).on("hide",function(){
                that.destroy();
            })
        },
        hide:function(){
            $('.city').parent().removeClass("plugin-show");
            this.afterHide();
        },
        destroy:function(){
            $(".plugin").find(".city").remove();
        },
        getData:function(){
            this.data= data;
        }
    };

    return City;
});
