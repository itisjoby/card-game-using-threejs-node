var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var url = require('url');

/*const MONGO_USERNAME = "root";
 const MONGO_PASSWORD = "redhat";
 const MONGO_HOSTNAME = "127.0.0.1";
 const MONGO_PORT = "27017";
 const MONGO_DB = "chat_test";
 const url =
 "mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin";
 */
mongoose.connect("mongodb://localhost/card_game", {useNewUrlParser: true});
// get reference to database
var db = mongoose.connection;
app.use(session({'secret': 'secret'}))

/*player schema */
let player_Schema = {
    first_name: {type: String, default: ""},
    last_name: {type: String, default: ""},
    email: {type: String, default: ""},
    password: {type: String, default: ""},
    gender: {type: String, default: "male"},
    profile_pic: {type: String, default: "./assets/default.png"},
    level: {type: Number, default: 1},
    hands_played: {type: Number, default: 0},
    hands_won: {type: Number, default: 0},
    biggest_won: {type: Number, default: 0},
    sit_n_go_wins: {type: Number, default: 0},
    coins: {type: Number, default: 500},
    gift: {type: String, default: ""},
    location: {type: String, default: "Unknown"},
    best_hand: [
        {
            card_: String
        }
    ]
};

var playerModel = mongoose.model("player", player_Schema);

/*table schema */
let table_Schema = {
    name: {type: String, default: ""},
    status: {type: String, default: "active"},
    time_type: {type: String, default: "fast"},
    type: {type: String, default: "small"},
    min_deal: {type: Number, default: 40},
    max_deal: {type: Number, default: 400},
    initial_deposit: {type: Number, default: 4},
    is_game_on: {type: String, default: "N"},
    seat: [
        {
            seat_name: {type: String, default: ""},
            status: {type: String, default: "active"},
            member_id: {
                type: Schema.Types.ObjectId,
                default: null
            },
            card_one: {type: String, default: ""},
            card_two: {type: String, default: ""}
        }
    ]
};
var tableModel = mongoose.model("tables", table_Schema);

/*game schema */
let game_Schema = new Schema({
    table_id: Schema.Types.ObjectId,
    winner: {type: String, default: ""},
    player_count: {type: Number, default: 0},
    winning_amount: {type: Number, default: 0},
    winning_method: {type: String, default: ""},
    rounds: {type: Number, default: 0},
    created_at: {type: Date, default: Date.now},
    ended_at: {type: Date, default: Date.now},
    dealer: {
        type: Schema.Types.ObjectId,
        default: null
    },
    dealer_neighbour: {
        type: Schema.Types.ObjectId,
        default: null
    },
    history: [
        {
            player_id: {
                type: Schema.Types.ObjectId,
                default: null
            },
            description: String,
            round: Number,
            time: {type: Date, default: Date.now}
        }
    ]
});

var gameModel = mongoose.model("game", game_Schema);
/**setting view */
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

/*routigs */
app.get("/", function (req, res) {

    console.log(req.session.page_views)
    res.render(__dirname + "/views/signin.html");
});

app.get("/index", isAuthenticated, function (req, res) {

    playerModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.session.user_id)
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        player_first_name: {$first: "$first_name"},
                        player_last_name: {$first: "$last_name"},
                        email: {$first: "$email"},
                        profile_pic: {$first: "$profile_pic"},
                        hands_played: {$first: "$hands_played"},
                        hands_won: {$first: "$hands_won"},
                        biggest_won: {$first: "$biggest_won"},
                        sit_n_go_wins: {$first: "$sit_n_go_wins"},
                        coins: {$first: "$coins"},
                        location: {$first: "$location"},
                        best_hand: {$first: "$best_hand"},
                        gift: {$first: "$gift"}
                    }
                }
            ])
            .exec(function (err, result) {
                res.render(__dirname + "/views/index.html", {result: result});

            });

});

