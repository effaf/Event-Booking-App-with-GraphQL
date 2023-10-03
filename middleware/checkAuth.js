const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const authHeader = req.get('Authorization');
    console.log("I am inside auth");
    
    if(!authHeader){
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(" ")[1];
    if(!token || token===''){
        req.isAuth = false;
        return next();
    }
    
    let decodedToken;
    try {
    console.log("Inside decoded");
    decodedToken = jwt.verify(token, 'myPrivateHashKey');;
    
    }catch(err){
        req.isAuth = false;
        return next();
    }

    if(!decodedToken){
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    console.log("Auth is not set to true");
    console.log(req.isAuth);
    req.userId = decodedToken.userId;
}