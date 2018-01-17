function FeedbackFormComponent(){
    const f = this;
    Component.apply(f, arguments);
    f.createComponent();
    return f;
}
FeedbackFormComponent.prototype = Object.create(Component.prototype);
FeedbackFormComponent.prototype.constructor = FeedbackFormComponent;