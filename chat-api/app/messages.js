const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');


const router = express.Router();


router.get('/', auth, (req, res) => {
    Message.find()
        .then(result => {
            if (result) return res.send(result);
            res.sendStatus(404)
        })
        .catch(() => res.sendStatus(500));
});


router.delete('/:id', [auth, permit('moderator')], (req, res) => {
    Message.findByIdAndDelete(req.params.id)
        .then(() => res.send({message: 'success'}))
        .catch(error => res.status(500).send(error))
});

module.exports = router;