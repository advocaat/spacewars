var socket;

$(document).ready(function(){

    socket = io('https://spacewarsoffical.herokuapp.com/');
    console.log("Level up emit in progress...");
    socket.emit("levelUp", {user: name});

});