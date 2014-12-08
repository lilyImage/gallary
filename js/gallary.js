(function($, window, document, undefined) {
    var G = null,
        element = null,
        elementMask = null;
    var Config = {
        gListEl : null,
        gListBdEl : null,
        gImgParentList:{},
        gImgList : {},
        gImgLen : 0,
        pContainer : null,
        pCurImgUrl : '',
        pPrevImgUrl : '',
        pNextImgUrl :''
    };
    
    var Gallery = function(settings){
        var $settings = setSettings(settings);
            
        
       
        /**默认的事件包括左滑，右滑和点击关闭*/
        function bindEvent(){
           
            Config.gListBdEl.on('tap', closeGallary, false);
            Config.gListEl.on('swipeleft', previewNext, false);
            Config.gListEl.on('swiperight', previewPrev, false);
        }
        function unbindEvent(){
           
            Config.gListBdEl.off('tap', closeGallary, false);
            Config.gListEl.off('swipeleft', previewNext, false);
            Config.gListEl.off('swiperight', previewPrev, false);
        }
        /**关闭弹出层*/
        function closeGallary(){
            element.hide();
            elementMask.hide();

            Config.gListEl.html('');
        }
        /**
        *   向左滑动或者点击右箭头时，查看next图片
        */
        function previewNext() {
          
            var curIndex = $settings.currentIndex,
                imgList = $settings.imgInfo,
                imgLen = Config.gImgLen,
                w = $settings.w;
              
            if(!Config.pNextImgUrl) {
                return;
            } 
            if($settings.currentIndex<imgLen-1) {
                $settings.currentIndex ++;
                Config.pCurImgUrl = imgList[$settings.currentIndex].url;
                Config.pPrevImgUrl = $settings.currentIndex?imgList[$settings.currentIndex-1].url: '';
                Config.pNextImgUrl = ($settings.currentIndex<imgLen-1)?imgList[$settings.currentIndex+1].url:'';
            }
         
            var imgLis = Config.pContainer.find('li');
            var newLi = $('<li><img /></li>');
             $(imgLis[2]).css('-webkit-transform', 'translateX(0px)').css('-webkit-transition-duration', '.35s').css('z-index','2').addClass('cur');
             $(imgLis[1]).css('-webkit-transform', 'translateX(-'+w+'px)').css('-webkit-transition-duration', '.35s').css('z-index','1').removeClass('cur');
            
            $(imgLis[0]).remove();
            newLi.appendTo(Config.pContainer).css('-webkit-transform', 'translateX('+w+'px)').css('-webkit-transition-duration', '.35s').css('z-index','1').removeClass('cur');
          
            setImgUrl(1,[Config.pNextImgUrl],2);

        }

    
        function previewPrev() {    
            
            var curIndex = $settings.currentIndex,
                imgList = $settings.imgInfo,
                imgLen = Config.gImgLen,
                w = $settings.w;  
            if(!Config.pPrevImgUrl) {
                return;
            } 
            if($settings.currentIndex) {
                $settings.currentIndex --;
                Config.pCurImgUrl = imgList[$settings.currentIndex].url;
                Config.pPrevImgUrl = $settings.currentIndex?imgList[$settings.currentIndex-1].url: '';
                Config.pNextImgUrl = ($settings.currentIndex<imgLen-1)?imgList[$settings.currentIndex+1].url:'';
            }
           
          
            var imgLis = Config.pContainer.find('li');
            var newLi = $('<li><img /></li>');
           
            $(imgLis[0]).css('-webkit-transform', 'translateX(0px)').css('-webkit-transition-duration', '.35s').css('z-index','2').addClass('cur');
            $(imgLis[1]).css('-webkit-transform', 'translateX('+w+'px)').css('-webkit-transition-duration', '.35s').css('z-index','1').removeClass('cur');

            $(imgLis[2]).remove();
            
            newLi.prependTo(Config.pContainer).css('-webkit-transform', 'translateX(-'+w+'px)').css('-webkit-transition-duration', '.35s').css('z-index','1').removeClass('cur');
            setImgUrl(1,[Config.pPrevImgUrl],0);
           

        }

        function setImgUrl(len,urls,index){
            var len = len,
                url = urls;
            //len :1 , index:2
            for(var i=0 ;i<(len); i++){
                if(len == 1){
                    var j = index;
                }else{
                    var j = i;
                }
                $('#gallery_p_list img')[j].src = url[i] == "" ? 'http://p4.qhimg.com/d/inn/33979b01/blank.gif' : url[i];
                $('#gallery_p_list img')[j].onload = function(){
                    var item = this;
                    $(item).parent('li').css('background-image', 'none');
                };
            }
        }
      
        function imgInitPhone(index){
            $settings.currentIndex = index==undefined ? $settings.currentIndex : index;
            var ctn = Config.gListEl,
                curIndex = parseInt($settings.currentIndex,10),
                urls = $settings.imgInfo;
            
            Config.pPrevImgUrl = curIndex > 0 ? urls[curIndex-1].url : '';
            Config.pNextImgUrl = curIndex < (Config.gImgLen-1) ? urls[curIndex+1].url : '';
            Config.pCurImgUrl = urls[curIndex].url;
            var prevImgUrl = Config.pPrevImgUrl,
                nextImgUrl = Config.pNextImgUrl,
                curImgUrl = Config.pCurImgUrl,
                w = $settings.w;
          
            var html = ['<ul id="gallery_p_list">',
                        '<li style="z-index:1;-webkit-transform : translateX(-'+w+'px)"></li>',
                        '<li class="cur" style="z-index:2;-webkit-transform : translateX(0px)"></li>',
                        '<li style="z-index:1;-webkit-transform : translateX('+w+'px)"></li>',
                     '</ul>'];
            ctn.html(html.join(''));
            Config.pContainer = $('#gallery_p_list');
            
            
            var imgLis = Config.pContainer.find('li');   
            $(imgLis[0]).html(prevImgUrl?('<img src="'+prevImgUrl+'" />'):'');
            $(imgLis[1]).html('<img src="'+curImgUrl+'" />');
            $(imgLis[2]).html(nextImgUrl?('<img src="'+nextImgUrl+'" />'):'');

            if(prevImgUrl && nextImgUrl){//前后都有
                setImgUrl(3,[prevImgUrl,curImgUrl,nextImgUrl],0);
            }else{
                if(prevImgUrl){//前有，后面没有
                    setImgUrl(2,[prevImgUrl,curImgUrl],0);
                }else if(nextImgUrl){//后有，前面没有
                    setImgUrl(2,[curImgUrl,nextImgUrl],1);
                }else{//前后，都没有
                    setImgUrl(1,[curImgUrl],0);//这个时候index要传0
                }
            }

        }
        function setSettings(settings){
            $settings = settings;
            return $settings;
        }
        function getCurIndex(){

            return $settings.currentIndex;
        }
        function setTransWidth(w){
            $settings.w = w;
            var imgLis = Config.pContainer.find('li');
            $(imgLis[0]).css('-webkit-transform', 'translateX(-'+w+'px)').css('-webkit-transition-duration', '.35s');
            $(imgLis[1]).css('-webkit-transform', 'translateX(0px)').css('-webkit-transition-duration', '.35s');
            $(imgLis[2]).css('-webkit-transform', 'translateX('+w+'px)').css('-webkit-transition-duration', '.35s');
        }
        function setFtHtml(innerHtml){
            element.find('.ft').html(innerHtml);
        }
        function setHdHtml(innerHtml){
            element.find('.hd').html(innerHtml);
        }
        return {
          
            imgInitPhone : imgInitPhone,
            bindEvent : bindEvent,
            unbindEvent : unbindEvent,
            setSettings : setSettings,
            previewPrev : previewPrev,
            previewNext : previewNext,
            closeGallary : closeGallary,
            getCurIndex : getCurIndex,
            setTransWidth : setTransWidth,
            setFtHtml : setFtHtml,
            setHdHtml : setHdHtml
        }
    };
  
    var HGallery = function(options){
        var settings = $.extend(true,{
            imgInfo : [],
            currentIndex : 0,
            container : document.body,
            hdHtml :'',
            ftHtml :'',
            needEvent : false,
            w : $('body').width()
        },options);
        
        var init = function(){

            if(!G){
                var galleryEl = document.createElement("div"),
                    maskEl = document.createElement("div");
                galleryEl.id = 'gallery';
                maskEl.id = 'gallery-mask';
                galleryEl.style.display = 'none';
                maskEl.style.display = 'none';
              
                $(settings.container).append(galleryEl);
                $(settings.container).append(maskEl);
                element = $('#gallery');
                elementMask = $('#gallery-mask');
                elementMask.css('height',$(settings.container).height()+$(settings.container).scrollTop()+'px');

                G = new Gallery(settings);
                var html = ['<div class="wrap"><div class="hd">'+settings.hdHtml+'</div>',
                    '<div class="bd">',
                        '<div id="gallery_list"></div>',
                    '</div>',
                    '<div class="ft">'+settings.ftHtml+'</div></div>'].join('');
                $(element).html(html);
                Config.gListEl = $('#gallery_list');
                Config.gListBdEl = $('#gallery .bd');
              
                if(!settings.needEvent){
                    G.bindEvent();//绑定默认的事件
                }

            }else{
                G.setSettings(settings);
                elementMask.css('height',$(settings.container).height()+$(settings.container).scrollTop()+'px');
            }
            Config.gImgLen = settings.imgInfo.length;
            G.imgInitPhone();
            return G;
        };
        var MyGallery = init();

        function show(){
            element.show();
            elementMask.show();

        }
        function close(){
            if(!settings.needEvent){
                unbindEvent();
            }
            G.closeGallary();
        
        }
        return {
            prev : MyGallery.previewPrev,//下一页
            next : MyGallery.previewNext,//上一页
            close : close,//关闭
            show : show,
            setImg : MyGallery.imgInitPhone,//设置中间的图片
            getImgIndex : MyGallery.getCurIndex,
            setTransWidth : MyGallery.setTransWidth,//设置图片滑动的宽度，默认是body的width
            setFtHtml : MyGallery.setFtHtml,
            setHdHtml : MyGallery.setHdHtml
        }
    };

    window.HGallery = HGallery;
   
}(Zepto, window, document));