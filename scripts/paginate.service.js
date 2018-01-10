function PaginateService(options){
    const p = this;

    p.init = function(opts){
        p._eItems = opts && opts.eItems || null;
        p._hidingClassName = opts && opts.hidingClassName || '';
        p._displayingClassName = opts && opts.displayingClassName || '';
        p.numPerPage = opts && opts.numPerPage || null;
        p.autoPaginate = opts && opts.autoPaginate || false;
        p.numOfPages = (p.numPerPage) ? Math.ceil(p._eItems.length/p.numPerPage) : null;
        p.currentPage = 1;
        p._aPaginatedItems = Array.from(p._eItems,function(item, index){
            if(p.numPerPage && index > p.numPerPage - 1){
                p._hide(item)
            }
            return item;
        });
    }

    p.paginate = function(){
        let n = 0
        ,pageNum = 1
        ,aPaginatedItems;

        aPaginatedItems = p._aPaginatedItems.filter(function(item){
            return !/filtered/.test(item.className)
        });
        aPaginatedItemsSorted = aPaginatedItems.sort(function(itemA, itemB){
            return (+itemA.style.order || 0) - (+itemB.style.order || 1)
        });

        while(p._firstPageCriterium(n)){
            aPaginatedItemsSorted[n].dataset.page = 1;
            n++;
        }
        p.numPerPage = n;
        p.numOfPages = Math.ceil(p._eItems.length/p.numPerPage);

        for(let i = p.numPerPage; i < aPaginatedItems.length; i++){
                pageNum += !(i%p.numPerPage);
                aPaginatedItems[i].dataset.page = pageNum;
            }
    }
    p.goToPage = function(pageNum){
        p._aPaginatedItems.map(function(eItem){
            if(+eItem.dataset.page == +pageNum){
                p._display(eItem)
            }else if(+eItem.dataset.page != +pageNum){
                p._hide(eItem);
            }
            return eItem;
        });
        p.currentPage = +pageNum;
    }
    p.slide = function(){
        p._aPaginatedItems.map(function(eItem, index){
            if(index < p.currentPage*p.numPerPage && 
                index >= Math.min(
                    p._eItems.length - p.numPerPage
                    , (p.currentPage-1)*p.numPerPage )
                ){
                p._display(eItem)
            }else{
                p._hide(eItem);
            }
            return eItem;
        });
    }
    p.goToNext = function(fMove){
        if(p.currentPage < p.numOfPages){
            p.currentPage++;
        }
        if(fMove){
            fMove();
        }else{
            p.goToPage(p.currentPage)
        }
    }
    p.goToPrevious = function(fMove){
        if(p.currentPage > 1){
            p.currentPage--;
        }
        if(fMove){
            fMove();
        }else{
            p.goToPage(p.currentPage)
        }
    }
    p.generatePageLinks = function(container, sBasicRef){
        const aAnchors = [];
        for(let i = 1; i <= p.numOfPages; i++){
            let anchor = document.createElement('a');
            anchor.href = sBasicRef + i;
            anchor.innerHTML = i;
            anchor.className = 'paginate-link';
            aAnchors.push(anchor)
        }
        container.append.apply(container, aAnchors);
    }

    p._hide = function(element){
        if(p._hidingClassName){
            element.classList.add(p._hidingClassName)
        }else{
            element.style.display = "none"
        }
    }
    p._display = function(element){
        if(p._hidingClassName){
            element.classList.remove(p._hidingClassName)
        }else{
            element.style.display = ""
        }
    }
    p._firstPageCriterium = function(n){
        let bResult;
        if(p.numPerPage && !p.autoPaginate){
            bResult = (n < p.numPerPage)
        }else if(!p.numPerPage && p.autoPaginate){
            bResult = p._isOnScreen(p._eItems[n])
        }else if(!p.numPerPage && !p.autoPaginate){
            bResult = n < 1;
        }
        return bResult;
    }
    p._isOnScreen = function(item){
        return ((item.getBoundingClientRect().bottom + 50) < document.documentElement.clientHeight);
    }
if(options){
    p.init(options);
}
return p;
}