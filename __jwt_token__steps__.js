/**
 * 1. after successful login: generate a jwt token 
 *  npm i jsonwebtoken cookie-parser
 *  jwt.sign(payload, secret, {expairesIn: "1h"})
 * 
 * 2. firstly send request to genarate the token (generated in the server side) to the client side request
 * 
 * 
 * 3.for sensitive or secure apis: send token from the server side to client browser cookies
 * on the server side: 
 * app.use(cors(
   {
     origin: ["http://localhost:5173"],
     credentials: true,
   }
 ));
 * 
 * 4. In the client side: 
 * send the browser cookies token to server side {for valided: token is same}
 * 
 * 
 * 5.receive the token and validate the token in the server side:
 * if valid: provide data
 * else: logout the user
 * 
 * 6.check user and users token are equeal in this api
 */