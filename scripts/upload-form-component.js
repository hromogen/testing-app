function UploadFormComponent(){
    const u = this;
    Component.apply(u, arguments);
    u._getAttachedData = function(){
        return Promise.resolve([u._attachedData]);
    }
    u._modifyTemplate = function(template, fetchedData){
        const form = template.querySelector('.upload-form')
            ,templateFormfield = form.querySelector('.upload-form__formfield')
            ,submitInput = form.querySelector('.upload-form__submit');

            u._session.setUploadedInfo(fetchedData[0]);
        if(u._session.getUploadParam() != 'question'){
            for(let i = 1; i <= +fetchedData[0].size; i++){
                let formfieldCopy = templateFormfield.cloneNode(true)
                ,uploadQuestion = formfieldCopy.querySelector('.upload-form__question')
                ,uploadOptions = formfieldCopy.querySelectorAll('.upload-form__option')
                ,correctAnswer =  formfieldCopy.querySelector('.upload-form__correct-answer');

                uploadQuestion.name += ('00'+ i).slice(-2);
                correctAnswer.name += ('00'+ i).slice(-2);
                Array.from(uploadOptions).map(function(option){
                    option.name += ('00'+ i).slice(-2);
                });
                form.insertBefore(formfieldCopy,templateFormfield);
            }
            form.removeChild(templateFormfield);
        }
        return template;
    }

    u._setEventListeners = function(DOMtree){
        const form = DOMtree.querySelector('.upload-form')
        ,formService = new FormsService(form)
        ,paginateOpts = {}
        ,questionSet = []
        ,paginator = s.uploadFormPaginator

        paginateOpts.eItems = form.querySelectorAll('.upload-form__formfield');
        paginateOpts.numPerPage = 1;
        paginator.init(paginateOpts);

        form.addEventListener('submit', function(event){
            event.preventDefault();
            questionSet[paginator.currentPage - 1] = formService.processUploadForm(paginator.currentPage);
            if(questionSet.filter(Boolean).length == paginateOpts.eItems.length){
                let timeStamp = new Date();
                session.setUploadedQuestions(timeStamp, questionSet);
            }else{
                paginator.goToNext()
            }
        })
        return DOMtree; 
    }
    u.createComponent().then(function(){
        u._session.addComponent(u, '_uploadForm');
        u._router.navigate(/*path=*/ '/upload/' + u._session.getUploadParam() + '/1'
        , /*absolute=*/false);
    });
    return u;
}
UploadFormComponent.prototype = Object.create(Component.prototype);
UploadFormComponent.prototype.constructor = UploadFormComponent;

