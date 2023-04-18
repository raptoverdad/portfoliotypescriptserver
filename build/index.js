"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = require("./bot");
//import {Bot} from './bot'
var cors = require("cors");
var express = require("express");
var app = express();
var bot;
app.use(express.json());
var corsOptions = {
    origin: '*'
};
app.get("/", function (req, res) {
    res.send("Hello, world!");
});
app.post("/newMessage", function (req, res) {
    res.send("Hello, world!");
});
app.listen(3000, function () {
    console.log("app listening on port 3000");
    bot = bot_1.Bot.getInstance();
});
