//Класс для валидации полей любой формы.

export class FormValidator {
    constructor(form) {
        this.form = form;

        this.formInputs = [...this.form.querySelectorAll('input')]; //массив со всеми инпутами формы
        this.submitButton = this.form.querySelector('button');

        //эти два метода могут быть переданы в экземпляры Popup, чтобы автоматически либо активировать, либо дезактивировать кнопку сабмита формы при открытии попапа, содержащего эту форму. Передавать методы в Popup не обязательно.
        this.activateSumbitButton = this._activateSumbitButton.bind(this);
        this.desactivateSubmitButton = this._desactivateSubmitButton.bind(this);

        this._setEventListeners();
    }

    // это метод валидирует текущий инпут формы. Метод показывает ошибку, если инпут не проходит валидацию. Если проходит — скрывает ошибку.
    сheckInputValidity(input) {
        const errorElement = input.nextElementSibling; //это элемент с текстом ошибки, соответствующей текущему валидируему инпуту. В данном проекте элемент для текста ошибки - это следующий элемент после элемента инпута. Поэтому метод .nextElementSibling должен работать без сбоев.

        const validityMessages = {
            missingValue: 'Это обязательное поле',
            lengthIsWrong: 'Должно быть от 2 до 30 символов',
            needLink: 'Здесь должна быть ссылка',
            valid: ''
        };

        //проверяет инпут: как именно он не проходит валидацию? Отображает соответствующее сообщение об ошибке валидации, либо убирает сообщение об ошибке, если инпут валиден
        if (input.value.length === 0) { //если хотя бы один из элементов формы пустой, у него установится соответствующее сообщение об ошибке
            errorElement.textContent = validityMessages.missingValue;
        }

        if (input.validity.typeMismatch) { //если в инпуте для ссылки не ссылка
            errorElement.textContent = validityMessages.needLink;
        }

        if (input.validity.tooShort || input.validity.tooLong) { //если в текстовом инпуте <2 или >30 символов
            errorElement.textContent = validityMessages.lengthIsWrong;
        }

        if (input.validity.valid) { // если инпут валиден
            errorElement.textContent = validityMessages.valid;
        }
    }

    //два нижеследующие метода обязательно нужны в забинденном виде, т.к. они передаются в экземпляры класса Popup
    _activateSumbitButton() {
        this.submitButton.removeAttribute('disabled', true);
        this.submitButton.classList.remove('popup-button_disabled');
        this.submitButton.classList.add('popup-button_active');
    }

    _desactivateSubmitButton() {
        this.submitButton.setAttribute('disabled', true);
        this.submitButton.classList.add('popup-button_disabled');
        this.submitButton.classList.remove('popup-button_active');
    }


    // делает кнопку сабмита активной или неактивной. Состояние кнопки сабмита зависит от того, прошли все поля валидацию или нет. Этот метод должен вызываться при любом изменении данных формы. Если поля в порядке, кнопка становится активной. Если хотя бы одно из полей не прошло валидацию, кнопка станет неактивной.
    setSubmitButtonState() {

        const arrayOfFlags = []; //сюда будут записаны true и false по количеству инпутов, проверенных на валиднсоть

        this.formInputs.forEach(function(input) {
            arrayOfFlags.push(input.validity.valid);
        }); // добавляет в массив arrayOfFlags true и false по результатам проверки валидноти каждого инпута

        const formIsValid = arrayOfFlags.reduce((accumulator, current) => accumulator && current, true); //если в массиве есть хотя бы один false, вернёт false. То есть, если хотя бы один инпут формы не прошёл валидацию, вернёт false. Иначе true.
        //Это ещё можно сделать через Array.prototype.every: inputDomElements.every(input => input.validity.valid) --- Метод every() проверяет, удовлетворяют ли все элементы массива условию, заданному в передаваемой функции

        if (formIsValid) {
            this._activateSumbitButton();
        } else {
            this._desactivateSubmitButton();
        }
    }

    // вешает обработчик для валидации на каждый инпут.
    _setEventListeners() {

        const validateForm = (event) => {
            //проверяет валидность  инпута и отображает/убирает сообщение об ошибке
            this.сheckInputValidity(event.target);
            //выставляет валидность кнопки в зависимости от того, валидны ли все инпуты или нет
            this.setSubmitButtonState();
        };

        this.formInputs.forEach(function(inputElement) {
            inputElement.addEventListener('input', validateForm);
        });
    }
}