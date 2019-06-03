const multer = require('multer')
const path = require('path')
const md5 = require('md5')

module.exports = function(app){

	const config = {
		desc: path.resolve(__dirname, '..','..','storage','images','posts'),
		limits: {fileSize: 3 * 1024 * 1024},
		fileFilter: function(req, file, next) {
			const allowedMimeTypes = [
				'image/png',
				'image/jpeg',
				'image/jpg',
				'image/pjpeg'
			]
			if(allowedMimeTypes.includes(file.mimetype)) {
				next(null, true)
			}
		},
		storage: multer.diskStorage({
			destination: function(req, file, next) {
				next(null, path.resolve(__dirname, '..','..','storage','images','posts'))
			},
			filename: function(req, file, next) {

				const ext = file.originalname
					.substring(file.originalname.lastIndexOf('.'))

				const filename = md5(file.originalname + Date.now().toString())
				next(null, filename.concat(ext))
			},
		}),
	}

	return config
}