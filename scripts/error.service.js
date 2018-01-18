function ErrorService(router){
    const e = this;
    e._router = router;
    e._template = '<section class="error-section">'                         +
    '<span class="error-section__standard-message">{{error.name}}</span>'   +
    '<button class="error-section__detail-button">Показати деталі</button>' +
    '<ul class="error-section__error-detail">'                              +
        '<li><strong>Повідомлення:</strong>'                                +
            '<br>{{error.message}}'                                         +
        '</li>'                                                             +
        '<li><strong>Стек:</strong>'                                        +
            '<br>{{error.stack}}'                                           +
        '</li>'                                                             +
        '<li><strong>Номер рядка:</strong>'                                 +
            '<br>{{error.lineNumber}}'                                      +
       '</li>'                                                              +
    '</ul>'                                                                 +
    '<button class="error-section__go-on-button">OK</button>'               +
'</section>'                                                                ;

    e.showError = function(error){
        const body = document.body
        ,message = Mustache.render(e._template, error)
        ,showDetailButton = message.querySelector('.error-section__detail-button')
        ,goOnButton = message.querySelector('.error-section__go-on-button');

        showDetailButton.onclick = function(){
            detailList.classList.toggle('error-section__error-detail--open')
        }
        goOnButton.onclick = function(){
            body.removeChild(message);
            i._router.navigate(/*path=*/ '/rules/general', /*absolute=*/false);
        }
        body.appendChild(message);
    }
    return e;
}
ErrorService.STANDARD_ERROR_NAMES = {
    templateDownloadProblem: 'Виникла проблема при завантаженні темплейту. Можливо, спробуйте ще раз з головної сторінки?'
    ,dataDownloadProblem: 'Виникла проблема при завантаженні даних. Можливо, сервер зараз не доступний. Спробуйте пізніше'
    ,uploadFormNotValid: 'Перевірте, будь ласка, чи Ви не пропустили якесь поле при створенні тестування'
}
