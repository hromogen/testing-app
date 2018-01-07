function CardArticleComponent(){
    const c = this;
    Component.apply(c, arguments);
    c._cardService = new CardsDisplayService(c._session); 

    c._getAttachedData = function(){
        const pCardsInfo = c._http.get(c._attachedDataUri)
        .then(function(success){
            return JSON.parse(success)
        })
        , pCardsData = Promise.resolve(pCardsInfo)
        .then(function(success){
            const aCardsInfo = success.map(function(cardInfo){
                return c._http.get(cardInfo.uri);
            });
            return aCardsInfo;
        }).then(function(success){
            return Promise.resolve(Promise.all(success))
        });
        return pCardsData;
    }

    c._modifyTemplate = function(template, fetchedData){
        const originalCardBox = template.querySelector('.cards-article__card');
        resultingCards = fetchedData.map(function (oItem){
            let eCardBox = originalCardBox.cloneNode(true);
            c._cardService.setCardFields(eCardBox, oItem);
            c._cardService.setCardDataset(eCardBox, oItem);
            eCardBox.href = '#/cards/' + c._modeName + '/set_testing';
            return eCardBox;
        }); 

        c._session.setLoadedCardsData(fetchedData, c._modeName); 

        return resultingCards;
    }

    c._setEventListeners = function(aElCards){
        let referenceCardSet = c._session.getLoadedCardsData(c._modeName);
        aElCards.map(function(elCard){
            elCard.addEventListener('click', function(){ 
                let cardQuestionsData = referenceCardSet.find(function(cardData){
                    return cardData.id == elCard.dataset.id;
                })
                ,testingArticleData = c._session.getRegister().testingArticle

                testingArticleData.attachedDataUri = [
                    './assets/mock-server/questions/test-q-01.json'
                    ,'./assets/mock-server/questions/test-q-02.json'
                    ,'./assets/mock-server/questions/test-q-03.json'
                    ,'./assets/mock-server/questions/test-q-04.json'
                    ,'./assets/mock-server/questions/test-q-05.json'
                    ,'./assets/mock-server/questions/test-q-06.json'
                    ,'./assets/mock-server/questions/test-q-07.json'
                    ,'./assets/mock-server/questions/test-q-08.json'
                    ,'./assets/mock-server/questions/test-q-09.json'
                    ,'./assets/mock-server/questions/test-q-10.json'
                ];
                testingArticleData.session = c._session;
                const testingArticleComponent = new TestingArticleComponent(testingArticleData);

                c._session.setTestingArticle(testingArticleComponent);
            })   
        })
        return aElCards; 
    }

    c._inject = function(aCards){
        const mode = c._modeName
        ,s = c._session
        c._container.innerHTML = '';
        c._container.append.apply(c._container, aCards);
        s.setParsedCards(aCards, mode);
        return c._container;
    }
    return c;
}

CardArticleComponent.prototype = Object.create(Component.prototype);
CardArticleComponent.prototype.constructor = CardArticleComponent;
