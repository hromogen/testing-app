
/*
* Базовий клас, від якого наслідують майже всі об’єкти інтерфейсу користувача. Повинен отримати
* при створенні об’єкт _options_ у якого обов’язковим є поле options.sSelector, де міститься css-селектор
* компонентна (контейнера) у існуючій DOM структурі, куди після модифікацій буде вставлено екземпляр
* нащадків цього класу. Також усі представники нащадків цього класу за замовчуванням отримують
* екземпляр базового роутер-модуля та поточної сесії  
*/
'use strict';
function Component(options){                                         // <-- опції для створення 
    const c = this;                                                  //     компонента <object>
    c._container       = options && options.sSelector &&             // <-- контейнерний елемент компоненту,
                  document.querySelector(options.sSelector) || null; //     куди вставляється темплейт після 
                                                                     //     модернізації, <DOMElement>
    c._templateUri     = options && options.templateUri     || ''  ; // <-- *опціональна* адреса темплейту, 
                                                                     //     <string>
    c._attachedDataUri = options && options.attachedDataUri || ''  ; // <-- *опціональна* адреса, звідки  
                                                                     //      завантажуються додаткові дані,
                                                                     //     <string>
    c._attachedData    = options && options.attachedData    || ''  ; // <-- *опціонально* додаткові дані,  
                                                                     //     <JSON || object>
    c._modeName        = options && options.modeName        || ''  ; // <-- *опціонально* назва поточного 
                                                                     //     режиму (quiz чи erudith, <string>) 
    c._router          = options && options.router          || null; // <-- екземпляр роутера, створений у 
                                                                     //     файлі _session.js_, <routerModule>
    c._session         = options && options.session         || null; // <-- екземпляр поточної сесії, 
                                                                     //     <sessionModule>
    c._http            = new HttpService();                          // <-- екземпляр http-сервіса, <httpService>
    c._parser          = new DOMParser();                            // <-- екземпляр DOM-парсера, <DOMParse>
    c._clearContainer  = true;                                       // <-- вказує на те, чи слід очищати 
                                                                     //     container перед вставкою 
                                                                     //     темплейту, <boolean>
    c._routeToView = '';
    c._active = false;
    c._template = '';
    c._handleError = c._session.informService.errorHandler;
    c._errNames = InformService.STANDARD_ERROR_NAMES; 

    c._getTemplate = function(){                                       // стандартна функція завантаження
        return c._templateUri ?                                   // темплейту
        c._http.get(this._templateUri) : '';                      // --> Promise<String>, де міститься 
                                                                     //     інформація про темплейт  
    }
    c._getAttachedData = function(){                                  // стандартна функція завантаження                                             // додатковий даних
        let result;                                                  // -->  Promise<string[]||Object[]||
        if(c._attachedDataUri){                                      //      null>, де містяться заватнажені  
            result = c._http.get(c._attachedDataUri)                 //      дані                          
        }else if(c._attachedData){
            result = Promise.resolve(c._attachedData)
        }else{
            result = Promise.resolve(null)
        }
        return result;
    }
    c._renderTemplate = function(sTemplate, fetchedData){
        let result = ''                                               
        c._template = sTemplate;
        if(sTemplate && !fetchedData){
            result = sTemplate;
        }
        else if(sTemplate && fetchedData){
            if(Array.isArray(fetchedData)){
                result = fetchedData.reduce(function(interim, dataItem){
                    interim += Mustache.render(sTemplate, dataItem);
                    return interim
                },'')
            }else if(typeof fetchedData === 'object'){
                result = Mustache.render(sTemplate, fetchedData);
            }   
        }
        return result ? 
        c._parser.parseFromString(result, "text/html") : '';                                                   
    }                                                           
    
    c._setEventListeners = function(DOMtree){                  
        return DOMtree                                          
    }                                                           
                                                                                                                                
    c._inject = function(DOMtree){                                                           
        if(c._clearContainer){
            c._container.innerHTML = '';                            
        }                                                           
        c._container.append.apply(c._container
            , DOMtree.body.children);
        return c._container;                                        
    }
    c.createComponent = function (){                                                                        
        return Promise.all(
            [c._getTemplate()
                .catch(function(error){
                    error.name = c._errNames.templateDownloadProbllem
                    c._handleError(error);                    
                }), c._getAttachedData()
                .catch(function(error){
                    error.name = c._errNames.dataDownloadProblem
                    c._handleError(error);
            })
        ])                                
        .then(                                                      
            function(success){
                return c._renderTemplate(success[0], success[1]) 
            }                                      
        ).then(
                function(success){
                    return c._setEventListeners(success);
            }).then(
                function(success){
                    return c._inject(success);
            }).then(
                function(success){                                  // тут відбувається оновлення шляхів
                    c._router.updatePageLinks();                    // роутера про всяк випадок
                    return success;                                 // --> <void>
            });
    }
    return c;
}
Component.prototype = {
    getContainer : function(){                                     // --> Доступ до контейнерного елементу,
        return this._container;                                     //     <DOMElement>  
    }

    ,display : function(){                                          // Функція для додавання css-класу
        this._container.classList.add('view--active');              // видимості до контейнерних елементів
    }                                                               // представників нащадків цього класу
                                                                    // --> <void>

    ,hide : function(){                                             // Функція для додавання css-класу
        this._container.classList.remove('view--active');           // видимості до контейнерних елементів
    }                                                               // представників нащадків цього класу
                                                                    // // --> <void>
    ,modifyInline : function(attachedData){
        const elChangedContent = this._renderTemplate(this._template, attachedData)
        ,elContentWithListeners = this._setEventListeners(elChangedContent)
        this._container.innerHTML = '';
        this._container.append.apply(this._container
            , Array.from(elContentWithListeners.body.children));
    }
    ,setRouteToView : function(sRoute){
        this._routeToView = sRoute;
    }
    ,getRouteToView : function(){
        return c._routeToView
    }
    ,activate : function(){
        this._active = true;
    }
    ,deactivate : function(){
        this._active = false;
    }
    ,isActive : function(){
        return this._active;
    }
    ,getTemplate : function(){
        return this._template;
    }
}                                                                   
