

function addHighScore(score){
	var highscores = JSON.parse(localStorage.getItem("scores")) || new Array();
	highscores.sort(Test);
	if(highscores.length >= 5){
		var lowest = highscores.shift();
		if(lowest < score){
			highscores.push(score);
		}else{
			highscores.push(lowest);
		}
	
		}else{
	
			highscores.push(score);
		}
		highscores.sort(Test);
	localStorage.setItem("scores", JSON.stringify(highscores));
}

function displayHighScores(){
		var highscores = JSON.parse(localStorage.getItem("scores"));
		console.log("type "+ typeof(highscores) );
		var parentElement = document.getElementById("scores");
		for(var i = highscores.length-1; i >= 0; i--){
			
			var item = document.createElement('li');
			item.innerHTML = highscores[i];
			parentElement.appendChild(item);
		}
		
		//});
	}


function Test(a,b)
{
    return a > b ? true : false;
}