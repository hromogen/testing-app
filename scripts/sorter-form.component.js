function SorterFormComponent(){
    const s = this
    Component.apply(s, arguments);
    s._clearContainer = false;

    s._setEventListeners = function(DOMtree){
        const sorterForm =  DOMtree.querySelector('.sorter-form')
        ,formService = new FormsService(sorterForm
            , new CardsDisplayService(s._session));

        sorterForm.addEventListener('submit', function(event){
            event.preventDefault();
            const sSorterResult = formService.processSorterForm()
            ,oPrevLink = s._router.lastRouteResolved()
            ,aSeparatedQuery = oPrevLink.query && oPrevLink.query.split('&') || []
            ,aPrevFilterParam = aSeparatedQuery.filter(function(queryItem){
                return /filtered_by=/.test(queryItem)
            })
            ,sTargetUri = oPrevLink.url   + '?' +
            (aPrevFilterParam[0] || '' )  + '&' +
            ('sorted_by=' + sSorterResult) + '&' +
            'page#=1';
            s._router.navigate(/*path=*/sTargetUri,/*absolute=*/false)
        });

    return DOMtree;
    }

    s.createComponent();
    return s;
}
SorterFormComponent.prototype = Object.create(Component.prototype);
SorterFormComponent.prototype.constructor = SorterFormComponent;