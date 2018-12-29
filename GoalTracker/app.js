var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoJS = require("mongojs");
var app = express();
var db = mongoJS("goaltracker", ["goals"]);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client")))

// API routes
app.get("/", (req, res) => {
    res.send("Welcome!");
});
app.get("/goals", (req, res) => {
    db.goals.find((err, data) => {
        if (err){
            res.send(err);
        } else {
            console.log("Getting goals...");
            res.json(data);
        }
    });
});
app.post("/goals", (req, res) => {
    db.goals.insert(req.body, (err, data) => {
        if (err){
            res.send(err);
        } else {
            console.log("Adding goal..."),
            res.json(data)
        }
    });
});
app.put("/goals/:id", (req, res) => {
    db.goals.findAndModify(
        {
            query: { 
                _id: mongoJS.ObjectId(req.params.id)
            },
            update: {
                $set:{
                    name: req.body.name,
                    type: req.body.type,
                    deadline: req.body.deadline
                }
            },
            new: true 
        },
        (err, data) => {
            if (err){
                res.send(err);
            } else {
                console.log("Updating goal..."),
                res.json(data)
            }
        }
    );
});
app.delete('/goals/:id', (req, res) => {
    db.goals.remove({_id: mongoJS.ObjectId(req.params.id)}, (err, data) => {
        if (err){
            res.send(err);
        } else {
            console.log("Removing goal..."),
            res.json(data)
        }
    });
});

// server settings
var port = 7770;
app.listen(port);
console.log("Running on port: " + port);