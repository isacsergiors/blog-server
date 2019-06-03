const { verifyToken } = require('../utils/jwtSystem')
const { secretKey } = require('../../env')
const jwt = require('jsonwebtoken')

module.exports = (app) => {

   return (req, res, next) => {

      const authHeader = req.headers['authorization']

      if(!authHeader) return res.status(401).json({error: "Token not send"})

      const tokenParts = authHeader.split(' ')

      if(!tokenParts.length === 2)
         return res.status(401).json({error: "Token error"})

      const [scheme, token] = tokenParts

      if(!/^Bearer$/i.test(scheme))
         return res.json({error: "Token malformatted"})
 
      verifyToken(token, (error, decoded) => {

         if (error) 
            return res.status(401).send({
               error: "Sua sessão expirou faça login novamente",
               codeError: "token_expired"
            }) 

         if(decoded.master === true) 
            return next()
         else res.status(401).json({
            error: "Sem permissão",
            errorCode: "not_master"
         })
   
      })
   }



}