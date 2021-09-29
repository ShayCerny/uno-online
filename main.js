var players = [
  (player1 = {
    name: "player1",
    hand: [],
  }),
  (player2 = {
    name: "player2",
    hand: [],
  }),
  (player3 = {
    name: "player3",
    hand: [],
  }),
  (player4 = {
    name: "player4",
    hand: [],
  }),
];
var deck = [];
var playedCards = [];
var currentPlayer = "player1";
var nextPlayer = "";
var reverse = false;

// Card object construtor
function Card(type, color, number, imagePath) {
  this.type = type;
  this.color = color;
  this.number = number;
  this.imagePath = imagePath;
}

// Finds next player
function findNext() {
  console.log(players);
  // checks if play is reversed
  if (reverse == false) {
    // uses the name of the current player to find the index
    var currentIndex = players.findIndex(
      (player) => player.name == currentPlayer
    );
    //   if the current player is not player 4
    // increase the index by one and use the next player
    if (currentIndex != 3) {
      nextPlayer = players[currentIndex + 1].name;
    } else {
      //   if the current player is player 4 then set the next player to
      //player 1
      nextPlayer = "player1";
    }
  } else {
    //   if play is reversed do the reverse of above
    // uses the name of the current player to find the index
    var currentIndex = players.findIndex(
      (player) => player.name == currentPlayer
    );
    //   if the current player is not player 4
    // increase the index by one and use the next player
    if (currentIndex != 0) {
      nextPlayer = players[currentIndex - 1].name;
    } else {
      //   if the current player is player 4 then set the next player to
      //player 1
      nextPlayer = "player4";
    }
  }
}

// Creates, shuffles, deals, and flips the top card
function setUp() {
  const colors = ["red", "blue", "green", "yellow"];
  const actions = ["skip", "draw2", "reverse"];
  const wild = ["draw4", "wild"];

  colors.forEach((color) => {
    //   creates two of each 0-9 for each color
    for (let i = 0; i <= 9; i++) {
      for (let p = 0; p < 2; p++) {
        var path = "/images/cards/regular/" + color + "/" + i + ".png";
        var card = new Card("regular", color, i, path);
        deck.push(card);
      }
    }
    // creates 2 of each action card for each color
    actions.forEach((action) => {
      for (let i = 0; i < 2; i++) {
        var path = "/images/cards/action/" + color + "/" + action + ".png";
        var card = new Card(action, color, 0, path);
        deck.push(card);
      }
    });
  });
  //   Creates 4 of each wild card
  wild.forEach((type) => {
    for (let i = 0; i < 4; i++) {
      var path = "/images/cards/wild/" + type + ".png";
      var card = new Card(type, "black", 0, path);
      deck.push(card);
    }
  });
  //   shuffle function
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  //   deals 10 cards to each player
  players.forEach((player) => {
    for (let i = 0; i < 10; i++) {
      var dealtCard = deck.pop();
      player.hand.push(dealtCard);
    }
  });
  //   flips the top card and puts it in the played cards pile
  var flipped = deck.pop();
  playedCards.push(flipped);
  $("#piles").append(`
  <img src="${flipped.imagePath}" 
  alt="" id="played">`);
  // calls the display function to show the player hands
  display();
}

function display() {
  // clears computers hands displayed

  // cycles through each player if player is player1 then it will display
  //cards face up, if not then it will display them face down
  players.forEach((player) => {
    $("#" + player.name).html("");
    if (player.name == "player1") {
      for (let i = 0; i < player.hand.length; i++) {
        const card = player.hand[i];
        $("#player1").append(
          `<img class='card' 
          onclick="play('player1', '${i}')"
           src='${card.imagePath}' 
           alt=''>`
        );
      }
    } else {
      for (let i = 0; i < player.hand.length; i++) {
        $("#" + player.name).append(
          `<img class='card' src='/images/cards/back.png' alt=''>`
        );
      }
    }
  });
}

