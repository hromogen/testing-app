function VideoSliderComponent(){
    const v = this;
    Component.apply(v, arguments);
 
    v._modifyTemplate = function(template){
        const avatarArticle = template.querySelector('.video-section__avatars')
        ,videoAnchorTemplate = avatarArticle.querySelector('.video-section__anchor')
        ,videoAnchorSet = VIDEO_REGISTER.map(function(videoData, index){
            let videoAnchorCopy = videoAnchorTemplate.cloneNode(true)
            ,avatarImg = videoAnchorCopy.querySelector('.slider-article__video-placeholder')
            ,videoName = videoData.name;

            avatarImg.src = videoData.avatarSrc;
            avatarImg.alt = 'placeholder' + ('000'+ index).slice(-3);
            videoAnchorCopy.href += videoName
            return videoAnchorCopy;
        });

        avatarArticle.removeChild(videoAnchorTemplate);
        avatarArticle.append.apply(avatarArticle, videoAnchorSet);

        return template;
    }
    v._setEventListeners = function(DOMtree){
        const slidesArticle =  DOMtree.querySelector('.video-section__avatars')
        ,slides = DOMtree.querySelectorAll('.video-section__anchor')
        ,moveToPrevButton = DOMtree.querySelector('.videomaterials__arrow-container--to-prev')
        ,moveToNextButton = DOMtree.querySelector('.videomaterials__arrow-container--to-next')
        ,numPerPage = 3
        let position = 0;

        moveToPrevButton.addEventListener('click', function(){
            const flipWidth = v._container.clientWidth;
            position = Math.min(position + flipWidth, 0);
            slidesArticle.style.marginLeft = position + 'px';
        });
        moveToNextButton.addEventListener('click',function(){
            const flipWidth = v._container.clientWidth;
            position = Math.max(position - flipWidth
                , -(slides.length - numPerPage)*flipWidth/numPerPage);
            slidesArticle.style.marginLeft = position + 'px';
        });
        return DOMtree; 
    }
    v.createComponent();
    return v;
}

VideoSliderComponent.prototype = Object.create(Component.prototype);
VideoSliderComponent.prototype.constructor = VideoSliderComponent;