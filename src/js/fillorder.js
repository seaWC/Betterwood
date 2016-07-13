define(['js/add-customer','js/slideSelect'],function(add){
    if(location.href.indexOf('order.html')<0) return;
    //slideSelector组件
    $('.room-count').slideSelect({
        init: 2,
        wrapper: $('.container'),
        data: [1,2,3,4,5],
        title: '房间数量',
        renderTo: '.count',
        callback: function(a, b){
            console.log(a+','+b);
            var str ='<h3 class="order-title">入住人信息 <span class="choose-customer-btn">选择入住人</span></h3>';
            for(var i=0;i<b;i++){
                str+='<div class="info-detail"><p><span>姓名</span><input class="name" type="text"></p><p><span>证件</span><input class="id-num" type="text"></p></div>'
            }
            $('.customer-detail-info').html(str);
        },
        cls: 'selected'
    });

    $('.room-time').slideSelect({
        init: 3,
        wrapper: $('.container'),
        data: ['14:00前','16:00前','18:00前','20:00前','22:00前'],
        title: '入住时间',
        renderTo: '.time',
        callback: function(a,b){
            //alert(123);
        },
        cls: 'selected'
    });



    var addCustomer = new add();

    $(".customer-detail-info").on("click",".choose-customer-btn",function(){
        addCustomer.show();
    });

    $(".book-btn").on("click",function(){
        var customerDetail = $(".customer-detail-info");
        var _name = customerDetail.find(".name").val(),
            _idnum = customerDetail.find(".id-num").val();
        var person = {
            name: _name,
            id: _idnum
        };

        var ls = localStorage, arr = [];

        if(ls.getItem("customerHistory") && ls.getItem("customerHistory").length>0){
            arr = JSON.parse(ls.getItem("customerHistory"));
        }
        arr.push(person);

        localStorage.setItem("customerHistory",JSON.stringify(arr));
    })
});