"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var http = require("http");
function bootstrapServer() {
    var port = 3000;
    var expr = express();
    // expr.use(logger('dev'));
    expr.use(express.json());
    expr.use(express.urlencoded({ extended: false }));
    expr.use(cookieParser());
    expr.use(session({
        secret: "YhXUsKIaTM4$7lwpEn39EG",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));
    expr.use(express.static(path.join(__dirname, 'public')));
    // expr.use('/broker', broker);
    expr.set('port', port);
    var server = http.createServer(expr);
    server.listen(port);
    server.on('error', function (error) {
        console.error(error);
        throw error;
    });
    server.on('listening', function () {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.info('Web server listening on ' + bind);
    });
    return server;
}
exports.bootstrapServer = bootstrapServer;
//# sourceMappingURL=webserver.js.map