app.get("/holdem_table", isAuthenticated, function (req, res) {
    //console.log(req.query.type);
    let active_type = "tiny";
    if (req.query.type == "tiny") {
        active_type = "tiny";
    } else if (req.query.type == "small") {
        active_type = "small";
    } else if (req.query.type == "medium") {
        active_type = "medium";
    } else {
        active_type = "big";
    }

    tableModel
            .aggregate([
                {
                    $match: {
                        status: {$eq: "active"},
                        type: {$eq: active_type}
                    }
                },
                {
                    $project: {
                        name: 1,
                        time_type: 1,
                        type: 1,
                        min_deal: 1,
                        max_deal: 1,
                        empty_seats_count: {
                            $size: {
                                $filter: {
                                    input: "$seat",
                                    as: "seat",
                                    cond: {$eq: ["$$seat.member_id", null]}
                                }
                            }
                        },
                        occupied_seats_count: {
                            $size: {
                                $filter: {
                                    input: "$seat",
                                    as: "seat",
                                    cond: {$ne: ["$$seat.member_id", null]}
                                }
                            }
                        }
                    }
                }
            ])
            .exec(function (err, result) {
                res.render(__dirname + "/views/table_list.html", {
                    result: result,
                    active: active_type
                });
                //console.log(result);
            });

    //res.render("table_list.html", { name: "result" });
});

app.get("/toRoom", isAuthenticated, function (req, res) {
    let table_id = req.query.table_id;

    tableModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(table_id)
                    }
                },
                {
                    $unwind: {
                        path: "$seat",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $lookup: {
                        from: "players",
                        localField: "seat.member_id",
                        foreignField: "_id",
                        as: "player_data"
                    }
                },
                {
                    $unwind: {
                        path: "$player_data",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$seat._id",
                        name: {$first: "$name"},
                        table_id: {$first: "$_id"},
                        status: {$first: "$status"},
                        time_type: {$first: "$time_type"},
                        type: {$first: "$type"},
                        max_deal: {$first: "$max_deal"},
                        min_deal: {$first: "$min_deal"},
                        member_id: {$first: "$seat.member_id"},
                        seat_name: {$first: "$seat.seat_name"},
                        player_first_name: {$first: "$player_data.first_name"},
                        player_last_name: {$first: "$player_data.last_name"}
                    }
                }
            ])
            .exec(function (err, result) {
                res.render(__dirname + "/views/room.html", {
                    result: result, table_id: table_id, member_id: req.session.user_id
                });
            });

    //res.render("table_list.html", { name: "result" });
});

