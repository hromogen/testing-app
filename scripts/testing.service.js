"use strict";
function TestingService(options, session, formsService, timerService, informService){
    const ts = this
    ts._formsService  = formsService;
    ts._timerService  = timerService;
    ts._informService = informService;
    ts._questionary   = session.getCurrentQuestionary();
    ts._options       = options;
    ts._questionsSet  = ts._formsService.form.querySelectorAll('.testing-form__formfield');
    ts._finalLog      = {
                    answers                  : []
                    ,anweredCorrectlyNums    : []
                    ,anweredIncorrectlyNums  : []
                    ,anweredIncorrectly      : []
                    ,correctAnswersUDontKnow : []
                    ,score                   : ''
                };
    ts._log = [];
    ts._aCorrectAnswers  = ts._questionary.map(function(field){
        return field.correct;
    });
    ts._currQuestionNum  = 0;

    ts.startTesting = function(){
        ts._formsService.form.querySelector('.testing-form__formfield')
        .classList.add('testing-form__formfield--current');
        ts._timerService.start(ts._options.timeout
            ,ts._options.numOfCoundowns
            ,function(){ 
                ts._callBacksSet(ts._askNextQuestion)
            }
            ,function(){ 
                ts._callBacksSet(ts._finishTesting)
            })
    }

    ts.proceedTesting = function(event){
        event.preventDefault();
        if(ts._currQuestionNum < ts._questionary.length - 1){
            ts._callBacksSet(ts._askNextQuestion);  
        }else{
            ts._callBacksSet(ts._finishTesting);
        }
    }
    
    ts._callBacksSet = function(fFinalCallBack){
        let i = ts._currQuestionNum;
        ts._log[i] = ts._formsService.processTestingForm();
        if(ts._options.timingCountdown == 'each'){
            ts._timerService.clearTimeout();
        }
        if(ts._options.informAboutAnswer == 'true'){
            informService.informAboutAnswer(ts._log[i]
                ,ts._aCorrectAnswers[i]);
            setTimeout(function(){
                informService.hideMessages();
                fFinalCallBack();
            }, 1000);
        }else{
            fFinalCallBack();
        }
    }

    ts._askNextQuestion = function(){
       let i = ts._currQuestionNum;
       ts._questionsSet[i].classList.remove('testing-form__formfield--current');
       ts._questionsSet[i+1].classList.add('testing-form__formfield--current');
       ts._currQuestionNum++;
    }
     
    ts._finishTesting = function(){
        let finalQuestion = ts._questionsSet[ts._currQuestionNum];
        finalQuestion.classList.remove('testing-form__formfield--current');
        ts._timerService.stop();
        ts._finalLog.answers = ts._log;
        ts._aCorrectAnswers.map(function(correctAnsweNum, index){
            if (correctAnsweNum == ts._log[index]){
                ts._finalLog.anweredCorrectlyNums.push(index)
            }else{
                ts._finalLog.anweredIncorrectlyNums.push(index)
            }
        });
        ts._finalLog.anweredIncorrectlyNums.map(function(value){
            let oTargQuestion = ts._questionary[value]
            ,correctAnswer = oTargQuestion.options[oTargQuestion.correct]
            ts._finalLog.anweredIncorrectly.push(oTargQuestion.question);
            ts._finalLog.correctAnswersUDontKnow.push(correctAnswer)
        });
        ts._finalLog.score = (100*ts._finalLog.anweredCorrectlyNums.length/ts._questionary.length)
        .toPrecision(4);
        ts._messageService.displayTestingResults(ts._finalLog)
    }
}
