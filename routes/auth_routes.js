const e = require('express');
const express = require('express');
const jwtUtil = require('../utility/jwt_util');
const router = express.Router();
const userDao = require('../dao/user_dao');

router.post('/login', async (req, res) => {
    
    const username = req.body.username;
    const password = req.body.password;

    const data = await userDao.retrieveUserByUsername(username);
    const userItem = data.Item;//undefined if user doesnt exist

    if (userItem) {//because undefined is falsely we can use userItem to check and see if 
        //username doesnt exist
        if(userItem.password === password) {
            res.send({
                "message": "Successful Login",
                "token": jwtUtil.createToken(userItem.username, userItem.role)
            });
        } else {//Password is wrong
            res.statusCode = 400;
            res.send({
                "message": "Invalid Password"
            });
        }



    } else {
        //userItem is UNDEFINED
        res.statusCode = 400;
        res.send({
            "message": "Username does not exist"
        })
    }

    // if(username === 'user123' && password === 'password123' ){
    //     res.send({
    //         "message": "Successfully logged in!",
    //         "token": jwtUtil.createToken({"username": "user123", "role": "manager"})
    //     });
    // } else {
    //     res.statusCode = 400;
    //     res.send({
    //         "message": "Invalid Login"
    //     })
    // }

});

router.post('/users', (req, res) => {
    res.send({
        "message": "POST /users endpoint reached"

    })
});

module.exports = router;