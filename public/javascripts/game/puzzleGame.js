// Set win pieces
function setWinPieces() {

    for (var i = 0; i < pieces.length; i++) {

        winPieces[i] = JSON.parse(JSON.stringify(pieces[i]));

    }
}

// Draw the graph
function drawGraph() {

    // Display the time
    function displayTime() {

        var timeElement = document.getElementById("timer");
        var movesElement = document.getElementById("moves");
        beginTimer();
        setInterval(function () {

            timeElement.innerHTML = "<p>" + ((( new Date().getTime() - (startTime.getTime() + removedTime))) / 1000.0).toFixed(2).toString() + "</p>";
            movesElement.innerHTML = "<p> Moves:" + numMoves + "</p><br/>"
            return myTime;

        });

    }

    // Start the timer
    function beginTimer() {

        if (firstTime === true) {

            startTime = new Date();
            firstTime = false;

        }
    }

    var firstTime = true;
    var myTime;
    var startTime;
    img.onload = function () {

        displayTime();
        drawPieces();

    };

    img.src = get2d();

}

// Draw the game pieces
function drawPieces() {

    var i = 0;
    for (var y = 0; y < rows; y++) {

        for (var x = 0; x < cols; x++) {

            var p = pieces[i++];
            context.drawImage(
                // From the original image
                img,
                // Take the next x and y piece
                x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight,
                // Draw it on the canvas based on the shuffled pieces[] array
                p.col * pieceWidth, p.row * pieceHeight, pieceWidth, pieceHeight
            );
        }
    }
}

// Set the grid background colour
function strokeGrid() {

    context.strokeStyle = "cornflowerblue";
    for (var i = 0; i < level; i++) {

        for (var j = 0; j < level; j++) {

            context.strokeRect(pieceWidth * i, pieceHeight * j, pieceWidth, pieceHeight);

        }
    }
}

// Clean the grid
function cleanGrid() {

    context.fillStyle = "rgba(255,255,255,0.0)";
    for (var i = 0; i < level; i++) {

        for (var j = 0; j < level; j++) {

            context.fillRect(pieceWidth * i, pieceHeight * j, pieceWidth, pieceHeight);

        }
    }
}

// Highlight a score if it enter the leaderboard on win
function highlightSelected(position) {

    context.lineWidth = 4;
    context.fillStyle = "rgba(255,0,0,.2)";
    context.strokeStyle = "red";
    context.strokeRect(pieceWidth * position.x, pieceHeight * position.y, pieceWidth, pieceHeight);
    context.fillRect(pieceWidth * position.x, pieceHeight * position.y, pieceWidth, pieceHeight);
    context.lineWidth = 2;

}

// Highlight appropriate neighbours
function highlightNeighbours(position) {

    context.fillStyle = "rgba(255,255,0,.2)";
    context.strokeStyle = "yellow";
    context.strokeRect(pieceWidth * (position.x + 1), pieceHeight * (position.y), pieceWidth, pieceHeight);
    context.fillRect(pieceWidth * (position.x + 1), pieceHeight * (position.y), pieceWidth, pieceHeight);
    context.strokeRect(pieceWidth * (position.x - 1), pieceHeight * (position.y), pieceWidth, pieceHeight);
    context.fillRect(pieceWidth * (position.x - 1), pieceHeight * (position.y), pieceWidth, pieceHeight);
    context.strokeRect(pieceWidth * (position.x), pieceHeight * (position.y + 1), pieceWidth, pieceHeight);
    context.fillRect(pieceWidth * (position.x), pieceHeight * (position.y + 1), pieceWidth, pieceHeight);
    context.strokeRect(pieceWidth * (position.x), pieceHeight * (position.y - 1), pieceWidth, pieceHeight);
    context.fillRect(pieceWidth * (position.x), pieceHeight * (position.y - 1), pieceWidth, pieceHeight);

}

// Shuffle
function shuffle(a) {

    for (var j, x, i = a.length; i; j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);

    return a;

}

// Switch the pieces
function switchPieces(pos, other) {

    var done = false;
    var notSecondThrough = true;
    pieces.forEach(function (piece) {

        if (done) {

            return false;

        }

        if (piece.col == pos.x && piece.row == pos.y) {

            pieces.forEach(function (otherPiece) {

                if (otherPiece.col == other.x && otherPiece.row == other.y && notSecondThrough) {

                    otherPiece.col = pos.x;
                    otherPiece.row = pos.y;
                    piece.col = other.x;
                    piece.row = other.y;
                    console.log("Moved " + piece.col + " - " + piece.row + " to " + otherPiece.col + " - " + otherPiece.row);
                    notSecondThrough = false;
                    numMoves++;
                    done = true;

                }
            });
        }
    });
}

// Get the 2D
function get2d() {

    var strMime = "image/jpeg";
    imgData = renderer.domElement.toDataURL(strMime);
    return imgData;
    
}