// play function
function play(person, index) {
  // if last card played wasnt wild set selected color to last color played
  if (
    playedCards[playedCards.length - 1].type != "wild" ||
    playedCards[playedCards.length - 1].type != "draw4"
  ) {
    selectedColor = playedCards[playedCards.length - 1].color;
  }
  // checks to see if its your turn to play
  if (currentPlayer == person) {
    // Goes to your hand and checks if the card you are trying to play can
    //be played
    var player = players.find((player) => player.name == person);
    var playedCard = player.hand[index];
    if (
      playedCard.color == playedCards[playedCards.length - 1].color ||
      playedCard.number == playedCards[playedCards.length - 1].number ||
      playedCard.color == "black" ||
      playedCard.color == selectedColor
    ) {
      // checks the type of card for any special actions
      if (playedCard.type == "skip") {
        // if the card is a skip the next player will be skipped
      } else if (playedCard.type == "draw2") {
        // if the card is a draw2 the next player will have 2 cards added
      } else if (playedCard.type == "reverse") {
        // if card is a reverse it will switch the state of the global
      } else if (playedCard.type == "draw4") {
        // if the card is a draw4 the next player will have 4 cards added
        // and be asked to select a color
      } else if (playedCard.type == "wild") {
        // if the card is a wild then the player will be promted to
        //   select a color
      }
      // takes the card from your hand and adds it to the played cards
      var played = player.hand.splice(index, 1);
      playedCards.push(played[0]);
      $("#played").replaceWith(
        `<img src="${played[0].imagePath}" 
        alt="" id="played">`
      );
      //   refreshes the display
      display();
      //   finds the next player
      findNext();
      // sets the current player to the next player
      currentPlayer = nextPlayer;
      // if the current player is not player1 then it will call computer turn
      if (currentPlayer != "player1") {
        computerTurn();
      }
    }
  }
}

// draw a card
function draw(person) {
  // check if its the current players turn
  if (currentPlayer == person) {
    // take the top card from the deck and add it to current player hand
    var newCard = deck.pop();
    var player = players.find((player) => player.name == person);
    player.hand.push(newCard);
    // refreshes display
    display();
    //   finds the next player
    findNext();
    // sets the current player to the next player
    currentPlayer = nextPlayer;
    console.log(currentPlayer + " is current player");
    // if the current player is not player1 then it will call computer turn
    if (currentPlayer != "player1") {
      computerTurn();
    }
  }
}

// computer find functions
const isSameColor = (card) =>
  card.color == playedCards[playedCards.length - 1].color &&
  card.type == "regular";
const isSameNumber = (card) =>
  card.number == playedCards[playedCards.length - 1].number &&
  card.type == "regular";
const isSpecial = (card) =>
  card.type != "regular" &&
  card.color == playedCards[playedCards.length - 1].color;
const isBlackCard = (card) => card.color != "black";

// computer turn
function computerTurn() {
  // gets the computers hand
  var computerHand = players.find(
    (player) => player.name == currentPlayer
  ).hand;
  var lessThanFive = false;
  var cardIndex;
  // check how many cards each player has
  players.forEach((player) => {
    if (player.hand.length < 5) {
      lessThanFive = true;
    }
  });
  // if a player has less than 5 cards prioritize action or wild cards
  if (lessThanFive == true) {
    // check through the deck for a playable card
    cardIndex = computerHand.findIndex(isBlackCard || isSpecial);
    // if there isnt a black card then find a regular card
    if (cardIndex == -1) {
      cardIndex = computerHand.findIndex(isSameNumber || isSameColor);
    }
  } else {
    // check through the deck for a playable card
    cardIndex = computerHand.findIndex(isSameNumber || isSameColor);
  }
  // if card found play the card
  if (cardIndex != -1) {
    console.log(
      "computer played a " +
        computerHand[cardIndex].color +
        " " +
        computerHand[cardIndex].number
    );
    play(currentPlayer, cardIndex);
  } else {
    // if no card is found then draw
    console.log("computer drew a card");
    draw(currentPlayer);
  }
}

setUp();
console.log(players);
