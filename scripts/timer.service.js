function TimerService(elContainter) {
    const t = this;
    t._TIMERID = 0;
    t._elContainter = elContainter;

    t._timerEmitter = function(){
        let dateFromInput = new Date(t._timeout)
        ,opts = {'minute':'2-digit', 'second': '2-digit'};
        t._elContainter.innerHTML = dateFromInput.toLocaleString("ua", opts);
    }

    t.start = function(msTimeout
        , iNumOfCalls
        , fCallBack
        , fFinalCallBack) {
            t._initTimeout = msTimeout;
            t._timeout = msTimeout;
            t._numOfCalls = iNumOfCalls
            t._msTimeLeft = msTimeout*iNumOfCalls;
            t._TIMERID = setInterval(function() {
                t._timeout -= 1000;
                t._msTimeLeft -= 1000;
                t._timerEmitter();
                if(t._msTimeLeft == 0){
                    clearInterval(t._TIMERID);
                    fFinalCallBack();
                }else if(t._timeout == 0){
                    t._timeout = t._initTimeout;
                    fCallBack()
                }
        },1000);
    }

    t.clearTimeout = function(){
        t._timeout = t._initTimeout;
    }
    t.stop = function() {
        clearTimeout(t._TIMERID);
	}	
}