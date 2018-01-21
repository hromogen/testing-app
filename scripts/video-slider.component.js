function VideoSliderComponent(){
    const v = this;
    Component.apply(v, arguments);
    v._videoArticle     = null;
    v._aSources         = null;
    v._noSupportAnchor  = null;
    v._videoTag         = null;

    const _parentRenderTemplate = v._renderTemplate;

    v._renderTemplate = function(template){        
        const renderedTemplate = _parentRenderTemplate(template, { videoData: VIDEO_REGISTER })
        ,slides = renderedTemplate.querySelectorAll('.video-section__anchor');
        v.paginator = new PaginateService({
            eItems: slides
            ,numPerPage: 3
        });
        v._videoArticle    = renderedTemplate.querySelector('.video-section__video-container');
        v._videoTag        = v._videoArticle.querySelector('video');
        v._aSources        = Array.from(v._videoTag.querySelectorAll('source'));
        v._noSupportAnchor = v._videoTag.querySelector('.video-container__no-support-anchor');

        return renderedTemplate;
    }

    v._setEventListeners = function(DOMtree){
        const moveToPrevButton = DOMtree.querySelector('.videomaterials__arrow-container--to-prev')
        ,moveToNextButton = DOMtree.querySelector('.videomaterials__arrow-container--to-next')
        ,closeButton = DOMtree.querySelector('.video-container__close-button')
       
        moveToPrevButton.addEventListener('click', function(){
            v.paginator.goToPrevious(v.paginator.slide);
        });
        moveToNextButton.addEventListener('click',function(){
            v.paginator.goToNext(v.paginator.slide);
        });
        closeButton.addEventListener('click',v.stopWatching);

        return DOMtree; 
    }

    v.stopWatching = function(){
        if(v._videoTag){
            v._videoTag.pause();
            v._videoArticle.classList.remove('video-section__video-container--watching');
            window.removeEventListener('hashchange', v.stopWatching);
            window.removeEventListener('popstate', v.stopWatching);
            
        }
    }

    v.watch = function(sVideoName){
        const videoData = VIDEO_REGISTER.find(function(entry){
            return entry.name == sVideoName;
        });
        videoData.videoSrcs.map(function(sSrc, index){
            v._aSources[index].src = sSrc;
        });
        v._noSupportAnchor.href = videoData.videoSrcs[1];
        v._videoArticle.classList.add('video-section__video-container--watching');
        v._videoTag.load();
        v._videoTag.play();
        window.addEventListener('hashchange', v.stopWatching);
        window.addEventListener('popstate', v.stopWatching);
    }

    v.createComponent();
    return v;
}

VideoSliderComponent.prototype = Object.create(Component.prototype);
VideoSliderComponent.prototype.constructor = VideoSliderComponent;