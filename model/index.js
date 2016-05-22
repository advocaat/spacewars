var user = "";
var money = 0;
var level = 3;


var functions = {};

functions.setUser = function(username){
    console.log("model "+ username);
    user = username;
}



functions.setLevel = function(level){
    this.level = level;
}

functions.getLevel = function(){
    return level;
}
functions.incrementLevel = function(){
    level += 1;
    console.log("level "+ level);
}

functions.getUser = function(){
    return user;
}

functions.setBank = function(currency){
    console.log("model $$$$$$$ "+ currency);
    money = currency;
};

functions.getBank = function(){
    return money
};

module.exports = functions;