app.post("/sit", (req, res) => {
    let table_id = req.body.table_id;
    let seat_id = req.body.seat_id;
    let member_id = req.body.member_id;
    msg = "";
    /**check user sitting already */
    /**check seat free */
    tableModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(table_id)
                    }
                },
                {
                    $unwind: {
                        path: "$seat",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $group: {
                        _id: "$seat._id",
                        member_id: {$first: "$seat.member_id"},
                        is_game_on: {$first: "is_game_on"}
                    }
                }
            ])
            .exec(function (err, result) {
                for (let index in result) {
                    let r_val = result[index];
                    if (r_val["_id"] == seat_id) {
                        if (r_val["member_id"] !== null) {
                            //occupied
                            msg = "seat is occupied";
                        }
                    }
                    if (member_id == r_val["member_id"]) {
                        //already sitting
                        //msg = "Cannot sit here";
                    }
                }
                if (msg != "") {
                    return res.status(200).send({msg: msg});
                }
                //update seat info
                var query = {_id: table_id, "seat._id": seat_id};
                var update = {"seat.$.member_id": mongoose.Types.ObjectId(member_id)};

                tableModel.update(query, update, {upsert: false}, function (err, doc) {
                    if (err)
                        return res.send(500, {error: err});
                    //check whether game has began if not startgame




                    tableModel
                            .aggregate([
                                {
                                    $match: {
                                        _id: mongoose.Types.ObjectId(table_id)
                                    }
                                },
                                {
                                    $unwind: {
                                        path: "$seat",
                                        preserveNullAndEmptyArrays: false
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "players",
                                        localField: "seat.member_id",
                                        foreignField: "_id",
                                        as: "player_data"
                                    }
                                },
                                {
                                    $unwind: {
                                        path: "$player_data",
                                        preserveNullAndEmptyArrays: true
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$seat._id",
                                        name: {$first: "$name"},
                                        table_id: {$first: "$_id"},
                                        status: {$first: "$status"},
                                        time_type: {$first: "$time_type"},
                                        type: {$first: "$type"},
                                        max_deal: {$first: "$max_deal"},
                                        min_deal: {$first: "$min_deal"},
                                        initial_deposit: {$first: "$initial_deposit"},
                                        member_id: {$first: "$seat.member_id"},
                                        seat_name: {$first: "$seat.seat_name"},
                                        player_first_name: {$first: "$player_data.first_name"},
                                        player_last_name: {$first: "$player_data.last_name"}
                                    }
                                }
                            ])
                            .exec(function (err, result) {
                                io.emit("sitted", {table_id: table_id, seat_id: seat_id});
                                res.json({result: result});
                            });

                });
            });
});
app.post("/standUp", (req, res) => {
    let table_id = req.body.table_id;
    let seat_id = req.body.seat_id;
    let member_id = req.body.member_id;
    msg = "";
    /**check user sitting already */
    /**check seat free */

    //update seat info
    var query = {_id: table_id, "seat._id": seat_id};
    var update = {"seat.$.member_id": null};

    tableModel.update(query, update, {upsert: false}, function (err, doc) {
        if (err) {
            return res.send(500, {error: err});
        }

        io.emit("user_standup", {table_id: table_id, seat_id: seat_id});
        res.json({status: 1});

    });

});

app.post("/getSittingCount", (req, res) => {
    //let table_id = req.body.table_id;
    let table_id = req.body.table_id;
    tableModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(table_id)
                    }
                },
                {
                    $project: {
                        is_game_on: 1,
                        PlayersCount: {
                            $size: {
                                $filter: {
                                    input: "$seat",
                                    as: "seat",
                                    cond: {$ne: ["$$seat.member_id", ""]}
                                }
                            }
                        }
                    }
                }
            ])
            .exec(function (err, result) {
                let PlayersCount = result[0]["PlayersCount"];
                if (PlayersCount >= 2) {
                    if (result[0]["is_game_on"] == "N") {
                        console.log("start game now");
                        startGame(table_id, PlayersCount, res);
                    }
                }
                //io.emit("PlayersCount", PlayersCount);
            });
});

