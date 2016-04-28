

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
