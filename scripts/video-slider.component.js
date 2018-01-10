function VideoSliderComponent(){
    const v = this;
    Component.apply(v, arguments);

    const _parentRenderTemplate = v._renderTemplate;

    v._renderTemplate = function(template){        
        return _parentRenderTemplate(template, { videoData: VIDEO_REGISTER });
    }

    v._setEventListeners = function(DOMtree){
        const slides = DOMtree.querySelectorAll('.video-section__anchor')
        ,moveToPrevButton = DOMtree.querySelector('.videomaterials__arrow-container--to-prev')
        ,moveToNextButton = DOMtree.querySelector('.videomaterials__arrow-container--to-next')
        ,closeButton = DOMtree.querySelector('.video-container__close-button')
        ,sliderPaginator = new PaginateService({
            eItems: slides
            ,numPerPage: 3
        });

        v._videoArticle = DOMtree.querySelector('.video-section__video-container');
        v._video = v._videoArticle.querySelector('video');
        v._source = v._videoArticle.querySelector('source');
        
        moveToPrevButton.addEventListener('click', function(){
            sliderPaginator.goToPrevious(sliderPaginator.slide);
        });
        moveToNextButton.addEventListener('click',function(){
            sliderPaginator.goToNext(sliderPaginator.slide);
        });
        closeButton.addEventListener('click',v.stopWatching);

        return DOMtree; 
    }

    v.stopWatching = function(){
        v._source.src = "";
        v._video.poster = "";
        v._videoArticle.classList.remove('video-section__video-container--watching')
    }
    v.watch = function(sVideoName){
        const videoData = VIDEO_REGISTER.find(function(entry){
            return entry.name == sVideoName;
        });
        v._source.src = videoData.videoSrc;
        //v._video.poster = videoData.posterSrc;
        v._videoArticle.classList.add('video-section__video-container--watching')
    }

    v.createComponent();
    return v;
}

VideoSliderComponent.prototype = Object.create(Component.prototype);
VideoSliderComponent.prototype.constructor = VideoSliderComponent;