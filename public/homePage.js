'use strict'

// const { response } = require("express");

// Выход из личного кабинета

const logOut = new LogoutButton();
logOut.action = () => {
    ApiConnector.logout(callback => {
        if (callback.success) {
            location.reload();
        }
    });
};

// Получение информации о пользователе

ApiConnector.current(callback => {
    if (callback.success) {
        ProfileWidget.showProfile(callback.data)
        // console.log("ok");

    };
});


// Получение текущих курсов валюты

const ratesBoard = new RatesBoard();

function currencyRequest() {
    ApiConnector.getStocks(callback => {
        if (callback.success) {
            // console.log("ok#2")
            ratesBoard.clearTable(callback.data)
            ratesBoard.fillTable(callback.data);
        }
    });

};
let timerId = setInterval(currencyRequest, 10000);

// Операции с деньгами:
// пополнение баланса

const moneyManager = new MoneyManager();


moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, callback => {
        if (callback.success) {
            ProfileWidget.showProfile(callback.data)
            moneyManager.setMessage(callback.success, `${data.amount} ${data.currency} добавлены`);

        } else {
            moneyManager.setMessage(callback.success.false, `Произошла ошибка, ${data.amount} ${data.currency} не добавлены`);

        };

    }); 
};

// конвертирование валюты

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, callback => {
        if (callback.success) {
            ProfileWidget.showProfile(callback.data)
            moneyManager.setMessage(callback.success, `Конвертирование валюты ${data.fromCurrency} в ${data.targetCurrency} произошло успешно`);

        } else {
            moneyManager.setMessage(callback.success.false, `Произошла ошибка, конвертирование ${data.fromCurrency} в ${data.targetCurrency} не произошло`);

        };
    }); 

};

// перевод валюты

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, callback => {
        if (callback.success) {
            ProfileWidget.showProfile(callback.data)
            moneyManager.setMessage(callback.success, `Перевод валюты пользователю  с id ${data.to} в сумме ${data.to} ${data.currency} произошло успешно`);

        } else {
            moneyManager.setMessage(callback.success.false, `Произошла ошибка, перевода пользователю  с id ${data.to} в сумме ${data.amount} ${data.currency} не произошло`);

        };
    });

};

// Работа с избранным:

const favoritWidget = new FavoritesWidget();

// начальный список избранного


function favoriteRequest() {
    ApiConnector.getFavorites(callback => {
        if (callback.success) {
            favoritWidget.clearTable(callback.data)
            favoritWidget.fillTable(callback.data);
            moneyManager.updateUsersList(callback.data)
        }
    });

};
// let timerIdFavorit = setInterval(favoriteRequest, 5000);
favoriteRequest();

// добавление пользователя в список избранных

favoritWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, callback => {
        if (callback.success) {
            favoritWidget.clearTable(callback.data);
            favoritWidget.fillTable(callback.data);
            moneyManager.updateUsersList(callback.data);
            favoritWidget.setMessage(callback.success, `Добавление пользователя  ${data.id} ${data.name} произошло успешно`);
        } else {
            favoritWidget.setMessage(callback.success.false, `Такой пользователь уже есть в списке`)

        };

    });


};

// удаление пользователя из избранного

favoritWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, callback =>{
        if (callback.success) {
            favoritWidget.clearTable(callback.data);
            favoritWidget.fillTable(callback.data);
            moneyManager.updateUsersList(callback.data);
            favoritWidget.setMessage(callback.success, `Удаление пользователя ${data} произошло успешно`);
        } else {
            favoritWidget.setMessage(callback.error, `Произошла ошибка, удаление пользователя ${data} не произошло`)

        };

    });
    

};