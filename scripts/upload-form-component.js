function UploadFormComponent(){
    const u = this;
    Component.apply(u, arguments);

    u._renderTemplate = function(sTemplate, fetchedData){
        const parsedTemlate = u._parser.parseFromString(sTemplate, 'text/html') 
        ,form = parsedTemlate.querySelector('.upload-form')
        ,templateFieldsets = form.querySelectorAll('.upload-form__fieldset')
        ,submitInput = form.querySelector('.upload-form__submit')
        ,templateFieldset = templateFieldsets[0];

        u._template = sTemplate;

        if(templateFieldsets.length > 1){
            for(let i = 1; i < templateFieldsets.length; i++){
                form.removeChild(templateFieldsets[i])
            }
        }
        if(u._session.getCurrentMode() != 'question' && fetchedData){
            for(let i = 1; i <= +fetchedData.size; i++){
                let fieldsetCopy = templateFieldset.cloneNode(true)
                ,uploadQuestion = fieldsetCopy.querySelector('.upload-form__question')
                ,uploadOptions = fieldsetCopy.querySelectorAll('.upload-form__option')
                ,correctAnswer =  fieldsetCopy.querySelector('.upload-form__correct-answer')
                ,aInserteFormfields = [];

                uploadQuestion.name += ('00'+ i).slice(-2);
                correctAnswer.name += ('00'+ i).slice(-2);
                Array.from(uploadOptions).map(function(option){
                    option.name += ('00'+ i).slice(-2);
                });
                form.insertBefore(fieldsetCopy,templateFieldset);
            }
            form.removeChild(templateFieldset);
        }
        u._session.uploadFormPaginator.init({
            eItems: form.querySelectorAll('.upload-form__fieldset')
            ,numPerPage: 1
        });
        u._session.uploadFormPaginator.paginate();
        return parsedTemlate;
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

