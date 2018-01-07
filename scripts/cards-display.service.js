function CardsDisplayService(){
    const c = this;
    c._arraysMatch = function( comparedArray
        ,arrayToCompareTo ){
            let matched = !arrayToCompareTo.length; // if the array to compare
        for ( let i = 0;                            //  to is empty _matched_ = true
            i < comparedArray.length && !matched; 
            i++){
          matched = (arrayToCompareTo.indexOf(comparedArray[i]) !== -1);
        }
        return matched;
      }

    c.filter = function(cards, oParameters){
        const aFilteredCards = cards.map(function(card) {
            const difficulty = +card.dataset.difficulty
            ,size = card.dataset.size
            ,topics = card.dataset.topics.split(','); 
             let isFiltered = difficulty < +oParameters.difficulty[0] || 
                difficulty > +oParameters.difficulty[1] || 
                false;
            isFiltered = isFiltered || 
                oParameters.size && oParameters.size.indexOf(size) !== -1 || 
                false;
            isFiltered = isFiltered || 
                oParameters.topics && !c._arraysMatch( topics, oParameters.topics) || 
                false;
            
            card.classList.remove('cards-article__card--filtered');
            if (isFiltered){
                card.classList.add('cards-article__card--filtered');
            }
            return card;
        });
        return aFilteredCards;
    }

    c.sort = function(cards, sParameterName){
        const aCardsAndSortingTargs = cards.map(function(card) {
                let elSortingTarget = card.querySelector('.card-' + sParameterName + '-info')
                , sSortingTarget = elSortingTarget.querySelector('.sorting-parameter').innerHTML;
            return {
                card: card
                ,target: sSortingTarget 
                }
        })
        ,aSortedCardsAndTargs = aCardsAndSortingTargs.sort(function(oCardAndTargA, oCardAndTargB){
            let result;
            if(['difficulty', 'size'].indexOf(sParameterName) !== -1 ){
                result = +oCardAndTargA.target - (+oCardAndTargB.target)
            }else if(sParameterName == 'topics'){
                result = oCardAndTargA.target.localeCompare(oCardAndTargB.target);
            }
            return result;
        })
        ,oAccumulator = {}
        ,aIndexedCards  = aSortedCardsAndTargs.map(function(oCardAndTarg, index){
            oAccumulator[oCardAndTarg.card.dataset.id] = index;
        })
        ,sortedCards = cards.map(function(card){
                card.style.order = oAccumulator[card.dataset.id];
                return card;
            });

        return sortedCards;
    }

    c.setCardFields = function(card, cardInfo){
        const eDifficulty = document.createElement('span')
        ,eTopics = document.createElement('span')
        ,eQuestionsNum = document.createElement('span');

        eQuestionsNum.innerHTML = cardInfo.questions_uris.length;
        eTopics.innerHTML = cardInfo.topics.map(
            function(val){
                return CardsDisplayService._TOPICNAMES[val];
            });
        eDifficulty.innerHTML = cardInfo.difficulty;
        eDifficulty.classList.add('sorting-parameter');
        eTopics.classList.add('sorting-parameter');
        eQuestionsNum.classList.add('sorting-parameter');

        card.querySelector('.card-difficulty-info').appendChild(eDifficulty);
        card.querySelector('.card-size-info').appendChild(eQuestionsNum);
        card.querySelector('.card-topics-info').appendChild(eTopics);
      }
      
    c.setCardDataset = function(card, cardInfo){
        card.dataset.id = cardInfo.id;
        card.dataset.difficulty = cardInfo.difficulty || '';
        card.dataset.topics = cardInfo.topics;
        card.dataset.size = cardInfo.questions_uris.length;
    }
}

CardsDisplayService._TOPICNAMES = [
    'Біологія','Географія','Інформатика','Історія','Математика','Хімія'
];