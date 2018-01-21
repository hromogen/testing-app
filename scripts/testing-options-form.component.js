function TestingOptionsFormComponent(){
    const t = this;
    Component.apply(t, arguments);
    const _parentRender = t._renderTemplate
    
    t._setEventListeners = function(DOMtree){
        const testingOptionsForm =  DOMtree.querySelector('.testing-options__form')
        ,paginateInput = testingOptionsForm.querySelector('#paginate-questions--yes')
        ,noPaginateInput = testingOptionsForm.querySelector('#paginate-questions--no')
        ,informAboutAnswerInput = testingOptionsForm.querySelector('#inform-about-answer--yes')
        ,notInformAboutAnswerInput = testingOptionsForm.querySelector('#inform-about-answer--no')
        ,eachQuestionTimingInput = testingOptionsForm.querySelector('#question-timing--each')
        ,allQuestionsTimingInput = testingOptionsForm.querySelector('#question-timing--all')
        ,testingOptionsFormSevice = new FormsService(testingOptionsForm);

        testingOptionsForm.addEventListener('submit'
        ,function(event){
            event.preventDefault();
            
            const oTestingParams = testingOptionsFormSevice.processTestingOptionsForm()
            ,basicTimeout        = +oTestingParams.timingDifficulty*1000
            ,currQuestionary     = t._session.getCurrentQuestionary()
            ,qLen                = currQuestionary.length
            ,oTestingComponent   = t._session._testingArticle
            ,testingSection      = oTestingComponent.modifyInline(currQuestionary)
            ,elTestingForm       = testingSection.querySelector('.testing-form')
            ,elTimer             = testingSection.querySelector('.testing-section__timer')
            ,eQuestionSets       = testingSection.querySelectorAll('.testing-form__fieldset')
            ,endTestingButton    = testingSection.querySelector('.testing-form__end-testing')
            ,paginateOpts        = {
                eItems: eQuestionSets
                ,displayingClassName: 'testing-form__fieldset--current'
                ,numPerPage: 1 
            }
            ,testingFormService  = new FormsService(elTestingForm, false)
            ,timerService        = new TimerService(elTimer)
            ,testingPaginator    = new PaginateService(paginateOpts);

            if(oTestingParams.timingCountdown == 'all'){
                oTestingParams.timeout = basicTimeout*qLen;
                oTestingParams.numOfCoundowns = 1;
            }else{
                oTestingParams.timeout = basicTimeout;
                oTestingParams.numOfCoundowns = qLen;
            }
            if(oTestingParams.paginateQuestions == 'true'){
                testingPaginator.generatePaginateLinks(
                    testingSection
                    ,'testing-section__paginate-box')
            }
            oTestingParams.type = t._session.getCurrentMode()
            testingPaginator.paginate();

            t._testingService = new TestingService(oTestingParams
                ,currQuestionary
                ,testingPaginator
                ,testingFormService
                ,timerService
                ,t._session._testingArticle.informService
                ,t._router
                ,t._session.userService.testingResults.catch);
                
            elTestingForm.addEventListener('submit', t._testingService.proceedTesting);
            endTestingButton.addEventListener('click', t._testingService.finishTesting);
            t._testingService.startTesting();
            t._session._testingArticle.activate();
            t._router.navigate(/*path=*/ '/testingON', /*absolute=*/false)
        });
        paginateInput.addEventListener('click', function(){
            t.hideChildren('.hide-if-paginate', t._container, false);
            eachQuestionTimingInput.checked = false;
            allQuestionsTimingInput.checked = true;

        });
        noPaginateInput.addEventListener('click',function(){
            t.displayChildren('.hide-if-paginate');
            eachQuestionTimingInput.checked = true;
            allQuestionsTimingInput.checked = false;
        });
        informAboutAnswerInput.addEventListener('click',function(){
            t.hideChildren('.hide-if-inform', t._container, false);
        });
        notInformAboutAnswerInput.addEventListener('click',function(){
            if(!eachQuestionTimingInput.checked){
                t.displayChildren('.hide-if-inform');
            }
        });
        eachQuestionTimingInput.addEventListener('click',function(){
            t.hideChildren('.hide-if-each-timing', t._container, false);
        });
        allQuestionsTimingInput.addEventListener('click',function(){
            t.displayChildren('.hide-if-each-timing');
        });
        t.hideChildren('.hide-if-each-timing', testingOptionsForm, false);
    return DOMtree;
    }
    t.createComponent();
    return t;
}
TestingOptionsFormComponent.prototype = Object.create(Component.prototype);
TestingOptionsFormComponent.prototype.constructor = TestingOptionsFormComponent;