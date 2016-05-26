// When a user selects a new playing ship, swap it out
function swapShip(ship){

    var shipId = ship + ".json";
    localStorage.setItem("shipId", shipId);
    console.log("Selected ship: "+ localStorage.getItem("shipId"))

}

// Display the high-scores
function displayHighScores(scores, score) {

    var parentElement = document.getElementById("scores");
    for (var i = 0; i < scores.length; i++) {

        var item = document.createElement('li');
        if (scores[i]["userMoves"] == score["moves"] && scores[i]["userTime"] == score["time"].trim(0) && scores[i]["userName"] == score["name"]) {

            console.log("New score goes in here...");
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