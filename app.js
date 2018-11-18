"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var fs = require("fs");
var webserver_1 = require("./webserver");
var typeorm_1 = require("typeorm");
// import {Block} from "./models/block";
// import {Alias} from "./models/alias";
// import {Player} from "./models/player";
// import {Transaction} from "./models/transaction";
var configJSON = require("./config.json");
var config = configJSON;
exports.app = {
    server: null,
    connection: null
};
exports.app.connection = typeorm_1.createConnection({
    type: "mysql",
    host: "localhost",
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    entities: [
    // Block,
    // Alias,
    // Player,
    // Transaction
    ],
    synchronize: true,
    logging: false
});
exports.app.connection.then(function (connection) {
    exports.app.server = webserver_1.bootstrapServer();
    // Block.repo = connection.getRepository(Block);
    // Alias.repo = connection.getRepository(Alias);
    // Player.repo = connection.getRepository(Player);
    // Transaction.repo = connection.getRepository(Transaction);
}).catch(function (error) {
    console.log(error);
});
if (fs.existsSync("/sys/bus/w1/devices")) {
    fs.readdirSync("/sys/bus/w1/devices").forEach(function (file) {
        console.info(file);
    });
}
//# sourceMappingURL=app.js.map