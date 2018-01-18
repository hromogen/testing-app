function SearchService(){
    const s = this
    s._searchResult = [];
    s._takeSnapShot = function (index, sSearchedText, sTargetText){
        const snapShotRightStart = index + sSearchedText.length
        ,snapShotLeftEnd = index - 1
        let snapShotLeftStart 
        ,snapShotRightEnd; 
        for(let i = snapShotLeftEnd, gapCounter = 0; gapCounter < 4 && i > 0; i--){
            gapCounter += /\s/.test(sTargetText[i])
            snapShotLeftStart = i;
        }
        for(let i = snapShotRightStart, gapCounter = 0; gapCounter < 4 && i < sTargetText.length; i++){
            gapCounter += /\s/.test(sTargetText[i])
            snapShotRightEnd = i;
        }
        return   sTargetText.slice(snapShotLeftStart, snapShotLeftEnd)
               + ' <strong class="search-result__target-text">' + sSearchedText + '</strong>' 
               + sTargetText.slice(snapShotRightStart, snapShotRightEnd);
    }
    s.search = function(sSearched){
        const aElIndexedViews = Array.from(document.querySelectorAll('[data-route]'))
        ,regExpSearched = new RegExp(sSearched, 'g', 'i')
        ,aMatchedInfo = aElIndexedViews.reduce(function(aInterimResult, elView){
            const aMatchStartIndexes = [];
            let aProcessedMatches
            while(regExpSearched.test(elView.innerText)){
                aMatchStartIndexes.push(regExpSearched.lastIndex - sSearched.length)
            }
            if(aMatchStartIndexes.length){
                aProcessedMatches = aMatchStartIndexes.map(function(index){
                    let oInnerResult = {}
                    oInnerResult.route = elView.dataset.route;
                    oInnerResult.snapshot = s._takeSnapShot(index
                        ,sSearched
                        ,elView.innerText);
                    return oInnerResult;
                });
                aInterimResult.push.apply(aInterimResult, aProcessedMatches);
            }
            return aInterimResult;
        },[]);
        s._searchResult = aMatchedInfo ;
        return aMatchedInfo;
    }
}