const db = require('./src/config/database')
const app = require('express')()
const server = require('http').Server(app)
const consign = require('consign')
const io = require('socket.io')(server)

app.db = db
app.connections = 0

io.origins([
   'http://192.168.1.10:3000', 
   'http://localhost:3000', 
   'https://blog-saude.herokuapp.com:443',
   'http://blog-saude.herokuapp.com:443'
])

io.on('connection', function(socket) {
   socket.emit('conn', {status: 200}) // emitir mensagem ao conectar
   socket.on('user', function(res) { // resposta do client (on = ouvindo 'user')
      app.connections += 1
   })
   socket.on('disconnect', () => {
      app.connections -= 1
   })
})

consign()
   .then('src/middlewares/start.js')
   .then('src/config/api.js')
   .then('src/utils/upload.js')
   .then('src/admin')
   .then('src/user')
   .then('src/')
   .then('src/routes.js')
   .into(app)

server.listen(process.env.PORT || 4088)