//Класс для работы с данными пользователя. Экземпляр этого класса должен хранить в себе данные пользователя: имя и информацию о себе, а также отображать эту информацию на странице.

class UserInfo {
    constructor(nameElement, userInfoElement, avatarElement) { //принимает DOM-элементы
        this.nameElement = nameElement;
        this.userInfoElement = userInfoElement;
        this.avatarElement = avatarElement;
        this.myID = "";

        this.name = ''; //свойство хранит в себе значение (строку)
        this.userInfo = ''; //свойство хранит в себе значение  (строку)
        this.avatarLink = ''; // свойство хранит в себе ссылку на .jpg  (строку)
    }

    //обновляет данные внутри экземпляра класса;
    setUserInfo(newName, newUserInfo, imgLink, id) { // принимает значение инпутов при сабмите формы
        this.name = newName;
        this.userInfo = newUserInfo;
        this.avatarLink = imgLink;
        this.myID = id;
    }

    updateUserInfo() { // вставляет данные из переменных на страницу.
        this.nameElement.textContent = this.name;
        this.userInfoElement.textContent = this.userInfo;
        this.avatarElement.setAttribute('style', `background-image: url(${this.avatarLink})`); // Не уверена, куда красивее класть ссылку: в атрибуты тэга или в свойство css. В требованиях к проекту это не оговаривается
    }
}

/*
Цитата из требований к проекту:

Логичный вопрос: почему не объединить эти методы в один, который бы обновлял данные и затем выводил на экран?
Первая причина — принцип разделения ответственности. Лучше, чтобы каждый метод отвечал за небольшую часть функциональности.
Вторая причина станет понятна в следующем спринте, — когда мы подключим проект к серверу. Тогда, чтобы обновить данные, сначала нужно будет отправить запрос на сервер, дождаться ответа и только после этого обновить DOM. Поэтому лучше сразу вынести обновление DOM в отдельную функцию.

*/