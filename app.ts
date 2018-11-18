import "reflect-metadata";
import * as fs from "fs";
import * as path from "path";
import {bootstrapServer} from "./webserver";
import {createConnection} from "typeorm";
// import {Block} from "./models/block";
// import {Alias} from "./models/alias";
// import {Player} from "./models/player";
// import {Transaction} from "./models/transaction";


import * as configJSON from './config.json';
import {ProbePort} from "./models/ProbePort";

const config: any = configJSON;

export const app = {
    server: null,
    connection: null
};
app.connection = createConnection({
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

app.connection.then((connection) => {
    app.server = bootstrapServer();
    // Block.repo = connection.getRepository(Block);
    // Alias.repo = connection.getRepository(Alias);
    // Player.repo = connection.getRepository(Player);
    // Transaction.repo = connection.getRepository(Transaction);
}).catch((error) => {
    console.log(error)
});

const ports = ProbePort.checkPorts("/sys/devices/");

for (const port of ports) {
    port.temperatur().catch(()=>{
        console.info('Port', port.port, '-')
    }).then((temp) => {
        console.info('Port', port.port, temp + '°C');
    });
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