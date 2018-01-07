function SessionModule(){
    const s = this;

    s.sliderPaginator = new PaginateService();
    s.uploadFormPaginator  = new PaginateService();
    s.cardsPaginators = {
        erudith: null
        ,quiz: null
    };
    s.cacheService = new CacheService()
    s.userService = new UserService(s._currentUser);
    s.cardsDisplayService = new CardsDisplayService()

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

    s._navMenu = new NavMenuComponent(s._reg.navMenu);
    s._rulesArticles.general = new RulesSectionComponent(s._reg.generalRulesArticle);
    s._rulesArticles.quiz = new RulesSectionComponent(s._reg.quizRulesArticle);
    s._rulesArticles.erudith = new RulesSectionComponent(s._reg.erudithRulesArticle);
    s._filterForm = new FilterFormComponent(s._reg.filterForm);
    s._sorterForm = new SorterFormComponent(s._reg.sorterForm);
    s._cardsArticles.quiz = new CardArticleComponent(s._reg.quizCardsArticle);
    s._cardsArticles.erudith = new CardArticleComponent(s._reg.erudithCardsArticle);
    s._cardsPaginateBoxes.quiz = new PaginateBoxComponent(s._reg.quizCardsPaginateBox)
    s._cardsPaginateBoxes.erudith = new PaginateBoxComponent(s._reg.erudithCardsPaginateBox)
    s._testingOptionsForm = new TestingOptionsFormComponent(s._reg.testingOptionsForm);
    s._videoSlider = new VideoSliderComponent(s._reg.videoSlider);
    s._uploadSetupForm = new UploadSetupFormComponent(s._reg.uploadSetupForm);
    
    s._uploadForm = null;


    s._routerModule.on({
        '*': function(){
        s._routerModule.navigate(/*path=*/ '/rules/general', /*absolute=*/false)
       }
        ,'/rules/:articleName': function(options){
            s.viewComponents(s._rulesArticles[options.articleName]);
        }
        ,'/cards/:modeName': function(params, query){
            const mode = params.modeName;
            s.setCurrentMode(mode);
            if( !query                      || 
                !/sorted_by=/.test(query)   && 
                !/filtered_by=/.test(query) &&
                !/page#=/.test(query)       ){
                    s._routerModule.navigate(/*path=*/ '/cards/'+ mode + '?page#=1', /*absolute=*/false);
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
                    ,oFilterParams = sFilterParamsClean && JSON.parse(sFilterParamsClean);
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
        ,'/cards/:modeName/set_testing': function(){
            s.viewComponents(s._testingOptionsForm);
        }
        ,'/setup-upload/:parameter': function(uploadOpts){
            s.setUploadParam(uploadOpts.parameter);
            s.viewComponents(s._uploadSetupForm);   
        }
        ,'/upload/:parameter/:questionNum': function(uploadOpts){
            if(uploadOpts.parameter != s._currentUploadParam){
                s._routerModule.navigate(/*path=*/ ('/setup/'+ uploadOpts.parameter), /*absolute=*/false);
            }else{
                let questionNum = +(uploadOpts.questionNum || 1); 
                s.setUploadParam('');
                s.uploadFormPaginator.goToPage(questionNum);
                s.viewComponents(s._uploadForm);
            }
        }  
        ,'/videomaterials' : function(options){
           // s.sliderPaginator.goToPage(options && +options.pageNum || 1)
            s.viewComponents(s._videoSlider);
        }
        ,'/videomaterials/watch' : function(options){
            s._videoSliderComponent.watch(options.videoName);
        }
        ,'/testingON': function(){
            s.viewComponents(s._testingArticle);
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
    ,getUploadParam : function(){
        return this._currentUploadParam;
    }
    ,setUploadParam : function(sParam){
        this._currentUploadParam = sParam;
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
    ,addComponent : function(oComponent, sComponentName){
        s[sComponentName] = oComponent
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
    ,getRegister : function(){
        return this._reg;
    }
    ,cardsPageChanged : function(currPageNum, sCurrFilterParams, sCurrSorterParam){
        const savedPageNum = sessionStorage.getItem('savedPageNum') 
        ,savedFilterParams = sessionStorage.getItem('savedFilterParams') || ''
        ,savedSorterParam  = sessionStorage.getItem('savedSorterParam') || '';
        let result;
        if(+currPageNum != +savedPageNum){
            sessionStorage.setItem('savedPage', currPageNum);
            result = true;
        }
        if(sCurrFilterParams != savedFilterParams){
            sessionStorage.setItem('savedFilterParams', sCurrFilterParams);
            result = true;
        }
        if(sCurrSorterParam != savedSorterParam){
            sessionStorage.setItem('savedSorterParam', sCurrSorterParam);
            result = true;
        }
        return result;
    }
}