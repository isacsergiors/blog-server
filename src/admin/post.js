const multer = require('multer')
const fs = require('fs')
const path = require('path')

module.exports = app => {

   const { storage } = app.src.config.api

   // USER e *

   async function getPosts(req, res) {

      const posts = await app.db('posts')
         .where('category', 'like', `%${req.query.category}%`)
         .andWhere('title', 'like', `%${req.query.search}%`)
         .limit(parseInt(req.query.pages))
         .orderBy('id', 'desc')


      if (!posts) return res.json({ error: "Sem posts" })

      posts.forEach(post => {
         if (post.image)
            post.image = storage.post + post.image

      })

      res.json(posts)
   }

   async function countClicks(req, res) {

      const post = await app.db('posts').select('id', 'clicks')
         .where({ id: req.params.id }).first()

      app.db('posts').where({ id: req.params.id })
         .update({ clicks: post.clicks + 1 })
         .then(_ => {
            res.json({ post: "Click registrado" })
         }).catch(error => {
            res.json({ error })
         })

   }
   // AUTH

   function getOnePost(req, res) {

      app.db('posts').where({ id: req.params.id }).first()
         .then(post => {
            res.json({
               id: post.id,
               title: post.title,
               link: post.link,
               image: post.image ? storage.post + post.image : "",
               content: post.content,
               category: post.category,
            })
         }).catch(error => {
            res.status(400).json(error)
         })
   }

   function addPost(req, res) {

      console.log(req.body)

      let filename = req.file ? req.file.filename : ""
      let fileurl = req.body.image || ""

      app.db('posts').insert({ ...req.body, image: filename || fileurl })
         .then(_ => {
            res.json({ post: "Post adicionado com sucesso!" })
         }).catch(error => {
            res.json({ error })
         })
   }

   function updatePost(req, res) {

      if (req.body.image)
         req.body.image = req.body.image.replace(storage.post, "")

      app.db('posts').where({ id: req.params.id })
         .update(req.body)
         .then(_ => {
            res.end()
         }).catch(error => {
            res.status(400).json({ error })
         })
   }

   async function deletePost(req, res) {

      const post = await app.db('posts')
         .select('image')
         .where({ id: req.params.id })
         .first()

      const deleteFile = () => {
         if (!post) return
         fs.unlink(__dirname + '../../../storage/images/posts/' + post.image, (error) => {
            if (error) return
         })
      }

      app.db('posts').delete()
         .where({ id: req.params.id })
         .then(_ => {
            res.json({ post: "Post removido com sucesso!" })
         })
         .then(_ => {
            deleteFile()
         }).catch(error => {
            res.status(400).json({ error })
         })
   }

   function getPostImage(req, res) {

      fs.readFile('./storage/images/posts/' + req.params.name, function (error, file) {
         if (!error) {
            res.end(file)
         } else {
            res.send(error)
         }
      })
   }

   async function info(req, res) {

      let totalClicks = 0
      let totalPosts = 0

      const clicks = await app.db('posts')
         .select('clicks')

      clicks.forEach(post => {
         totalClicks += post.clicks
      })

      const posts = await app.db('posts').count('id').first()
         totalPosts = posts.count

      res.json({ totalClicks, totalPosts, connections: app.connections})

   }

   return {
      getPosts, addPost, updatePost, deletePost, countClicks,
      getPostImage, info, getOnePost
   }
}