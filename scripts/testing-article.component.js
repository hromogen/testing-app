function TestingArticleComponent(){
    const t = this
    Component.apply(t, arguments);
    const _parentRenderTemplate = t._renderTemplate


    t._renderTemplate = function(template, aDataSet){
        let renderedTemplate = template
        ,aModifiedDataSet
        if(aDataSet){
            aModifiedDataSet  = aDataSet.map(function(oDataItem, i){
                oDataItem.qNum = i;
                return  oDataItem;
            });
        }
        renderedTemplate = _parentRenderTemplate(template, aModifiedDataSet);
        return renderedTemplate;
    }
    t.createComponent();

    return t;
}
TestingArticleComponent.prototype = Object.create(Component.prototype);
TestingArticleComponent.prototype.constructor = TestingArticleComponent;