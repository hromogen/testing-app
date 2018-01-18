function InformService(
    opts/* 
        * в форматі  {
        *    messageName: {
        *        container: <hTMLElement>
        *        displayingClass: <string>
        *    }
        * }
        */

){ 
    const i = this
    for (let messageName in opts){
        let option = opts[messageName]
        ,field;
        i[messageName] = field = {}

        field.container = option.container;
        field.displayingClass = option.displayingClass
        field.display = function(){
            field.container.classList.add(field.displayingClass);
        }
        field.hide = function(){
            field.container.classList.remove(field.displayingClass);
        }
    }
    i.hideAll = function(){
        for(let field in i){
            if(i[field].hide){
                i[field].hide();
            }
        }
    }
    return i;
}