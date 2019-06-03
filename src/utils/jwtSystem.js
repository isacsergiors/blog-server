const {secretKey} = require('../../env')
const jwt = require('jsonwebtoken')

function generateToken(admin) {

   return jwt.sign(
      admin, secretKey, {expiresIn: (60 * 60) * 6}
   )
}

function verifyToken(token, callback) {

   jwt.verify(token, secretKey, function(error, decoded) {
      callback(error, decoded)
   })
}


module.exports = {generateToken, verifyToken}