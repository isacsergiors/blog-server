const fs = require('fs')
const multer = require('multer')
const admin = require('./middlewares/admin')

module.exports = app => {

   const { src } = app

   app.get('/', (req, res) => {
      res.send(`
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
         <h3 style='color:rgb(80,80,80);font-family:arial, sans-serif'>Hehee como você veio parar aqui :D</h3>
      `)
   })

   app.get('/avatar/:name', (req, res) => {
      fs.readFile('./storage/images/avatar/' + req.params.name,
         function (error, file) {
            if (!error) res.end(file) 
            else res.send(error)
         })
   })

   app.get('/post/image/:name', src.admin.post.getPostImage)

   // AUTH
   app.post('/admin/login', src.admin.auth.login)

   // USER e *
   app.put('/post/clicked/:id', src.admin.post.countClicks)
   app.post('/mail', src.user.sendEmail.sendEmail)

   // ADMIN
   app.route('/info')
      .all(src.middlewares.admin)
      .get(src.admin.post.info)

   app.route('/post/:id')
      .all(src.middlewares.admin)
      .get(src.admin.post.getOnePost)
      .put(src.admin.post.updatePost)
      .delete(src.admin.post.deletePost)

   app.route('/post')
      .get(src.admin.post.getPosts)
      .all(src.middlewares.admin)
      .post(multer(src.utils.upload).single('file'), src.admin.post.addPost)

}
