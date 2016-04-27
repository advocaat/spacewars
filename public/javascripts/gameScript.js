///TODO: moves are not being added to the winscreen

(function () {
    var player1;
    var player2;
    var myImage;
    var my_canvas = document.getElementById("mine");
    var ctx = my_canvas.getContext('webgl');
    var renderer = new THREE.WebGLRenderer({canvas: my_canvas, preserveDrawingBuffer: true});
    var img = new Image();
    my_canvas.width = 900;
    my_canvas.height = 620;
    var canvee = document.getElementById('yours');
    canvee.width = my_canvas.width;
    canvee.height = my_canvas.height;
    var myPos = {x: 1, y: 1};
    var context = canvee.getContext("2d");
    var rows = 3;
    var cols = 3;
    var selected = false;
    var pieceWidth = my_canvas.width / cols;
    var pieceHeight = my_canvas.height / rows;
    var myimg
    var imgData;
    var winPieces = [];
    var numMoves = 0;
    var myZ = 50.00;
    var gameTime;
    var removedTime = 0;
    var awayTime;
    var returnTime;
    var enemyCubes = [];
    var pieces = [
        {col: 0, row: 0},
        {col: 1, row: 0},
        {col: 2, row: 0},
        {col: 0, row: 1},
        {col: 1, row: 1},
        {col: 2, row: 1},
        {col: 0, row: 2},
        {col: 1, row: 2},
        {col: 2, row: 2},
    ]


    setWinPieces();
    shuffle(pieces);


    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, my_canvas.width / my_canvas.height, 0.1, 1000);

    renderer.setSize(my_canvas.width, my_canvas.height);
    document.body.appendChild(renderer.domElement);


    var rand = function () {
        return Math.floor(Math.random() * 15)
    };



    setInterval(function () {
        var randSwitch = Math.floor(Math.random() * 2);
        console.log("num " + randSwitch);
        var color = getRandomColor();
        cube = createBox(color, 50, 1.726);
        cube.color = color;
        if (randSwitch === 0) {
            cube.position.x = rand();
        } else {
            cube.position.x = -rand();
        }
        THREE.Collisions.colliders.push(
            THREE.CollisionUtils.MeshOBB(cube)
        );
        addCube(cube);
    }, 1000);


    function loadObject() {
        light = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(light);
        directionalLight = new THREE.DirectionalLight(0x8923DD, 0.5);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);
        var loader = new THREE.JSONLoader();

        loader.load("/javascripts/tyler.json", function (geometry, material) {
            zmesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
            zmesh.position.set(-.3, -2, -.5);
            zmesh.rotateX(180);

            zmesh.scale.set(2, 2, 2);
            scene.add(zmesh);
            player1 = zmesh;

        });

    }

    player2 = createBox("invisible", 0, 1.726);
    THREE.Collisions.colliders.push(
        THREE.CollisionUtils.MeshOBB(player2)
    );
// var player1= createBox("rgba(32,32,250,112)", 0, 1.726);
    loadObject();

//
    var rays = [
        new THREE.Vector3(0, 0, .5),
        new THREE.Vector3(.5, 0, .5),
        new THREE.Vector3(.5, 0, 0),
        new THREE.Vector3(.5, 0, -.5),
        new THREE.Vector3(0, 0, -.5),
        new THREE.Vector3(-.5, 0, -.5),
        new THREE.Vector3(-.5, 0, 0),
        new THREE.Vector3(-.5, 0, .5)
    ];
    var collisions;
    var distance = .5;

    var caster = new THREE.Raycaster();

    function castemz() {
        var died = false;
        for (i = 0; i < rays.length; i += 1) {
            caster.set(player2.position, rays[i]);
            collisions = caster.intersectObjects(scene.children);

            if (collisions.length > 0 && collisions[0].distance <= distance) {
                died = true;

            }
        }
        if (died) {
            document.getElementById("messageBox").innerHTML = "<h2>You Died</h3>";
            var gameTime = document.getElementById('timer').childNodes[0].innerHTML;
            setTimeout(function () {
                var myData = [];
                myData["time"] = gameTime;
                post(myData, "/gameOver");

            }, 2000);

        }
    }


    function lowerZ(cube) {
        return cube.position.z += 0.1;
    }

