function CardArticleComponent(){
    const c = this;
    Component.apply(c, arguments);
    const _parentRenerer = c._renderTemplate;

    c._cardService = new CardsDisplayService(c._session);

    c._getAttachedData = function(){
        const pCardsInfo = c._http.get(c._attachedDataUri)
        .then(function(success){
            return JSON.parse(success)
        })
        , pCardsData = Promise.resolve(pCardsInfo)
        .then(function(success){
            const aCardsInfo = success.map(function(cardInfo){
                return c._http.get(cardInfo.uri).then(function(success){
                    return JSON.parse(success)
                })
            });
            return aCardsInfo;
        }).then(function(success){
            return Promise.resolve(Promise.all(success))
        });
        return pCardsData;
    }

    c._renderTemplate = function(template, fetchedData){
        const dataForRendering = fetchedData.map(function(cardData){
            cardData.size = cardData.questions_uris.length;
            return cardData;
        })
        ,parsedTemplate = _parentRenerer(template, dataForRendering)
        ,eCardCollection = parsedTemplate.querySelectorAll('.cards-article__card')
        ,aElCards = Array.from(eCardCollection, function(eCard, index){
            eCard.href = '/cards/' + c._modeName + '/set_testing';
            eTopics = eCard.querySelector('.card-topics-info .sorting-parameter');
            eTopics.innerHTML = fetchedData[index].topics.map(
                function(val){
                    return CardsDisplayService._TOPICNAMES[val];
                });
                c.hideChildren('.hide-if-' + c._modeName, eCard);
            return eCard;
        })
        ,sPaginateLink = '#/cards/' + c._modeName + 'page#=';
        c.paginator = new PaginateService({
            eItems: aElCards
            ,displayingClassName: 'cards-article__card--on-this-page'
            ,numPerPage: 9
        });
        c.paginator.generatePaginateLinks(parsedTemplate.body, 'cards__links', sPaginateLink);

        c._session.setParsedCards(aElCards, c._modeName);
        c._session.setLoadedCardsData(fetchedData, c._modeName); 
        return parsedTemplate;
    }
    
    c._setEventListeners = function(DOMElement){
        const aElCards = Array.from(DOMElement.querySelectorAll('.cards-article__card'))
        , referenceCardSet = c._session.getLoadedCardsData(c._modeName);

        aElCards.map(function(elCard){
            elCard.addEventListener('click', function(){ 
                let cardQuestionsData = referenceCardSet.find(function(cardData){
                    return cardData.id == elCard.dataset.id;
                })
                Promise.all([
                    ' ./assets/mock-server/questions/test-q-01.json'
                    ,'./assets/mock-server/questions/test-q-02.json'
                    ,'./assets/mock-server/questions/test-q-03.json'
                    ,'./assets/mock-server/questions/test-q-04.json'
                    ,'./assets/mock-server/questions/test-q-05.json'
                    ,'./assets/mock-server/questions/test-q-06.json'
                    ,'./assets/mock-server/questions/test-q-07.json'
                    ,'./assets/mock-server/questions/test-q-08.json'
                    ,'./assets/mock-server/questions/test-q-09.json'
                    ,'./assets/mock-server/questions/test-q-10.json'
                ].map(function(uri){
                    return c._http.get(uri)
                })
                ).then(function(aQuestionaryData){
                    let parsedQuestionary = aQuestionaryData.map(function(sQuestionaryItem){
                        return JSON.parse(sQuestionaryItem)
                    });
                    c._session.setCurrentQuestionary(parsedQuestionary)
                    return parsedQuestionary;
                }) 
            })
        return elCard;     
        })
    return DOMElement;
    }

    c.modifyInline = function(query){
        const s             = c._session
        ,aCards             = s.getParsedCards(c._modeName)
        ,sSortingParamDirty = query.split('sorted_by=')[1]
        ,sFilterParamsDirty = query.split('filtered_by=')[1]
        ,sSortingParamClean = sSortingParamDirty && sSortingParamDirty.split('&')[0] || ''
        ,sFilterParamsClean = sFilterParamsDirty && sFilterParamsDirty.split('&')[0] || ''
        ,oFilterParams      = sFilterParamsClean && JSON.parse(sFilterParamsClean)
        ,sPaginateBasicRef  = '#/cards/' + c._modeName + '?' + query.slice(0,-1)
        
        if(sSortingParamClean){
            s.cardsDisplayService.sort(aCards, sSortingParamClean)
        }
        if(oFilterParams){
            s.cardsDisplayService.filter(aCards, oFilterParams)
        }else{
            s.cardsDisplayService.resetFilters(aCards);
        }
        c.paginator.generatePaginateLinks(c._container, 'cards__links', sPaginateBasicRef);
    }
    c.createComponent();
    return c;
}

CardArticleComponent.prototype = Object.create(Component.prototype);
CardArticleComponent.prototype.constructor = CardArticleComponent;
