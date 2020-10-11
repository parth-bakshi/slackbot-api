const passport = require('passport');

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt; //to extract data from payload

const User = require('../models/users');

const opts = {
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:require("../keys").secretEncryptionKey, //encryption key
    passReqToCallback: true
}


passport.use(new JWTStrategy(opts, function(req, jwtPayload, done){ 
    User.findById(jwtPayload._id, function(err,user){
        if(err){console.log(err);return done(err,false);}
        if(user){
            req.user = user;
            console.log("succesful user stores");
            return done(null,user);
        }
        return done(null,false);
    });
}));

module.exports = passport;

// return res.json(200,{
//     message: "sign in succesful",
//     data:{
//         token: jwt.sign(user.toJSON(), key, {expiry}'10000')
//     }
// })