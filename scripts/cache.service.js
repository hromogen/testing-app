function CacheService(){
    this._sSeparator = '__sEpArAtOr__';
}
CacheService.prototype = {
    saveDOMElementsArray : function(name, aElements){
        const aStrinhifiedEls = aElements.map(function(element){
            return element.outerHTML
        }).join(this._sSeparator);
        sessionStorage.setItem(name, aStrinhifiedEls);
    }
    ,loadDOMElementsArray : function(name){
        const sItem = sessionStorage.getItem(name)
        ,parser = new DOMParser();
        return sItem ? sItem.split(this._sSeparator).map(function(item){
            return parser.parseFromString(item, "text/html").body.children[0];
        }) : null;
    }
    ,saveJSONElementsArray : function(name, aElements){
        const aStrinhifiedEls = aElements.map(function(element){
            return JSON.stringify(element)
        }).join(this._sSeparator);
        sessionStorage.setItem(name, aStrinhifiedEls);
    }
    ,loadJSONElementsArray : function(name){
        const sItem = sessionStorage.getItem(name)
        return sItem ? sItem.split(this._sSeparator).map(function(item){
            return JSON.parse(item);
        }) : null;
    }
}