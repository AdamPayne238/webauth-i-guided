const router = require('express').Router();

const bcrypt = require('bcryptjs');
const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 12);
  //return to user in an object that lookslike { password: 'original password, hash: 'hashed password' }
  credentials.password = hash;

  Users.add(credentials)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      //checks if the password is valid
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
