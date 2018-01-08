function recursiveSearch(regExp, element){
    const result = []
    ,helperSerch = function(text, element){
        if(element.children.length){
            for(let i = 0; i < element.children.length; i++){
                helperSerch(text, element)
            }
        } else if( element.innerText.indexOf(text) != -1 ){
            result.push(element);
            return;
        } else{
            return;
        }
    }
    return result;
}
function takeSnapShot(text, element){
    const textPosition  = element.innerText.indexOf(text)
    ,snapShotLeftStart  = textPosition - 6
    ,snapShotLeftEnd    = textPosition - 1
    ,snapShotRightStart = textPosition + text.length + 1
    ,snapShotRightEnd   = textPosition + text.length + 5;
    return element.innerText.slice(snapShotLeftStart, snapShotLeftEnd)
           + '<strong>' + text + '</strong>' + 
           element.innerText.slice(snapShotRightStart, snapShotRightEnd)
}

function SearchService(){
    this._indexedViews = {};
}
SearchService.prototype = {
    addToViews : function(sRoute, oComponent){
        this._indexedViews[sRoute] = oComponent;
    }
    ,search : function(sTarget){
        const result = []
        let aResultedMatches;
        for(let sRoute in this._indexedViews){
            let currElt = this._indexedViews[Route].getContainer()
            if( currElt.innerText.indexOf(sTarget) != -1 ){
                aResultedMatches = recursiveSearch(regexpTarg, currElt);
                aResultedMatches.map(function(eMatched){
                    let matchInfo = {}
                    matchInfo.route = sRoute;
                    matchInfo.linkHtml = takeSnapShot(text, eMatched);
                    matchInfo.page = eMatched.dataset.page || '';
                    matchInfo.needsResolving = /filtered/.match(eMatched.className);
                    result.push(matchInfo);
                })
            }   
        }
        return result;
    }
}