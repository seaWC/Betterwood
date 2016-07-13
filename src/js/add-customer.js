define([],function(){
    var addCustomer = function(){
        this.pluginDom = $(".plugin");
        this.init();
    };

    addCustomer.prototype={
        tpl:'<div class="choose-customer"><h2 class="title"><a href="javascript:;" class="back"></a>选择入住人 <span class="done">确定</span></h2><div class="customer-wrapper"><ul></ul></div></div>',
        tplItem:'<li class="customer-info-item"><div class="select-icon"><span></span></div><div class="customer-info"><p><span>姓名</span><span class="c-name">{name}</span></p><p><span>证件号</span><span class="c-id">{id}</span></p></div><div class="edit-info"><span class="right-arrow"></span></div></li>',
        init:function(){
            this.pluginDom.html(this.tpl);

            this.bindEvent();

        },
        render:function(){
            var ls = localStorage,
                ch = ls.getItem("customerHistory"),
                str = "";
            var that = this;
            if(ch && ch.length>0){
                JSON.parse(ch).forEach(function(v, i){
                    str += that.tplItem.replace("{name}",function(){
                        return v.name;
                    }).replace(/\{id}/, v.id);
                })
            }
            this.pluginDom.find(".customer-wrapper ul").html(str);


        },
        bindEvent:function(){
            var that = this;
            $(window).on('popstate',function(){
                if(location.href.indexOf('add-customer')==-1){
                    that.hide();
                }
            });
            this.pluginDom.find(".back").on('click',function(){
                that.hide();
            });
            this.pluginDom.find(".customer-wrapper").off().on('click',".customer-info-item",function(){
                if($(this).hasClass("selected")){
                    $(this).removeClass("selected");
                } else{
                    $(this).addClass("selected")
                }
            });
            this.pluginDom.find(".done").on("click",function(){
                var selects = that.pluginDom.find(".selected");

                var arr =[];
                //Array.apply(null,"类数组").forEach()
                selects.each(function(){
                    arr.push({
                        name : $(this).find(".c-name").text(),
                        id : $(this).find(".c-id").text()
                    })
                });

                if(arr.length>1){
                    for(var i=0;i<arr.length-1;i++){
                        $(".customer-detail-info").append($('<div class="info-detail"><p><span>姓名</span><input class="name" type="text"></p><p><span>证件</span><input class="id-num" type="text"></p></div>'));
                    }
                }
                arr.forEach(function(v, i){
                    var temp = $(".customer-detail-info").find(".info-detail").eq(i);
                    temp.find(".name").val(v.name);
                    temp.find(".id-num").val(v.id);
                });

                that.hide();
            })
        },
        show:function(){
            this.pluginDom.addClass("plugin-show");
            history.pushState({},'add-customer',location.href+'?plugin_addcustomer');
            this.render();
        },
        hide:function(){
            this.pluginDom.removeClass("plugin-show");
            if(location.href.indexOf('plugin_addcustomer')>0){
                var _href = location.href.replace(/(\?|&)plugin_addcustomer/,'');
                history.replaceState({},'',_href);
            }
        }
    };

    return addCustomer;
});