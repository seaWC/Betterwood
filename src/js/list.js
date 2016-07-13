define(["jquery","js/screen","js/calendar","js/dialog","js/common",'js/iscroll'],function($, screen, calendar, dialog, common, IScroll){
    if(location.href.indexOf('list.html')<0) return;

    //初始化组件
    var _calendar = new calendar({});
    var Dialog = new dialog();
    var s = new screen({
        brand:["北京天安瑞安酒店","北京汉庭酒店","北京翠微酒店","广州天安瑞安酒店"],
        price:[200,300,400,500],
        stars:["一星","二星","三星","四星","五星"]
    });

    var myscroll = new IScroll(".list-wrap",{});


    //初始化页面数据
    var searchParam = common.getParam(window.location.search),
        startDate = searchParam.dateIn,
        endDate = searchParam.dateOut;
    if(startDate && endDate){
        $('.list-date-in span').text(searchParam.dateIn.substring(5));
        $('.list-date-out span').text(searchParam.dateOut.substring(5));
    }
    //渲染页面list数据
    getData();
    function getData(searchParam){
        //localStorage.getItem('listdata-datein-dateout');
        common.startLoading('.list-wrap');
        setTimeout(function(){
            $.ajax({
                url:"data/hotel.json",
                type:"post",
                dataType:"json",
                data:searchParam,
                timeout: 7000,
                success:function(data){
                    var _data = data.result.hotel_list;
                    //localStorage.setItem('listdata-datein-dateout',_data);
                    $(".list-wrap ul").html(renderList(_data));
                    if(location.href.indexOf("rendered")==-1){
                        history.pushState({},'render',location.href+'&rendered');
                    }

                    common.stopLoading('.list-wrap');
                    myscroll && myscroll.refresh();
                },
                error:function(info){

                }
            });
        },1000);

    }
    function renderList(data){
        var str = "";
        $(data).each(function(i,c){
            str += '<li class="list-item" dataDistance="'+ c.distance +'" dataBrand="'+ c.name +'" dataStars="'+ c.stars +'" dataPrice="'+ c.low_price/100+ '">'+
                '<div class="list-img"><img src="'+ c.image+'" alt=""></div>'+
                '<div class="list-detail">'+
                '<p>'+ c.name+'</p>'+
                '<p><span><em>4.6分</em><em class="list-icon color-y">礼</em><em class="list-icon color-r">促</em><em class="list-icon color-b">返</em></span>'+
                '<span><em class="list-price">￥'+ c.low_price/100 +'</em><em>起</em></span></p>'+
                '<p class="service-info"><span class="">'+ c.stars+'</span><span></span><span>P</span></p>'+
                '<p><span>'+ c.addr+'</span><span>'+ c.distance/1000 +'km</span></p></div></li>'
        });
        return str;
    }


    //底部筛选dom action
    $(".list-bar").on('click',"li",function(){

        var flag = $(this).attr("data");

        if($(this).hasClass("down-arrow")){
            s.hide();
        }else{
            $(this).addClass("down-arrow").removeClass("up-arrow").siblings().addClass("up-arrow").removeClass("down-arrow");
            s.show($(this).attr("data"));
        }

    });

    function check(s,e){
        console.log(s+','+e);
        if( s==undefined || e==undefined )return true;
        var _s = new Date(s);
        var _e = new Date(e);

        return _s-_e <= 0;
    }
    $(".list-date-in").on('click',function(){//xxxx-xx-xx
        var _date = new Date(),
            _span = $(this).find("span");
        var txt = _date.getFullYear() +"-"+ _span.text();

        _calendar.show({
            _class : ".list-date-in span",
            _date: txt,
            callback:function(data){
                startDate = data;
                _span.text(data.substr(5));
                if(!check(startDate,endDate)){
                    Dialog._alert("出发日期不能晚于到达日期", function () {
                        console.log(common.addDay(startDate,2))
                    })
                }
                if(data != txt){
                    searchParam.datein = data;
                    getData(searchParam);
                }
            }
        });
    });


    $(".list-date-out").on('click',function(){//xxxx-xx-xx
        var _date = new Date(),
            _span = $(this).find("span");
        var txt = _date.getFullYear() +"-"+ _span.text();
        _calendar.show({
            _class : ".list-date-out span",
            _date: txt,
            callback:function(data){
                endDate = data;
                _span.text(data.substr(5));
                if(!check(startDate,endDate)){
                    Dialog._alert("出发日期不能晚于到达日期", function () {

                    })
                }
                if(txt != data){
                    searchParam.dateout = data;
                    getData(searchParam)
                }
            }
        });
    });

    //监听url变化，重新请求数据
    window.addEventListener('popstate',function(){
        if(location.href.indexOf('rendered')==-1){
            $('.list-wrap ul').html("");
        }else{
            getData();
        }
    },false)


    $('.list-wrap').on('click','li',function(){
        var hotelName = $(this).attr('databrand'),
            hotelPrice = $(this).attr('dataprice');
        var param = "?hotelName="+hotelName+"&hotelPrice="+hotelPrice;
        location.href = "detail.html"+encodeURI(param);

    })
});