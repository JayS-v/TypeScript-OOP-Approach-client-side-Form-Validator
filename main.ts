class Validator {
    isNotEmpty(textInput: HTMLInputElement): boolean {
        return textInput.value.trim() !== '';
    }

    isEmail(emailInput: HTMLInputElement): boolean {
        const emailPattern = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, 'gm');
        return emailPattern.test(emailInput.value);
    }

    isChecked(checkboxInputValue: HTMLInputElement): boolean {
        return checkboxInputValue.checked;
    }

    doPasswordsMatch(confirmedPassword: HTMLInputElement | undefined, password: HTMLInputElement | undefined): boolean {
        if (confirmedPassword?.value !== '' && password?.value !== '') {
            return confirmedPassword?.value === password?.value;
        }
        return false;
    }
}

class MyFormValidator extends Validator {
    private errorsList: string[];

    constructor() {
        super();
        this.errorsList = [];
    }

    clearErrorsList(): void {
        this.errorsList = [];
    }

    getErrorsList(): string[] {
        return this.errorsList;
    }

    realTimeValidator(
            input1: HTMLInputElement, 
            validationFunction: (input1: HTMLInputElement, input2?: HTMLInputElement | undefined) => boolean, 
            input2?: HTMLInputElement): void {
        input1.addEventListener('input', () => {
            const validationResult = input2 === undefined ? validationFunction(input1) : validationFunction(input1, input2);
            this.alertUser(input1, validationResult);
        });
    }

    emptyInputsChecker(input: HTMLInputElement[]): void {
        let emptyField = 0;

        for (let i = 0; i < input.length; i++) {
            const eachInput = input[i];
            const validationResult = this.isNotEmpty(eachInput);
            this.alertUser(eachInput, validationResult)

            if (!this.isNotEmpty(eachInput)) {
                emptyField++;
            }
        }

        if (emptyField > 0) {
            this.errorsList.push(`${emptyField} empty required field${emptyField > 1 ? 's' : ''} remaining !`);
        }
    }

    emailChecker(input: HTMLInputElement): void {
        const validationResult = this.isEmail(input);
        this.alertUser(input, validationResult);

        if (!this.isEmail(input)) {
            this.errorsList.push('Valid email is mandatory');
        }
    }

    checkboxChecker(input: HTMLInputElement): void {
        const validationResult = this.isChecked(input);
        this.alertUser(input, validationResult);

        if (!this.isChecked(input)) {
            this.errorsList.push('Checkbox must be checked');
        }
    }

    passwordsMatcher(confirmedPassword: HTMLInputElement, password: HTMLInputElement): void {
        const validationResult = this.doPasswordsMatch(confirmedPassword, password);
        this.alertUser(confirmedPassword, validationResult);

        if (!validationResult) {
            this.errorsList.push('Passwords do not match!');
        }
    }

    alertUser(input: HTMLInputElement, validationResult: boolean): void {
        const inputName = input.dataset.inputName;
        const errorMessage = this.getErrorMessage(inputName, validationResult);

        this.displayErrorMessage(input, errorMessage, validationResult);
        this.setStyle(input, validationResult);
    }

    getErrorMessage(inputName: string | undefined, validationResult: boolean): string {
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

    setStyle(input: HTMLInputElement, validationResult: boolean): void {
        input.style.border = validationResult ? '2px solid #ccc' : '2px solid red';
    }

    displayErrorMessage(input: HTMLInputElement, message: string, validationResult: boolean): void {
        const errorDiv = input.parentNode?.querySelector('.error-message') as HTMLElement | null;

        if (!validationResult && !errorDiv) {
            const newErrorDiv = document.createElement('div');
            newErrorDiv.textContent = message;
            newErrorDiv.classList.add('error-message');
            input.parentNode?.appendChild(newErrorDiv);
        } else if (!validationResult && errorDiv) {
            errorDiv.textContent = message;
        } else if (validationResult && errorDiv) {
            input.parentNode?.removeChild(errorDiv);
        }
    }
}


const form = document.getElementById('form') as HTMLFormElement;
const requiredInputs = document.querySelectorAll('.required-inputs') as NodeListOf<HTMLInputElement>;
const emailInput = document.getElementById('email') as HTMLInputElement;
const agreementCheckbox = document.querySelector('.agreement-checkbox-input') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;
const confirmedPassword = document.getElementById('confirmed_password') as HTMLInputElement;

const validator = new MyFormValidator();

requiredInputs.forEach((input) => validator.realTimeValidator(input, validator.isNotEmpty));
validator.realTimeValidator(emailInput, validator.isEmail);
validator.realTimeValidator(agreementCheckbox, validator.isChecked);
validator.realTimeValidator(confirmedPassword, validator.doPasswordsMatch, password);

password.addEventListener('input', () => {
    confirmedPassword.value = '';
});

const onSubmitValidation = ():boolean => {
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

  

document.addEventListener('DOMContentLoaded', () =>
    form.addEventListener('submit', (event) => {

        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const value = Object.fromEntries(formData.entries());
        const jsonData = JSON.stringify(value, null, '  ');

        const formIsValidated = onSubmitValidation();

        if (formIsValidated) {
            alert('Your form was successfully submitted. Thank you ! ');
            form.reset();
            console.log(jsonData);
            return jsonData;
        }
    })
);