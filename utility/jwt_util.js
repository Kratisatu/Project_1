const { JsonWebTokenError } = require('jsonwebtoken');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');



function createToken(username, role){
    return jwt.sign({
        "username": username,
        "role": role
    }, 'thisisasecretforsigningthetoken');

}

// const token = createToken("username", "manager");

// console.log(token);

//This function retuns a promise that returns the payload when promise is fulfilled
function verifyTokenAndReturnPayload(token){
    jwt.verify = Promise.promisify(jwt.verify);//Take the verify function which has an arg for (err, data)
    //callback function and instead turn it into a function that returns a promise

    return jwt.verify(token, 'thisisasecretforsigningthetoken');
}

// verifyTokenAndReturnPayload('createToken("username", "admin")').then((payload) => {
//     console.log(payload);
// }).catch((err) => {
//     console.error(err);
// });

async function myAsyncFunction(){
    try {
    const payload = await verifyTokenAndReturnPayload(createToken('user123','admin'));
    console.log(payload);
 } catch(err){
    console.error(err);
 }
}

myAsyncFunction();

module.exports = { 
    createToken,
    verifyTokenAndReturnPayload
};