var functions = {};

// Set the user
functions.setUser = function(username){

    console.log("User: "+ username);
    user = username;

};

// Increment the game level
functions.incrementLevel = function(){

    level += 1;
    console.log("Level number: "+ level);

};

// Get the current user
functions.getUser = function(){

    return user;

};

// Set the currency amount
functions.setBank = function(currency){

    console.log("Player currency: "+ currency);
    money = currency;

};

// Get the currency amount
functions.getBank = function(){

    return money

};

module.exports = functions;