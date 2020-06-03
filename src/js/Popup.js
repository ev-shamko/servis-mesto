//класс для попапа. отвечает за работу модальных окон
//popupElement - один из попапов страницы
//buttonOpen - необязательный аргумент. Кнопка, по нажатию на которую открывается попап
//funcSetSubmitButton - необязательный аргумент. Забинденный метод экземпляра класса FormValidation, отвечающий за включение или выключение кнопки сабмита формы (находящейся внутри попапа) при открытии попапа с этой форомой.

export class Popup {

    constructor(popupElement, buttonOpen, funcSetSubmitButton) {

        this.setSubmitButton = funcSetSubmitButton; //если в экземпляр класса была передана funcSetSubmitButton, то при открытии попапа кнопка сабмита формы (находящйеся в этом попапе) будет включаться/выключаться. Если функция не была передана в экземпляр класса (не передаём, если в попапе нет формы), ничего страшного не случится.
        this.popup = popupElement;
        this.buttonClose = this.popup.querySelector('.popup__close');
        this.form = this.popup.querySelector('.popup__form'); // если внутри попапа нет формы, то в свойство this.form запишется null
        this.buttonOpen = buttonOpen; // кнопка открытия попапа может не передаваться в случае попапа Галереи

        this.open = this._open.bind(this);

        this._setCloseEventListeners(); //навешивает обработчик на кнопку закрытия попапа
        this._setOpenEventListeners(); //навешивает обработчик на кнопку открытия попапа
    }

    close() { //закрывает попап и резетит форму, если в попапе есть форма
        this.popup.classList.remove('popup_is-opened');

        if (this.form != null) { //если в попапе содержится форма, то она резетнется при закрытии попапа, а все сообщения об ошибке валидации полей будут скрыты + кнопка сабмита станет неактивной
            this.form.reset();

            const arrayAllErrorElements = this.form.querySelectorAll('.popup__error');
            arrayAllErrorElements.forEach((element) => element.textContent = '');
        }
    }

    _open() {
        if (this.setSubmitButton !== undefined) { //если при создании экземпляра класса в него был передан третий аргумент с функцией из класса FormValidator, метод _open дополнительно активирует или дезактивирует кнопку сабмита формы при открытии попапа
            this.setSubmitButton();
        }

        this.popup.classList.add('popup_is-opened');
    }

    _setOpenEventListeners() { // открытие попапа по клинку на кнопку, которая должна открывать popup

        if (this.buttonOpen !== undefined) {
            this.buttonOpen.addEventListener('click', this.open); //благодаря специфике this у стрелочных функций, в этот this навсегда записалась ссылка на экземпляр Popup
        }
    }

    _setCloseEventListeners() { // закрытие попапа по клику на кнопку закрытия или по нажатию клавиши Esc
        this.buttonClose.addEventListener('click', () => this.close());

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }
}

//в принципе, можно создать единственный попап и динамически менять его содержимое. Но у меня изначально на странице 3 попапа, так что сделаю вариант с тремя экземплярами класса