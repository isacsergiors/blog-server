const sha256 = require('sha256')
const jwt = require('../utils/jwtSystem')

const {storage} = require('../config/api')

module.exports = app => {

   async function login(req, res) {

      if (!req.body.username) return res.json({ error: "Digite seu username" })
      if (!req.body.password) return res.json({ error: "Digite sua senha" })

      const admin = await app.db('admin')
         .where({ username: req.body.username }).first()

      if (!admin || admin === undefined) 
         return res.json({ error: "Nome de usúario não existe" })
      
      if (sha256(req.body.password) !== admin.password) 
         return res.json({error: "Senha incorreta!"})

      if (admin.photo) admin.photo = storage.avatar+admin.photo
      
      delete admin.password

      const token = await jwt.generateToken(admin)

      app.user = { id: admin.id }

      res.json({
         token: token,
      })
      
   }

   return { login }
}