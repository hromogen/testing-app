
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
    c._modeName        = options && options.modeName        || ''  ; // <-- *опціонально* назва поточного 
                                                                     //     режиму (quiz чи erudith, <string>) 
    c._router          = options && options.router          || null; // <-- екземпляр роутера, створений у 
                                                                     //     файлі _session.js_, <routerModule>
    c._session         = options && options.session         || null; // <-- екземпляр поточної сесії, 
                                                                     //     <sessionModule>
    c._routeToView     = options && options.routeToView     || ''; //  -  дані, необхідні для пошуку <string>
    c._clearContainer  = true;                                       // <-- вказує на те, чи слід очищати 
                                                                     //     container перед вставкою 
                                                                     //     темплейту, <boolean>
    c._errorService    = c._session.errorService;                    //     поля, необхідні для обробки
    c._errNames        = ErrorService.STANDARD_ERROR_NAMES;          //     помилок <function>, <object[]>
/* власні сервіси */
    c._http            = new HttpService();                          // <-- екземпляр http-сервіса, <httpService>
    c._parser          = new DOMParser();                            // <-- екземпляр DOM-парсера, <DOMParse>
    c.paginator        = null;                                       //  - власний елемент, що здійснюватиме пагінацію,
                                                                     //  - <paginateServise>
/* інші поля, які заповнюються в процесі створення */  
    c._active = false;                                               //  -  поле вказує, чи активовано компонент <boolean>   
    c._rawTemplate = '';                                             //  -  необроблений темплейт, <string>
    c._parsedTemplate = '';                                          //  -  темплейт після обробки,  <string>



    c._getTemplate = function(){                                     // стандартна функція завантаження
        return c._templateUri ?                                      // темплейту
        c._http.get(this._templateUri) : '';                         // --> Promise<String>, де міститься 
                                                                     //     інформація про темплейт  
    }
    c._getAttachedData = function(){                                 // стандартна функція завантаження                                             // додатковий даних
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
    c._renderTemplate = function(                                   // функція обробки темплейту
        sTemplate,                                                  // <-- стандартний темплейт для обробки
                                                                    // фреймворком `Mustache`, <string>
        fetchedData){                                               // <-- дані для рендерингу за допомогою феймворку                                                          
        let result = '';                                            // `Mustache` <object || object[]>
        c._rawTemplate = c._rawTemplate || sTemplate;                                             
        if(c._rawTemplate && !fetchedData){
            result = c._rawTemplate;
        }
        else if(c._rawTemplate && fetchedData){
            if(Array.isArray(fetchedData)){
                result = fetchedData
                .reduce(function(interim, dataItem){
                    interim += Mustache.render(c._rawTemplate, dataItem);
                    return interim
                },'')
            }else if(typeof fetchedData === 'object'){
                result = Mustache.render(c._rawTemplate, fetchedData);
            }   
        }
        c._renderedTemplate = result;
        return result ? 
        c._parser.parseFromString(result, "text/html") : '';                                                        
    }                                                           
    
    c._setEventListeners = function(DOMtree){                       //  функція, що встановлює на 
                                                                    //  пропарсений темплейт обробники подій, 
                                                                    //  <-- пропарсений темплейт <document>,                                                                                                         
        return DOMtree                                              //  --> пропарсений темплейт із обробниками подій, 
    }                                                               //      <document>                                         
                                                                                                                                                                                      
    c._inject = function(DOMtree){                                  //  відбувається вставка пропарсеного темплейту                                                          
        if(c._clearContainer){                                      //  у `_container`, <-- пропарсений темплейт <document> 
            c._container.innerHTML = '';                            //  із обробниками подій                           
        }                                                           
        c._container.append.apply(c._container
            , DOMtree.body.children);
        c.updateSearchRoute(c._container);
        return c._container;                                        // --> контейнерний елемент із вставленим фрагментом,                                       
    }                                                               //     <dOMElement>
    c.createComponent = function (){                                                                        
        return Promise.all(
            [c._getTemplate()
                .catch(function(error){
                    error.name = c._errNames.templateDownloadProblem
                    c._errorService.showError(error);                    
                }), c._getAttachedData()
                .catch(function(error){
                    error.name = c._errNames.dataDownloadProblem
                    c._errorService.showError(error);
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
        return this._container;                                     //     <hTMLElement>  
    }

    ,display : function(){                                          // Функція для додавання css-класу
        const view = this._container                                // видимості до контейнерних елементів
        ,parentView = view.parentNode.closest('.view');             // представників нащадків цього класу                                                           
        view. classList.add('view--active');                        // та їх батьківських елементів                       
        if(parentView){
            parentView.classList.add('view--active');
        }                                                             
    }                                                               // --> <void>

    ,hide : function(){                                             // Функція для вилучення css-класу
        const view = this._container                                // видимості до контейнерних елементів
        ,parentView = view.parentNode.closest('.view--active');     // представників нащадків цього класу     
        view.classList.remove('view--active');                      // та їх батьківських елементів                     
        if(parentView){
            parentView.classList.remove('view--active'); 
        }
    }                                                               // // --> <void>                                                              
                                                                    
    ,modifyInline : function(attachedData, additionalData){
        const elChangedContent = this._renderTemplate(this._rawTemplate
            ,attachedData, additionalData)
        ,elContentWithListeners = this._setEventListeners(elChangedContent)
        this._container.innerHTML = '';
        this._container.append.apply(this._container
            ,Array.from(elContentWithListeners.body.children));
        return this._container;
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
    ,updateSearchRoute : function(eViewItem){
        if(this._routeToView){
            let sRoute = this._routeToView;
            if(eViewItem.dataset.page){
                sRoute += '?page#=' + eViewItem.dataset.page;
            }
            eViewItem.dataset.route = sRoute;
        }
        return eViewItem;
    }
    ,hideChildren : function(sSelector, element){
        const parent = element || this._container 
        ,currentlyActual = Array.from(parent.querySelectorAll('.nonactual-field')
        ,function(child){
            child.classList.remove('nonactual-field');
        })
        ,currentlyHidden = Array.from(parent.querySelectorAll(sSelector)
        ,function(child){
            child.classList.add('nonactual-field');
        });
        return currentlyHidden;
    }
    ,getTemplate : function(){
        return this._renderedTemplate;
    }
}                                                                   
