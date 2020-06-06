import { Popup } from "./Popup";

export class PopupGallery extends Popup {
    constructor(popupElement) { // принимает элемент попапа галереи и массив превьюшек картинок из дефолтных карточек, создающихся при загрузке страницы
        super(popupElement);

        this.imgInGallery = this.popup.querySelector('.place-image');

        this.createOpenGalleryButton = this._generateNewOpenButton.bind(this); //забинденный коллбэк, передаётся экземпляру класса Card
    }

    //это коллбэк (забинденный строчкой выше), который передаётся в экземпляр класса Card. Коллбэк передаётся в экземпляр Card обработчику превьюшки картинки (при создании карточки), и позволяет по клику на превьюшку открывать попап и отображать в нём большую картинку
    _generateNewOpenButton(event) {
        if (event.target.classList.contains('place-card__image')) {
            const imgCssRule = event.target.style.backgroundImage; // получаем строку типа 'url("https://ya.ru/waterfall.jpg")'
            const imgLink = imgCssRule.split(`"`)[1]; //из этой строки вытаскиваем ссылку, заключённую в кавычки
            this.imgInGallery.setAttribute('src', imgLink); //подставляем ссылку в атрибут <img src=""> внутри попапа галереи

            this.open(); //забинденный метод родительского класса Popup. Открывает попап, забинденный в this (в данном случае, попап Галереи)
        }
    }
}