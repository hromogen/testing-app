function TestingOptionsFormComponent(){
    const t = this;
    Component.apply(t, arguments);
    t._setEventListeners = function(DOMtree){
        const testingOptionsForm =  DOMtree.querySelector('.testing-options-form')
        ,testingOptionsFormSevice = new FormsService(testingOptionsForm);

        testingOptionsForm.addEventListener('submit'
        ,function(event){
            event.preventDefault();
            const testingParams = testingOptionsFormSevice.processTestingOptionsForm()
            ,testingSection = t._session.getTestingArticle().getComponent()
            ,elTestingForm = testingSection.querySelector('.testing-form')
            ,elTimer = testingSection.querySelector('.testing-section__timer')
            ,testingFormService = new FormsService(elTestingForm)
            ,timerService = new TimerService(elTimer)
            ,informService = new InformService({
                questionBox: elTestingForm
                ,correctAnswerBox: testingSection.querySelector('.testing-section__message--correct')
                ,wrongAnswerBox: testingSection.querySelector('.testing-section__message--wrong')
                ,finalLogBox: testingSection.querySelector('.testing-section__summary')
            });

            t._testingService = new TestingService(testingParams
                , t._session
                , testingFormService
                , timerService
                , informService);
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