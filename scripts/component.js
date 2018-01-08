
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
}
Component.prototype = {
    _getTemplate : function(){                                       // стандартна функція завантаження
        return this._templateUri ?                                   // темплейту
        this._http.get(this._templateUri) : '';                      // --> Promise<String>, де міститься 
                                                                     //     інформація про темплейт  
    }
    ,_getAttachedData : function(){                                  // стандартна функція завантаження
        const c = this;                                              // додатковий даних
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
    ,_parseTemplate : function(sTemplate){                          // функція-"заглушка"; за замовчуванням
        return sTemplate ?                                          // у випадку наявності проводить парсинг                                      
        this._parser.parseFromString(sTemplate, "text/html") :      // рядку завантаженого темплейту
        '';                                                         // --> Promise<DOMElement || null> 
    }
    ,_modifyTemplate : function(template /*optional*/               // фунція-"заглушка", модифікується у разі  
        , fetchedData){                                             // необхідності у нащадках класу для  
        return template;                                            // модифікації темплейту відповідно до 
                                                                    // завантажених даних
    }                                                               // --> Promise<DOMElement>
    
    ,_setEventListeners : function(DOMtree){                        // фунція-"заглушка", модифікується у разі 
        return DOMtree                                              // необхідності у нащадках класу; 
    }                                                               // додаються обробники подій для взаємодії 
                                                                    // з користувачем
                                                                    // --> Promise<DOMElement>

    ,_inject : function(DOMtree){                                   // точка вставки модифікованого темплейту                                  
        const c = this;
        if(c._clearContainer){
            c._container.innerHTML = '';                            // у випадку необхідності знищуємо 
        }                                                           // попередній зміст
        c._container.append.apply(c._container
            , DOMtree.body.children);
        return c._container;                                        // --> Promise<DOMElement>
    }

    ,createComponent : function (){                                 // функція комбінування стадій створення
        const c = this;                                             // елементу за замовчуванням;
        return Promise.all([c._getTemplate()                        // включати у конструктор нащадків 
            , c._getAttachedData()])                                // класу для того, щоб вони вставлялись 
        .then(                                                      // у DOM-дерево зразу після створення
            function(success){                                      // або викликати в момент, коли це 
                const parsedTmpl = c._parseTemplate(success[0]);    // є доцільним
                let parsedFetchedData;
                if(success[1]){
                    if(Array.isArray(success[1])){
                        parsedFetchedData = success[1].map(         // Тут відбувається додатковий парсинг
                            function(dataItem){                     // завантажених даних, якщо вони є 
                            let result;                             // <string> чи <string[]> 
                            if(typeof dataItem === 'string'){
                                result = JSON.parse(dataItem);
                            }else{
                                result = dataItem
                            }
                            return result;
                        });
                    }else if(typeof success[1] === 'string'){
                        parsedFetchedData = JSON.parse(success[1])
                    }else if(typeof success[1] === 'object'){
                        parsedFetchedData = success[1]
                    }
                }
            return c._modifyTemplate(parsedTmpl
                , parsedFetchedData);
            }).then(
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
    ,getContainer : function(){                                     // --> Доступ до контейнерного елементу,
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
    ,modifyAfterParsing : function(attachedData){
        this._modifyTemplate(this._container, attachedData)
    }
    ,setRouteToView : function(sRoute){
        c._routeToView = sRoute;
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
}                                                                   
