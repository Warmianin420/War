class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    getCardValue() {
        const values = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
        return values[this.value];
    }
}

class Deck {
    constructor(cards = []) {
        this.cards = cards;
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal(numberOfCards) {
        return this.cards.splice(0, numberOfCards);
    }

    addCards(cards) {
        this.cards.push(...cards);
    }

    drawCard() {
        return this.cards.shift();
    }

    getNumberOfCards() {
        return this.cards.length;
    }
}

class Player {
    constructor(deck, playerNumber) {
        this.deck = deck;
        this.playerNumber = playerNumber;
    }

    playCard() {
        this.removeCardBack();
        return this.deck.drawCard();
    }

    winCards(cards) {
        this.deck.addCards(cards);
    }

    outOfCards() {
        return this.deck.getNumberOfCards() === 0;
    }
    removeCardBack() {
        // Select the main card container of the player
        const cardContainer = document.getElementById(`player${this.playerNumber}MainCard`);
        // Remove the background image (card back)
        cardContainer.style.backgroundImage = 'none';
    }
}
function updateCardCount(playerOne, playerTwo) {
    // Pobierz elementy dla licznika kart obu graczy
    const playerOneCardCountElement = document.getElementById('playerOneCardCount');
    const playerTwoCardCountElement = document.getElementById('playerTwoCardCount');

    // Uaktualnij liczbę kart dla gracza pierwszego
    if (playerOneCardCountElement) {
        playerOneCardCountElement.textContent = `Gracz 1: ${playerOne.deck.getNumberOfCards()} kart`;
    } else {
        console.error('Nie znaleziono elementu dla licznika kart gracza pierwszego.');
    }

    // Uaktualnij liczbę kart dla gracza drugiego
    if (playerTwoCardCountElement) {
        playerTwoCardCountElement.textContent = `Gracz 2: ${playerTwo.deck.getNumberOfCards()} kart`;
    } else {
        console.error('Nie znaleziono elementu dla licznika kart gracza drugiego.');
    }
}


function initializeGame() {
    const suits = ['h', 'd', 'c', 's'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = new Deck();

    for (let suit of suits) {
        for (let value of values) {
            deck.cards.push(new Card(suit, value));
        }
    }
    

    deck.shuffle();

    const playerOneDeck = new Deck(deck.deal(26));
    const playerTwoDeck = new Deck(deck.deal(26));

    const playerOne = new Player(playerOneDeck, 'One');
    const playerTwo = new Player(playerTwoDeck, 'Two');
    updateCardCount(playerOne, playerTwo);
    return { playerOne, playerTwo };

}
function displayWarCards(playerOneWarCards, playerTwoWarCards) {
    // Usuwamy poprzednie karty
    const playerOneWarCardsContainer = document.getElementById('playerOneWarCards');
    const playerTwoWarCardsContainer = document.getElementById('playerTwoWarCards');
    playerOneWarCardsContainer.innerHTML = '';
    playerTwoWarCardsContainer.innerHTML = '';

    // Wyświetlamy karty wojny dla obu graczy
    playerOneWarCards.forEach((card, index) => {
        displayCard('playerOneWarCards', card, index);
    });
    playerTwoWarCards.forEach((card, index) => {
        displayCard('playerTwoWarCards', card, index);
    });
}

function war(playerOne, playerTwo, playerOneCard, playerTwoCard) {
    console.log(playerOneCard.getCardValue(), playerTwoCard.getCardValue());
    let warCards = [playerOneCard, playerTwoCard];
    console.log(warCards[0].value, warCards[1].value);
    //let saveCards =  [playerOneCard, playerTwoCard];
    const WAR_CARD_COUNT = 2;

    let playerOneWarCards = [], playerTwoWarCards = [];
    console.log("War!");
    for (let i = 0; i < WAR_CARD_COUNT; i++) {
        if (!playerOne.outOfCards()) {
            let cardOne = playerOne.playCard();
            playerOneWarCards.push(cardOne);
        }
        if (!playerTwo.outOfCards()) {
            let cardTwo = playerTwo.playCard();
            playerTwoWarCards.push(cardTwo);
        }
    }
    warCards = warCards.concat(playerOneWarCards, playerTwoWarCards);
    // Display cards for war
    displayWarCards(playerOneWarCards, playerTwoWarCards);

    // Update card count after the war cards are displayed
    updateCardCount(playerOne, playerTwo);

    // Determine the outcome of the war based on the last card played by each player
    let playerOneFinalWarCard = playerOneWarCards[playerOneWarCards.length - 1];
    let playerTwoFinalWarCard = playerTwoWarCards[playerTwoWarCards.length - 1];
    evaluateWarOutcome(playerOneFinalWarCard, playerTwoFinalWarCard, warCards, playerOne, playerTwo);
}


function displayCard(containerId, card, index) {
    let container = document.getElementById(containerId);
    if (container && card) {
        let cardElement = document.createElement('img');
        cardElement.src = getCardImageUrl(card);
        cardElement.alt = `Card: ${card.value} of ${card.suit}`;
        cardElement.classList.add('card');
        cardElement.style.position = 'absolute'; // Pozycjonowanie absolutne
        cardElement.style.top = `${index * 30}px`; // Każda następna karta jest przesunięta o 30px w dół
        container.appendChild(cardElement);
    }
}




function evaluateWarOutcome(playerOneFinalWarCard, playerTwoFinalWarCard, warCards, playerOne, playerTwo) {
    console.log("Karty do dodania:", warCards.map(card => `${card.value} of ${card.suit}`));

    if (playerOneFinalWarCard.getCardValue() > playerTwoFinalWarCard.getCardValue()) {
        playerOne.winCards(warCards);
    } else if (playerOneFinalWarCard.getCardValue() < playerTwoFinalWarCard.getCardValue()) {
        playerTwo.winCards(warCards);
    } else {
        // The war ends in a tie, continue with another war if both players have enough cards
        if (!playerOne.outOfCards() && !playerTwo.outOfCards()) {
            console.log("Kolejna wojna!");
            war(playerOne, playerTwo);
        } else {
            // If either player does not have enough cards to continue, they lose
            if (playerOne.outOfCards()) {
                console.log("Gracz 2 wygrywa wojnę i grę, ponieważ Gracz 1 nie ma więcej kart.");
                endGame('Player Two');
            } else {
                console.log("Gracz 1 wygrywa wojnę i grę, ponieważ Gracz 2 nie ma więcej kart.");
                endGame('Player One');
            }
        }
    }
    
    // Update card counts
    updateCardCount(playerOne, playerTwo);
}





function getCardImageUrl(card) {
    // Tutaj powinna znaleźć się logika przekształcania karty na adres URL obrazu
    // Przykład:
    return 'images/' + card.value + card.suit + '.png';
}

function updateCardDisplay(player, card) {
    const cardElementId = `player${player}MainCard`; // Zakładając, że używasz 'MainCard' w id
    const cardElement = document.getElementById(cardElementId);

    if (cardElement) {
        // Twój kod do aktualizacji wyświetlania karty
    } else {
        console.error(`Element o id ${cardElementId} nie został znaleziony.`);
    }
}

function endGame(winner) {
    // Wyszukujemy przycisk "Następna Runda" w dokumencie
    const nextRoundButton = document.getElementById('nextRoundButton');
    // Wyszukujemy element, w którym chcemy wyświetlić wynik
    const gameResultElement = document.getElementById('gameResult');

    // Sprawdzamy, czy przycisk istnieje
    if (nextRoundButton) {
        // Jeżeli istnieje, wyłączamy go
        nextRoundButton.disabled = true;
        // Sprawdzamy, czy element na wynik istnieje
        if (gameResultElement) {
            // Ustawiamy tekst elementu na odpowiedni komunikat
            gameResultElement.textContent = winner === 'remis' ? 
                "Gra zakończona remisem. Obaj gracze nie mają więcej kart." : 
                `Gra zakończona. Wygrywa ${winner}! Gratulacje!`;
            // Wyświetlamy element z wynikiem
            gameResultElement.style.display = 'block';
        } else {
            console.error('Element wyświetlający wynik gry nie został znaleziony.');
        }
    } else {
        console.error('Przycisk "Następna Runda" nie został znaleziony.');
    }
}

function playRound(playerOne, playerTwo) {
    const playerOneCard = playerOne.playCard();
    const playerTwoCard = playerTwo.playCard();
    if (!playerOneCard || !playerTwoCard) {
        if (!playerOneCard && !playerTwoCard) {
            endGame('remis');
        } else if (!playerOneCard) {
            endGame('Gracz drugi');
        } else {
            endGame('Gracz pierwszy');
        }
        return; // Zwróć uwagę, że tu powinno być return, aby zakończyć funkcję.
    }
    updateCardCount(playerOne, playerTwo);
    displayCard('playerOneMainCard', playerOneCard, true);
    displayCard('playerTwoMainCard', playerTwoCard, true);

    updateCardDisplay('One', playerOneCard);
    updateCardDisplay('Two', playerTwoCard);
    console.log(`Player One plays: ${playerOneCard.value} of ${playerOneCard.suit}`);
    console.log(`Player Two plays: ${playerTwoCard.value} of ${playerTwoCard.suit}`);
    console.log("VALUE GRACZA 1:" + playerOneCard.getCardValue());
    console.log("VALUE GRACZA 2:" + playerTwoCard.getCardValue());
    if (playerOneCard.getCardValue() > playerTwoCard.getCardValue()) {
        console.log("Gracz 1 wygrywa rundę");
        playerOne.winCards([playerOneCard, playerTwoCard]);
    } else     if (playerOneCard.getCardValue() < playerTwoCard.getCardValue()) {
        console.log("Gracz 2 wygrywa rundę");
        playerTwo.winCards([playerOneCard, playerTwoCard]);
    } else {
        console.log("Wojna!");
        war(playerOne, playerTwo, playerOneCard, playerTwoCard);
    }
    updateCardCount(playerOne, playerTwo); //czy potrzebne?
}

function playGame() {
    const { playerOne, playerTwo } = initializeGame();

    while (!playerOne.outOfCards() && !playerTwo.outOfCards()) {
        playRound(playerOne, playerTwo);
    }

    if (playerOne.outOfCards()) {
        console.log("Player Two wins the game!");
    } else {
        console.log("Player One wins the game!");
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    const gameState = initializeGame();

    document.getElementById('nextRound').addEventListener('click', () => {
        playRound(gameState.playerOne, gameState.playerTwo);
    });
});