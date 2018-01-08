function UploadSetupFormComponent(){
    const u = this;
    Component.apply(u, arguments);
    u._setEventListeners = function(DOMtree){
        const form = DOMtree.querySelector('.upload-setup-form')
        formService = new FormsService(form);
        form.addEventListener('submit', function(event){
            event.preventDefault();
            const uploadFormOptions = formService.processUploadSetupForm()
            ,sUploadMode = u._session.getCurrentMode()
            u._session._uploadForm.modifyAfterParsing(uploadFormOptions);
            u._session._uploadForm.activate();
            u._router.navigate(/*path=*/'/upload/'+ sUploadMode + '?question#=1', /*absolute=*/false)
        })
        return DOMtree; 
    }
    u.createComponent();
    return u;
}
UploadSetupFormComponent.prototype = Object.create(Component.prototype);
UploadSetupFormComponent.prototype.constructor = UploadSetupFormComponent;