import  { Request, Response } from 'express';
import {Bot} from './bot'
import {CONFIG} from './config'
const cors=require("cors")
const http = require('http');
const express = require("express");
const app =  express();
import { Server, Socket } from 'socket.io';

let bot:Bot;


bot =  Bot.getInstance();

