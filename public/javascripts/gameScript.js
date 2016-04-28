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
var rows = level;
var cols = level;
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
var collisions;
var distance = .5;
var caster = new THREE.Raycaster();
var socket;
var enemyCubes = [];
var pieces = createPieces();

function createPieces() {
    function piece(r, c) {
        var obj = {};
        obj.col = c;
        obj.row = r;
        return obj;
    }

    var pieceList = [];

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            pieceList.push(new piece(i, j))
        }
    }
    return pieceList;
}


function calcGameTime() {
    gameTime = ((( new Date().getTime() - (startTime.getTime() + removedTime))) / 1000.0).toFixed(2).toString()
}
