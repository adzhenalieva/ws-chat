const express = require('express');

const Message = require('../models/Message');

const router = express.Router();

router.get('/', (req, res) => {
    Message.find()
        .then(result => res.send(result))
        .catch(() => res.sendStatus(500))
});

// router.post('/', (req, res) => {
//     const category = new Message(req.body);
//     category.save()
//         .then(result => res.send(result))
//         .catch(() => res.sendStatus(400).send(error))
// });

module.exports = router;