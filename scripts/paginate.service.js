function PaginateService(options){
    const p = this;

    p.init = function(opts){
        p._eItems = opts && opts.eItems || null;
        p._hidingClassName = opts && opts.hidingClassName || '';
        p._displayingClassName = opts && opts.displayingClassName || '';
        p.numPerPage = opts && opts.numPerPage || 1;
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
        const aPaginatedItems = (p._aPaginatedItems) ? p._aPaginatedItems.filter(function(item){
            return !(/filtered/.test(item.className))
        }) : []
        ,bNeedsSorting = aPaginatedItems.every(function(item){
            return item.style.order;
        })
        ,aPaginatedItemsSorted = (bNeedsSorting) ? aPaginatedItems.sort(function(itemA, itemB){
            return +itemA.style.order - (+itemB.style.order);
        }) : aPaginatedItems;
        p.numOfPages = Math.ceil(aPaginatedItems.length/p.numPerPage);

        for(let i = 0, pageNum = 0; i < aPaginatedItems.length; i++){
            pageNum += !(i%p.numPerPage);
            aPaginatedItemsSorted[i].dataset.page = pageNum;
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
    p.hideCurrent = function(){
        p._hide(p._eItems[p.currentPage-1])
    }
    p.generatePaginateLinks = function(container, sBoxClassName, sBasicRef){
        const existingPaginateBox = container.getElementsByClassName(sBoxClassName)[0]
        ,currPaginateBox = existingPaginateBox || document.createElement('p')
        ,aPaginateItems = []
        p.paginate();
        for(let i = 1; i <= p.numOfPages; i++){
            let paginateElement
            if(sBasicRef){
                paginateElement = document.createElement('a');
                paginateElement.href = sBasicRef + i;
            }else{
                paginateElement = document.createElement('button');
                paginateElement.addEventListener('click', function(){
                    p.goToPage(i)
                })
            }
            paginateElement.innerHTML = i;
            paginateElement.className = 'paginate-link';
            aPaginateItems.push(paginateElement)
        }
        currPaginateBox.innerHTML = '';
        currPaginateBox.classList.add(sBoxClassName)
        currPaginateBox.append.apply(currPaginateBox, aPaginateItems);
        container.appendChild(currPaginateBox)
        return container;
    }

    p._hide = function(element){
        if(p._displayingClassName){
            element.classList.remove(p._displayingClassName)
        }else{
            element.style.display = "none"
        }
    }
    p._display = function(element){
        if(p._displayingClassName){
            element.classList.add(p._displayingClassName)
        }else{
            element.style.display = ""
        }
    }
if(options){
    p.init(options);
}
return p;
}