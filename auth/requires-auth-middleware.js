const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
    //headers instead of body
    let { username, password } = req.headers;

    if(username && password){
    Users.findBy({ username })
      .first()
      .then(user => {
        //checks if the password is valid
        if (user && bcrypt.compareSync(password, user.password)) {
        //next sends back to complete the requuest if true
          next();
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
    } else {
        res.status(400).json({ message: "please provide credentials"})
    }
};