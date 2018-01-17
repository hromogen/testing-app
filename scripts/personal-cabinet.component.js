function PersonalCabinetComponent(){
    const p = this;
    Component.apply(p, arguments);
    p._rawTemplates = {
        testingLogs : ''
        ,mainInfo : ''
    }
    p._elTestingLogs = null;
    p._elMainInfo = null;

    const _parentRenderTemplate = p._renderTemplate;

    p._renderTemplate = function(sTemplate, fetchedData){
        const elRawArticle = p._parser.parseFromString(sTemplate, "text/html")
        ,elTestingLogs     = elRawArticle.querySelector('.personal-cabinet__testing-info')
        ,elMainInfo        = elRawArticle.querySelector('.personal-cabinet__main-info');
        p._rawTemplates.testingLogs = elTestingLogs.innerHTML;
        p._rawTemplates.mainInfo    = elMainInfo.innerHTML;
        return _parentRenderTemplate(sTemplate, fetchedData);

    }
    p._setEventListeners = function(parsedTemplate){
        p._elTestingLogs = parsedTemplate.querySelector('.personal-cabinet__testing-info');
        p._elMainInfo = parsedTemplate.querySelector('.personal-cabinet__main-info');
        return parsedTemplate
    }
    p.updateTestingLogs = function(userData){
        const sUpdatedLogs = Mustache.render(p._rawTemplates.testingLogs, userData);
        p._elTestingLogs.innerHTML = sUpdatedLogs;
    }
    p.createComponent();
    return p;
}
PersonalCabinetComponent.prototype = Object.create(Component.prototype);
PersonalCabinetComponent.prototype.constructor = PersonalCabinetComponent;