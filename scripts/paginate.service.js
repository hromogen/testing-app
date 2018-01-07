function PaginateService(options){
    const p = this;

    p.init = function(opts){
        p._eItems = opts && opts.eItems || null;
        p._hidingClassName = opts && opts.hidingClassName || '';
        p._displayingClassName = opts && opts.displayingClassName || '';
        p.numPerPage = opts && opts.numPerPage || null;
        p.autoPaginate = opts && opts.autoPaginate || false;
        p.numOfPages;
        p.currentPage = 1;
    }

    p.paginate = function(){
        let n = 0
        ,pageNum = 1
        ,aPaginatedItems;

        aPaginatedItems = Array.from(p._eItems).filter(function(item){
            return !/filtered/.test(item.className)
        });
        aPaginatedItems = aPaginatedItems.sort(function(itemA, itemB){
            return (+itemA.style.order || 1) - (+itemB.style.order || 0)
        });

        while(p._firstPageCriterium(n)){
            aPaginatedItems[n].dataset.page = 1;
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
        const aPaginatedItems = Array.from(p._eItems, function(eItem){
            if(+eItem.dataset.page == +pageNum){
                p._display(eItem)
            }else if(+eItem.dataset.page != +pageNum){
                p._hide(eItem);
            }
        });
        p.currentPage = +pageNum;
    }
    p.goToNext = function(){
        if(p.currentPage < p.numOfPages - 1){
            p.currentPage++;
        }else{
            p.currentPage = 1;
        }
        p.goToPage(p.currentPage);
    }
    p.goToPrevious = function(){
        if(p.currentPage > 1){
            p.currentPage--;
        }else{
            p.currentPage = p._eItems.length;
        }
        p.goToPage(p.currentPage);
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