"use strict";

const time = document.querySelector(".time");
const checkboxes = Array.from(document.querySelectorAll("input[type='checkbox']"));

const gameData = {
    startedGame: false,
    theGameIsOver: false,
    startingTime: null,
    previousCardId: null,
    currentCardId: null,
    previousCardSymbol: null,
    currentCardSymbol: null,
    numbersOfShownCards: 0,
    freeIndexesArray: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    randomSymbolsArray: ["&#9749", "&#9889", "&#9924", "&#9981", "&#9962", "&#9749", "&#9889", "&#9924", "&#9981", "&#9962"],
    getPreviousCard() { return document.querySelector(this.previousCardId); },
    getCurrentCard() { return document.querySelector(this.currentCardId); }
};

const cardSymbolPairing = {
    freeIndexes: [...gameData.freeIndexesArray],
    randomSymbols: [...gameData.randomSymbolsArray],
    pairingObj: {},
    getRandomNumber() {
        const randomNumber = this.freeIndexes[Math.floor(Math.random() * this.freeIndexes.length)];
        const index = this.freeIndexes.indexOf(randomNumber);
        this.freeIndexes.splice(index, 1);
        return randomNumber;
    },
    pairing() { this.randomSymbols.map((_item, index) => this.pairingObj[index] = this.randomSymbols[this.getRandomNumber()]); }
};

const getCardFromId = id => document.querySelector(`#${id}`);
const freezeCard = id => document.querySelector(`#${id}`).parentElement.firstElementChild.disabled = true;
const unFreezeCard = id => document.querySelector(`#${id}`).parentElement.firstElementChild.disabled = false;
const isTheCardFrozen = id => document.querySelector(`#${id}`).parentElement.firstElementChild.disabled;
const isTheCardUpsideDown = id => id ? document.querySelector(`#${id}`).parentElement.firstElementChild.checked : null;
const cardHider = id => id ? document.querySelector(`#${id}`).parentElement.firstElementChild.checked = false : null;
const cardContentRemover = id => document.querySelector(`#${id}`).textContent = "";

const setTime = () => {
    setInterval(() => {
        if (!gameData.theGameIsOver && gameData.startedGame) {
            const getTimeNow = new Date().getTime();
            let timeDiff = getTimeNow - gameData.startingTime;
            timeDiff = timeDiff / 1000;
            let seconds = Math.floor(timeDiff % 60);
            let secondsAsString = seconds < 10 ? `0${seconds}` : seconds;
            timeDiff = Math.floor(timeDiff / 60);
            let minutes = timeDiff % 60;
            let minutesAsString = minutes < 10 ? `0${minutes}` : minutes;
            let totalTime = `${minutesAsString}:${secondsAsString}`;
            time.textContent = totalTime;
        }
    }, 1000);
};

const hit = () => {
    const currentCardSymbol = gameData.currentCardSymbol;
    const previousCardSymbol = gameData.previousCardSymbol;
    const previousCardId = gameData.previousCardId;
    const currentCardId = gameData.currentCardId;
    const isPreviousCardUpsideDown = isTheCardUpsideDown(previousCardId);
    const isCurrentCardUpsideDown = isTheCardUpsideDown(currentCardId);
    return currentCardSymbol === previousCardSymbol && previousCardId !== currentCardId &&
        isPreviousCardUpsideDown && isCurrentCardUpsideDown ? true : false;
};

const getANewGame = () => {
    checkboxes.map(item => {
        const checkbox = item;
        const card = item.nextElementSibling;
        const cardId = card.getAttribute("id");
        unFreezeCard(cardId);
        checkbox.checked = false;
        card.textContent = "";
        time.textContent = "00:00";
        gameData.startedGame = false;
        gameData.theGameIsOver = false;
        gameData.numbersOfShownCards = 0;
        cardSymbolPairing.freeIndexes = [...gameData.freeIndexesArray];
        cardSymbolPairing.randomSymbols = [...gameData.randomSymbolsArray];
        cardSymbolPairing.pairing();
    });
};

cardSymbolPairing.pairing();

checkboxes.map((item, index) => {
    item.addEventListener("click", () => {
        const isShown = item.checked;
        const card = item.nextElementSibling;
        if (!gameData.startedGame && !gameData.theGameIsOver) {
            gameData.startingTime = new Date().getTime();
            setTime();
            gameData.startedGame = true;
        }
        gameData.previousCardSymbol = gameData.currentCardSymbol;
        gameData.previousCardId = gameData.currentCardId;
        isShown ? card.innerHTML = cardSymbolPairing.pairingObj[index] : card.textContent = "";
        if (isShown) {
            gameData.currentCardSymbol = card.textContent;
            gameData.currentCardId = card.getAttribute("id");
            if (hit()) {
                freezeCard(gameData.currentCardId);
                freezeCard(gameData.previousCardId);
                gameData.numbersOfShownCards = 0;
                if (checkboxes.every(item => item.checked)) {
                    gameData.theGameIsOver = true;
                    setTimeout(() => getANewGame(), 5000);
                }
                return;
            }
        }
        gameData.numbersOfShownCards++;
        if (gameData.numbersOfShownCards === 2) {
            setTimeout(() => {
                cardContentRemover(gameData.currentCardId);
                cardHider(gameData.currentCardId);
                cardContentRemover(gameData.previousCardId);
                cardHider(gameData.previousCardId);
                gameData.numbersOfShownCards = 0;
            }, 350);
        }
    });
});