function RulesSectionComponent(){
    const r = this;
    Component.apply(r, arguments);
    r.createComponent();
    return r;
}
RulesSectionComponent.prototype = Object.create(Component.prototype);
RulesSectionComponent.prototype.constructor = RulesSectionComponent;