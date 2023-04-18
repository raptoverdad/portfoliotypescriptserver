import  { Request, Response } from 'express';
import {Bot} from './bot'
import {CONFIG} from './config'
//import {Bot} from './bot'
const cors=require("cors")
const http = require('http');
const express = require("express");
const app =  express();
const server = http.createServer(app);

let bot:Bot;

bot =  Bot.getInstance();
