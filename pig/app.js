/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
firstOrientationCheck();

function firstOrientationCheck() {
  if (window.innerHeight > window.innerWidth) {
    //portrait mode:
    document.querySelector(".orientationCover").style.display = "block";
  } else {
    ///horizontal mode:
    document.querySelector(".orientationCover").style.display = "none";
  }
}

window.addEventListener("orientationchange", checkOrientation);

function checkOrientation() {
  if (window.innerHeight < window.innerWidth) {
    document.querySelector(".orientationCover").style.display = "block";
  } else {
    document.querySelector(".orientationCover").style.display = "none";
  }
}

var scores, roundScore, activePlayer, dice, gamePlaying;

resetGame();

document
  .querySelector(".btn-roll")
  .addEventListener("click", async function () {
    if (gamePlaying) {
      var dice1DOM = document.querySelector(".dice1");
      var dice2DOM = document.querySelector(".dice2");
      dice1DOM.style.display = "block";
      dice2DOM.style.display = "block";
      document.querySelector(".btn-roll").style.display = "none";
      document.querySelector(".btn-hold").style.display = "none";
      await rollDices();
      document.querySelector(".btn-roll").style.display = "block";
      document.querySelector(".btn-hold").style.display = "block";
      var dice1 = Math.floor(Math.random() * 6) + 1;
      var dice2 = Math.floor(Math.random() * 6) + 1;
      dice1DOM.src = "dice-" + dice1 + ".png";
      dice2DOM.src = "dice-" + dice2 + ".png";
      if (dice1 !== 1 && dice2 !== 1) {
        //add score
        roundScore += dice1 + dice2;
        document.querySelector(
          "#current-" + activePlayer
        ).textContent = roundScore;
      } else {
        document.querySelector(".btn-hold").style.display = "none";
        document.querySelector(".btn-roll").style.display = "none";
        document.querySelector(".btn-pass").style.display = "block";
      }
    }
  });

document.querySelector(".btn-pass").addEventListener("click", nextPlayer);

document.querySelector(".btn-hold").addEventListener("click", function () {
  if (gamePlaying) {
    if (document.getElementById("winningInput").value == "") {
      alert("Please enter a winning value in the box!");
      return;
    }
    // Add current score to global score
    scores[activePlayer] += roundScore;

    // Update UI
    document.querySelector("#score-" + activePlayer).textContent =
      scores[activePlayer];
    // check if player won the game

    var x = document.getElementById("winningInput").value;
    if (scores[activePlayer] >= x) {
      document.getElementById("name-" + activePlayer).textContent = "winner";
      document.querySelector(".dice1").style.display = "none";
      document.querySelector(".dice2").style.display = "none";
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");
      document.querySelector(".btn-roll").style.display = "none";
      document.querySelector(".btn-hold").style.display = "none";
      gamePlaying = false;
    } else {
      nextPlayer();
    }
  }
});

function rollDices() {
  return new Promise((resolve) => {
    for (var i = 0; i < 30; i++) {
      setTimeout(function () {
        document.querySelector(".dice1").src =
          "dice-" + (Math.floor(Math.random() * 6) + 1) + ".png";
        document.querySelector(".dice2").src =
          "dice-" + (Math.floor(Math.random() * 6) + 1) + ".png";
      }, 50 * i);
    }
    setTimeout(resolve, 1450);
  });
}

function nextPlayer() {
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
  roundScore = 0;
  document.querySelector(".btn-hold").style.display = "block";
  document.querySelector(".btn-roll").style.display = "block";
  document.querySelector(".btn-pass").style.display = "none";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");

  document.querySelector(".dice1").style.display = "none";
  document.querySelector(".dice2").style.display = "none";
}

document.querySelector(".btn-new").addEventListener("click", resetGame);

function resetGame() {
  scores = [0, 0];
  activePlayer = 0;
  roundScore = 0;
  gamePlaying = true;
  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";
  document.querySelector(".dice1").style.display = "none";
  document.querySelector(".dice2").style.display = "none";
  document.getElementById("name-0").textContent = "Player 1";
  document.getElementById("name-1").textContent = "Player 2";
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");
  document.querySelector(".btn-roll").style.display = "block";
  document.querySelector(".btn-hold").style.display = "block";
  document.querySelector(".btn-pass").style.display = "none";
}

function closeAll() {
  document.querySelector(".settingsMenu").classList.remove("slideIn");
  document.querySelector(".settingsBox").classList.remove("stayPlace");
  document.querySelector(".rulePage").classList.remove("vis");
  document.querySelector(".rulesBox").classList.remove("stayPlace2");
}
