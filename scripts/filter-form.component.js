function FilterFormComponent(){
    const f = this
    Component.apply(f, arguments);

    function setInputMaxMin (inputElement){
        if(inputElement.id == 'difficultyFrom'){
            inputElement.setAttribute('max',this.value);
        } else if(inputElement.id == 'difficultyTo'){
            inputElement.setAttribute('min',this.value);
        }
    }

    f._setEventListeners = function(DOMtree){
        const filterForm =  DOMtree.querySelector('.filter-form')
        ,diffFromInput = DOMtree.getElementById('difficultyFrom')
        ,diffToInput = DOMtree.getElementById('difficultyTo')
        ,formService = new FormsService(filterForm,/*clear inputs = */false);

        filterForm.addEventListener('submit', function(event){
            event.preventDefault();
            const filterResults = formService.processFilterForm()
            ,sFilterResults = JSON.stringify(filterResults)
            ,oPrevLink = f._router.lastRouteResolved()
            ,aSeparatedQuery = oPrevLink.query && oPrevLink.query.split('&') || []
            ,aPrevSortingParam = aSeparatedQuery.filter(function(queryItem){
                return /sorted_by=/.test(queryItem)
            })
            ,sTargetUri = oPrevLink.url       + '?' +
            (aPrevSortingParam[0] || '')      + '&' +
            ('filtered_by=' + sFilterResults) + '&' +
            'page#=1';
            f._router.navigate(/*path=*/sTargetUri,/*absolute=*/false)
        });
        diffFromInput.addEventListener('input', setInputMaxMin.bind(diffFromInput,diffToInput));
        diffToInput.addEventListener('input', setInputMaxMin.bind(diffToInput, diffFromInput));
        return DOMtree;
    }

    f.createComponent();
    return f;
}
FilterFormComponent.prototype = Object.create(Component.prototype);
FilterFormComponent.prototype.constructor = FilterFormComponent;