const jwt = require('jsonwebtoken');
require('dotenv').config()
const login = require("../controller/userRegistration")

const authenticate = (req, res, next) => {
  const authorization = req.headers['authorization'];
  if (authorization) {
    const token = authorization.replace('Bearer ', '').replace('bearer ', '');
    // console.log('authorization: ' + authorization, token,"token")
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // console.log("decoded",decoded)
      if (decoded.userId) {
        // console.log('decoded: ' + JSON.stringify(decoded.userId))
        return login.checkUser(decoded, (err, response) => {
          // console.log('response: ' + JSON.stringify(response))
          // console.log(!err && response != null,"outside");
          if (!err && response != null) {
            // console.log(!err && response != null,"inside");
            // console.log(response,"req.userId");
            req._id = decoded.userId;
            // console.log(req.userId,"req.userId");
            req.user = response;
            // console.log(req.user);
            return next();
          } else {
            return res.status(401).send({ error: 'Unauthorized', message: 'Authentication failed (token 3).' });
          }
        });
      } else {
        return res.status(401).send({ error: 'Unauthorized', message: 'Authentication failed (token 1).' });
      }
    } catch (e) {
      return res.status(401).send({ error: 'Unauthorized 2', message: 'Authentication failed (token 2).' });
    }
  }
  return res.status(401).send({ error: 'Unauthorized 1', message: 'Authentication failed (token).' });
}


module.exports = authenticate;














