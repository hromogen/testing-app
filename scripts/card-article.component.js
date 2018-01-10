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
        const renderedTemplate = _parentRenerer(template, fetchedData)
        ,eCardCollection = renderedTemplate.querySelectorAll('.cards-article__card')
        ,aElCards = Array.from(eCardCollection, function(eCard, index){
            eCard.href = '/cards/' + c._modeName + '/set_testing';
            eTopics = eCard.querySelector('.card-topics-info .sorting-parameter');
            eTopics.innerHTML = fetchedData[index].topics.map(
                function(val){
                    return CardsDisplayService._TOPICNAMES[val];
                });
            return eCard;
        });

        c._session.setParsedCards(aElCards, c._modeName);
        c._session.setLoadedCardsData(fetchedData, c._modeName); 
        return renderedTemplate;
    }
    
    c._setEventListeners = function(DOMElement){
        const aElCards = Array.from(DOMElement.querySelectorAll('.cards-article__card'))
        , referenceCardSet = c._session.getLoadedCardsData(c._modeName);
        aElCards.map(function(elCard){
            elCard.addEventListener('click', function(){ 
                let cardQuestionsData = referenceCardSet.find(function(cardData){
                    return cardData.id == elCard.dataset.id;
                })
                c._session._testingArticleComponent.modifyInline([
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
                ]);
            })   
        })
        return DOMElement; 
    }
    c.createComponent();
    return c;
}

CardArticleComponent.prototype = Object.create(Component.prototype);
CardArticleComponent.prototype.constructor = CardArticleComponent;
