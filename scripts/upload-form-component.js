function UploadFormComponent(){
    const u = this;
    Component.apply(u, arguments);

    u._modifyTemplate = function(template, fetchedData){
        const form = template.querySelector('.upload-form')
            ,templateFormfields = form.querySelectorAll('.upload-form__formfield')
            ,submitInput = form.querySelector('.upload-form__submit')
            ,templateFormfield = templateFormfields[0];

        if(templateFormfields.length > 1){
            for(let i = 1; i < templateFormfields.length; i++){
                form.removeChild(templateFormfields[i])
            }
        }
        if(u._session.getCurrentMode() != 'question' && fetchedData){
            for(let i = 1; i <= +fetchedData.size; i++){
                let formfieldCopy = templateFormfield.cloneNode(true)
                ,uploadQuestion = formfieldCopy.querySelector('.upload-form__question')
                ,uploadOptions = formfieldCopy.querySelectorAll('.upload-form__option')
                ,correctAnswer =  formfieldCopy.querySelector('.upload-form__correct-answer')
                ,aInserteFormfields = [];

                uploadQuestion.name += ('00'+ i).slice(-2);
                correctAnswer.name += ('00'+ i).slice(-2);
                Array.from(uploadOptions).map(function(option){
                    option.name += ('00'+ i).slice(-2);
                });
                form.insertBefore(formfieldCopy,templateFormfield);
            }
            form.removeChild(templateFormfield);
        }
        u._session.uploadFormPaginator.init({
            eItems: form.querySelectorAll('.upload-form__formfield')
            ,numPerPage: 1
        });
        u._session.uploadFormPaginator.paginate();
        return template;
    }

    u._setEventListeners = function(DOMtree){
        const form = DOMtree.querySelector('.upload-form')
        ,formService = new FormsService(form)
        ,questionSet = []
        ,paginator = s.uploadFormPaginator;

        form.addEventListener('submit', function(event){
            event.preventDefault();
            const currentPage = paginator.currentPage
            questionSet[currentPage - 1] = formService.processUploadForm(currentPage);
            if(questionSet.filter(Boolean).length == paginator.numOfPages){
                let timeStamp = new Date();
                u._session.setUploadedQuestions(timeStamp, questionSet);
            }else{
                u._router.navigate(/*path=*/ '/upload/' + 
                u._session.getCurrentMode()             + 
                '?question#='                           +
                currentPage
                , /*absolute=*/false);
            }
        });
    return DOMtree; 
    }
    u.createComponent();
    return u;
}
UploadFormComponent.prototype = Object.create(Component.prototype);
UploadFormComponent.prototype.constructor = UploadFormComponent;

