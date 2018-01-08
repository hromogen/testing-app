function SessionModule(){
    const s = this;

    s.sliderPaginator = new PaginateService();
    s.uploadFormPaginator = new PaginateService();
    s.cardsPaginators = {
        erudith: null
        ,quiz: null
    };
    s.cacheService = new CacheService()
    
    s.cardsDisplayService = new CardsDisplayService();
    s.searchService = new SearchService();
    s.userService = new UserService(s.getCurrentUser.bind(s)
    , s.setCurrentUser.bind(s));

    s._parsedCards = {
        quiz: s.cacheService.loadDOMElementsArray('parsedCards.quiz') || []
        ,erudith:s.cacheService.loadDOMElementsArray('parsedCards.erudith') || []
    };
    s._loadedCardsData = {
        quiz: s.cacheService.loadJSONElementsArray('loadedCardsData.quiz') || []
        ,erudith: s.cacheService.loadJSONElementsArray('loadedCardsData.erudith') || []
    };
    s._reg = COMPONENTS_REGISTER;
    s._routerModule = new Navigo(null, true);
    s._currentMode = '';
    s._currentUploadParam = ''
    s._testingArticle = null;
    s._currentQuestionary = null;
    s._currentlyViewed = [];
    s._uploadedQuestions = [];
    s._currentlyUploadedInfo = {};
    s._currentUser = null;


    for(componentName in s._reg){
        s._reg[componentName].session = s;
        s._reg[componentName].router = s._routerModule;
    }
    s._cardsArticles = {
        quiz:{}, erudith:{}
    }
    s._cardsPaginateBoxes = {
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
    s._cardsPaginateBoxes.quiz = new PaginateBoxComponent(s._reg.quizCardsPaginateBox);
    s._cardsPaginateBoxes.erudith = new PaginateBoxComponent(s._reg.erudithCardsPaginateBox);
    s._uploadSetupForm = new UploadSetupFormComponent(s._reg.uploadSetupForm);
    s._uploadForm = new UploadFormComponent(s._reg.uploadForm);
    s._videoSlider = new VideoSliderComponent(s._reg.videoSlider);
    s._testingOptionsForm = new TestingOptionsFormComponent(s._reg.testingOptionsForm);
    s._searchResults = new BasicSectionComponent(s._reg.searchResults);
    s._registrationForm = new RegistrationFormComponent(s._reg.registrationForm);
    s._personalCabinet = new PersonalCabinetComponent (s._reg.personalCabinet);
    

    s._routerModule.on({
        '*': function(){
        s._routerModule.navigate(/*path=*/ '/rules/general', /*absolute=*/false)
       }
        ,'/rules/:articleName': function(options){
            s.searchService.addToViews('/rules/'+ options.articleName
            , s._rulesArticles[options.articleName]);
            s.viewComponents(s._rulesArticles[options.articleName]);
        }
        ,'/cards/:modeName': function(params, query){
            const mode = params.modeName;
            s.setCurrentMode(mode);
            if( !query                      || 
                !/sorted_by=/.test(query)   && 
                !/filtered_by=/.test(query) &&
                !/page#=/.test(query)       ){
                    s._routerModule.navigate(/*path=*/ '/cards/'+ mode + '?page#=1'
                    , /*absolute=*/false);
                    return;
            }
            const targetPage    = +query.split('page#=')[1] || 1
            ,sSortingParamDirty = query.split('sorted_by=')[1]
            ,sFilterParamsDirty = query.split('filtered_by=')[1]
            ,sSortingParamClean = sSortingParamDirty && sSortingParamDirty.split('&')[0] || ''
            ,sFilterParamsClean = sFilterParamsDirty && sFilterParamsDirty.split('&')[0] || ''
            ,currPaginateBox    = s._cardsPaginateBoxes[mode];

            if(targetPage == 1 || !s.cardsPaginators[mode]){
                s._cardsArticles[mode].createComponent().then(function(){
                    const aCards = s._parsedCards[mode]
                    ,oFilterParams = sFilterParamsClean && 
                        JSON.parse(sFilterParamsClean);
                    let currPaginator;
                    if(sSortingParamClean){
                        s.cardsDisplayService.sort(aCards, sSortingParamClean)
                    }
                    if(oFilterParams){
                        s.cardsDisplayService.filter(aCards, oFilterParams)
                    }
                    currPaginator = new PaginateService({
                        eItems: aCards
                        ,hidingClassName: 'on-other-page'
                        ,numPerPage: 6
                    });
                    currPaginator.paginate();
                    s.searchService.addToViews('/cards/'+ mode, s._cardsArticles[mode]);
                    currPaginateBox.setBasicRef('#/cards/'+ mode + '?' + query.slice(0,-1));
                    currPaginateBox.setPaginateService(currPaginator);
                    currPaginateBox.createComponent().then(function(){
                        s.viewComponents(s._filterForm
                            ,s._sorterForm
                            ,s._cardsArticles[mode]
                            ,currPaginateBox);
                        currPaginator.goToPage(targetPage);
                    });
                    s.cardsPaginators[mode] = currPaginator;
                })
            }else{
                s.cardsPaginators[mode].goToPage(targetPage);
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
                s.uploadFormPaginator.goToPage(questionNum);
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
        ,'/register_user' : function (){
            s.viewComponents(s._registrationForm);
        }
        ,'/personal_cabinet/:currUserNickname' : function(options){
            if( s._currentUser                                      && 
                s._currentUser.nickname == options.currUserNickname &&
                s._personalCabinet.isActive()                       ){
                    s.viewComponents(s._personalCabinet);

            }
        }
        ,'/testingON': function(){
            s.viewComponents(s._testingArticle);
        }
        ,'/search_result': function(options, query){
            if(query){
                vewComponents(s._testingArticle);
            }
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
    ,getCurrentMode : function(sModeName){
        return this._currentMode;
    }
    ,setTestingArticle : function(elArticle){
        this._testingArticle = elArticle;
    }
    ,getTestingArticle : function(){
        return this._testingArticle;
    }
    ,setCurrentQuestionary : function(aQuestionary){
        this._currentQuestionary = aQuestionary;
    }
    ,getCurrentQuestionary : function(){
        return this._currentQustionary;
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