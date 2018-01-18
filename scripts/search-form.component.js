function SearchFormComponent(){
    const s = this;
    Component.apply(s, arguments);
    s._clearContainer = false;
    s._setEventListeners = function(DOMtree){
        const form = DOMtree.querySelector('.header__search-form');
        form.addEventListener('submit', function(event){
            event.preventDefault();
            const searchedText = form[0].value;
            s._router.navigate(/*path=*/'/search?'+ searchedText
        ,/*absolute=*/ false)
        });
    return DOMtree;
    }
    
    s.createComponent();
    return s;
}
SearchFormComponent.prototype = Object.create(Component.prototype);
SearchFormComponent.prototype.constructor = SearchFormComponent;