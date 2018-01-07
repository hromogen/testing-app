function FormsService(form, clearInputs){
    const f = this;
    f.form = form || null;
    f._clearInputs = (arguments.length > 1) ? clearInputs : true;

    f._camelizeString = function(string){
        return string.split('-').map(function(word, index){
                return (index == 0) ? word : ( word[0].toUpperCase() + word.slice(1) )
            }).join("");
    }
    f._evalCheckedInputs = function(){
        const aCheckedInputs = Array.from(f.form.querySelectorAll('input:checked'))
        ,nameSet = aCheckedInputs.reduce(function(interimResult, checkedInput){
            let zeroVal = (checkedInput.type == 'checkbox') ? [] : "";
            interimResult[f._camelizeString(checkedInput.name)] = zeroVal;
            return interimResult;
        },{})
        ,testingParams = aCheckedInputs.reduce(function(interimResult, checkedInput){
            if(checkedInput.type == 'checkbox') {
                interimResult[f._camelizeString(checkedInput.name)].push(checkedInput.value)
            }else{
                interimResult[f._camelizeString(checkedInput.name)] = checkedInput.value;
            }
            checkedInput.checked = f._clearInputs;
            return interimResult;
        }, nameSet);
        return testingParams;
    }

    f._evalReadableInputs = function(opts){
        const iterableInputs = f.form.querySelectorAll('[name='+opts.inputsName+']')
        let result;
        if(opts.toSimpleArray){
            result = Array.from(iterableInputs, function(input, index){
                const sResult = input.value || opts.defaults && opts.defaults[index];
                input.value = (f._clearInputs) ? input.value : '';
                return sResult
            })
        }else if(opts.toNamedArray){
            result = Array.from(iterableInputs, function(input){
                const oResult = {name: input.name, value: input.value};
                input.value = (f._clearInputs) ? input.value : '';
                return oResult;
            })
        }
        return result;
    }
    f._evalSelects = function(){
        return Array.from(f.form.querySelectorAll('select'))
        .reduce(function(interim, current){
            interim[f._camelizeString(current.name)] = current.value;
            return interim;
        }
    ,{})
    }
    f.processFilterForm = function(){
        const filterParams = {}
        ,difficultyOpts = {toSimpleArray: true, defaults:[0,5], inputsName:'difficulty' };
        filterParams.difficulty = f._evalReadableInputs(difficultyOpts)
        Object.assign(filterParams, f._evalCheckedInputs())
        return filterParams;
    }
    f.processSorterForm = function(event){
        const select = f.form.querySelector('.sorter-form__select')
        ,sortingParam = select.value;
        select[0].selected = true;
        return sortingParam
    }
    f.processTestingOptionsForm = function(){
        const testingParams = f._evalCheckedInputs();
        let basicTimeout = +testingParams.timingDifficulty*1000;
        if(testingParams.timingCountdown == 'all'){
            testingParams.timeout = basicTimeout*testQuizUris.length;
            testingParams.numOfCoundowns = 1;
        }else{
            testingParams.timeout = basicTimeout;
            testingParams.numOfCoundowns = testQuizUris.length;
        } 
        return testingParams;
    }
    f.processTestingForm = function(){
        return +Object.values(f._evalCheckedInputs())[0];
    }
    f.processUploadSetupForm = function(){
        const oCheckedInputs = f._evalCheckedInputs()
        ,oSelectVals = f._evalSelects()
        ,oTestingName = f._evalReadableInputs({
            inputsName: 'upload-testing-name'
            ,toNamedArray: true
        })[0];
        return Object.assign(oTestingName, oCheckedInputs, oSelectVals)

    }
    f.processUploadForm = function(fieldNum){
        const currFormField = f.form.querySelector('[data-page=' + fieldNum + ']')
        result = {};

        return  {
            question:""
            , options:[]
            , correct: 0
        }
    }
}

