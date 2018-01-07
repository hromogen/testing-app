const COMPONENTS_REGISTER = {
    navMenu: {
        sSelector: '.nav'     
        ,templateUri: './templates/nav-menu.template.html'
    }
    , generalRulesArticle: {
        sSelector: '.rules__article--general'     
        ,templateUri: './templates/rules--general.template.html'
    } 
    , quizRulesArticle: {
        sSelector: '.rules__article--quiz'     
        ,templateUri: './templates/rules--quiz.template.html' 
    }
    ,erudithRulesArticle: {
        sSelector: '.rules__article--erudith'    
        ,templateUri: './templates/rules--erudith.template.html'
    }
    ,filterForm: {
        sSelector: '.cards__controllers'   
        ,templateUri: './templates/filter-form.template.html'
    }
    ,sorterForm: {
        sSelector: '.cards__controllers'   
        ,templateUri: './templates/sorter-form.template.html'
    }
    ,quizCardsArticle: {
        sSelector: '.cards__quiz'   
        ,templateUri: './templates/testing-card.template.html' 
        ,attachedDataUri:'./assets/mock-server/quiz-cards-register.json'
        ,modeName:'quiz'
    }
    ,erudithCardsArticle:{
        sSelector: '.cards__erudith'   
        ,templateUri: './templates/testing-card.template.html' 
        ,attachedDataUri:'./assets/mock-server/erudith-cards-register.json'
        ,modeName:'erudith'
    }
    ,testingOptionsForm: {
        sSelector: '.testing-options-form'   
        ,templateUri: './templates/testing-options-form.template.html'
    }
    ,testingArticle: {
        sSelector: '.testing'   
        ,templateUri: './templates/testing-article.template.html'
    }
    ,videoSlider: {
        sSelector: '.videomaterials'   
        ,templateUri: './templates/video-slider.template.html'
    }
    ,uploadSetupForm: {
        sSelector:'.upload__setup'
        ,templateUri: './templates/upload-setup-form.template.html'
    }
    ,uploadForm: {
        sSelector:'.upload__create'
        ,templateUri: './templates/upload-question-form.template.html'
    }
    ,quizCardsPaginateBox: {
        sSelector:'.cards__links--quiz'
    }
    ,erudithCardsPaginateBox: {
        sSelector:'.cards__links--erudith'
    }
}