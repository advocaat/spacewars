function addHighScore(name, time, moves, level) {
    // var highscores =  JSON.parse(localStorage.getItem("scores")) || new Array();
    //
    // try {
    //     highscores.sort(Test);
    // }catch(err){
    //     console.log(err);
    // }
    // if (highscores[level].length >= 5) {
    //     var lowest = highscores[level].shift();
    //     if (lowest[0] < moves) {
    //         highscores.push([moves, time, name, level]);
    //     } else {
    //         highscores.push(lowest);
    //     }
    // } else {
    //     highscores.push([moves, time, name, level]);
    // }
    // //make sure its still sorted
    // highscores.sort(Test);
    // var socket = io('http://localhost:3000');
    // socket.emit("highscore", highscore);

    // localStorage.setItem("scores", JSON.stringify(highscores));
}




function swapShip(ship){
    var shipId = ship + ".json";
    localStorage.setItem("shipId", shipId);
    console.log("nut eye "+ localStorage.getItem("shipId"))
}





function displayHighScores(scores, score) {
    //var highscores = JSON.parse(localStorage.getItem("scores"));
    //console.log("type " + typeof(scores));
    var parentElement = document.getElementById("scores");
    for (var i = 0; i < scores.length; i++) {
        var item = document.createElement('li');
        if (scores[i]["userMoves"] == score["moves"] && scores[i]["userTime"] == score["time"].trim(0) && scores[i]["userName"] == score["name"]) {
            console.log("here");
            item.innerHTML = "<p class='newScore'>Name: " + scores[i]["userName"] + "<br/>Moves: " + scores[i]["userMoves"] + "<br/>Time: " + scores[i]["userTime"] + "</p>";
        } else {
            item.innerHTML = "<p>Name: " + scores[i]["userName"] + "<br/>Moves: " + scores[i]["userMoves"] + "<br/>Time: " + scores[i]["userTime"]+ "</p>";
        }
        parentElement.appendChild(item);

    }

}


function Test(a, b) {
    return a["moves"] < b["moves"] ? true : false;
}