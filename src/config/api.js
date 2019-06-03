
const heroku = "https://blog-saude-server.herokuapp.com"
const local = "http://192.168.1.10:4088"

module.exports = {
   storage: {
      post: heroku+"/post/image/",
      avatar: heroku+"/avatar/"
   }
}