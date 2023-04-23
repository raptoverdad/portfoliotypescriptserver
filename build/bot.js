"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
var telegraf_1 = require("telegraf");
var http = require('http');
var config_1 = require("./config");
var socket_io_1 = require("socket.io");
var Bot = /** @class */ (function () {
    function Bot() {
        var _this = this;
        this.bot = new telegraf_1.Telegraf(config_1.CONFIG.TELEGRAM_TOKEN);
        this.key = config_1.CONFIG.SOCKET_KEY;
        this.chatId = "5893927006";
        this.userSocket = null;
        this.iniciar();
        this.io = new socket_io_1.Server(http.createServer().listen(3000), {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                allowedHeaders: ["Access-Control-Allow-Origin"],
                credentials: false,
            },
        });
        this.io.use(function (sockete, next) { return __awaiter(_this, void 0, void 0, function () {
            var frontendKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sockete.handshake.query.key];
                    case 1:
                        frontendKey = _a.sent();
                        if (frontendKey !== this.key) {
                            next(new Error("invalid key"));
                        }
                        else {
                            next();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        this.io.on("connection", function (socket) {
            console.log("Cliente conectado");
            socket.on("isAvailableOrNot", function (data) {
                if (_this.userSocket == null) {
                    _this.io.to(data).emit("isAvailableOrNotResponse", "yes");
                }
                else {
                    _this.io.to(data).emit("isAvailableOrNotResponse", "no");
                }
            });
            //socket que vuelve la variable userSocket en null denuevo
            socket.on("socketoff", function (id) {
                console.log("el socket con id ", id, " se fue");
                if (id == _this.userSocket) {
                    _this.userSocket = null;
                }
            });
            try {
                socket.on("message", function (json, senderSocket) { return __awaiter(_this, void 0, void 0, function () {
                    var pakete, id, bossMessage;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                pakete = JSON.parse(json);
                                id = pakete.id;
                                if (!(this.userSocket == null)) return [3 /*break*/, 2];
                                this.userSocket = id;
                                return [4 /*yield*/, this.bot.telegram.sendMessage(this.chatId, "id: " + id + " mensaje: " + pakete.message)];
                            case 1:
                                bossMessage = _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                this.io.to(pakete.id).emit("isAvailableOrNotResponse", "no");
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
            }
            catch (error) {
                console.log("chatVisitor error:", error);
            }
        });
    }
    Bot.getInstance = function () {
        if (!Bot.instance) {
            Bot.instance = new Bot();
        }
        return Bot.instance;
    };
    Bot.prototype.iniciar = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Bot listening");
                        this.bot.hears(/^(?!.*(?:leavechat|chatinfo)).+$/, function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                            var message, nullMessage, error_1, errorMessage;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 4, , 6]);
                                        message = ctx.message.text;
                                        if (!this.userSocket) return [3 /*break*/, 1];
                                        this.io.to(this.userSocket).emit("bossMessage", message);
                                        return [3 /*break*/, 3];
                                    case 1:
                                        if (!(this.userSocket == null)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.bot.telegram.sendMessage(this.chatId, "SERVER: SOCKET IS NULL TYPE")];
                                    case 2:
                                        nullMessage = _a.sent();
                                        _a.label = 3;
                                    case 3: return [3 /*break*/, 6];
                                    case 4:
                                        error_1 = _a.sent();
                                        console.log(error_1);
                                        return [4 /*yield*/, this.bot.telegram.sendMessage(this.chatId, "SERVER: THE SOCKET YOU ARE TRYING TO TALK TO DOESN'T EXIST")];
                                    case 5:
                                        errorMessage = _a.sent();
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); });
                        this.bot.hears("leavechat", function () { return __awaiter(_this, void 0, void 0, function () {
                            var leaveChatMessage;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!this.userSocket) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.io.to(this.userSocket).emit("bossOut")];
                                    case 1:
                                        _a.sent();
                                        this.userSocket = null;
                                        return [4 /*yield*/, this.io.sockets.emit("isAvailableOrNotResponse", "yes")];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 3:
                                        if (!(this.userSocket == null)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this.bot.telegram.sendMessage(this.chatId, "SERVER: NO SOCKET IS CONNECTED")];
                                    case 4:
                                        leaveChatMessage = _a.sent();
                                        _a.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); });
                        this.bot.hears("chatinfo", function () { return __awaiter(_this, void 0, void 0, function () {
                            var infoMessage, infoMessage;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(this.userSocket != null)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.bot.telegram.sendMessage(this.chatId, "SERVER: THE SOCKET IS " + this.userSocket)];
                                    case 1:
                                        infoMessage = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 2:
                                        if (!(this.userSocket == null)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this.bot.telegram.sendMessage(this.chatId, "SERVER: THE SOCKET IS NULL")];
                                    case 3:
                                        infoMessage = _a.sent();
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, this.bot.launch()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.detener = function () {
        this.bot.stop();
    };
    return Bot;
}());
exports.Bot = Bot;
