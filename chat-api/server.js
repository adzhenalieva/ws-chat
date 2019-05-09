const express = require('express');
const cors = require('cors');
const nanoid = require('nanoid');
const app = express();
const users = require('./app/users');
const mongoose = require('mongoose');
const config = require('./config');

const expressWs = require('express-ws')(app);

const port = 8000;
app.use(cors());
app.use(express.json());

const activeConnections = {};

app.ws('/chat', (ws, req) => {


    const id = nanoid();

    console.log('client connected, id = ', id);
    activeConnections[id] = ws;

    let username = 'Anonymous';

    ws.on('message', msg => {
        const decodedMessage = JSON.parse(msg);
        console.log('client sent: ' + decodedMessage);
        switch (decodedMessage.type) {
            case 'SET_USERNAME':
                username = decodedMessage.username;
                break;
            case 'CREATE_MESSAGE':
                const message = JSON.stringify({
                    type: 'NEW_MESSAGE', message: {
                        username,
                        text: decodedMessage.text
                    }
                });

                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];
                    conn.send(message);
                });
                break;
            default:
                console.log('Unknown message type ', decodedMessage.type);
        }
    });

    ws.on('close', msg => {
        console.log('client disconnected');
        delete activeConnections[id];
    })
});
mongoose.connect(config.dbURL, config.mongoOptions).then(
    () => {
        app.use('/users', users);
    }
);

app.listen(port, () => {
    console.log(`Server started on ${port} port`);
});