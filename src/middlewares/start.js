const bodyParser = require('body-parser')
const cors = require('cors')()

module.exports = app => {

   app.use(cors)
   app.use(bodyParser.json({limit: "4mb"}))
   app.use(bodyParser.urlencoded({extended:true, limit: "5mb"}))
   app.use(bodyParser.text({limit: "2mb"}))

}