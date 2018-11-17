import "reflect-metadata";
import {bootstrapServer} from "./webserver";
import {createConnection} from "typeorm";
// import {Block} from "./models/block";
// import {Alias} from "./models/alias";
// import {Player} from "./models/player";
// import {Transaction} from "./models/transaction";


import * as configJSON from './config.json';

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