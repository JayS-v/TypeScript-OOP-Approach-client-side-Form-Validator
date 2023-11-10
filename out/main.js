"use strict";
class Validator {
    isNotEmpty(textInput) {
        return textInput.value.trim() !== '';
    }
    isEmail(emailInput) {
        const emailPattern = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, 'gm');
        return emailPattern.test(emailInput.value);
    }
    isChecked(checkboxInputValue) {
        return checkboxInputValue.checked;
    }
    doPasswordsMatch(confirmedPassword, password) {
        if ((confirmedPassword === null || confirmedPassword === void 0 ? void 0 : confirmedPassword.value) !== '' && (password === null || password === void 0 ? void 0 : password.value) !== '') {
            return (confirmedPassword === null || confirmedPassword === void 0 ? void 0 : confirmedPassword.value) === (password === null || password === void 0 ? void 0 : password.value);
        }
        return false;
    }
}
class MyFormValidator extends Validator {
    constructor() {
        super();
        this.errorsList = [];
    }
    clearErrorsList() {
        this.errorsList = [];
    }
    getErrorsList() {
        return this.errorsList;
    }
    realTimeValidator(input1, validationFunction, input2) {
        input1.addEventListener('input', () => {
            const validationResult = input2 === undefined ? validationFunction(input1) : validationFunction(input1, input2);
            this.alertUser(input1, validationResult);
        });
    }
    emptyInputsChecker(input) {
        let emptyField = 0;
        for (let i = 0; i < input.length; i++) {
            const eachInput = input[i];
            const validationResult = this.isNotEmpty(eachInput);
            this.alertUser(eachInput, validationResult);
            if (!this.isNotEmpty(eachInput)) {
                emptyField++;
            }
        }
        if (emptyField > 0) {
            this.errorsList.push(`${emptyField} empty required field${emptyField > 1 ? 's' : ''} remaining !`);
        }
    }
    emailChecker(input) {
        const validationResult = this.isEmail(input);
        this.alertUser(input, validationResult);
        if (!this.isEmail(input)) {
            this.errorsList.push('Valid email is mandatory');
        }
    }
    checkboxChecker(input) {
        const validationResult = this.isChecked(input);
        this.alertUser(input, validationResult);
        if (!this.isChecked(input)) {
            this.errorsList.push('Checkbox must be checked');
        }
    }
    passwordsMatcher(confirmedPassword, password) {
        const validationResult = this.doPasswordsMatch(confirmedPassword, password);
        this.alertUser(confirmedPassword, validationResult);
        if (!validationResult) {
            this.errorsList.push('Passwords do not match!');
        }
    }
    alertUser(input, validationResult) {
        const inputName = input.dataset.inputName;
        const errorMessage = this.getErrorMessage(inputName, validationResult);
        this.displayErrorMessage(input, errorMessage, validationResult);
        this.setStyle(input, validationResult);
    }
    getErrorMessage(inputName, validationResult) {
        if (!validationResult) {
            switch (inputName) {
                case 'email':
                    return 'A valid email is required';
                case 'agreement checkbox':
                    return 'Please check the agreement box to proceed';
                case 'confirmed password':
                    return 'passwords do not match';
                default:
                    return `${inputName} is required`;
            }
        }
        return '';
    }
    setStyle(input, validationResult) {
        input.style.border = validationResult ? '2px solid #ccc' : '2px solid red';
    }
    displayErrorMessage(input, message, validationResult) {
        var _a, _b, _c;
        const errorDiv = (_a = input.parentNode) === null || _a === void 0 ? void 0 : _a.querySelector('.error-message');
        if (!validationResult && !errorDiv) {
            const newErrorDiv = document.createElement('div');
            newErrorDiv.textContent = message;
            newErrorDiv.classList.add('error-message');
            (_b = input.parentNode) === null || _b === void 0 ? void 0 : _b.appendChild(newErrorDiv);
        }
        else if (!validationResult && errorDiv) {
            errorDiv.textContent = message;
        }
        else if (validationResult && errorDiv) {
            (_c = input.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(errorDiv);
        }
    }
}
const form = document.getElementById('form');
const requiredInputs = document.querySelectorAll('.required-inputs');
const emailInput = document.getElementById('email');
const agreementCheckbox = document.querySelector('.agreement-checkbox-input');
const password = document.getElementById('password');
const confirmedPassword = document.getElementById('confirmed_password');
const validator = new MyFormValidator();
requiredInputs.forEach((input) => validator.realTimeValidator(input, validator.isNotEmpty));
validator.realTimeValidator(emailInput, validator.isEmail);
validator.realTimeValidator(agreementCheckbox, validator.isChecked);
validator.realTimeValidator(confirmedPassword, validator.doPasswordsMatch, password);
password.addEventListener('input', () => {
    confirmedPassword.value = '';
});
const onSubmitValidation = () => {
    validator.clearErrorsList();
    validator.emptyInputsChecker(Array.from(requiredInputs));
    validator.emailChecker(emailInput);
    validator.checkboxChecker(agreementCheckbox);
    validator.passwordsMatcher(confirmedPassword, password);
    const errorsList = validator.getErrorsList();
    if (errorsList.length === 0) {
        return true;
    }
    alert(errorsList.join('\n'));
    return false;
};
document.addEventListener('DOMContentLoaded', () => form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const value = Object.fromEntries(formData.entries());
    const jsonData = JSON.stringify(value, null, '  ');
    const formIsValidated = onSubmitValidation();
    if (formIsValidated) {
        alert('Your form was successfully submitted. Thank you ! ');
        form.reset();
        console.log(jsonData);
        return jsonData;
    }
}));
//# sourceMappingURL=main.js.map