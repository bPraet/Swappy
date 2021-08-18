function verifyImageSize(req, res, next){
    if(Number(req.headers["content-length"]) < 5242880) //Image > 5Mo
        next();
    else 
        res.status(400).send("Veuillez uploader une image de 5Mo ou moins s'il vous plait ! (.jpg, .jpeg)");

        
}

module.exports = verifyImageSize;