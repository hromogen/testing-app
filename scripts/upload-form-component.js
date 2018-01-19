function UploadFormComponent(){
    const u = this;
    Component.apply(u, arguments);
    const _parentRender = u._renderTemplate
    function _calcDifficulty(index){
        return index - 5*Math.floor( (index - 1)/5 ) 
    }

    u._renderTemplate = function(sTemplate, fetchedData){
        const templateRenderOpts = {}
        ,aUploadOpts = []
        ,mode = u._session.getCurrentMode()
        ,len = fetchedData && +fetchedData.size || 1;             
        let difficulty = fetchedData && +fetchedData.difficulty || 1
        ,elParsedTemplate
        ,elFieldsets
        ,elPaginateBox;

        for(let i = 1; i <= len; i++){
            let uploadOption = {}
            difficulty = (mode == 'erudith') ? _calcDifficulty(i) : difficulty;
            uploadOption.index = ('00'+ i).slice(-2);
            uploadOption.difficulty = difficulty;
            aUploadOpts.push(uploadOption);
        }
        templateRenderOpts.uploadOpts = aUploadOpts;
        elParsedTemplate = _parentRender(sTemplate, templateRenderOpts);
        elFieldsets = elParsedTemplate.querySelectorAll('.upload-form__fieldset');
        elPaginateBox = elParsedTemplate.querySelector('.upload-form__pagination-box');

        u.paginator = new PaginateService({
            eItems: elFieldsets
            ,numPerPage: 1
        });
        u.paginator.generatePaginateLinks(
            elPaginateBox
            ,'upload-form__pagination-link'
            ,'#/upload/' + mode + '?question#='
        );
        return elParsedTemplate;
    }

    u._setEventListeners = function(DOMtree){
        const form = DOMtree.querySelector('.upload-form')
        ,submitButton = form.querySelectorAll('input[type=submit]')
        ,aLockButtons = Array.from(form.querySelectorAll('.upload-form__lock-button'))
        ,aUnlockButtons = Array.from(form.querySelectorAll('.upload-form__unlock-button'))
        ,fieldsets = DOMtree.querySelectorAll('.upload-form__fieldset')
        ,formService = new FormsService(form)
        ,questionSet = []

        ,paginator = u._session.uploadFormPaginator;

        aLockButtons.map(function(button, index){
            button.addEventListener('click', function(){
                questionSet[index] = formService.processUploadForm(index);
                u.lockFieldset(fieldsets[index])
                setTimeout(function(){
                    if(form.querySelectorAll('input').length == 1){
                        u.deactivate();
                        submitButton.classList.add('upload-form__submit--activated')
                        submitButton.disabled = false;

                    }else{
                        u._router.navigate(/*path=*/ '/upload/' + 
                        u._session.getCurrentMode()             + 
                        '?question#='                           +
                        (index + 2)
                        , /*absolute=*/false);
                    }
                },2000)
            })
        });
        aUnlockButtons.map(function(button, index){
            button.addEventListener('click', function(){
                u.unlockFieldset(fieldsets[index])
            });
        });
        form.addEventListener('submit', function(event){
            event.preventDefault();
            let timeStamp = new Date();
            if(form.querySelectorAll('input').length == 1){
                u._session.setUploadedQuestions(timeStamp, questionSet);
                submitButton.classList.add('upload-form__submit--activated')
                submitButton.disabled = false;
                u.deactivate();
                u._router.navigate('rules/general', false)
            }
        });
    return DOMtree;
    }
    u.createComponent();
    return u;
}
UploadFormComponent.prototype = Object.create(Component.prototype);
UploadFormComponent.prototype.constructor = UploadFormComponent;

Object.assign(UploadFormComponent.prototype, {
    lockFieldset : function(fieldset){
        const aLockedInputs = Array.from(fieldset.querySelectorAll('input')
            , function(input){
                let result
                if(input.value){
                    let p = document.createElement('p');
                    p.className = input.className + '--locked';
                    p.innerHTML = input.value;
                    p.dataset.type = input.type;
                    fieldset.replaceChild(p, input);
                    result = p;
                }
                return result;
            });

    }
    ,unlockFieldset : function(fieldset){
        const unlockedInputs = Array.from(fieldset.querySelectorAll('input')
        ,function(p){
            let input = document.createElement('input');
            input.type = p.dataset.type;
            input.className = p.className.split('--')[0];
            input.value = p.innerHTML;
        })
    }
});

