"use strict";
function TestingService(options
    , questionary
    , formsService
    , timerService
    , informService
    , router
    , fResultCatcher
){
    const ts = this
    ts._formsService  = formsService;
    ts._timerService  = timerService;
    ts._informService = informService;
    ts._router        = router;
    ts._resultCatcher = fResultCatcher
    ts._questionary   = questionary
    ts._options       = options;
    ts._questionsSet  = ts._formsService.form.querySelectorAll('.testing-form__formfield');
    ts._finalLog      = {
                    answers                      : []
                    ,incorrect_answers_detail    : []
                    ,anwered_correctly_nums      : []
                    ,score                       : 0
                    ,date                        : null
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
            ts._informService.informAboutAnswer(ts._log[i]
                ,ts._aCorrectAnswers[i]);
            setTimeout(function(){
                ts._informService.hideMessages();
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
        const fLog = ts._finalLog;
        let finalQuestion = ts._questionsSet[ts._currQuestionNum];
        finalQuestion.classList.remove('testing-form__formfield--current');
        ts._timerService.stop();
        fLog.answers = ts._log;
        ts._aCorrectAnswers.map(function(correctAnswerNum, index){
            if (correctAnswerNum == ts._log[index]){
                fLog.answered_correctly_nums.push(index)
            }else{
                fLog.incorrect_answers_detail.push({num: index})
            }
        });
        fLog.incorrect_answers_detail.map(function(value){
            let oTargQuestion = ts._questionary[value.num]
            ,correctAnswer = oTargQuestion.options[oTargQuestion.correct]
            value.question = oTargQuestion.question;
            value.correct_answer = correctAnswer
        });
        ts._finalLog.score = (100*fLog.anwered_correctly_nums.length/ts._questionary.length)
        .toPrecision(4);
        ts._resultCatcher(ts._finalLog);
        ts._router.navigate(/*path=*/'/testing_result', /*absolute=*/false)
    }
}
