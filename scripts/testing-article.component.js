function TestingArticleComponent(){
    const t = this
    Component.apply(t, arguments);
    const _parentRenderTemplate = t._renderTemplate

    t._renderTemplate = function(template, aDataSet){
        const sDisplayingMessageClass = 'testing-section__message--displayed'
        let renderedTemplate = template
        ,correctMessageBox
        ,wrongMessageBox
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
        wrongMessageBox = renderedTemplate.querySelector('.testing-section__message--wrong');
        correctMessageBox = renderedTemplate.querySelector('.testing-section__message--correct');
        t.informService = new InformService({
            correctMessage: { 
                container: correctMessageBox
                ,displayingClass: sDisplayingMessageClass
            }
            ,wrongMessage: {
                container: wrongMessageBox
                ,displayingClass: sDisplayingMessageClass
            }
        });
        return renderedTemplate;
    }
    t.createComponent();

    return t;
}
TestingArticleComponent.prototype = Object.create(Component.prototype);
TestingArticleComponent.prototype.constructor = TestingArticleComponent;