app.post("/getProfile", (req, res) => {
    let member_id = req.body.member_id;

    playerModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(member_id)
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        player_first_name: {$first: "$first_name"},
                        player_last_name: {$first: "$last_name"},
                        profile_pic: {$first: "$profile_pic"},
                        hands_played: {$first: "$hands_played"},
                        hands_won: {$first: "$hands_won"},
                        biggest_won: {$first: "$biggest_won"},
                        sit_n_go_wins: {$first: "$sit_n_go_wins"},
                        coins: {$first: "$coins"},
                        location: {$first: "$location"},
                        best_hand: {$first: "$best_hand"},
                        gift: {$first: "$gift"}
                    }
                }
            ])
            .exec(function (err, result) {
                res.json({result: result});
            });
});
app.post("/revealMyCard", (req, res) => {
    let table_id = req.body.table_id;
    let member_id = req.body.member_id;

    tableModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(table_id)

                    },
                },
                {
                    $unwind: {
                        path: "$seat",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $match: {

                        'seat.member_id': mongoose.Types.ObjectId(member_id)
                    }
                },
                {
                    $group: {
                        _id: "$seat._id",
                        member_id: {$first: "$seat.member_id"},
                        card_one: {$first: "$seat.card_one"},
                        card_two: {$first: "$seat.card_two"},
                        table_id: {$first: "$_id"},
                    }
                }
            ])
            .exec(function (err, result) {
                io.emit("my_card_revealed", result);
                res.sendStatus(200);

            });
});
app.post("/saveUser", (req, res) => {
    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;

    let player_data = {
        email: email,
        first_name: name,
        last_name: name,
        password: password
    };
    var player = new playerModel(player_data);
    player.save(function (err, player) {
        if (err) {
            sendStatus(500);
            //            io.emit("message", req.body);
            //        res.sendStatus(200);
        }
        req.session.user_id = player._id;
        let redirect_url = url.format({protocol: req.protocol, host: req.get('host'), pathname: '/index'});
        res.json({status: 1, redirect_url: redirect_url});
    });

});
app.post("/loginUser", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;





    playerModel
            .aggregate([
                {
                    $match: {
                        email: email
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        player_first_name: {$first: "$first_name"},
                        player_last_name: {$first: "$last_name"},
                        profile_pic: {$first: "$profile_pic"},
                        hands_played: {$first: "$hands_played"},
                        hands_won: {$first: "$hands_won"},
                        biggest_won: {$first: "$biggest_won"},
                        sit_n_go_wins: {$first: "$sit_n_go_wins"},
                        coins: {$first: "$coins"},
                        location: {$first: "$location"},
                        best_hand: {$first: "$best_hand"},
                        gift: {$first: "$gift"},
                        password: {$first: "$password"}
                    }
                }
            ])
            .exec(function (err, result) {
                console.log(result)
                if (Array.isArray(result) && result.length) {
                    if (result[0]['password'] == password) {
                        req.session.user_id = result[0]['_id'];
                        let redirect_url = url.format({protocol: req.protocol, host: req.get('host'), pathname: '/index'});
                        res.json({status: 1, redirect_url: redirect_url});
                    } else {

                        res.json({status: 0});
                    }
                } else {
                    res.json({status: 0});
                }
            });


});
app.post("/logout", (req, res) => {
    req.session.destroy(function () {
        let redirect_url = url.format({protocol: req.protocol, host: req.get('host'), pathname: '/index'});
        res.json({status: 1, redirect_url: redirect_url});
    })
});

io.on("connection", () => {
    console.log("a user is connected");
});

var server = http.listen(3000, () => {
    console.log("server is running on port", server.address().port);
});



function isAuthenticated(req, res, next) {
    if (req.session.user_id) {
        return next();
    }
    res.redirect('/');

}
function fullUrl(req) {
    return url.format({protocol: req.protocol, host: req.get('host'), pathname: req.originalUrl});
}
//createTables();