//function lowerZ(cube){
//	return cube.myZ += .1;
//
//}

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    camera.position.z = 5;
    camera.position.y = 4;
    camera.rotation.x = -25 * Math.PI / 180;

    var render = function () {

        requestAnimationFrame(render);
        renderer.render(scene, camera);

        if (enemyCubes.length > 0) {
            enemyCubes.forEach(function (cube) {
                cube.position.z = lowerZ(cube);
            });
            castemz();
        }

        img.src = get2d();
        cleanGrid();
        strokeGrid();

        highlightSelected(myPos);
        if (selected) {
            highlightNeighbours(myPos);
        }

    };


    render();
    drawGraph();

    function setWinPieces() {
        for (var i = 0; i < pieces.length; i++) {
            winPieces[i] = JSON.parse(JSON.stringify(pieces[i]));
        }
    }

    function drawGraph() {
        function displayTime() {
            var timeElement = document.getElementById("timer");
            var movesElement = document.getElementById("moves");
            //var myTime = new Date().getSeconds();
            beginTimer();
            setInterval(function () {
                timeElement.innerHTML = "<p>"+((( new Date().getTime() - (startTime.getTime()+ removedTime))) / 1000.0) .toFixed(2).toString()+ "</p>";
                movesElement.innerHTML = "<p> Moves:"  + numMoves + "</p><br/>"
                return myTime;
            });
        }

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
        }
        img.src = get2d();
    }


    function drawPieces() {
        var i = 0;
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                var p = pieces[i++];
                context.drawImage(
                    // from the original image
                    img,
                    // take the next x,y piece
                    x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight,
                    // draw it on canvas based on the shuffled pieces[] array
                    p.col * pieceWidth, p.row * pieceHeight, pieceWidth, pieceHeight
                );
            }
        }
    }

    function addCube(cube) {
        if (enemyCubes.length > 40) {
            var gone = enemyCubes.shift(cube);
            scene.remove(gone);
        }
        enemyCubes.push(cube);
    }

    function strokeGrid() {
        context.strokeStyle = "cornflowerblue";
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                context.strokeRect(pieceWidth * i, pieceHeight * j, pieceWidth, pieceHeight);
            }
        }
    }

    function cleanGrid() {
        context.fillStyle = "rgba(255,255,255,0.0)";
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                context.fillRect(pieceWidth * i, pieceHeight * j, pieceWidth, pieceHeight);
            }
        }
    }


    function highlightSelected(position) {
        context.lineWidth = 4;
        context.fillStyle = "rgba(255,0,0,.2)";
        context.strokeStyle = "red";
        context.strokeRect(pieceWidth * position.x, pieceHeight * position.y, pieceWidth, pieceHeight);
        context.fillRect(pieceWidth * position.x, pieceHeight * position.y, pieceWidth, pieceHeight);
        context.lineWidth = 2;
    }

    function highlightNeighbours(position) {
        context.fillStyle = "rgba(255,255,0,.2)";
        context.strokeStyle = "yellow";
        context.strokeRect(pieceWidth * (position.x + 1), pieceHeight * (position.y), pieceWidth, pieceHeight);
        context.fillRect(pieceWidth * (position.x + 1), pieceHeight * (position.y), pieceWidth, pieceHeight)
        context.strokeRect(pieceWidth * (position.x - 1), pieceHeight * (position.y), pieceWidth, pieceHeight);
        context.fillRect(pieceWidth * (position.x - 1), pieceHeight * (position.y), pieceWidth, pieceHeight);
        context.strokeRect(pieceWidth * (position.x), pieceHeight * (position.y + 1), pieceWidth, pieceHeight);
        context.fillRect(pieceWidth * (position.x), pieceHeight * (position.y + 1), pieceWidth, pieceHeight);
        context.strokeRect(pieceWidth * (position.x), pieceHeight * (position.y - 1), pieceWidth, pieceHeight);
        context.fillRect(pieceWidth * (position.x), pieceHeight * (position.y - 1), pieceWidth, pieceHeight);
    }


    function shuffle(a) {
        for (var j, x, i = a.length; i; j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
        return a;
    }


    function switchPieces(pos, other) {
        var done = false
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


    function createBox(colee, ex, wi) {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({color: colee});
        if (colee == "invisible") {
            material = new THREE.MeshLambertMaterial({color: 0x900000, transparent: true, opacity: 0.0})
        }
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.y = -wi;
        cube.position.z = -ex;
        return cube;
    }

    
    function recreateBox(enemy){
        var geometry = new THREE.BoxGeometry(1,1,1);
        var material = new  THREE.MeshBasicMaterial({color: enemy.color});
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.color = enemy.color;
        cube.position.y = enemy.y;
        cube.position.x = enemy.x;
        cube.position.z = enemy.z;
        return cube;
    }


    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

//TODO: Might could use this here mouse functionality for something else later
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


    function getPos() {
        for (var i = 0; i < 3; i++) {
            if (mousePos.x > pieceWidth * i && mousePos.x < pieceWidth * (i + 1)) {
                myPos.x = i;
            }
            if (mousePos.y > pieceHeight * i && mousePos.y < pieceHeight * (i + 1)) {
                myPos.y = i;
            }
        }
        console.log("position " + myPos.x + myPos.y);
    }

    function get2d() {
        var strMime = "image/jpeg";
        imgData = renderer.domElement.toDataURL(strMime);
        return imgData;
    }

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
            var gameTime = document.getElementById('timer').childNodes[0].innerHTML;
            setTimeout(function () {
                var myData = [];
                myData["moves"] = numMoves;
                myData["time"] = gameTime;
                post(myData, "/gameWin");

            }, 2000);
        }
    }

    function keepInBounds(myPos) {
        if (myPos.x > 2) {
            myPos.x = 2;
        }
        if (myPos.x < 0) {
            myPos.x = 0;
        }
        if (myPos.y > 2) {
            myPos.y = 2;
        }
        if (myPos.y < 0) {
            myPos.y = 0;
        }

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
var socket;
$(document).ready(function(){
    socket = io('http://localhost:3000');
});
    function gameSave(){

        var  obj = {}
        obj.playerName = localStorage.getItem("username");
        myPos.color = null;
        obj.playerPosition = myPos;
        obj.enemyPositions = [];
        enemyCubes.forEach(function(cube){
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


    $(window).blur( function(e){
        console.log(e);
        gameSave();
        console.log("Saved Game State");
        awayTime = new Date().getTime();
    });

    $(window).focus(function(e){
        console.log("Restarting Game");
        socket.emit("restart", localStorage.getItem("username"));
    });
    
    $(window).load(function(){
        socket.on("savedGame", function(gameState){
            console.log("restarting");
            removedTime += (new Date().getTime() - awayTime);
            console.log("removed Time: "+ removedTime);
            restartGame(gameState);

        });
    })
    
    function restartGame(gameState){
        enemyCubes.forEach(function(cube){
            scene.remove(cube);
        });
        enemyCubes = [];
        console.log(JSON.stringify(gameState));
        gameState.enemyPosition.forEach(function(enemy){
            console.log("enemy create");
            var cubish = recreateBox(enemy);
            addSavedCube(cubish, gameState);
        });
        
        
    }
    function addSavedCube(cube, gameState){
        if (enemyCubes.length > gameState.enemyPosition.length) {
            var gone = enemyCubes.shift(cube);
            scene.remove(gone);
        }
        enemyCubes.push(cube);
    }

    function calcGameTime(){
        gameTime = ((( new Date().getTime() - (startTime.getTime()+ removedTime))) / 1000.0) .toFixed(2).toString()
    }
})();