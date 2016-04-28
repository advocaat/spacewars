var socket;
$(document).ready(function(){
    socket = io('http://localhost:3000');
    console.log("emitting");
    socket.emit("levelUp", {});
});
