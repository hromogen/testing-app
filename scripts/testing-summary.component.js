function TestingSummaryComponent(){
    const t = this;
    Component.apply(t, arguments);
    t.createComponent();
    return t;
}
TestingSummaryComponent.prototype = Object.create(Component.prototype);
TestingSummaryComponent.prototype.constructor = TestingSummaryComponent;