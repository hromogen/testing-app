function TestingOptionsFormComponent(){
    const t = this;
    Component.apply(t, arguments);
    t._setEventListeners = function(DOMtree){
        const testingOptionsForm =  DOMtree.querySelector('.testing-options-form')
        ,testingOptionsFormSevice = new FormsService(testingOptionsForm);

        testingOptionsForm.addEventListener('submit'
        ,function(event){
            event.preventDefault();
            const oTestingParams = testingOptionsFormSevice.processTestingOptionsForm()
            ,testingSection      = t._session.getTestingArticle().getComponent()
            ,elTestingForm       = testingSection.querySelector('.testing-form')
            ,elTimer             = testingSection.querySelector('.testing-section__timer')
            ,basicTimeout        = +testingParams.timingDifficulty*1000
            ,currQuestionary     = t._session.getCurrentQuestionary()
            ,qLen                = currQuestionary.length
            ,testingFormService  = new FormsService(elTestingForm)
            ,timerService        = new TimerService(elTimer);

            
            
            
            if(testingParams.timingCountdown == 'all'){
                oTestingParams.timeout = basicTimeout*qLen;
                oTestingParams.numOfCoundowns = 1;
            }else{
                oTestingParams.timeout = basicTimeout;
                oTestingParams.numOfCoundowns = qLen;
            } 

            t._session.informService.initCorrectAnswerMessages({
                questionBox: elTestingForm
                ,correctAnswerBox: testingSection.querySelector('.testing-section__message--correct')
                ,wrongAnswerBox: testingSection.querySelector('.testing-section__message--wrong')
                ,finalLogBox: testingSection.querySelector('.testing-section__summary')
            });

            t._testingService = new TestingService(oTestingParams
                ,currQuestionary
                ,testingFormService
                ,timerService
                ,informService
                ,t._router
                ,t._session.userService.testingResults.catch);
                
            elTestingForm.addEventListener('submit', t._testingService.proceedTesting);
            t._testingService.startTesting()
            t._router.navigate(/*path=*/ '/testingON', /*absolute=*/false)
        });
    return DOMtree;
    }
    t.createComponent();
    return t;
}
TestingOptionsFormComponent.prototype = Object.create(Component.prototype);
TestingOptionsFormComponent.prototype.constructor = TestingOptionsFormComponent;