'use strict'

const logOut = new LogoutButton();
logOut.action = () => {
    ApiConnector.logout(callback => {
        if (callback.success) {
            location.reload();
        } 
    });
}

