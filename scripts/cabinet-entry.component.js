function CabinetEntryComponent(){
    const c = this;
    Component.apply(c, arguments);
    c._setEventListeners = function(DOMElement){
        c._form = DOMElement.querySelector('.header__cabinet-entry-form');
        c._registerButton = DOMElement.querySelector('.register-button');
        c._cabinetEnterButton = DOMElement.querySelector('.enter-button');
        c._logoutButton = DOMElement.querySelector('.logout-button');

        c._form.addEventListener('submit', function(event){
            event.preventDefault();
            c._session.userService.login(c._form[0].value, c._form[1].value)
            .then(function(success){
                if(success){
                    c.setLoginedView();
                    c._session._personalCabinet.activate();
                }
            })
        });
        c._registerButton.addEventListener('click', function(){
            c._router.navigate(/*path=*/'/register_user', /*absolute=*/false)
        });
        c._logoutButton.addEventListener('click', function(){
            c._session.userService.logout();
            c.setLogoutedView();
            c._session._personalCabinet.deactivate();
            c._router.navigate(/*path=*/'/rules/general', /*absolute=*/false)
        });
        return DOMElement;
    }

    c.setLoginedView = function(){
        c._form[0].classList.add('header__cabinet-entry-form--logined-state')
        c._cabinetEnterButton.disabled = false;
        c._logoutButton.disabled = false;
        c._cabinetEnterButton.classList.add('enter-button--logined-state');
        c._logoutButton.classList.add('logout-button--logined-state');
    }

    c.setLogoutedView = function(){
        c._form[0].classList.remove('header__cabinet-entry-form--logined-state')
        c._cabinetEnterButton.disabled = true;
        c._logoutButton.disabled = true;
        c._cabinetEnterButton.classList.remove('enter-button--logined-state');
        c._logoutButton.classList.remove('logout-button--logined-state');
    }

    c.createComponent();
    return c;
}
CabinetEntryComponent.prototype = Object.create(Component.prototype);
CabinetEntryComponent.prototype.constructor = CabinetEntryComponent;