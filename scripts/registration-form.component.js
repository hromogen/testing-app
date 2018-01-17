function RegistrationFormComponent(){
    const r = this;
    Component.apply(r, arguments);
    r._setEventListeners = function(DOMElement){
        const form = DOMElement.querySelector('.registration__form');
        form.addEventListener('submit', function(event){
            event.preventDefault();
            const formService = new FormsService(form)
            ,registerData = formService.processRegistrationForm();
            r._session.userService.registerUser(registerData);
            r._session._cabinetEntry.setLoginView();
            r._session._personalCabinet.activate()
            r._router.navigate(/*path=*/'/personal_cabinet/' + registerData.nickname
            , /*absolute=*/false)
        });
        return DOMElement;
    }
    r.createComponent();
    return r;
}
RegistrationFormComponent.prototype = Object.create(Component.prototype);
RegistrationFormComponent.constructor = RegistrationFormComponent;