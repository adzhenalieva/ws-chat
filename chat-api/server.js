const express = require('express');
const cors = require('cors');
const nanoid = require('nanoid');
const app = express();
const users = require('./app/users');
const messages = require('./app/messages');
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
    Object.keys(activeConnections).forEach(connId => {
        const conn = activeConnections[connId].ws;
        conn.send(JSON.stringify({
            type: 'NEW_USER',
            messages: user
        }));
    });
    const usernames = Object.keys(activeConnections).map(connId => {
        const connection = activeConnections[connId];
        return connection.user.username
    });

    ws.send(JSON.stringify({
        type: 'ACTIVE_USERS',
        messages: usernames
    }));

    ws.send(JSON.stringify({
        type: 'LATEST_MESSAGES',
        messages: await Message.find().limit(30)
    }));


    ws.on('message', async msg => {
        const decodedMessage = JSON.parse(msg);
        switch (decodedMessage.type) {
            case 'CREATE_MESSAGE':
                const base = await new Message({
                    user: user.username,
                    text: decodedMessage.text
                });
                await base.save();

                const message = await JSON.stringify({
                    type: 'NEW_MESSAGE',
                    messages: base
                });

                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId].ws;
                    conn.send(message);
                });
                break;
            case 'DELETE_MESSAGE':
                let newMessages = (JSON.stringify({
                    type: 'LATEST_MESSAGES',
                    messages: await Message.find()
                }));

                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId].ws;
                    conn.send(newMessages);
                });

                break;
            case 'DELETE_USER':

                let deleteUser = (JSON.stringify({
                    type: 'DELETE_USER',
                    messages: decodedMessage.user
                }));
                await Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId].ws;
                    conn.send(deleteUser);
                });
                break;
            default:
                console.log('Unknown message type ', decodedMessage.type);
        }
    });

    ws.on('close', () => {
        console.log('client disconnected');
        delete activeConnections[id];
    })
});
mongoose.connect(config.dbURL, config.mongoOptions).then(
    () => {
        app.use('/users', users);
        app.use('/messages', messages);

        app.listen(port, () => {
            console.log(`Server started on ${port} port`);
        });
    }
);

