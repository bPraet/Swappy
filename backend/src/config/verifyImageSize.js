function verifyImageSize(req, res, next){
    if(Number(req.headers["content-length"]) < '2097152') //Image > 2Mo
        next();
    else 
        res.status(400).send("Veuillez uploader une image de 2Mo ou moins s'il vous plait ! (.jpg, .jpeg)");

        
}

module.exports = verifyImageSize;