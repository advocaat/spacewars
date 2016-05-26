// Generate a random colour for the asteroids / objects
function getRandomColor() {

    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {

        color += letters[Math.floor(Math.random() * 16)];

    }

    return color;

}

// Handle all keyboard input by the player
function handleInput() {

    window.onkeydown = function (e) {

        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 68) {

            if (player1.position.x < 5) {

                player1.position.x += .3;
                player2.position.x += .3;

            }

        } else if (key == 65) {

            if (player1.position.x > -5) {

                player1.position.x -= .3;
                player2.position.x -= .3;

            }

        }

        if (!selected) {

            if (key == 39) {

                myPos.x += 1;
                keepInBounds(myPos);

            } else if (key == 37) {

                myPos.x -= 1;
                keepInBounds(myPos);

            } else if (key == 40) {

                myPos.y += 1;
                keepInBounds(myPos);

            } else if (key == 38) {

                myPos.y -= 1;
                keepInBounds(myPos);

            } else if (key == 32) {

                selected = true;

            }

        } else {

            var pos = JSON.parse(JSON.stringify(myPos));
            if (key == 39) {

                myPos.x += 1;
                keepInBounds(myPos);
                switchPieces(myPos, pos);
                drawPieces();
                selected = false;

            } else if (key == 37) {

                myPos.x -= 1;
                keepInBounds(myPos);
                switchPieces(myPos, pos);
                drawPieces();
                selected = false;

            } else if (key == 40) {

                myPos.y += 1;
                keepInBounds(myPos);
                switchPieces(myPos, pos);
                drawPieces();
                selected = false;

            } else if (key == 38) {

                myPos.y -= 1;
                keepInBounds(myPos);
                switchPieces(myPos, pos);
                drawPieces();
                selected = false;

            }

        }

        if (JSON.stringify(pieces) == JSON.stringify(winPieces)) {

            console.log("Winner Winner Chicken Dinner");
            document.getElementById("messageBox").innerHTML = "<h2 class='winMsg'>You Win</h3>";
            var gameTimer = document.getElementById('timer').childNodes[0].innerHTML;
            setTimeout(function () {

                console.log("my name " + localStorage.getItem("username"));
                var myData = {};
                myData["name"] = localStorage.getItem("username");
                myData["moves"] = numMoves;
                myData["time"] = gameTimer;
                myData["level"] = level;
                socket.emit("highscore", myData);
                post(myData, "/gameWin");

            }, 2000);
        }
    }
}

// Keep the objects within the canvas
function keepInBounds(myPos) {

    if (myPos.x > level - 1) {

        myPos.x = level - 1;

    }

    if (myPos.x < 0) {

        myPos.x = 0;

    }

    if (myPos.y > level - 1) {

        myPos.y = level - 1;

    }

    if (myPos.y < 0) {

        myPos.y = 0;

    }

}

// Generate a random number between 0 and 15
var rand = function () {

    return Math.floor(Math.random() * 15);

};

// Set a cubes z axis position
function lowerZ(cube) {

    return cube.position.z += 0.1;

}

// Save game
function gameSave() {

    var obj = {};
    obj.playerName = localStorage.getItem("username");
    myPos.color = null;
    obj.playerPosition = myPos;
    obj.enemyPositions = [];
    enemyCubes.forEach(function (cube) {

        var thisCube = {

            x: cube.position.x, y: cube.position.y, z: cube.position.z, color: cube.color

        };

        obj.enemyPositions.push(thisCube);

    });

    obj.playerCurrency = 25;
    obj.playerMoves = numMoves;
    obj.playerTime = document.getElementById('timer').childNodes[0].innerHTML;
    console.log("Saving Game State" + JSON.stringify(obj));
    socket.emit("gamesave", obj);
}

// POST
function post(dictionary, url) {

    // Create the form object
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", url);

    // For each key-value pair
    for (key in dictionary) {

        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", dictionary[key]);

        // Append the newly created control to the form
        form.appendChild(hiddenField);

        // Inject the form object into the body section
        document.body.appendChild(form);
        form.submit();

    }
}