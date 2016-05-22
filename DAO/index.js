var GameState = require('../models/GameState.js');
var mongoose = require('mongoose');
var User = require('../models/User.js');
var Ship = require('../models/Ship.js');
var Score = require('../models/Score.js');
mongoose.connect("mongodb://localhost/SpaceBase");
functions = {};

functions.saveGameState =
    function (username, playerPosition, enemyPositions, playerCurrency, playerMoves, playerTime) {
        var playState = new GameState();
        playState.playerName = username;
        playState.playerPosition = playerPosition;
        playState.enemyPosition = enemyPositions;
        playState.playerCurrency = playerCurrency;
        playState.playerMoves = playerMoves;
        playState.playerTime = playerTime;
        playState.save(function (err) {
            if (err) {
                console.log("no save bra " + err);
            }
        })

    }

functions.updateGameState = function (username, playerPosition, enemyPositions, playerCurrency, playerMoves, playerTime) {
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
                console.log("error: " + err);
            }
            console.log(items);
        });
}

functions.getGameState = function (playerName, callback) {
    var query = GameState.findOne({playerName: playerName});
    query.lean().exec(function (err, doc) {
        if (err) {
            throw(err);
        }
        console.log(JSON.stringify(doc));
        callback(doc);

    });
}


functions.updateUserLevel = function(user, level){
    User.update({username: user},{$inc: {level: level}}, function(err, data){
        if(err){
            console.log(err);
        
        }else{
            console.log("Updated user level" + data );
            
        }
        
    })
}

//
// functions.addUser = function (name, currency, password) {
//     var user = new User();
//     user.name = name;
//     user.currency = currency;
//     user.password = password;
//     user.ships = [];
//     user.save(function (err) {
//         if (err) {
//             console.log("No save there" + err);
//         }
//     })
// }
//
// functions.retreiveUsernameAndPassword = function (username, password, callback) {
//     User.findOne({name: username, password: password}, function (err, doc) {
//         if (err) {
//             console.log(err);
//         }
//         console.log("name-o " + doc.name)
//         callback(doc.name);
//
//
//     });
// }

functions.getAvailableShips = function (callback) {
    Ship.find({}, function (err, docs) {

        callback(docs);
    });

}


functions.getShipsAndUserDeets = function (user, callback) {
    var deets = {};
    User.findOne({username: user}, function(err, docs){
        if(err) console.log(err);
        else{
            console.log("GOT DOCS "+ JSON.stringify(docs));
            deets.user = docs;
        }
    })
    Ship.find({}, function (err, docs) {
        deets.ships = docs;
        callback(deets);
    });


}

functions.updateLeaderboard = function (highscore) {
    var updated = false;
    Score.find({"level": highscore["level"]}, function (err, docs) {
        if (err) {
            console.log(err)
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
                    console.log("saved score " + done);
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
                                console.log("not update" + err);
                            }
                            else {
                                console.log("updated " + saved);

                            }
                        })
                }
            })
        }
    }).sort({"userMoves": -1});


}


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
        })
        callback(data);
    }).sort({"userMoves": 1});

}

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
                console.log("inseryed doc");
            }
            if (docs[doc]["level"] == 4) {
                data.level2.push(docs[doc]);
            }
            if (docs[doc]["level"] == 5) {
                data.level3.push(docs[doc]);
            }
        }

        callback(data);
    }).sort({"userMoves": 1});
}


functions.insertUserShip = function (data) {
        var ship = new Ship();
        ship.shipName = data.name;
        ship.shipPrice = data.price;
        ship.shipImage = "/images/" + data.name + ".jpg";
        console.log("poop" + ship + data.name + data.price);
        User.update({username: data.user}, {$push: {"ships": ship}}, function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(data);
            }
        })
 
}


functions.getUserInfos = function(name, callback)
{
    User.findOne({"username": name}, function (err, data) {
        if (err) {
            console.log(err);

        } else if(data == null) {
            data = {
                ships: []
            }
        }
            callback(data);
    });
}


functions.updateBank  = function(username, amount){
    User.update({username: username}, {$inc : {currency: amount}}, function(err, done){
        if(err){
            console.log(err);
        }
        else{
            console.log("updated bank cunt "+ JSON.stringify(done));
        }
    })
}

functions.resetLevels = function(user){
    console.log("USERR" + user);
    User.update({username: user}, {$set: {level: 3}}, function(err, done){
        if(err){
            console.log(err);

        }else{

            console.log("reset level " + done);
        }

    })

}

module.exports = functions;