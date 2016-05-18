function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

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
            document.getElementById("messageBox").innerHTML = "<h2>You Win</h3>";
            var gameTimer = document.getElementById('timer').childNodes[0].innerHTML;
            setTimeout(function () {
                console.log("my name "+ localStorage.getItem("username"));
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

var rand = function () {
    return Math.floor(Math.random() * 15)
};

function lowerZ(cube) {
    return cube.position.z += 0.1;
}

function gameSave() {
    var obj = {}
    obj.playerName = localStorage.getItem("username");
    myPos.color = null;
    obj.playerPosition = myPos;
    obj.enemyPositions = [];
    enemyCubes.forEach(function (cube) {
        var thisCube = {x: cube.position.x, y: cube.position.y, z: cube.position.z, color: cube.color}
        //console.log("COLOR: "+ JSON.stringify(cube));
        obj.enemyPositions.push(thisCube);
    });
    obj.playerCurrency = 25;
    obj.playerMoves = numMoves;
    obj.playerTime = document.getElementById('timer').childNodes[0].innerHTML;
    console.log("Saving Game State");
    socket.emit("gamesave", obj);
}

function post(dictionary, url) {
    // Create the form object
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", url);
    // For each key-value pair
    for (key in dictionary) {
        //alert('key: ' + key + ', value:' + dictionary[key]); // debug
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", dictionary[key]);
        // append the newly created control to the form
        form.appendChild(hiddenField);
        document.body.appendChild(form); // inject the form object into the body section
        form.submit();
    }
}

//TODO: Might could use this here mouse functionality for something else later
//     function getMousePos(canvas, evt) {
//         var rect = canvas.getBoundingClientRect();
//         return {
//             x: evt.clientX - rect.left,
//             y: evt.clientY - rect.top
//         };
//     }
//    var mousePos = {x:0, y:0};
//    canvee.addEventListener('mouseover', function(evt) {
//    	 mousePos = getMousePos(canvee, evt);
//    	getPos();
//    	var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
//    	console.log(message);
//    }, false);
//
//    canvee.addEventListener('click', function(evt) {
//    	var pos = JSON.parse(JSON.stringify(myPos));
//    	mousePos = getMousePos(canvee, evt);
//    	getPos(canvee, evt);
//    	switchPieces(pos, myPos);
//    	drawPieces();
//
//
//    })
//     function getPos() {
//         for (var i = 0; i < 3; i++) {
//             if (mousePos.x > pieceWidth * i && mousePos.x < pieceWidth * (i + 1)) {
//                 myPos.x = i;
//             }
//             if (mousePos.y > pieceHeight * i && mousePos.y < pieceHeight * (i + 1)) {
//                 myPos.y = i;
//             }
//         }
//         console.log("position " + myPos.x + myPos.y);
//     }

