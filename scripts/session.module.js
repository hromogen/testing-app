function SessionModule(){
    const s = this;

    s.sliderPaginator = new PaginateService();
    s.uploadFormPaginator = new PaginateService();
    s.cacheService = new CacheService()
    s.cardsDisplayService = new CardsDisplayService();
    s.searchService = new SearchService();
    s.userService = new UserService(s.getCurrentUser.bind(s)
                                   ,s.setCurrentUser.bind(s));

    s._parsedCards = {
        quiz     : s.cacheService.loadDOMElementsArray('parsedCards.quiz')    || 
        []
        ,erudith : s.cacheService.loadDOMElementsArray('parsedCards.erudith') || 
        []
    };
    s._loadedCardsData = {
        quiz     : s.cacheService.loadJSONElementsArray('loadedCardsData.quiz')    || 
        []
        ,erudith : s.cacheService.loadJSONElementsArray('loadedCardsData.erudith') || 
        []
    };
    s._currentQuestionary = s.cacheService.loadJSONElementsArray('currentQuestionary') || 
    [];

    s._reg = COMPONENTS_REGISTER;
    s._routerModule = new Navigo(null, true);
    s._currentMode = '';
    s._currentUploadParam = ''
    s._testingArticle = null;
    s._currentlyViewed = [];
    s._uploadedQuestions = [];
    s._currentlyUploadedInfo = {};
    s._currentUser = null;

    s.errorService = new ErrorService(s._routerModule);

    for(componentName in s._reg){
        s._reg[componentName].session = s;
        s._reg[componentName].router = s._routerModule;
    }
    s._cardsArticles = {
        quiz:{}, erudith:{}
    }
    s._rulesArticles = {
        general:{}
        ,quiz:{}
        ,erudith:{}
    }
    s._cabinetEntry = new CabinetEntryComponent(s._reg.cabinetEntryPoint);
    s._navMenu = new NavMenuComponent(s._reg.navMenu);
    s._searchForm = new SearchFormComponent(s._reg.searchForm);
    s._rulesArticles.general = new BasicSectionComponent(s._reg.generalRulesArticle);
    s._rulesArticles.quiz = new BasicSectionComponent(s._reg.quizRulesArticle);
    s._rulesArticles.erudith = new BasicSectionComponent(s._reg.erudithRulesArticle);
    s._filterForm = new FilterFormComponent(s._reg.filterForm);
    s._sorterForm = new SorterFormComponent(s._reg.sorterForm);
    s._cardsArticles.quiz = new CardArticleComponent(s._reg.quizCardsArticle);
    s._cardsArticles.erudith = new CardArticleComponent(s._reg.erudithCardsArticle);
    s._uploadSetupForm = new UploadSetupFormComponent(s._reg.uploadSetupForm);
    s._uploadForm = new UploadFormComponent(s._reg.uploadForm);
    s._videoSlider = new VideoSliderComponent(s._reg.videoSlider);
    s._testingOptionsForm = new TestingOptionsFormComponent(s._reg.testingOptionsForm);
    s._testingArticle = new TestingArticleComponent(s._reg.testingArticle);
    s._searchResults = new BasicSectionComponent(s._reg.searchResult);
    s._registrationForm = new RegistrationFormComponent(s._reg.registrationForm);
    s._personalCabinet = new PersonalCabinetComponent (s._reg.personalCabinet);
    s._testingSummary = new BasicSectionComponent(s._reg.testingSummary);
    s._feedbackForm = new FeedbackFormComponent(s._reg.feedbackForm);
    s._info = new InfoComponent(s._reg.info);

    function _processCardsArticle(mode, query, targetPage){
        if(targetPage == 1){
            s._cardsArticles[mode].modifyInline(query)
        }
        if(targetPage > s._cardsArticles[mode].paginator.numOfPages){
            const lastPageNum = s.cardsPaginators[mode].numOfPages
            ,sRoute = '/cards/' + mode + '?' + query.slice(-1) + lastPageNum;
            s._routerModule.navigate(/*path=*/ sRoute, /*absolute=*/false)
        }else{
            s._cardsArticles[mode].paginator.goToPage(targetPage);
        }
        s._filterForm.hideChildren('.hide-if-' + mode);
        s._sorterForm.hideChildren('.hide-if-' + mode);
        s.viewComponents(s._filterForm
            ,s._sorterForm
            ,s._cardsArticles[mode]);
    }
    
    s._routerModule.on({
        '*': function(){
        s._routerModule.navigate(/*path=*/ '/rules/general', /*absolute=*/false)
       }
        ,'/rules/:articleName': function(options){
            s.viewComponents(s._rulesArticles[options.articleName]);
        }
        ,'/cards/:modeName': function(params, query){
            const mode     = params.modeName
            ,targetPage    = +query.split('page#=')[1];
            s.setCurrentMode(mode);

            if( !query                      || 
                !/sorted_by=/  .test(query) && 
                !/filtered_by=/.test(query) &&
                !/page#=/      .test(query) ){
                    s._routerModule.navigate(/*path=*/ '/cards/'+ mode + '?page#=1'
                    , /*absolute=*/false);
                    return;
            }else if(!s._cardsArticles[mode].paginator || !targetPage){
                s._cardsArticles[mode].createComponent().then(function(){
                    const sRoute = '/cards/' + mode + '?' + query.slice(-1) + '1';
                    _processCardsArticle(mode, query, 1);
                    s._routerModule.navigate(/*path=*/ sRoute, /*absolute=*/false);
                })
            }else {
                _processCardsArticle(mode, query, targetPage);
            }
        }
        ,'/setup-upload/:parameter': function(uploadOpts){
            s.setCurrentMode(uploadOpts.parameter);
            s.viewComponents(s._uploadSetupForm);   
        }
        ,'/upload/:parameter': function(uploadOpts, query){
            if(!s._uploadForm.isActive()){
                s._routerModule.navigate(/*path=*/ '/setup-upload/'+ 
                uploadOpts.parameter, /*absolute=*/false)
            }
                let questionNum = +(query.split('question#=')[1] || 1); 
                s._uploadForm.paginator.goToPage(questionNum);
                s.viewComponents(s._uploadForm);
        }  
        ,'/videomaterials' : function(options){
            s.viewComponents(s._videoSlider);
        }
        ,'/videomaterials/watch' : function(options, query){
            s._videoSlider.watch(query);
        }
        ,'/cards/:modeName/set_testing': function(){
            s.viewComponents(s._testingOptionsForm);
        }
        ,'/testingON': function(){
            if(!s._testingArticle.isActive()){
                s._routerModule.navigate(/*path=*/ '/cards/'    + 
                s._currentMode                                  + 
                '/set_testing'
                , /*absolute=*/false)
                
            }else{
                s.viewComponents(s._testingArticle)
            }
        }
        ,'/testing_result' : function(options, query){
            let parsedTestingResult; 
            if(!query && s._testingArticle.isActive()){
                parsedTestingResult = s.userService.testingResults.getLast();
                s._testingArticle.deactivate();
            }else if(query && !s._testingArticle.isActive()){
                return
            }else{
                s._routerModule.navigate(/*path=*/ '/rules/general', /*absolute=*/false)
            }
            s._testingSummary.modifyInline(parsedTestingResult);
            s.userService.testingResults.modifyLast("summary"
                ,s._testingSummary.getTemplate()
            );
            s.userService.updateTestingLog();
            s.viewComponents(s._testingSummary);
        }
        ,'/register_user' : function (){
            s.viewComponents(s._registrationForm);
        }
        ,'/feedback' : function(){
            s.viewComponents(s._feedbackForm);
        }
        ,'/personal_cabinet/:currUserNickname' : function(options){
            if( s._currentUser                                      && 
                s._currentUser.nickname == options.currUserNickname &&
                s._personalCabinet.isActive()                       ){
                    s._personalCabinet.modifyInline(s._currentUser);
                    s.viewComponents(s._personalCabinet);
            }
        }
        ,'/search': function(options, query){
            if(query){
                const sSearchTarget = decodeURIComponent(query)
                ,oSearchTemplateModData = {};
                oSearchTemplateModData.searchResult = s.searchService.search(sSearchTarget);
                s._searchResults.modifyInline(oSearchTemplateModData)
                s.viewComponents(s._searchResults);
            }
        }
        ,'/info': function(){
            s.viewComponents(s._info);
        }
    }).resolve();
}

