// Add an enemy
function enemyAdder() {

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
}

// Load in the player ship
function loadPlayerObject() {

    light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);
    directionalLight = new THREE.DirectionalLight(0x8923DD, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
    var loader = new THREE.JSONLoader();

    loader.load("/javascripts/" + localStorage.getItem("shipId"), function (geometry, material) {

        zmesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        zmesh.position.set(-.3, -2, -.5);
        zmesh.rotateX(180);
        zmesh.scale.set(2, 2, 2);
        scene.add(zmesh);
        player1 = zmesh;

    });

}

// Render the canvas
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

// Add a new cube / sphere
function addCube(cube) {

    if (enemyCubes.length > 40) {

        var gone = enemyCubes.shift(cube);
        scene.remove(gone);

    }

    enemyCubes.push(cube);

}

// Restart the game
function restartGame(gameState) {

    enemyCubes.forEach(function (cube) {

        scene.remove(cube);

    });

    enemyCubes = [];
    console.log(JSON.stringify(gameState));
    gameState.enemyPosition.forEach(function (enemy) {

        console.log("enemy create");
        var cubish = recreateBox(enemy);
        addSavedCube(cubish, gameState);

    });
}

function addSavedCube(cube, gameState) {

    if (enemyCubes.length > gameState.enemyPosition.length) {

        var gone = enemyCubes.shift(cube);
        scene.remove(gone);

    }

    enemyCubes.push(cube);

}

// Set the bounding box of a new cube
function createBox(colee, ex, wi) {

    var geometry = new THREE.SphereGeometry(.7, 16, 16);
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

// Recreate an enemy
function recreateBox(enemy) {

    var geometry = new THREE.SphereGeometry(.7, 16, 16);
    var material = new THREE.MeshBasicMaterial({color: enemy.color});
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.color = enemy.color;
    cube.position.y = enemy.y;
    cube.position.x = enemy.x;
    cube.position.z = enemy.z;
    return cube;
    
}

