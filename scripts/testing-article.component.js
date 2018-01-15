function TestingArticleComponent(){
    const t = this
    Component.apply(t, arguments);
    const _parentRenderTemplate = t._renderTemplate

    t._renderTemplate = function(template, aDataSet){
        let renderedTemplate = template
        ,aModifiedDataSet;

        if(aDataSet){
            t._session.setCurrentQuestionary(aDataSet);
            aModifiedDataSet  = aDataSet.map(function(oDataItem, i){
                let aOptions = oDataItem.options.map(function(text, index){
                    return {optText: text, optNum: index}
                });
                oDataItem.qNum = i;
                oDataItem.options = aOptions; 
                return  oDataItem;
            });
        }
        renderedTemplate = _parentRenderTemplate(template, {questionary: aModifiedDataSet });
        return renderedTemplate;
    }
    t.createComponent();

    return t;
}
TestingArticleComponent.prototype = Object.create(Component.prototype);
TestingArticleComponent.prototype.constructor = TestingArticleComponent;