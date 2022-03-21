/**
 * @typedef Client
 * @type {object}
 * @property {string} name
 * @property {number} balance
 *//*
const clientVasiliy = createClient('вася', 2500);
let bobo = [
    {
        name: 'петр',
        balance: 1488,
    },
    {
        name: 'непетр',
        balance: 2500,
    },
    {
        name: 'асетр',
        balance: 1555,
    },

]
const greenBank = createBank('GREENBANK', bobo);*//*
let provero4ka = greenBank.addClient(clientVasiliy);
provero4ka =greenBank.removeClient(bobo[1]);
provero4ka =greenBank.removeClient(clientVasiliy);
provero4ka = greenBank.addClient(bobo[1]);*//*
const notesRepository = {
    5000: 2,
    2000: 5,
    1000: 77,
    500: 3,
    200: 2,
    100: 2,
    50: 1,
    10: 6,
};

let provero4ka = createBankomat(notesRepository, greenBank);
let huet = provero4ka.setClient(clientVasiliy);
huet = provero4ka.giveMoney(2000);
huet = provero4ka.addMoney([{ 1000: 1, 500: 2 },{},{}]);
huet = provero4ka.removeClient();
huet = provero4ka.setClient(bobo[2]);
huet = provero4ka.giveMoney(2000);
huet = provero4ka.addMoney([]);
let adin = 1;*/
/**
 * @typedef Bank
 * @type {object}
 * @property {string} bankName
 * @property {Array<Client>} clients
 * @property {(client: Client) => boolean | Error} addClient
 * @property {(client: Client) => boolean | Error} removeClient
 */

const { throws } = require("assert");

/**
 * @typedef Bankomat
 * @type {object}
 * @property {Bank} bank
 * @property {{[key: string]: number}} notesRepository
 * @property {Client | undefined} currentClient
 * @property {(client: Client) => boolean} setClient
 * @property {(client: Client) => boolean} removeClient
 * @property {(notesRepository: {[key: string]: number}) => void} addMoney
 * @property {(sumToGive: number) => boolean | Error} giveMoney
 */

/**
 * @name createClient
 * @description Функция для создания клиента
 * @param {string} name Имя клиента
 * @param {number} balance Баланс клиента
 * @returns {Client} Объект клиента
 */
function createClient(name, balance = 0) {
    const invalidArguments = new Error('Ошибка ввода "createClient"')
    if (isNaN(balance) || typeof name !== 'string' || !name)
        throw invalidArguments;

    return {
        name: name,
        balance: balance,
    }
}

/**
 * @name createBank
 * @description Функция для создания банка
 * @param {bankName} name Имя банка
 * @param {Array<Client>} clients Список клиентов банка
 * @returns {Bank} Объект банка
 */
function createBank(bankName, clients = []) {
    const invalidArguments = new Error('Ошибка ввода "createBank"');
    if (typeof bankName != 'string' || !Array.isArray(clients) || !bankName)
        throw invalidArguments;

    return {
        bankName: bankName,
        clients: clients,
        addClient: function (client) {
            const invalidArguments = new Error('Ошибка ввода "addClient"');
            const weAlreadyHaveThisClient = new Error('Такой клиент уже есть 2х нам не надо');

            if (!checkClient(client))
                throw invalidArguments;
            if (!this.clients.includes(client)) {
                this.clients.push(client);
                return true;
            }

            throw weAlreadyHaveThisClient;
        },
        removeClient: function (client) {
            const invalidArguments = new Error('Ошибка ввода "removeClient"');
            const weDontHaveThisClient = new Error('Такого клиента не существует');

            if (!checkClient(client))
                throw invalidArguments;
            if (!this.clients.includes(client))
                throw weDontHaveThisClient;

            this.clients = this.clients.filter(clients => clients !== client);
            return true;
        }
    };
}
/**
 * @name createBankomat
 * @description Фукнция для создания банкомата
 * @param {{[key: string]: number}} bankNotesRepository Репозиторий валют
 * @param {Bank} bank Объект банка
 * @returns {Bankomat} Объект банкомата
 */
