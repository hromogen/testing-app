function PersonalCabinetComponent(){
    const p = this;
    Component.apply(p, arguments);
    p.createComponent();
    return p;
}
PersonalCabinetComponent.prototype = Object.create(Component.prototype);
PersonalCabinetComponent.prototype.constructor = PersonalCabinetComponent;