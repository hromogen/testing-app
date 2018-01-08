function NavMenuComponent(){
    const n = this;
    Component.apply(n, arguments);
    n._clearContainer  = false;
    

    function toggleSubmenu(){
        const menuItem = this.closest('.nav-menu__item')
        ,submenu = menuItem.querySelector('.nav-menu__submenu')
        submenu.classList.toggle('nav-menu__submenu--open');
      }
    
    function closeSubmenu(event) {
        const menuItem = this.closest('.nav-menu__item')
        ,submenu = menuItem.querySelector('.nav-menu__submenu')
        ,target = event.relatedTarget
        ,isThisSubmenuItem = target && !!target.closest('.nav-menu__submenu--open');
    
        if(!isThisSubmenuItem) {
            submenu.classList.remove('nav-menu__submenu--open');
        }
      }
    n._setEventListeners = function(DOMtree){
        const triggers  = Array.from(DOMtree.querySelectorAll('.menu__trigger')
        , function(trigger){
            trigger.addEventListener('click', toggleSubmenu.bind(trigger));
            trigger.addEventListener('blur' , closeSubmenu.bind(trigger))
        })
        , submenuItems = Array.from(DOMtree.querySelectorAll('.submenu__link')
        , function(submenuLink){
            submenuLink.addEventListener('blur', closeSubmenu.bind(submenuLink));
            submenuLink.addEventListener('click', closeSubmenu);
        });
    return DOMtree;
    }

    n.createComponent();
    return n;
}
NavMenuComponent.prototype = Object.create(Component.prototype);
NavMenuComponent.prototype.constructor = NavMenuComponent;