const AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1"
})

const docClient = new AWS.DynamoDB.DocumentClient();

//Username is a primary key
function retrieveUserByUsername(username){
    return docClient.get({
        TableName: 'reimb_users',
        Key: {
            "username": username,
            
        }
    }).promise();
}

// retrieveUserByUsername('employee123').then(data => {
//     console.log(data.Item);
// })

// retrieveUserByUsername('user123').then(data => {
//     console.log(data.Item)
// })

function registerUser(username, password){
    return docClient.put({
        TableName: 'reimb_users',
        Item: {
            "username": username,
            "password": password,
            "role": "employee"//hard-code role, since registration would default to employee
        }
    }).promise();

}

registerUser("newuser123","password").then(data => {
    console.log(data);
}).catch(err => {
    console.error(err);
})


module.exports = {
    retrieveUserByUsername, registerUser
}