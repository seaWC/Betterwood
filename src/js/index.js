define(["lib/fastclick","js/city","js/dialog","js/calendar","js/swiper"],function(FastClick, city, dialog, calendar,swiper){
    FastClick.attach(document.body);
    if(location.href.indexOf('index.html')<0) return;

    checkAgentType();
    function checkAgentType(){
        var str = navigator.userAgent;
        console.log(str.match(/iphone/i));
        if(str.match(/iphone/i)!=null){
            document.querySelector('html').setAttribute('data-type','iphone')
        }
        if(str.match(/ipad/i)!=null){
            document.querySelector('html').setAttribute('data-type','ipad')
        }
        if(str.match(/android/i)!=null){
            document.querySelector('html').setAttribute('data-type','android')
        }
    }

    var s_m = JSON.parse(localStorage.getItem('searchdata'));
    if(s_m != null){
        $('.sel-date-in').text(s_m.datein);
        $('.sel-date-out').text(s_m.dateout);
        $('.sel-city').text(s_m.city);
        $('.sel-hotel input').val(s_m.hotel);
    }


    var City = new city();
    var Dialog = new dialog();
    var Cal = new calendar({});
    var Swiper = new swiper(".banner");

    $(".get-city").on("click",function(){
        City.show("1");
    });

    $(".date-in").on("click",function(){
        var txt = $(this).find(".sel-date-in").text();
        Cal.show({
            _class : ".sel-date-in",
            _date: txt,
            callback:function(){
                //获取相应的文本转为日期对象比较
                /*Dialog._alert("好好学习天天向上",function(){
                    alert("callback called");
                });*/
            }
        });
    });



    $(".date-out").on("click",function(){
        Cal.show({
            _class : ".sel-date-out"
        });
    });

    var dateIn,dateOut,_city,hotel;

    $(".search-btn").on("click",function(){
            dateIn = $('.sel-date-in').text();
            dateOut = $('.sel-date-out').text();
            _city = $('.sel-city').text();
            hotel = $('.sel-hotel input').val();
        if(dateIn=='' || dateOut ==''||_city==''){
            Dialog._alert('您的信息没填写完', function () {

            })
        }else{
            searchMemory();
            window.location.href = encodeURI("list.html?dateIn="+dateIn+"&dateOut="+dateOut+"&city="+_city+"&hotel="+hotel);

        }
    });

    function searchMemory(){
        var ls = window.localStorage;
        var obj = {
            datein:dateIn,
            dateout:dateOut,
            city:_city,
            hotel:hotel
        };
        ls.setItem('searchdata',JSON.stringify(obj))
    }



    //地理定位
    function getLocation(){
        navigator.geolocation.getCurrentPosition(function(data){
            var lat = data.coords.latitude,
                lng = data.coords.longitude;

            console.log(lat+','+lng);
        },function(error){
            console.log(error);
            Dialog._confirm('定位失败，请打开GPS，刷新浏览器重试',function(){
                location.reload();
            })
        });

        $.ajax({// http://api.map.baidu.com/location/ip?ak=YhBVmlStEmtGFw5GwM8lDsyIjvEOedpL
            url:'http://apis.map.qq.com/ws/location/v1/ip?key=7SFBZ-SLNRP-UTZDY-VMH2X-NQG5T-D3FRF&output=jsonp',
            dataType: 'jsonp',
            success:function(data){
                console.log(data);
                getPositionByIP(data.result.location)
            }
        });

        function getPositionByIP(point){
            //&coordtype=bd09mc 百度米制坐标
            $.ajax({//http://api.map.baidu.com/geocoder/v2/?ak=YhBVmlStEmtGFw5GwM8lDsyIjvEOedpL&output=json&location=23.40,116.38
                url:'http://apis.map.qq.com/ws/geocoder/v1/?key=7SFBZ-SLNRP-UTZDY-VMH2X-NQG5T-D3FRF&output=jsonp&location='+point.lat+','+point.lng,
                dataType:'jsonp',
                success:function(data){
                    console.log(data.result)
                }
            })
        }

    }
    if(location.href.indexOf('index')>0){
        getLocation();
    }



});