"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = require("./bot");
var cors = require("cors");
var http = require('http');
var express = require("express");
var app = express();
var bot;
bot = bot_1.Bot.getInstance();
