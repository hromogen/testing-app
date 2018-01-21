function UserService(fUserGetter, fUserSetter){
    const u = this;
    u._userGetter = fUserGetter;
    u._userSetter = fUserSetter;
    u._userReg = null;
    u._http = new HttpService();
    u._logined = false;
    u.testingLog = [];
    u.testingResults = {
        catch : function(oTestingResult){
            u.testingLog.push(oTestingResult);
        }
        ,get : function(num){
            const savedResult = u.testingLog[num];
           return Object.assign({}, savedResult);
        }
        ,getLast : function(){
            return this.get(u.testingLog.length - 1);
        }
        ,modifyLast : function(sPropName, value){
            const lastNum = u.testingLog.length - 1 
            ,lastInLog = u.testingLog[lastNum];
            lastInLog[sPropName] = value;
        }
        ,getAll : function(){
            return u.testingLog;
        }
    }

    u._http.get('./assets/mock-server/users-reg.json')
    .then(function(succes){
        u._userReg = JSON.parse(succes)
    });
    if(u._userGetter()){
        u._logined = true;
    }
}
UserService.prototype = {
    login : function(nickname, password){
        const u = this
        ,aRegisteredNicknames = u._userReg.map(function(entry){
            return entry.nickname
        })
        ,nicknameInd = aRegisteredNicknames.indexOf(nickname)
        let response;
        if(nicknameInd != -1 && u._userReg[nicknameInd].uri){
            response = u._http.get(u._userReg[nicknameInd].uri)
            .then(function(succes){
                const parsedData = JSON.parse(succes)
                if(parsedData.password = password){
                    u._userSetter(parsedData);
                    u._logined = true;
                }else{
                    u._logined = false;
                }
                return u._logined;
            })
        }
        return response; 
    }
    ,logout : function(){
        this._userSetter(null);
    }
    ,registerUser : function(userData){
        this._userSetter(Object.assign({}, userData));
        this._userReg.push({
            nickname: userData.nickname
            ,uri: ''
        })
        this._logined = true;
        return this._logined;
    }
    ,isLogined : function(){
        return this._logined;
    }
    ,updateTestingLog : function(){
        const user = this._userGetter();
        if(user){
            user.testings_log = this.testingLog;
            this._userSetter(user)
        }
    }
}
