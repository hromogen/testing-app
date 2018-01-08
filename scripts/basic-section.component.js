function BasicSectionComponent(){
    const b = this;
    Component.apply(b, arguments);
    b.createComponent();
    return b;
}
BasicSectionComponent.prototype = Object.create(Component.prototype);
BasicSectionComponent.prototype.constructor = BasicSectionComponent;