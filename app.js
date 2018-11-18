"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var webserver_1 = require("./webserver");
var typeorm_1 = require("typeorm");
// import {Block} from "./models/block";
// import {Alias} from "./models/alias";
// import {Player} from "./models/player";
// import {Transaction} from "./models/transaction";
var configJSON = require("./config.json");
var ProbePort_1 = require("./models/ProbePort");
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
var ports = ProbePort_1.ProbePort.checkPorts("/sys/devices/");
var _loop_1 = function (port) {
    port.temperatur().catch(function () {
        console.info('Port', port.port, '-');
    }).then(function (temp) {
        console.info('Port', port.port, temp + '°C');
    });
};
for (var _i = 0, ports_1 = ports; _i < ports_1.length; _i++) {
    var port = ports_1[_i];
    _loop_1(port);
}
//
// if (fs.existsSync(basePath)) {
//     fs.readdirSync(basePath).forEach(bus => {
//         if (bus.search(/^w1_bus_master[0-9][0-9]*$/gi) > -1) {
//             if (fs.lstatSync(basePath + bus).isDirectory()) {
//                 console.info("Wire-Bus: " + bus);
//                 fs.readdirSync(basePath + bus).forEach(probe => {
//                     if (probe.search(/^28-/gi) > -1) {
//                         const probePath = basePath + bus + "/" + probe + "/"
//                         if (fs.lstatSync(probePath).isDirectory() && fs.existsSync(probePath + "w1_slave")) {
//                             console.info(" - probe " + probe);
//                             fs.readFile(probePath + "w1_slave", (err, data) => {
//                                 if (err) throw err;
//                                 console.info(bus, probe, data + "");
//                             });
//                         }
//                     }
//                 });
//             }
//         }
//     });
// }
//# sourceMappingURL=app.js.map