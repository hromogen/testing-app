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
        const videoAnchors = DOMtree.querySelectorAll('.video-section__anchor')
        moveLeftButton = DOMtree.querySelector('.videomaterials__arrow-container--left')
        ,moveRightButton = DOMtree.querySelector('.videomaterials__arrow-container--right');

        v._session.sliderPaginator.init({eItems: videoAnchors, numPerPage: 3});
        moveLeftButton.addEventListener('click', v._session.sliderPaginator.goToPrevious);
        moveRightButton.addEventListener('click', v._session.sliderPaginator.goToNext);
        return DOMtree; 
    }
    v.createComponent();
    return v;
}

VideoSliderComponent.prototype = Object.create(Component.prototype);
VideoSliderComponent.prototype.constructor = VideoSliderComponent;