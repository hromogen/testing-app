function InformService(){
    const i = this;

    i._currentlyDisplayed = [];
    i._testingResult = {};

    i.initCorrectAnswerMessages = function(opts){
        i._correctAnswerBox   = opts && opts.correctAnswerBox || null;
        i._wrongAnswerBox     = opts && opts.wrongAnswerBox   || null;
        i._questionBox        = opts && opts.questionBox      || null;
        i._finalLogBox        = opts && opts.finalLogBox      || null;
    }

    i.informAboutAnswer = function(givenAnswer, referenceAnswer){
        if(givenAnswer == referenceAnswer){
            i._correctAnswerBox.classList.add('testing-section__message--displayed');
            i._currentlyDisplayed.push({
                box: i._correctAnswerBox, className: 'testing-section__message--displayed'
            });
            i._questionBox.classList.add('testing-form--correct');
            i._currentlyDisplayed.push({
                box: i._questionBox, className: 'testing-form--correct'
            });

        }else{
            i._wrongAnswerBox.classList.add('testing-section__message--displayed');
            i._currentlyDisplayed.push({
                box: i._wrongAnswerBox, className: 'testing-section__message--displayed'
            });
            i._questionBox.classList.add('testing-form--wrong');
            i._currentlyDisplayed.push({
                box: i._questionBox, className: 'testing-form--wrong'
            });
        }
    }

    i.hideMessages = function(){
        i._currentlyDisplayed.map(function(oBoxInfo){
            oBoxInfo.box.classList.remove(oBoxInfo.className)
        });
        i._currentlyDisplayed = []
    }

    i.initErrorHandler = function(router){
        i._router = router;
    }
    i.errorHandler = function(error, sGoOnLink){
        const container = document.querySelector('.error-section')
        ,goOnButton = container.querySelector('.error-section__go-on-button')
        ,showDetailButton = container.querySelector('.error-section____detail-button')
        ,detailList = container.querySelector('.error-section__error-detail')
        ,sSavedHTML = container.innerHTML
        ,message = Mustache.render(sSavedHTML, error);
        showDetailButton.onclick = function(){
            detailList.classList.toggle('error-section__error-detail--open')
        }
        goOnButton.onclick = function(){
            i._router.navigate(/*path=*/ sGoOnLink || '/rules/general', /*absolute=*/false);
            container.classList.remove('view--active');
        }
        container.classList.add('view--active');
    }
}
InformService.STANDARD_ERROR_NAMES = {
    templateDownloadProblem: 'Виникла проблема при завантаженні темплейту. Можливо, спробуйте ще раз з головної сторінки?'
    ,dataDownloadProblem: 'Виникла проблема при завантаженні даних. Можливо, сервер зараз не доступний. Спробуйте пізніше'
    ,uploadFormNotValid: 'Перевірте, будь ласка, чи Ви не пропустили якесь поле при створенні тестування'
}
