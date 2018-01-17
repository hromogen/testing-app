function TestingOptionsFormComponent(){
    const t = this;
    Component.apply(t, arguments);
    const _parentRender = t._renderTemplate
    
    t._setEventListeners = function(DOMtree){
        const testingOptionsForm =  DOMtree.querySelector('.testing-options-form')
        ,testingOptionsFormSevice = new FormsService(testingOptionsForm);

        testingOptionsForm.addEventListener('submit'
        ,function(event){
            event.preventDefault();
            
            const oTestingParams = testingOptionsFormSevice.processTestingOptionsForm()
            ,basicTimeout        = +oTestingParams.timingDifficulty*1000
            ,currQuestionary     = t._session.getCurrentQuestionary()
            ,qLen                = currQuestionary.length
            ,testingSection      = t._session._testingArticle.modifyInline(currQuestionary)
            ,elTestingForm       = testingSection.querySelector('.testing-form')
            ,elTimer             = testingSection.querySelector('.testing-section__timer')
            ,eQuestionSets       = testingSection.querySelectorAll('.testing-form__fieldset')
            ,paginateOpts        = {
                eItems: eQuestionSets
                ,displayingClassName: 'testing-form__fieldset--current'
                ,numPerPage: 1 
            }
            ,testingFormService  = new FormsService(elTestingForm)
            ,timerService        = new TimerService(elTimer)
            ,testingPaginator    = new PaginateService(paginateOpts);

            if(oTestingParams.timingCountdown == 'all'){
                oTestingParams.timeout = basicTimeout*qLen;
                oTestingParams.numOfCoundowns = 1;
            }else{
                oTestingParams.timeout = basicTimeout;
                oTestingParams.numOfCoundowns = qLen;
            }
            oTestingParams.type = t._session.getCurrentMode()
            testingPaginator.paginate();

            t._session.informService.initCorrectAnswerMessages({
                questionBox: elTestingForm
                ,correctAnswerBox: testingSection.querySelector('.testing-section__message--correct')
                ,wrongAnswerBox: testingSection.querySelector('.testing-section__message--wrong')
                ,finalLogBox: testingSection.querySelector('.testing-section__summary')
            });

            t._testingService = new TestingService(oTestingParams
                ,currQuestionary
                ,testingPaginator
                ,testingFormService
                ,timerService
                ,t._session.informService
                ,t._router
                ,t._session.userService.testingResults.catch);
                
            elTestingForm.addEventListener('submit', t._testingService.proceedTesting);
            t._testingService.startTesting();
            t._session._testingArticle.activate();
            t._router.navigate(/*path=*/ '/testingON', /*absolute=*/false)
        });
    return DOMtree;
    }
    t.createComponent();
    return t;
}
TestingOptionsFormComponent.prototype = Object.create(Component.prototype);
TestingOptionsFormComponent.prototype.constructor = TestingOptionsFormComponent;