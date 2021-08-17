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
    limits: {fileSize: 5000000}, //5MB en Bytes
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const {name, description} = req.body;

        if(name == 'undefined' || name == '' || description == 'undefined' || description == ''){
            return cb(null, false);
        }

        if(name.length > 50 || description.length > 1500)
            return cb(null, false);

        if(ext !== '.jpg' && ext !== '.jpeg'){
            return cb(null, false);
        }

        cb(null, true);
    },
}