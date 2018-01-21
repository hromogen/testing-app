"use strict";
function TestingService(options
    , questionary
    , paginator
    , formsService
    , timerService
    , informService
    , router
    , fResultCatcher){
        const ts = this
        ts._formsService  = formsService;
        ts._timerService  = timerService;
        ts._informService = informService;
        ts._paginator     = paginator;
        ts._router        = router;
        ts._resultCatcher = fResultCatcher
        ts._questionary   = questionary
        ts._options       = options;
        ts._questionsSet  = ts._formsService.form.querySelectorAll('.testing-form__formfield');
        ts._finalLog      = {
                        answers                   : []
                        ,incorrect_answers_detail : []
                        ,answered_correctly_nums  : ''
                        ,score                    : 0
                        ,type                     : ts._options.type
                    };
        ts._log = [];
        ts._aCorrectAnswers  = ts._questionary.map(function(field){
            return field.correct;
        });

        function _informAboutAnswer(valA, valB){
            if (valA === valB){
                ts._informService.correctMessage.display()
            }else if(valA != valB){
                ts._informService.wrongMessage.display()
            }
        }

        ts.startTesting = function(){
            ts._paginator.goToPage(1);
            ts._timerService.start(ts._options.timeout
                ,ts._options.numOfCoundowns
                ,function(){ 
                    ts._callBacksSet(ts._paginator.goToNext)
                }
                ,function(){ 
                    ts._callBacksSet(ts.finishTesting)
                })
        }

        ts.proceedTesting = function(event){
            if(event){
                event.preventDefault();
            }
            if(ts._paginator.currentPage - 1 < ts._questionary.length){
                ts._callBacksSet(ts._paginator.goToNext);  
            }
        }

        ts._callBacksSet = function(fCallBack){
            let i = ts._paginator.currentPage - 1;
            ts._log[i] = ts._formsService.processTestingForm(i);
            if(ts._options.timingCountdown == 'each'){
                ts._timerService.clearTimeout();
            }
            if(ts._options.informAboutAnswer == 'true'){
                _informAboutAnswer(ts._log[i], ts._aCorrectAnswers[i]);
                setTimeout(function(){
                    ts._informService.hideAll();
                    fCallBack();
                }, 1000);
            }else{
                fCallBack();
            }
        }

        ts.finishTesting = function(){
            const fLog = ts._finalLog
            ,aAnsweredCorrectlyNums = []
            ,timeStampOpts = {
                year: 'numeric'
                ,month: 'long'
                ,day: 'numeric'
                ,weekday: 'long'
                ,hour: 'numeric'
                ,minute: 'numeric'
            };
            let finalQuestion = ts._questionsSet[ts._currQuestionNum];
            ts._paginator.hideCurrent();
            ts._timerService.stop();
            fLog.answers = ts._log;
            ts._aCorrectAnswers.map(function(correctAnswerNum, index){
                if (correctAnswerNum == ts._log[index]){
                    aAnsweredCorrectlyNums.push(index + 1)
                }else{
                    fLog.incorrect_answers_detail.push({num: index + 1})
                }
            });
            fLog.answered_correctly_nums = aAnsweredCorrectlyNums.join(', ')
            fLog.incorrect_answers_detail.map(function(value){
                let oTargQuestion = ts._questionary[value.num - 1]
                ,correctAnswer = oTargQuestion.options[oTargQuestion.correct].optText;
                
                value.question = oTargQuestion.question;
                value.correct_answer = correctAnswer
            });
            ts._finalLog.score = (100*aAnsweredCorrectlyNums.length/ts._questionary.length)
            .toPrecision(4);
            ts._finalLog.timeStamp = new Date()
            ts._finalLog.sTestingDate = ts._finalLog.timeStamp.toLocaleString('ua',timeStampOpts);
            ts._resultCatcher(ts._finalLog);
            ts._router.navigate(/*path=*/'/testing_result', /*absolute=*/false)
        }
}
