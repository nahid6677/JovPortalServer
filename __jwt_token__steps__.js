/**
 * 1. after successful login: generate a jwt token 
 *  npm i jsonwebtoken cookie-parser
 *  jwt.sign(payload, secret, {expairesIn: "1h"})
 * 
 * 2.send token (generated in the server side) to the client side
 * localstroage --> easear 
 * httpOnly cookies ---> standart way
 * 
 * 3.for sensitive or secure apis: send token to the server side 
 * app.use(cors(
   {
     origin: ["http://localhost:5173"],
     credentials: true,
   }
 ));
 * 
 * 
 * 
 * 4.validate the token in the server side:
 * if valid: provide data
 * else: logout the user
 * 
 * 
 */