function startGame(table_id, player_count, res) {

    //update seat info
    var query = {_id: table_id};
    var update = {"is_game_on": 'Y'};

    tableModel.update(query, update, {upsert: false}, function (err, doc) {
        if (err)
            return res.send(500, {error: err});
        //check whether game has began if not startgame

        let game_data = {
            table_id: table_id,
            player_count: player_count,
            rounds: 0
        };
        var game = new gameModel(game_data);

        game.save(function (err, game) {
            if (err) {
                res.sendStatus(200);
                console.log(err)
            }
            deliverPlayerCards(table_id, res);
        });
    });




}
function deliverPlayerCards(table_id, res) {
    tableModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(table_id),
                        "seat.status": {$eq: "active"}
                    }
                }
            ])
            .exec(function (err, result) {
                for (index in result) {
                    for (key in result[index]["seat"]) {
                        let val = result[index]["seat"][key];
                        if (val["member_id"] !== null) {

                            let card_one = getMyCard();
                            let card_two = getMyCard();

                            let seat_id = val["_id"];

                            var query = {_id: table_id, "seat._id": seat_id};
                            var update = {"seat.$.card_one": card_one, "seat.$.card_two": card_two};

                            tableModel.update(query, update, {upsert: false}, function (
                                    err,
                                    doc
                                    ) {
                                if (err)
                                    return res.send(500, {error: err});

                                if ((Object.keys(result).length - 1) == index && (Object.keys(result[index]["seat"]).length - 1) == key) {
                                    console.log("added cards");
                                    io.emit("game_started", {table_id: table_id});
                                    res.sendStatus(200);
                                }
                            });
                        }
                    }
                }
            });
}
function createTables() {
    let table_data = {
        name: "table 2",
        status: "active",
        time_type: "fast",
        type: "small",
        min_deal: 500,
        max_deal: 10000,
        seat: [
            {
                seat_name: "seat 1",
                status: "active"
            },
            {
                seat_name: "seat 2",
                status: "active"
            },
            {
                seat_name: "seat 3",
                status: "active"
            },
            {
                seat_name: "seat 4",
                status: "active"
            },
            {
                seat_name: "seat 5",
                status: "active"
            }
        ]
    };
    var table1 = new tableModel(table_data);
    table1.save(function (err, table1) {
        if (err) {
            //console.log(err);
            //sendStatus(200);
            //            io.emit("message", req.body);
            //        res.sendStatus(200);
        }
    });
}
createTables();

function createPlayer() {
    let player_data = {
        first_name: "nimmy",
        last_name: "baby",
        gender: "female"
    };
    var player = new playerModel(player_data);
    player.save(function (err, player) {
        if (err) {
            sendStatus(500);
            //            io.emit("message", req.body);
            //        res.sendStatus(200);
        }
    });
}
//createPlayer();


class Deck {
    constructor() {
        this.deck = [];
        this.reset();
        this.shuffle();
    }

    reset() {
        this.deck = [];

        const suits = ["Hearts", "Spades", "Clubs", "Diamonds"];
        const values = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];

        for (let suit in suits) {
            for (let value in values) {
                this.deck.push(`${values[value]} of ${suits[suit]}`);
            }
        }
    }

    shuffle() {
        const {deck} = this;
        let m = deck.length,
                i;

        while (m) {
            i = Math.floor(Math.random() * m--);

            [deck[m], deck[i]] = [deck[i], deck[m]];
        }

        return this;
    }

    deal() {
        return this.deck.pop();
    }
}

const deck1 = new Deck();
deck1.reset();
function getMyCard() {
    deck1.shuffle();
    return deck1.deal();
}

function setSession(req) {
    req.session.session_id = (Math.random() * 100);
}



app.post("/messages", (req, res) => {
    let message = req.body.message;
    let table_id = req.body.table_id;
    let member_id = req.body.member_id;

    playerModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(member_id)
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        player_first_name: {$first: "$first_name"},
                        player_last_name: {$first: "$last_name"},
                        profile_pic: {$first: "$profile_pic"},

                    }
                }
            ])
            .exec(function (err, result) {

                if (Array.isArray(result) && result.length) {
                    let player_name = result[0]['player_first_name'] + ' ' + result[0]['player_last_name'];


                    tableModel
                            .aggregate([
                                {
                                    $match: {
                                        _id: mongoose.Types.ObjectId(table_id)

                                    },
                                },
                                {
                                    $unwind: {
                                        path: "$seat",
                                        preserveNullAndEmptyArrays: false
                                    }
                                },
                                {
                                    $match: {

                                        'seat.member_id': mongoose.Types.ObjectId(member_id)
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$seat._id",

                                    }
                                }
                            ])
                            .exec(function (err, result) {
                                let data = {table_id: table_id, player_name: player_name, message: message, seat_id: result[0]['_id']};
                                io.emit("message", data);
                                res.json({status: 1});

                            });


                } else {
                    res.json({status: 0});
                }
            });


});