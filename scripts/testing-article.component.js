function TestingArticleComponent(){
    const t = this
    Component.apply(t, arguments);

    t._modifyQuestionField = function(field, data, index){
        const eQuestion = field.querySelector('.testing-form__question'),
        qlInputs = field.querySelectorAll('.testing-form__option')
        ,qlLabels = field.querySelectorAll('.testing-form__label');
    
        eQuestion.innerHTML = data.question;
        data.options.map(function(option, optNum){
            qlLabels[optNum].innerHTML = option;
            qlLabels[optNum].for = qlInputs[optNum].id = 'option'+ index + optNum;
            qlInputs[optNum].value = optNum;
            qlInputs[optNum].name = 'option' + index;
        });
        return field;
    }

    t._getAttachedData = function(){
         return Promise.all(
            t._attachedDataUri.map(function(questionItem){
                return t._http.get(questionItem);
            })
        )
    }

    t._modifyTemplate = function(template, fetchedData){
        const testingForm = template.querySelector('.testing-form')
        , questionField = testingForm.querySelector('.testing-form__formfield')
        ,aTestigFields = fetchedData.map(function(data, index){
            let fieldCopy = questionField.cloneNode(true);
            return t._modifyQuestionField(fieldCopy, data, index);
        });
        testingForm.removeChild(questionField);
        testingForm.append.apply(testingForm, aTestigFields);
        t._session.setCurrentQuestionary(fetchedData);
        return template;
    }
    t.createComponent();

    return t;
}
TestingArticleComponent.prototype = Object.create(Component.prototype);
TestingArticleComponent.prototype.constructor = TestingArticleComponent;