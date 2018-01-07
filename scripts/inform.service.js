function InformService(opts){
    const i = this;
    i._correctAnswerBox   = opts && opts.correctAnswerBox || null;
    i._wrongAnswerBox     = opts && opts.wrongAnswerBox   || null;
    i._questionBox        = opts && opts.questionBox      || null;
    i._finalLogBox        = opts && opts.finalLogBox      || null;
    i._currentlyDisplayed = [];


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

    i.displayTestingResults = function(finalLog){
        const boxForAnsweredCorrectlyNums = i._finalLogBox
        .querySelector('.summary__answered-correctly-nums')
        ,boxForScore = i._finalLogBox
        .querySelector('.summary__score')
        ,boxForDetails = i._finalLogBox
        .querySelector('.summary__anwers-details');
    }
}
