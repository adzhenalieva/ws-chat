const express = require('express');
const cors = require('cors');
const nanoid = require('nanoid');
const app = express();
const users = require('./app/users');
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/User');
const Message = require('./models/Message');

const expressWs = require('express-ws')(app);

const port = 8000;
app.use(cors());
app.use(express.json());

const activeConnections = {};

app.ws('/chat', async (ws, req) => {

    if (!req.query.token) {
        return ws.close();
    }
    const user = await User.findOne({token: req.query.token});

    if (!user) {
        return ws.close();
    }

    const id = nanoid();
    console.log('client connected, id = ', id);
    activeConnections[id] = {ws, user};

    const usernames = Object.keys(activeConnections).map(connId => {
        const connection = activeConnections[connId];
        return connection.user.username
    });

    ws.send(JSON.stringify({
        type: 'ACTIVE_USERS',
        usernames
    }));


    ws.send(JSON.stringify({
        type: 'LATEST_MESSAGES',
        messages: await Message.find().limit(30)
    }));


    ws.on('message', async msg => {
        const decodedMessage = JSON.parse(msg);
        console.log('client sent: ' + decodedMessage);
        switch (decodedMessage.type) {
            case 'CREATE_MESSAGE':
                const message = JSON.stringify({
                    type: 'NEW_MESSAGE', message: {
                        user: user.username,
                        text: decodedMessage.text
                    }
                });

                const base = await new Message({
                    user: user.username,
                    text: decodedMessage.text
                });
                await base.save();

                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId].ws;
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

        app.listen(port, () => {
            console.log(`Server started on ${port} port`);
        });
    }
);

