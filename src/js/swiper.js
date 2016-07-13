define([],function(){
    var Swiper = function(targetEle){
        this.wrap = document.querySelector(targetEle);
        if(!this.wrap)return;
        this._ul = this.wrap.querySelector("ul");
        this.items = this._ul.querySelectorAll("li");
        this.len = this.items.length;
        this.setStyle();
        this.bindEvent();
        this.autoPlay();
    };
    Swiper.prototype={
        setStyle: function () {
            var w = this.itemWidth = this.wrap.offsetWidth, len = this.len;
            this._ul.style.width = w*len +"px";
            var that =this;
            /*Array.apply(null,that.items).forEach(function(i){
                i.style.width = w+"px";
            })*/
            [].forEach.call(that.items,function(i){
                i.style.width = w+"px";
            })
        },
        autoPlay:function(){
            var that = this;
            this.timer = setInterval(function(){
                that.index++;
                if(that.index+1 > that.len) that.index=0;
                that._ul.style.webkitTransition =  "margin-left 1s ease";
                that._ul.style.marginLeft =  -that.index*that.itemWidth +"px";
            },5000)
        },
        transitionEnd:function(){
            var el = document.createElement('element');

            var transitions = {
                'WebkitTransform': 'webkitTransitionEnd',
                'OTransform': 'oTransitionEnd',
                'MozTransform': 'TransitionEnd',
                'MsTransform': 'msTransitionEnd',
                'transform': 'transitionEnd'
            };
            for (var t in transitions) {
                if (el.style[t] !== undefined) {
                    this.transform = t;
                    return transitions[t];
                }
            }
        },
        bindEvent:function(){
            this.currentSpan = 0;
            this.index = 0;
            this.timeSpan = 0;
            this.isTouched = false;
            var l = this.len -1;
            var startTime,endTime;
            var that =this;
            function _touchstart(e){
                that.isTouched = !0;
                var computedStyle = window.getComputedStyle(that._ul),
                    marginLeft = computedStyle.getPropertyValue("margin-left");
                this.style.marginLeft = marginLeft;
                that.removeTransition();
                clearInterval(that.timer);
                startTime = new Date().getTime();
                that.startPoint = e.touches[0].pageX;
                that.currentSpan = parseFloat(marginLeft);
            }
            function _touchmove(e) {

                that.movePoint = e.touches[0].pageX;
                that._span = that.movePoint-that.startPoint;
                this.style.marginLeft = that._span + that.currentSpan + "px";
            }
            function _touchend(){
                that.isTouched = !1;
                endTime = new Date().getTime();
                that.timeSpan = endTime- startTime;
                var idx = that.index;
                that._ul.style.webkitTransition =  "margin-left 1s ease";
                if(Math.abs(that._span)>=that.itemWidth*0.4){
                    //to the right
                    if(that._span>0){
                        idx--;
                        if(idx<0)idx=0;
                    }
                    //to the left
                    if(that._span<0){
                        idx++;
                        if(idx>l)idx=l;
                    }
                }else if(that.timeSpan<300 && that.timeSpan>120 && Math.abs(that._span)>that.itemWidth*0.1 ){
                    if(that._span>0){
                        idx--;
                        if(idx<0)idx=0;
                    }
                    //to the left
                    if(that._span<0){
                        idx++;
                        if(idx>l)idx=l;
                    }
                }
                that.index = idx;
                that._ul.style.marginLeft =  -idx*that.itemWidth +"px";

                setTimeout(function(){
                    if(!that.isTouched)
                        clearInterval(that.timer);
                    that.autoPlay();
                },3000)
            }

            this._ul.addEventListener("touchstart",_touchstart,false);
            this._ul.addEventListener("touchmove",_touchmove,false);
            this._ul.addEventListener("touchend",_touchend,false);
            this._ul.addEventListener(this.transitionEnd(),function(){
                that.removeTransition();
                that.currentSpan = parseFloat(this.style.marginLeft);
            },false);
        },
        removeTransition:function(){
            this._ul.style.webkitTransition =  "";
        }
    };


    return Swiper;
});