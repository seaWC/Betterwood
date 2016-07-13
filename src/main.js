require.config({
    baseUrl: "../src",
    paths: {
        jquery:'lib/jQuery'
    }

});

// 开始使用jQuery 模块
require(["jquery", "js/index", "js/list", "js/detail", "js/fillorder"], function ($, C) {

    $('.container').on('click','.back',function(){
        window.history.back();
    })
});