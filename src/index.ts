import  { Request, Response } from 'express';
//import {Bot} from './bot'
const cors=require("cors")
const express = require("express");
const app =  express();
import {CONFIG} from './config'

app.use(express.json());

const corsOptions = {
    origin: '*'
  };

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, world!");
});

app.post("/newMessage", (req: Request, res: Response) => {
    res.send("Hello, world!");
});
  