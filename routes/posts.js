const router = require('express').Router();
const User = require('../model/User');
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    //Find id of user object
    // const payload = User.findbyOne({_id: req.user});
    res.send(req.user);
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    User.find({_id: id}).then(items => res.json(items));
    // res.send(suspect);
})




module.exports = router;