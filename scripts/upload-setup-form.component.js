function UploadSetupFormComponent(){
    const u = this;
    Component.apply(u, arguments);
    u._setEventListeners = function(DOMtree){
        const form = DOMtree.querySelector('.upload-setup-form')
        formService = new FormsService(form);
        form.addEventListener('submit', function(event){
            event.preventDefault();
            const updateFormOptions = formService.processUploadSetupForm()
            ,uploadFormOpts = u._session.getRegister().uploadForm;

            uploadFormOpts.attachedData = updateFormOptions;
            uploadFormOpts.clear = true;
            new UploadFormComponent(uploadFormOpts);
        })
        return DOMtree; 
    }
    u.createComponent();
}
UploadSetupFormComponent.prototype = Object.create(Component.prototype);
UploadSetupFormComponent.prototype.constructor = UploadSetupFormComponent;