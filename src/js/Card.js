export class Card {
    constructor(card, funcCreateGalleryButton, toggleLike, deleteCard, myId) {

        /*******  Данные текущей карточки */

        this.name = card.name;
        this.link = card.link;

        this.likesArr = card.likes; // массив с перечнем пользователей, лайкнувших карточку
        this.numberOfLikes = this.likesArr.length.toString(); //сколько лайков у карточки на момент получения ответа от сервера

        this.id = card._id; //id карточки
        this.ownerId = card.owner._id; //id автора карточки



        /*******  Данные и методы из других классов */

        this.myId = myId; //нам необходимо знать id текущего пользователя, чтобы позволять делать некоторые вещи только с теми карточками, у которых ownerId = myId
        this.toggleLike = toggleLike; // кладём сюда забинденный метод api.toggleLike
        this.createGalleryButton = funcCreateGalleryButton; // кладём сюда забинденный метод класса PopupGallery, вешает слушатели для открытия большой картинки
        this._deleteCard = deleteCard; //кладём сюда забинденный метод api.deleteCard - отправляет запрос на сервер об удалении карточки



        /**** Операции с DOM-элементами карточи */

        this.cardMarkup = this._create(); // создаём и возвращает DOM-элементы карточки. Помним: этот DOM-элемент ещё не встроен в страницу и хранятся только в памяти. В дальнейшем DOM-элемент будет отображён на страницу с помощью метода класса CardList

        this.likeButton = this.cardMarkup.querySelector('.place-card__like-icon');
        this.deleteButton = this.cardMarkup.querySelector('.place-card__delete-icon');
        this.previewPicture = this.cardMarkup.querySelector('.place-card__image');



        /**** Все операции с DOM и разметкой карточи */

        this.like = this._like.bind(this); //объявляем коллбэк для обработчика. При вызове этого метода обработчиком, this будет ссылаться не на кнопку лайка, а на экземпляр карточки
        this.removeCardElement = this._removeCardElement.bind(this); //биндим метод, отправляющий на сервер запрос на удаление, и потом убирающий элемент карточки со страницы



        /**** Вызов метода */

        this._setEventListeners(); //вешает индивидуальные слушатели на элементы каждой карточки, создаваемой с помощью экземпляра класса Card
    }

    //создаёт DOM-элемент карточки
    _create() {
        const cardElem = document.createElement('div'); //создаём div карточки
        cardElem.classList.add('place-card');

        //кладём в этот div разметку карточки (так читабельнее, чем через createElement)
        cardElem.innerHTML = `
        <div class="place-card__image" id="">
            <button class="place-card__delete-icon"></button>
        </div>
        <div class="place-card__description">
            <h3 class="place-card__name"></h3>
            <div class="place-card__like-container">
                <button class="place-card__like-icon"></button>
                <span class="numberOfLikes">1</span>
            </div>
        </div>
        `;

        //далее выбираем элементы разметки и устанавливаем у них background-image для фоновой картинки и и textContent для заголовка
        const cardImage = cardElem.querySelector('.place-card__image');
        cardImage.setAttribute('style', `background-image: url(${this.link})`);

        const cardHeader = cardElem.querySelector('.place-card__name');
        cardHeader.textContent = this.name;

        //пишем, сколько лайков у карточки на момент получения ответа от сервера
        const likesCounter = cardElem.querySelector('.numberOfLikes');
        likesCounter.textContent = this.numberOfLikes;

        cardElem.setAttribute('id', this.id); //записываем в атрибуты элемента id текщей карточки



        //Если пользователь лайкнул текущую карточку, то кнопка лайка станет чёрной, иначе она останется дефолтной белой
        this.likesArr.forEach((like) => {
            if (like._id === this.myId) { //если в массиве лайков карточки есть мой
                cardElem.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
            }
        });


        //если id создателя карточки не совпадает с id текущего пользователя, мы скрываем кнопку удаления карточки. Нельзя удалять чужие карточки
        if (this.ownerId !== this.myId) {
            cardElem.querySelector('.place-card__delete-icon').setAttribute('style', 'display: none'); //style="display: none"
        }



        return cardElem; //возвращаем DOM-элемент карточки
    }

    //меняет вид кнопки лайка при нажатии. Принимает в качестве аргумента событие click по кнопке лайка.
    _like(event) {
        const cardId = event.target.closest('.place-card').getAttribute('id');
        const isLiked = event.target.classList.contains('place-card__like-icon_liked'); // false/true - проверяет, как выглядит кнопка лайка: если белая, то false; если чёрная, то true
        const numberOfLikes = event.target.nextElementSibling;

        //Отправляет на сервер информацию о постановке/удалении лайка. Тип запроса зависит от того, в каком состоянии находится кнопка лайка: чёрная она или белая
        if (isLiked) { // isLiked = true, когда кнопка лайка чёрная, т.е. лайк поставлен текущим пользователем. Прямо при создании карточки мы проверили, ставил ли пользователь лайк в предыдущую сессию, поэтому цвет кнопки лайка всегда является индикатором того, лайкал ли пользователь карточку
            this.toggleLike('DELETE', cardId) //отправили на сервер сообщение о снятии лайка. Сервер возвращает объект карточки
                .then((cardInfo) => {
                    numberOfLikes.textContent = cardInfo.likes.length; //отображаем, сколько теперь у карточки лайков
                })
                .catch(error => {
                    console.error(`Ошибка при обработке лайка: ${error}`);
                });
        } else {
            this.toggleLike('PUT', cardId) //отправили на сервер сообщение о снятии лайка. Сервер возвращает объект карточки
                .then((cardInfo) => {
                    numberOfLikes.textContent = cardInfo.likes.length; //отображаем, сколько теперь у карточки лайков
                })
                .catch(error => {
                    console.error(`Ошибка при обработке лайка: ${error}`);
                });
        }


        event.target.classList.toggle('place-card__like-icon_liked'); // меняет цвет кнопки лайка
    }

    _removeCardElement(event) {
        const сardElem = event.target.closest('.place-card');

        // передаёт на сервер команду удалить карточку. В this попадает корректная ссылка на экземпляр Card, а не на deleteButton, потому что метод забинден в конструкторе
        this._deleteCard(this.id)
            .then(() => {
                this._removeEventListeners(); //здесь в this попадает забинденная ссылка на экземпляр Card
                сardElem.remove();
            })
            .catch(error => {
                console.error(`Ошибка при удалении DOM-элемента карточки: ${error}`);
            });
    }

    _setEventListeners() {
        this.likeButton.addEventListener('click', this.like); //тогглит кнопку лайка
        this.deleteButton.addEventListener('click', this.removeCardElement); //функционал кнопки удаления карточки
        this.previewPicture.addEventListener('click', this.createGalleryButton); //делает элемент с картинкой "кнопкой", по нажатию на который открывается попап галерии с большой картинкой
    }

    _removeEventListeners() { //убирает с элементов карточки все навешанные слушатели
        this.likeButton.removeEventListener('click', this.like);
        this.deleteButton.removeEventListener('click', this.removeCardElement);
        this.previewPicture.removeEventListener('click', this.createGalleryButton);
    }
}