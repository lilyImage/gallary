/**
 * 基于zepto的touch事件，事件只会绑定在特定的元素上，不会绑定到document上
 */
(function($) {
    'use strict';
    var t,x,y;
    var _Touch = function(el,evt){
        function createCustomEvent(touchName,e){
            var evt,
                e = e,
                touch = e.changedTouches[0];
            
            if (window.CustomEvent) {
                evt = new window.CustomEvent(touchName, {
                    bubbles: true,
                    cancelable: true,
                    detail : touch
                });
            } else {
                evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(touchName, true, true,touch);
            }
         
            return evt;
        } 
        var touch = {
            el : typeof el === 'object' ? el : document.getElementById(el),
            element : el,
            moved : false, //flags if the finger has moved
            moveDirection : '',//moved direction
            startX : 0, //starting x coordinate
            startY : 0, //starting y coordinate
            initEvt : evt,
            start : function (e) { 
                
                this.moved = false;
                this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
                this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
                this.moveDirection = '';

            },

            move : function (e) {
                //if finger moves more than 30px flag to cancel
                // 移动大于30px的时候认为移动了
                
                var mx = e.touches[0].clientX,
                    my = e.touches[0].clientY;
             
                if (Math.abs(mx - this.startX) > 10 || Math.abs(my - this.startY) > 10) {

                    this.moveDirection = Math.abs(mx - this.startX) >=
      Math.abs(my - this.startY) ? (mx - this.startX > 0 ? 'right' : 'left') : (my - this.startY > 0 ? 'down' : 'up');

                   // alert(this.moveDirection);
                    this.moved = true;
                }
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
            },
            end : function (e) {
               
                var evt;

              
                if (!this.moved) {
                    if(this.initEvt == 'tap'){
                        evt = createCustomEvent('tap',e);
                    }
                }else{
                   
                    if(this.moveDirection == 'left' && this.initEvt == 'swipeleft'){
                        evt = createCustomEvent('swipeleft',e);
                    }else if(this.moveDirection == 'right' && this.initEvt == 'swiperight'){
                        evt = createCustomEvent('swiperight',e);
                    }
                    
                }
                
                // dispatchEvent returns false if any handler calls preventDefault,
                if (evt && !e.target.dispatchEvent(evt)) {
                    // in which case we want to prevent clicks from firing.
                    // 注意某些型号的android是不支持preventdefault的，所以才有下面的时间判断，然后监听click事件的时间延迟,也就是对ghost click的处理
                    e.preventDefault();
                }
                //不支持preventDefault的机型，才会去click里面阻止click的原生行为
                /*
                if(e.defaultPrevented){
                    e.preventDefault();
                }else{
                    t = new Date().valueOf();
                }*/
                t = new Date().valueOf();
            },
            cancel : function (e) {
              
               
                this.moved = false;
                this.startX = 0;
                this.startY = 0;
            },
            destroy : function(){
                var el = this.element;

                el.removeEventListener('touchstart', this, false);
                el.removeEventListener('touchmove', this, false);
                el.removeEventListener('touchend', this, false);
                el.removeEventListener('touchcancel', this, false);
                this.element = null;
            },
            handleEvent : function(e){
                 switch (e.type) {
                    case 'touchstart': this.start(e); break;
                    case 'touchmove': this.move(e); break;
                    case 'touchend': this.end(e); break;
                    case 'touchcancel': this.end(e); break;// touchcancel == touchend
                }
            }
        };

        return touch;
         
    };
    var Touch = function(el,evt){
        var func = _Touch(el,evt);

        el.addEventListener('touchstart', func, false);
        el.addEventListener('touchmove', func, false);
        el.addEventListener('touchend', func, false);
        el.addEventListener('touchcancel', func, false);

    };
    var unTouch = function(el,evt){
        _Touch(el,evt).destroy();
    };
    var oldBind = $.fn.on,
        oldUnBind = $.fn.off,
        onArray = [];
    $.fn.on = function( evt ){
        
        if( /(^| )(tap|swipeleft|swiperight)( |$)/.test( evt ) ){ 
            for(var i=0 ;i<this.length;i++){
               Touch( this[i],evt);
            }
        }
        return oldBind.apply( this, arguments );
    };
    $.fn.off = function( evt ){
        if( /(^| )(tap|swipeleft|swiperight)( |$)/.test( evt ) ){
            for(var i=0 ;i<this.length;i++){
               unTouch( this[i],evt);
            }
        }
        return oldUnBind.apply( this, arguments );
    };
    //去掉ghost click 详细见http://ariatemplates.com/blog/2014/05/ghost-clicks-in-mobile-browsers/
    
    window.addEventListener('click', function (e) {
        var time_threshold = 500,
            space_threshold = 100;
        if (new Date().valueOf() - t <= time_threshold 
            && Math.abs(e.clientX-x)<=space_threshold
            && Math.abs(e.clientY-y)<=space_threshold) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);
}(Zepto));