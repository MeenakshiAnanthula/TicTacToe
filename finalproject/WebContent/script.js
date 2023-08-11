var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
var result="";

const firebaseConfig = {
		apiKey: "AIzaSyDkLtjKSXX6jXiSD0gmVyeLiwPVUP8fqKI",
		authDomain: "final-28250.firebaseapp.com",
		databaseURL: "https://final-28250.firebaseio.com",
		projectId: "final-28250",
		storageBucket: "final-28250.appspot.com",
		messagingSenderId: "883527466353",
		appId: "1:883527466353:web:5772add37a5f242e878ad0",
		measurementId: "G-H8ZES5L6SR"
	  };
//Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
	

let database;

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

//ref to cell on html page
const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		//during start of game remove all X and O s and background-color
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
	result=who;
	console.log(result);

	var database = firebase.database();
	
		// Set Value Firebase
	database.ref().update({score:result});
	 
	 /*database.ref('score').on("value", snap => {
				document.getElementById("score").innerText = snap.val();
			});*/
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return emptySquares()[0];
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}



/*function updateDB() {
	const firebaseConfig = {
		apiKey: "AIzaSyDkLtjKSXX6jXiSD0gmVyeLiwPVUP8fqKI",
		authDomain: "final-28250.firebaseapp.com",
		databaseURL: "https://final-28250.firebaseio.com",
		projectId: "final-28250",
		storageBucket: "final-28250.appspot.com",
		messagingSenderId: "883527466353",
		appId: "1:883527466353:web:5772add37a5f242e878ad0",
		measurementId: "G-H8ZES5L6SR"
	  };

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	firebase.analytics();

	var database = firebase.database();
	var r1 = result.valueOf();
	console.log(r1);
	// Set Value Firebase
    database.ref().update({
    	score:r1
    	});
    
    //firebase.database().ref('score/').set({
       // username: "Win"
     // });

	// Event Listening
	//database.ref('score').on("value", snap => {
	//	document.getElementById("score").innerText = snap.val();
	//});	
}
updateDB();*/

