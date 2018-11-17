import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as http from "http";

export function bootstrapServer() {
    const port = 3000;

    const expr = express();

// expr.use(logger('dev'));

    expr.use(express.json());
    expr.use(express.urlencoded({extended: false}));
    expr.use(cookieParser());
    expr.use(session({
            secret: "YhXUsKIaTM4$7lwpEn39EG",
            resave: false,
            saveUninitialized: true,
            cookie: {secure: false}
        })
    );
    expr.use(express.static(path.join(__dirname, 'public')));
    // expr.use('/broker', broker);
    expr.set('port', port);

    const server = http.createServer(expr);
    server.listen(port);
    server.on('error', (error: Error) => {
        console.error(error);
        throw error;
    });
    server.on('listening', () => {
        const addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.info('Web server listening on ' + bind);
    });
    return server;
}

