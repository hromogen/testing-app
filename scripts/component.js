'use strict';
function Component(options){ //  <-- options for a component generation
    const c = this;
    c._container       = options && options.sSelector &&               // the component
                  document.querySelector(options.sSelector) || null;   // container
    c._templateUri     = options && options.templateUri     || ''  ;   // html or other html-parseable file URI 
    c._attachedDataUri = options && options.attachedDataUri || ''  ;   // *optional* URI of data to fetch and use for template modification 
    c._attachedData    = options && options.attachedData    || ''  ;   // 
    c._modeName        = options && options.modeName        || ''  ;
    c._router          = options && options.router          || null;
    c._session         = options && options.session         || null;
    c._http            = new HttpService();
    c._parser          = new DOMParser();
    c._clearContainer  = true;  

    
}
Component.prototype = {
    _getTemplate : function(){
        return this._templateUri ? this._http.get(this._templateUri) : '';  
    }
    ,_getAttachedData : function(){
        const c = this;
        let result;
        if(c._attachedDataUri){
            result = c._http.get(c._attachedDataUri) 
        }else if(c._attachedData){
            result = Promise.resolve(c._attachedData)
        }else{
            result = Promise.resolve(null)
        }
        return result;
    }
    ,_parseTemplate : function(sTemplate){
        return sTemplate ? this._parser.parseFromString(sTemplate, "text/html") : '';
    }
    ,_modifyTemplate : function(template /*optional*/, fetchedData){
        return template;
    }
    ,_setEventListeners : function(DOMtree){
        return DOMtree; 
    }
    ,_inject : function(DOMtree){
        const c = this;
        if(c._clearContainer){
            c._container.innerHTML = '';
        }
        c._container.append.apply(c._container, DOMtree.body.children);
        return c._container;
    }

    ,createComponent : function (){
        const c = this;
        return Promise.all([c._getTemplate(), c._getAttachedData()])
        .then(
            function(success){
                const parsedTmpl = c._parseTemplate(success[0])
                let parsedData;
                if(success[1]){
                    if(Array.isArray(success[1])){
                        parsedData = success[1].map(function(dataItem){
                            let result;
                            if(typeof dataItem === 'string'){
                                result = JSON.parse(dataItem);
                            }else{
                                result = dataItem
                            }
                            return result;
                        });
                    }else if(typeof success[1] === 'string'){
                        parsedData = JSON.parse(success[1])
                    }else if(typeof success[1] === 'object'){
                        parsedData = success[1]
                    }
                }
            return c._modifyTemplate(parsedTmpl, parsedData);
            }).then(
                function(success){
                    return c._setEventListeners(success);
            }).then(
                function(success){
                    return c._inject(success);
            }).then(
                function(success){
                    c._router.updatePageLinks();
                    return success;
            });
    }
    ,getContainer : function(){
        return this._container;
    }

    ,display : function(){
        this._container.classList.add('view--active');
    }

    ,hide : function(){
        this._container.classList.remove('view--active');
    }
}