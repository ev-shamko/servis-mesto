/* ******************************** */
/* Переменные */
/* ******************************** */

const api = new Api({
    baseUrl: 'https://praktikum.tk/cohort10',
    headers: {
        authorization: '',
        'Content-Type': 'application/json'
    }
});

const formAddCard = document.forms.new;

const validatorFormAddCard = new FormValidator(formAddCard);
const popupAddCard = new Popup(document.querySelector('.popup__addcard'), document.querySelector('.user-info__button'), validatorFormAddCard.desactivateSubmitButton);

const validatorFormEditProfile = new FormValidator(document.forms.editProfile);
const popupEditProfile = new Popup(document.querySelector('.popup__profile'), document.querySelector('.profile__button'), validatorFormEditProfile.activateSumbitButton);

const userInfo = new UserInfo(document.querySelector('.user-info__name'), document.querySelector('.user-info__job'), document.querySelector('.user-info__photo'));


const popupGallery = new PopupGallery(document.querySelector('.popup__img'));

const arrOfDefaultCardElems = []; //это массив DOM-элементов дефолтных карточек. Он нужен, чтобы в глобальной области видимости был доступ к этом массиву (ссылка на него). Ссылка на этот же массив хранится в одном из свойста экземпляр CardList  --- так сделано по рекомендации ревьюера
const cardList = new CardList(document.querySelector('.places-list'), arrOfDefaultCardElems);
// --- Сдалала! --- Надо исправить
// Массивы передаются по ссылке:
// Объявите пустой массив яерез const
// Укажите этот массив при создании экземпляра CardList
// Потом загрузите в массив данные внутри then (например через push), и после того как соберете массив -- вызывайте render, внутри того же then

//я не поняла, как передать в конструктор массив DOM-элементов (из-за асинхронности никак), создающийся асинхронно. Поэтому передача массива внутрь класса реализована иначе - см.ниже. 

/* ******************************** */
/* Объявление функций */
/* ******************************** */

//в будущем методы класса можно попробовать забиндить и передать в экземпляр другого класса
function getDefaultProfileData() {
    api.getProfileData()
        .then(profileData => {

            api._myId = profileData._id; //в будущем id понадобится для некоторых проверок данных, пришедших с сервера. Или лучше хранить его в userInfo? Пока хз

            userInfo.setUserInfo(profileData.name, profileData.about, profileData.avatar, profileData._id); //обновляем данные в экземпляре класса, йуху!
            userInfo.updateUserInfo(); // обновляем имя и юзеринфо в DOM
        })
        .catch(error => {
            console.error(`Ошибка при отрисовке данных профиля: ${error}`);
        });
}


//получает с сервера массив данных о карточках. Создаёт на основании этого массива DOM-элементы карточек и пушит их в массив внутри экземпляра класса. По завершении этого действия вызывает метода cardList, который рендерит дефолтные карточки
function getDefaultCardsThenRender() {
    api.getDefaultCards() //получает массив карточек с сервера
        .then(arrDefaultCards => {
            //console.log(arrDefaultCards[0]);
            //после получения массива данных с сервера создаём DOM-элемент каждой карточки и пушим его в массив cardList.arrayOfDefaultCardElems
            arrDefaultCards.forEach(function(card) {
                const newCard = new Card(card, popupGallery.createOpenGalleryButton, api.toggleLike, api.deleteCard, userInfo.myID); // я помню, что лучше бы переписать класс Card и создавать только один его экземпляр, но времени в обрез. Доделаю на каникулах.
                arrOfDefaultCardElems.push(newCard.cardMarkup);
            });
        })
        //рендер карточек вызывается именно здесь, чтобы рендер начался именно после окончания загрузки данных с сервера и после создания массива элементов карточек на основании этих данных. Асинхронность!
        .then(() => {
            cardList.render(); //добавляет на страницу дефолтные карточки, разметка которых была запушена в массив cardList.arrayOfDefaultCardElems в предыдущем .this
            //напоминаю сама себе, что теперь метод render нельзя вызывать вне .this, потому что асинхронность, и метод render будет пытаться что-то там отрисовать ещё до прихода данных с сервера
        })
        .catch(error => {
            console.error(`Ошибка при рендере дефолтных карточек: ${error}`);
        });
}


/* ******************************** */
/* Вызов методов и функций */
/* ******************************** */

/* Наверно, это реально запихнуть в методы классов. Но времени на это нет, предыдущий спринт занял слишком много времени. Поэкспериментирую с переносом функций в методы класса на каникулах */

getDefaultProfileData();
getDefaultCardsThenRender();



/* ******************************** */
/* Обработчики (слушатели событий) */
/* ******************************** */

//по нажатию на кнопку открытия попапа для редактирования профиля, подставляет в поля формы текущие имя и юзеринфо
document.querySelector('.profile__button').addEventListener('click', () => {
    const currentName = document.querySelector('.user-info__name').textContent;
    const currentUserInfo = document.querySelector('.user-info__job').textContent;

    const inputName = document.querySelector('.popup__input_username');
    const inputUserInfo = document.querySelector('.popup__input_userinfo');

    inputName.value = currentName;
    inputUserInfo.value = currentUserInfo;
});

//этот обработчик создаёт новую карточку, добавляет её в контейнер и закрывает попап
formAddCard.addEventListener('submit', (event) => {
    event.preventDefault();

    //записываем в переменные значения инпутов
    const name = formAddCard.name.value;
    const link = formAddCard.link.value;

    api.addNewCard(name, link) //посылает на сервер информации о новой карточке. Если всё ок, то возвращает объект новой карточки
        .then((card) => {
            const newCard = new Card(card, popupGallery.createOpenGalleryButton, api.toggleLike, api.deleteCard, userInfo.myID);
            cardList.addCard(newCard.cardMarkup);
            popupAddCard.close(); //закрывает попап и резетит форму
        })
        .catch(error => {
            console.error(`Ошибка при добавлении новой карточки: ${error}`);
        });
});

//обработчик вешается на форму редактирования профиля. По сабмиту изменяет имя и userinfo на те, которые ввёл пользователь.
document.forms.editProfile.addEventListener('submit', (event) => {
    event.preventDefault();

    //сохраняем в переменных значения, которые пользователь ввёл в <input>
    const strNewName = document.querySelector('.popup__input_username').value;
    const strNewUserInfo = document.querySelector('.popup__input_userinfo').value;

    api.sendProfileUpdate(strNewName, strNewUserInfo) //отправляет на сервер новые имя, юзеринфо
        /* 
        Получаем данные такого вида:
        {
            "name": "Sailormoon",
            "about": "Warrior and Beauty",
            "avatar": "https://pictures.s3.yandex.net/frontend-developer/common/ava.jpg",
            "_id": "e20537ed11237f86bbb20ccb",
            "cohort": "cohort10",
        }*/
        .then((obj) => {
            userInfo.setUserInfo(obj.name, obj.about, obj.avatar);
            userInfo.updateUserInfo();
            popupEditProfile.close();
        })
        .catch(error => {
            console.error(`Ошибка при редактировании профиля: ${error}`);
        });
});