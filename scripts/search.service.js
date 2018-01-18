function SearchService(){
    const s = this
    s._searchResult = [];
    s._takeSnapShot = function (text, element){
        const searchText = element.innerText
        ,textPosition  = searchText.indexOf(text);
        let snapShotRightStart = textPosition + text.length
        ,snapShotLeftEnd = textPosition - 1
        ,snapShotLeftStart 
        ,snapShotRightEnd 
        for(let i = textPosition, gapCounter = 0; i > 0 || gapCounter >= 3; i--){
            gapCounter += /\b/.test(searchText[i])
            snapShotLeftStart = i;
        }
        for(let i = snapShotRightStart, gapCounter = 0; i < searchText.length || gapCounter >= 3; i++){
            gapCounter += /\b/.test(searchText[i])
            snapShotRightEnd = i;
        }
        return element.innerText.slice(snapShotLeftStart, snapShotLeftEnd)
               + '<strong>' + text + '</strong>' + 
               element.innerText.slice(snapShotRightStart, snapShotRightEnd)
    }
    s.search = function(sTarget){
        const aElTaragets = Array.from(document.querySelectorAll('[data-route]'))
        ,aMatchedEls = aElTaragets.filter(function(element){
            return element.innerText.indexOf(sTarget) !== -1;
        })
        ,aMatchedInfo = aMatchedEls.map(function(view){
            let result = {}
            result.route = view.dataset.route;
            result.snapshot = s._takeSnapShot(sTarget, view)
            return result;
        })
        s._searchResult = aMatchedInfo;
        return aMatchedInfo;
    }
}