SessionModule.prototype = {
    setParsedCards : function(aCards, sModeName){
        this._parsedCards[sModeName] = aCards;
        this.cacheService.saveDOMElementsArray('parsedCards.' + sModeName
        , this._parsedCards[sModeName])
    }
    ,getParsedCards : function(sModeName){
        return this._parsedCards[sModeName];
    }
    ,setLoadedCardsData : function(aCards, sModeName){
        this._loadedCardsData[sModeName] = aCards;
        this.cacheService.saveJSONElementsArray('loadedCardsData.' + sModeName
        , this._loadedCardsData[sModeName])
    }
    ,getLoadedCardsData : function(sModeName){
        return this._loadedCardsData[sModeName];
    }
    ,setCurrentMode : function(sModeName){
        this._currentMode = sModeName;
    }
    ,getCurrentMode : function(){
        return this._currentMode;
    }
    ,setTestingArticle : function(elArticle){
        this._testingArticle = elArticle;
    }
    ,getTestingArticle : function(){
        return this._testingArticle;
    }
    ,setCurrentQuestionary : function(aQuestionary){
        this.cacheService.saveJSONElementsArray('currentQuestionary'
        , aQuestionary);
        this._currentQuestionary = aQuestionary;
    }
    ,getCurrentQuestionary : function(){
        return this._currentQuestionary;
    }
    ,setUploadedQuestions : function(timeStamp, questionSet){
        const s = this;
        let currentInfo = Object.assign({}, s._currentlyUploadedInfo);
        s._currentlyUploadedInfo = {}
        s._uploadedQuestions.push({createdOn: timeStamp
            , testing: questionSet
            , info: currentInfo
            , author: s._currentUser && s._currentUser._nickname || ''
        })
    }
    ,setUploadedInfo : function(oAdditionalInfo){
        Object.assign(this._currentlyUploadedInfo, oAdditionalInfo);
    }
    ,viewComponents : function(){
        this._currentlyViewed.map(function(component){
                component.hide();
            });
        this._currentlyViewed = Array.from(arguments, function(component){
            component.display();
            return component;
        });
    }
    ,addToViewed : function(){
        const aAddedItems = Array.from(arguments, function(item){
            item.display();
            return item;
        })
        this._currentlyViewed = this._currentlyViewed.concat(aAddedItems);
    }
    ,clearView : function(){
        this._currentlyViewed.map(function(component){
            component.hide();

        })
        this._currentlyViewed = [];
    }
    ,getCurrentUser : function(){
        return this._currentUser;
    }
    ,setCurrentUser : function(oUser){
        this._currentUser = oUser;
    }
    ,getRegister : function(){
        return this._reg;
    }
}