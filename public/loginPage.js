'use strict'
const useForm = new UserForm();

useForm.loginFormCallback = data => {
    ApiConnector.login(data, response => {
        if (response.success) {
            document.location.reload();
        } else {
            useForm.setLoginErrorMessage(response.error);
        }
    });
};
