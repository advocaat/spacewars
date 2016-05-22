

$(".ship").each(function(){
    $(this).click(function(evt){

        console.log(evt["currentTarget"]["innerHTML"].trim().split(" ")[3].split("/")[2].split(".")[0]);
        swapShip(evt["currentTarget"]["innerHTML"].trim().split(" ")[3].split("/")[2].split(".")[0]);
        location.href = "/game";
        // console.log(name + price);
        // socket.emit("newShip", {name : name.toString(), price: price.toString(), user: user});
        // console.log("emitted newShip");
    })
})
