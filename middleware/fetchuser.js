var jwt = require('jsonwebtoken');
const Jwt_secret = 'jwtstringsecret90';

const fetchuser = (req, res, next) => {
    //get user from jwt token and add id to req object
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send('please auth using valid token')
    }
    try {
        const data = jwt.verify(token, Jwt_secret);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send('please auth using valid token')
    }

}

module.exports = fetchuser;