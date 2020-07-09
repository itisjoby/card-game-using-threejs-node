let dealer = 1;
let dealer_neighbour = 2;
let active_players = 0;
let current_round = "1";

function startGame(username) {
  //every player get 2 cards none shown to others

  deliverPlayerCards(username);

  //dealer puts itial coin
  //getInitialDeposit();

  //getPlayerDecisions();

  //roundOne();
  //first 3 cards revealed
  //getPlayerDecisions();
  //if the cards match levles shown to player
  //roundTwo();
  //4th card revealed
  //getPlayerDecisions();
  // roundThree();
  //last card revealed
  // getPlayerDecisions();
  //guy after dealer get the options and once everyy cycle the cardes are shown
  // pickWinner();
  //once final round the winner is declared
  // deliverPrice();
}

function deliverPlayerCards(player) {
  $.post("http://localhost:3000/deliverPlayerCards", {
    table_id: "5dbb31d501c64629104786c3",
    seat_id: "5dbb31d501c64629104786c6"
  });
}
