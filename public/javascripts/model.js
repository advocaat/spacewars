

function addHighScore(score, moves){
	var highscores = JSON.parse(localStorage.getItem("scores")) || new Array();
	highscores.sort(Test);

	if(highscores.length >= 5){
		var lowest = highscores.shift();
		if(lowest[0] < moves){
			highscores.push([moves, score]);
		}else{
			highscores.push(lowest);
		}
		}else{
			highscores.push([moves, score]);
		}
		//make sure its still sorted
		highscores.sort(Test);
	console.log("moves " + highscores[0][0].toString() + "times "+ highscores[0][1].toString());
	localStorage.setItem("scores", JSON.stringify(highscores));
}

function displayHighScores(){
		var highscores = JSON.parse(localStorage.getItem("scores"));
		console.log("type "+ typeof(highscores) );
		var parentElement = document.getElementById("scores");
		for(var i = highscores.length-1; i >= 0; i--){
			var item = document.createElement('li');
			item.innerHTML = "Moves " + highscores[i][0] + "<br/>" + "Time: " + highscores[i][1];
			parentElement.appendChild(item);

		}

	}


function Test(a,b)
{
    return a[0] < b[0] ? true : false;
}