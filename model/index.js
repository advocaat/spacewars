var user = "";
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

module.exports = functions;