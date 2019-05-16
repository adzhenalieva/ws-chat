const mongoose = require('mongoose');
const nanoid = require('nanoid');
const config = require('./config');

const User = require('./models/User');


const run = async () => {
    await mongoose.connect(config.dbURL, config.mongoOptions);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();

    for (let collection of collections) {
        await collection.drop();
    }

    await User.create(
        {username: 'moderator', password: '123', role: 'moderator', token: nanoid()},
        {username: 'leo', password: '123', role: 'user', token: nanoid()}
    );

    await connection.close();
};


run().catch(error => {
    console.log('Something went wrong', error);
});