function createBankomat(bankNotesRepository, bank) {
    const invalidArguments = new Error('Ошибка ввода "createBankomat"');
    if (typeof bankNotesRepository != 'object' 
    || !bankNotesRepository
    || checkBank(bank))
        throw invalidArguments;
    let currentClient = undefined;
    let allBanknotes = {
        1: 5000,
        2: 2000,
        3: 1000,
        4: 500,
        5: 200,
        6: 100,
        7: 50,
        8: 10,
    };
    return {
        bank: bank,
        notesRepository: bankNotesRepository,
        currentClient: currentClient,
        setClient: function (client) {
            const AtmIsBusy = new Error('Ббанкомат занят жди очередь');
            if (this.currentClient !== undefined)
                throw AtmIsBusy;

            this.currentClient = client;
            return true;
        },
        removeClient: function () {
            this.currentClient = undefined;
            return true;
        },
        addMoney: function (...moooney) {
            const NoCustomer = new Error('Клиента нет')
            if (currentClient !== undefined)
                throw NoCustomer;
            
            for (let moneyObj of moooney) {
                for (let i in moneyObj) {
                    this.notesRepository[i] += moneyObj[i];
                    this.currentClient.balance += moneyObj[i] * i;
                };
            };
            return this.addMoney.bind(this);
        },
        giveMoney: function (moooney) {
            const NoCustomer = new Error('Клиента нет')
            if (this.currentClient === undefined)
                throw NoCustomer;
            let allMoneyInAtf = 0;
            for (let i = 1; i < 9; i++) {
                allMoneyInAtf += allBanknotes[i] * notesRepository[allBanknotes[i]];
            }
            const WeNeedMoreMoney = new Error('В банкомате недостаточно средств')
            if (allMoneyInAtf < moooney)
                throw WeNeedMoreMoney;
            const Mod10NotEqualTo0 = new Error('Сумма не кратна 10');
            if (moooney % 10 !== 0)
                throw Mod10NotEqualTo0;
            const noRequiredBanknotes = new Error('В банкомате нет нужных банкнот');

            let banknotes = {
                5000: 0,
                2000: 0,
                1000: 0,
                500: 0,
                200: 0,
                100: 0,
                50: 0,
                10: 0,
            };
            let isSumMoreThenNominals;
            let isSumMoreThenAllBanknotes;
            for (let i = 1; i < 9; i++) {
                isSumMoreThenNominals = moooney >= allBanknotes[i];
                isSumMoreThenAllBanknotes = moooney <= allBanknotes[i] * notesRepository[allBanknotes[i]];

                if (isSumMoreThenNominals)
                    if (isSumMoreThenAllBanknotes)
                        banknotes[allBanknotes[i]] = Math.floor(moooney / allBanknotes[i]);
                    else banknotes[allBanknotes[i]] = notesRepository[allBanknotes[i]];

                moooney -= banknotes[allBanknotes[i]] * allBanknotes[i];
            }
            if (moooney != 0)
                throw noRequiredBanknotes;
            for (let i = 1; i < 9; i++) {
                notesRepository[allBanknotes[i]] -= banknotes[allBanknotes[i]];
            }
            return banknotes;
        }
    };
}

module.exports = { createClient, createBank, createBankomat };

function checkClient(client) {
    return (typeof client === 'object'
        && client.hasOwnProperty('name')
        && typeof client.name === 'string'
        && client.hasOwnProperty('balance')
        && typeof client.balance === 'number');
}

function checkBank(bank) {
    return (typeof bank === 'object')
        && bank.hasOwnProperty('bankName')
        && typeof bank.bankName === 'string'
        && bank.hasOwnProperty('clients')
        && Array.isArray(bank.clients)
        && bank.hasOwnProperty('addClient')
        && typeof bank.addClient === 'function'
        && bank.hasOwnProperty('removeCLient')
        && typeof bank.removeClient === 'function';
}
