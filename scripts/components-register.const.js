const COMPONENTS_REGISTER = {
    cabinetEntryPoint: {
        sSelector:'.header'
        ,templateUri: './templates/cabinet-entry-point.template.html'
    }
    ,navMenu: {
        sSelector: '.nav'     
        ,templateUri: './templates/nav-menu.template.html'
    }
    , searchForm: {
        sSelector: '.nav'     
        ,templateUri: './templates/search-form.template.html'
    }
    , generalRulesArticle: {
        sSelector: '.rules__article--general'     
        ,templateUri: './templates/rules-section--general.template.html'
        ,routeToView: '#/rules/general'
    } 
    , quizRulesArticle: {
        sSelector: '.rules__article--quiz'     
        ,templateUri: './templates/rules-section--quiz.template.html'
        ,routeToView: '#/rules/quiz"'
    }
    ,erudithRulesArticle: {
        sSelector: '.rules__article--erudith'    
        ,templateUri: './templates/rules-section--erudith.template.html'
        ,routeToView: '#/rules/erudith'
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
        ,routeToView: '#/cards/quiz'
    }
    ,erudithCardsArticle:{
        sSelector: '.cards__erudith'   
        ,templateUri: './templates/testing-card.template.html' 
        ,attachedDataUri:'./assets/mock-server/erudith-cards-register.json'
        ,modeName:'erudith'
        ,routeToView: '#/cards/erudith'
    }
    ,testingOptionsForm: {
        sSelector: '.testing-options'   
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
    ,registrationForm: {
        sSelector:'.registration'
        ,templateUri: './templates/registration-form.template.html'
    }

    ,personalCabinet: {
        sSelector: '.personal-cabinet'
        ,templateUri: './templates/personal-cabinet.template.html'
    }
    ,searchResult: {
        sSelector: '.search-result'
        ,templateUri: './templates/search-result.template.html'
    }
    ,testingSummary: {
        sSelector: '.testing-summary'
        ,templateUri: './templates/testing-summary.template.html'
    }
    ,feedbackForm: {
        sSelector: '.feedback'
        ,templateUri: './templates/feedback.template.html'
    }
    ,info: {
        sSelector: '.info'
        ,templateUri: './templates/info.template.html'
        ,routeToView: '#/info'
    }
}

