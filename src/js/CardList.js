//экземпляр этого класса хранит в себе все карточки и отрисовывает все карточки

//container - контейнер - это DOM-элемент, куда нужно помещать карточки
//arrayOfDefaultCardElems - массив дефолтных карточек (экземпляров класса Card), которые будут на странице при загрузке. 

export class CardList {

    constructor(container, arrayOfDefaultCardElems) {
        this.container = container; // сюда будут добавляться карточки
        this.arrayOfDefaultCardElems = arrayOfDefaultCardElems;
    }

    //когда мы получили с сервера дефолтные карточки и создали на их основании элементы карточек, этот метод добавляет элементы карточек на страницу
    render() {
        this.arrayOfDefaultCardElems.forEach((cardDomElement) => {
            this.addCard(cardDomElement);
        });
    }

    //метод для добавления карточки в контейнер, принимает на вход DOM-элемент карточки (хранится в свойстве .cardMarkup экземпляра объекта Card);
    addCard(newCardDomElement) {
        this.container.appendChild(newCardDomElement);
    }
}