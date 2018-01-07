function PaginateBoxComponent(options){
    const p = this;
    Component.call(p, options);

    p.setBasicRef = function(sBasicRef){
        p._sBasicRef = sBasicRef;
    }
    p.setPaginateService = function(paginateServise){
        p._paginateService = paginateServise;
    }

    p._modifyTemplate = function(){
        const aAnchors = []
        ,parentClassList =  p._container['classList']
        ,sParentClassName = parentClassList[parentClassList.length-1]

        for(let i = 1; i <= p._paginateService.numOfPages; i++){
            let anchor = document.createElement('a');
            anchor.href = p._sBasicRef + i;
            anchor.innerHTML = i;
            anchor.className = sParentClassName + '__paginate-link';
            aAnchors.push(anchor)
        }
        return aAnchors;
    }
    p._inject = function(aAnchors){
        p._container.innerHTML = '';
        p._container.append.apply(p._container, aAnchors);
        return p._container;
    }

}
PaginateBoxComponent.prototype = Object.create(Component.prototype);
PaginateBoxComponent.constructor = PaginateBoxComponent;