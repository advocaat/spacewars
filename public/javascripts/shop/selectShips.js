var socket;

$(document).ready(function(){

    socket = io('https://spacewarsoffical.herokuapp.com/');

});

// When a store item is clicked
$(".storeItem").each(function(){

    $(this).click(function(evt){

        var element = $(this).find($(".name")["o"]);
        var name = element["context"]["childNodes"][1]["childNodes"][3]["childNodes"][1]["textContent"].split(" ")[1];
        var price = element["context"]["childNodes"][1]["childNodes"][3]["childNodes"][3]["textContent"].split(" ")[1];
        console.log(name + price);
        if(currency >= price) {

            socket.emit("newShip", {name: name.toString(), price: parseInt(price.toString()), user: user});
            console.log("Ship successfully emitted...");
            location.href = "/game";

        }else{

            alert("Did you think we are a charity?");

        }
    })
});
