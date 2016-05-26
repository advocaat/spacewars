var GameState = require('../models/GameState.js');
var mongoose = require('mongoose');
var User = require('../models/User.js');
var Ship = require('../models/Ship.js');
var Score = require('../models/Score.js');
mongoose.connect("mongodb://onetime:onetime@ds051665.mlab.com:51665/spacebase");
functions = {};

// Save the current game state
functions.saveGameState = function (username, playerPosition, enemyPositions, playerCurrency, playerMoves, playerTime) {

    GameState.findOne({"playerName" : username}, function (err, doc) {
        doc.remove();
    });
    var playState = new GameState();
    playState.playerName = username;
    playState.playerPosition = playerPosition;
    playState.enemyPosition = enemyPositions;
    playState.playerCurrency = playerCurrency;
    playState.playerMoves = playerMoves;
    playState.playerTime = playerTime;
    playState.save(function (err) {

        if (err) {

            console.log("Error while saving game state: " + err);

        }

    });
};

// Update the current game state
functions.updateGameState = function (username, playerPosition, enemyPositions, playerCurrency, playerMoves, playerTime) {

    // Update the game state for the logged in user
    GameState.update({playerName: username}, {

            $set: {

                playerPosition: playerPosition,
                enemyPosition: enemyPositions,
                playerCurrency: playerCurrency,
                playerMoves: playerMoves,
                playerTime: playerTime

            }
        },

        {multi: true}, function (err, items) {

            if (err) {

                console.log("Error while updating game state: " + err);

            }

            console.log('Game state items: ' + items);

        });
};

// Load the game state
functions.getGameState = function (playerName, callback) {

    var query = GameState.findOne({playerName: playerName});
    query.lean().exec(function (err, doc) {

        if (err) {

            throw(err);

        }

        console.log(JSON.stringify(doc));
        callback(doc);

    });
};

// Update the players game level
functions.updateUserLevel = function (user, level) {

    User.update({username: user}, {$inc: {level: level}}, function (err, data) {

        if (err) {

            console.log(err);

        } else {

            console.log("Updated user level: " + data);

        }

    })
};

// Get the current logged in user and all available ships for purchase
functions.getShipsAndUserDeets = function (user, callback) {

    var deets = {};
    User.findOne({username: user}, function (err, docs) {

        if (err) console.log(err);

        else {

            console.log("Received docs: " + JSON.stringify(docs));
            deets.user = docs;

        }
    });

    Ship.find({}, function (err, docs) {

        deets.ships = docs;
        callback(deets);

    });
};

// Update the high-score leaderboard
functions.updateLeaderboard = function (highscore) {

    var updated = false;
    Score.find({"level": highscore["level"]}, function (err, docs) {

        if (err) {

            console.log(err);

        }
        if (docs.length < 5) {

            var myScore = new Score();
            myScore.userName = highscore["name"];
            myScore.userMoves = highscore["moves"];
            myScore.userTime = highscore["time"];
            myScore.level = highscore["level"];
            myScore.save(function (err, done) {

                if (err) {

                    console.log(err);

                }
                else {

                    console.log("Saved score: " + done);

                }
            })

        } else {

            console.log(JSON.stringify(docs));
            docs.forEach(function (doc) {

                console.log(JSON.stringify(doc));
                if (doc["userMoves"] > highscore["moves"] && updated == false) {

                    updated = true;
                    Score.update({_id: doc._id},
                        {
                            userMoves: highscore["moves"],
                            userTime: highscore["time"],
                            level: highscore["level"],
                            userName: highscore["name"]
                        }, function (err, saved) {

                            if (err) {

                                console.log("Failed to update: " + err);

                            }
                            else {

                                console.log("Successfully updated: " + saved);

                            }
                        })
                }
            })
        }
    }).sort({"userMoves": -1});
};

// Get the players score details (number of moves, time taken and level number)
functions.getLevelScores = function (level, callback) {

    Score.find({"level": level}, function (err, docs) {

        console.log(JSON.stringify(docs));
        var data = [];
        docs.forEach(function (doc) {

            dataObj = {

                userName: doc.userName,
                userMoves: doc.userMoves,
                userTime: doc.userTime,
                level: doc.level

            };

            data.push(dataObj);

        });

        callback(data);

    }).sort({"userMoves": 1});

};

// Get all the scores
functions.getScores = function (callback) {

    Score.find({}, function (err, docs) {

        data = {};
        data.level1 = [];
        data.level2 = [];
        data.level3 = [];
        for (var doc in docs) {

            console.log("doc level" + docs[doc].level);
            if (docs[doc]["level"] == 3) {

                data.level1.push(docs[doc]);
                console.log("Inserted doc for level 1");

            }

            if (docs[doc]["level"] == 4) {

                data.level2.push(docs[doc]);
                console.log("Inserted doc for level 2");

            }

            if (docs[doc]["level"] == 5) {

                data.level3.push(docs[doc]);
                console.log("Inserted doc for level 3");

            }
        }

        callback(data);

    }).sort({"userMoves": 1});
};

// When the user purchases a ship, add it to their personal collection
functions.insertUserShip = function (data) {

    var ship = new Ship();
    ship.shipName = data.name;
    ship.shipPrice = data.price;
    ship.shipImage = "/images/" + data.name + ".jpg";
    console.log("ship: " + ship + data.name + data.price);
    User.update({username: data.user}, {$push: {"ships": ship}}, function (err, data) {

        if (err) {

            console.log(err);

        }
        else {

            console.log(data);

        }
    })
};

// Get the players information
functions.getUserInfos = function (name, callback) {

    User.findOne({"username": name}, function (err, data) {

        if (err) {

            console.log(err);

        } else if (data == null) {

            data = {

                ships: []

            }
        }

        callback(data);

    });
};

// Update the users currency
functions.updateBank = function (username, amount) {

    User.update({username: username}, {$inc: {currency: amount}}, function (err, done) {

        if (err) {

            console.log(err);

        }
        else {

            console.log("Updated the players currency: " + JSON.stringify(done));

        }
    })
};

// Reset the player's level
functions.resetLevels = function (user) {

    console.log("Logged in user: " + user);
    User.update({username: user}, {$set: {level: 3}}, function (err, done) {

        if (err) {

            console.log(err);

        } else {

            console.log("Reset the level to: " + done);
        }

    })

};

module.exports = functions;