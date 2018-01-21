function RegistrationFormComponent(){
    const r = this;
    Component.apply(r, arguments);
    r._setEventListeners = function(DOMElement){
        const form = DOMElement.querySelector('.registration__form')
        ,elWrongPassMessage = DOMElement.querySelector('.registration__password-message');

        r._formService = new FormsService(form)
        r._messageService = new InformService({
               invalidPassword: {
                   container: elWrongPassMessage
                   ,displayingClass: 'registration__password-message--displayed'
               }
            });
        form.addEventListener('submit', function(event){
            event.preventDefault();
            const registerData = r._formService.processRegistrationForm();
            if(registerData.password != registerData.passwordRep){
                r._messageService.invalidPassword.display();
                setTimeout(function(){
                    r._messageService.invalidPassword.hide();
                },2000)
            }else{
                r._session.userService.registerUser(registerData);
                r._session._cabinetEntry.setLoginView();
                r._session._personalCabinet.activate()
                r._router.navigate(/*path=*/'/personal_cabinet/' + registerData.nickname
            , /*absolute=*/false)
            }  
        });
        return DOMElement;
    }
    r.createComponent();
    return r;
}
RegistrationFormComponent.prototype = Object.create(Component.prototype);
RegistrationFormComponent.constructor = RegistrationFormComponent;