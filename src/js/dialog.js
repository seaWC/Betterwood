define([],function(){
    var Dialog = function(){
        this.mask = document.querySelector(".advanced-mask-layer");
        this.dialogDom = document.querySelector(".dialog");
    };
    Dialog.prototype={
        _alert:function(msg,callback){
            this.dialogDom.querySelector(".dialog-title").innerHTML = msg;
            this.dialogDom.querySelector(".dialog-btn").innerHTML = '<span class="btn ok">确定</span>';
            this.show();
            this.callback = callback;
            this.bindEvent();
        },
        _confirm:function(msg, callback){
            this.dialogDom.querySelector(".dialog-title").innerHTML = msg;
            this.dialogDom.querySelector(".dialog-btn").innerHTML = '<span class="btn ok">确定</span><span class="cancel btn">取消</span>';
            this.show();
            this.callback = callback;
            this.bindEvent();
        },
        bindEvent:function(){
            var that = this;
            this.dialogDom.querySelector(".ok").addEventListener("click",function(){
                that.hide();
                !!that.callback && that.callback();
            },false);
            var cancel = this.dialogDom.querySelector(".cancel");
            if(cancel != null){
                this.dialogDom.querySelector(".cancel").addEventListener("click",function(){
                    that.hide();
                },false)
            }
        },
        show:function(){
            this.mask.className = this.mask.className.replace(" hide","");
            this.dialogDom.className = this.dialogDom.className.replace(" hide","");
        },
        hide:function(){
            this.mask.className += " hide";
            this.dialogDom.className += " hide";
        }
    };

    return Dialog;
});