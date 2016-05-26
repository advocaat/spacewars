var socket;

$(document).ready(function(){

    socket = io('http://localhost:3000');
    console.log("Level up emit in progress...");
    socket.emit("levelUp", {user: name});

});