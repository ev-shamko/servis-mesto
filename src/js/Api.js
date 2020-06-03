//класс содержит методы обращения к серверу

export class Api {
    constructor(object) {
        this.baseUrl = object.baseUrl; // https://praktikum.tk/cohort10/
        this.urlCars = this.baseUrl + '/cards'; // https://praktikum.tk/cohort10/cards
        this.urlProfileData = this.baseUrl + '/users/me'; // https://praktikum.tk/cohort10/users/me

        this.headers = object.headers; // сюда вот что кладётся:
        /* 
        headers: {
             authorization: '3fc69959-d32c-40df-bba7-4d30f433aedc',
            'Content-Type': 'application/json'
        } 
        */

        this.toggleLike = this._toggleLike.bind(this); //метод передаётся в экземпляр класса Card, чтобы отправлять на сервер информацию о поставленном/убранном лайке
        this.deleteCard = this._deleteCard.bind(this); // удаляет карточку на сервере
    }

    // передаёт на сервер информацию о том, что мы поставили/убрали лайк
    _toggleLike(action, cardId) {
        return fetch(`${this.urlCars}/like/${cardId}`, { // пример ссылки: https://praktikum.tk/cohort10/cards/like/5e9
                method: action,
                headers: {
                    authorization: this.headers.authorization,
                }
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            });
    }

    //вызов этой функции запишет в this.profileData полученный от сервера объект с данными профиля пользователя
    getProfileData() {
        return fetch(this.urlProfileData, {
                headers: {
                    authorization: this.headers.authorization,
                }
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            });
    }

    //получает с сервера массив с данными дефолтных карточек
    getDefaultCards() {
        return fetch(this.urlCars, {
                headers: {
                    authorization: this.headers.authorization,
                }
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            });
    }

    //метод для отправки юзердаты на сервер
    sendProfileUpdate(name, about) { // аргументы - обязательно строки
        return fetch(this.urlProfileData, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify({
                    name: name,
                    about: about
                })
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            });
    }

    //отправляет на сервер запрос на создание новой карточки. Метод используется в script.js, используется внутри коллбэка обработчика, висящего на кнопке добавления новой карточки.
    addNewCard(name, link) {
        return fetch(this.urlCars, {
                method: 'POST',
                headers: {
                    authorization: this.headers.authorization,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    link: link
                })
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            });
    }

    //отправляет на сервер запрос на удаление текущей карточки. Метод передаётся в класс Card
    _deleteCard(cardId) {
        return fetch(`${this.urlCars}/${cardId}`, {
                method: 'DELETE',
                headers: {
                    authorization: this.headers.authorization,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            });
    }


    /*
    Доделаю на каникулах: пример fetch-запроса для смены аватара.
    Не забыть спросить у наставника, почему Content-Type срабатывает именно такой, а не image/jpg

    fetch('https://praktikum.tk/cohort10/users/me/avatar', {
      method: 'PATCH',
      headers: {
        authorization: '3fc69959-d32c-40df-bba7-4d30f433aedc',
        'Content-Type': 'application/json' --- а вот так! Внезапно.
      },
      body: JSON.stringify({
        avatar: 'https://diskomir.ru/upload/iblock/53f/53f478b212bf133a0d0fe8f3e97a7b78.jpg',

      })
    });
    */

}