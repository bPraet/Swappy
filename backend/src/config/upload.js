const multer = require('multer');
const path = require('path');

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, "..", "..", "files"),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            const name = path.basename(file.originalname, ext);

            cb(null, `${name.replace(/\s/g, "")}-${Date.now()}${ext}`);
        },
    }),
    limits: {fileSize: 2000000}, //2MB en Bytes
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const {name, description} = req.body;

        if(name == 'undefined' || name == '' || description == 'undefined' || description == ''){
            return cb(new Error('Champs requis manquant !'));
        }

        if(ext !== '.jpg' && ext !== '.jpeg'){
            return cb('Only images are allowed');
        }

        cb(null, true);
    },
}