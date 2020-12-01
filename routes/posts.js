const router = require('express').Router();
const User = require('../model/User');
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    //Find id of user object
    // const payload = User.findbyOne({_id: req.user});
    res.send(req.user);
})

//Get user data by id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    User.find({_id: id}).then(items => res.json(items));
    // res.send(suspect);
})

//Add task to user taskList
router.put('/change', (req, res) => {
    // const filter = { name: 'Jean-Luc Picard' };
    // const update = { age: 59 };
    // User.updateOne(filter, { name: 'Will Riker' });
    User.findByIdAndUpdate(
        { _id: req.body._id },
        { taskList: req.body.taskList },
        function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );
})

router.put('/removeTask', (req, res) => {
    // const filter = { name: 'Jean-Luc Picard' };
    // const update = { age: 59 };
    // User.updateOne(filter, { name: 'Will Riker' });
    User.findByIdAndUpdate(
        { _id: req.body._id },
        { taskList: req.body.taskList },
        function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );
})


module.exports = router;