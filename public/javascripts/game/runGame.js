setWinPieces();
shuffle(pieces);


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, my_canvas.width / my_canvas.height, 0.1, 1000);

renderer.setSize(my_canvas.width, my_canvas.height);
document.body.appendChild(renderer.domElement);

player2 = createBox("invisible", 0, 1.726);

THREE.Collisions.colliders.push(
    THREE.CollisionUtils.MeshOBB(player2)
);

loadPlayerObject();

camera.position.z = 5;
camera.position.y = 4;
camera.rotation.x = -25 * Math.PI / 180;


render();
drawGraph();

handleInput();
enemyAdder();
$(document).ready(function () {
    socket = io('http://localhost:3000');
});

$(window).blur(function (e) {
    console.log(e);
    gameSave();
    console.log("Saved Game State");
    awayTime = new Date().getTime();
});

$(window).focus(function (e) {
    console.log("Restarting Game");
    socket.emit("restart", localStorage.getItem("username"));
});

$(window).load(function () {
    socket.on("savedGame", function (gameState) {
        console.log("restarting");
        removedTime += (new Date().getTime() - awayTime);
        console.log("removed Time: " + removedTime);
        restartGame(gameState);

    });
})