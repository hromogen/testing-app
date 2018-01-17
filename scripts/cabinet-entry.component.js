function CabinetEntryComponent(){
    const c = this;
    Component.apply(c, arguments);
    c.setLoginView = function(container){
        c.hideChildren('.hide-if-logged-in', container);
        c._cabinetEnterButton.disabled = false;
        c._logoutButton.disabled = false;
    }

    c.setLogoutView = function(container){
        c.hideChildren('.hide-if-logged-out', container);
        c._cabinetEnterButton.disabled = true;
        c._logoutButton.disabled = true;
    }

    c._setEventListeners = function(DOMElement){
        c._form = DOMElement.querySelector('.header__cabinet-entry-form');
        c._registerButton = DOMElement.querySelector('.register-button');
        c._cabinetEnterButton = DOMElement.querySelector('.enter-button');
        c._logoutButton = DOMElement.querySelector('.logout-button');
        if(c._session.getCurrentUser()){
            c.setLoginView(DOMElement);
        }else{
            c.setLogoutView(DOMElement);
        }
        c._form.addEventListener('submit', function(event){
            event.preventDefault();
            c._session.userService.login(c._form[0].value, c._form[1].value)
            .then(function(success){
                if(success){
                    c.setLoginView();
                    c._session._personalCabinet.activate();
                }
            })
        });
        c._cabinetEnterButton.addEventListener('click', function(){
            const userNickname = c._session.getCurrentUser().nickname;
            c._router.navigate(/*path=*/'/personal_cabinet/' + userNickname
            , /*absolute=*/false);
        });
        c._registerButton.addEventListener('click', function(){
            c._router.navigate(/*path=*/'/register_user', /*absolute=*/false);
        });
        c._logoutButton.addEventListener('click', function(){
            c._session.userService.logout();
            c.setLogoutView();
            c._session._personalCabinet.deactivate();
            c._router.navigate(/*path=*/'/rules/general', /*absolute=*/false);
        });
        return DOMElement;
    }



    c.createComponent();
    return c;
}
CabinetEntryComponent.prototype = Object.create(Component.prototype);
CabinetEntryComponent.prototype.constructor = CabinetEntryComponent;