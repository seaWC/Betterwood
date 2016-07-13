define(['jquery'],function(){
    $('.hotel-info-tab').on('click','span',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).index();
        $('.tab-wrap').css('margin-left',-100*index+'%');
    });


    $('.detail-room-type').on('click','.book',function(){
        location.href = "order.html";

    })
});