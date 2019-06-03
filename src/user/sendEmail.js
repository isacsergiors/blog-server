const nodemailer = require('nodemailer')

module.exports = app => {
    
    function sendEmail(req, res) {
        
        const value = req.body
        
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: "isacsergiodev@gmail.com",
            pass: "isac_develop4331"
          },
          tls: { rejectUnauthorized: false }
        })

        const mailOptions = {

          from: value.email,
          to: 'isac.sergio@outlook.com',
          subject: value.title,
          text: `Mensagem de: ${value.name}
                 ${value.message}
                `
        }

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            res.json({error})
          } else {
              return res.json({success: 'Email enviado com sucesso'})
          }
        })
        
    }
    
    return {sendEmail}
}