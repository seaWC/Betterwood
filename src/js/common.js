define([],function(){
    return {
        transitionEnd:function(){
            var el = document.createElement('element'),t;
            var transitions = {
                'WebkitTransform': 'webkitTransitionEnd',
                'OTransform': 'oTransitionEnd',
                'MozTransform': 'TransitionEnd',
                'MsTransform': 'msTransitionEnd',
                'transform': 'transitionEnd'
            };
            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    this.transform = t;
                    return transitions[t];
                }
            }
        },
        addZero: function(num){
            if(num <= 0) throw new error("the number must > 0");
            return num < 10 && num >0 ? "0"+num : num;
        },
        minusZero:function(num){
            return num.charAt(0) == 0 ? num.substr(1) : num;
        },
        getParam: function (url){
            var obj = {},arr=[];
            url = decodeURI(url.substring(1));
            arr = url.split('&');
            arr.forEach(function(item){
                var tmp = item.split('=');
                obj[tmp[0]] = tmp[1];
            });
            return obj;
        },
        startLoading:function(parent){
            var dom= $('<div class="advanced-mask-layer"></div><div class="loading"><div class="circle cc1"></div><div class="circle cc2"></div><div class="circle cc3"></div><div class="circle cc4"></div><div class="circle cc5"></div><div class="circle cc6"></div><div class="circle cc7"></div><div class="circle cc8"></div></div>');
            $(parent).append(dom);
        },
        stopLoading:function(parent){
            $(parent).find('.loading,.advanced-mask-layer').remove();
        },
        addDay:function(date,num){
            var res = date.replace(/[^\d]+/g,'-');
            var arr = res.split('-');

            var _date = new Date(arr[0],arr[1]-1,arr[2]*1+num);

            return _date.getFullYear()+"-"+(_date.getMonth()+1)+'-'+_date.getDate();
        }
    }
});